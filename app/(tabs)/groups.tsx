import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'expo-router';
import axios from 'axios'; 
import { useUser } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';

const API_BASE_URL = 'http://51.21.28.186:5001';

const generateRandomChannelName = () => {
  const prefixes = ['general', 'main', 'public', 'group', 'team'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${randomPrefix}-${randomNum}`;
};

const createChannelWithName = async (groupId, channelName, userToken) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/channels/create`,
      {
        name: channelName,
        groupId: groupId,
        description: 'Default channel'
      },
      {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Channel created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating channel:', error);
    Alert.alert('Error', 'Could not create default channel');
    return null;
  }
};

export default function NotificationScreen() {
  const [selectedCategory, setSelectedCategory] = useState('friends');
  const { user } = useUser();
  const userId = user?._id;
  const userToken = user?.token;
  const router = useRouter();
  
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [betsWithGroups, setBetsWithGroups] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [friends, setFriends] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendsError, setFriendsError] = useState(null);
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchData();
      fetchFriends();
    }
  }, [userId]);

  const fetchData = async () => {
    if (!userId) {
      setError('User not logged in');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/pages/groups/all/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = response.data;
      
      setJoinedGroups(data.joinedGroups || []);
      setBetsWithGroups(data.betsWithGroups || []);
      setFilteredBets(data.betsWithGroups || []);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Could not load data. Please try again later.');
      
      setJoinedGroups([]);
      setBetsWithGroups([]);
      setFilteredBets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriends = async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/friends`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      setFriends(response.data.friends || []);
      setFriendsError(null);
      
    } catch (err) {
      console.log('Friends API not ready, using dummy data');
      setFriendsError('Friends API not available, showing sample friends');
    }
  };

  useEffect(() => {
    if (selectedCategory === 'friends') {
      setFilteredBets([]);
    } else if (selectedCategory === 'groups') {
      setFilteredBets([]);
    } else {
      const filtered = betsWithGroups.filter(bet => bet.groupName === selectedCategory);
      setFilteredBets(filtered);
    }
  }, [selectedCategory, betsWithGroups]);

  const handleGroupPress = (groupId) => {
    router.push({ pathname: "/gang/[gangId]", params: { gangId: groupId } });
  };

  const handleFriendPress = (friendId) => {
    router.push({ pathname: "/profile/[userId]", params: { userId: friendId } });
  };

  const buildCategories = () => {
    return [
      { key: 'groups', title: 'Groups' },
      { key: 'friends', title: 'Friends' }
    ];
  };

  const handleNewGroup = () => {
    setIsNewGroupModalVisible(true);
  };

  const createNewGroup = async () => {
    if (!newGroupTitle.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    setIsCreatingGroup(true);

    try {
      const groupResponse = await axios.post(`${API_BASE_URL}/api/groups/create`, {
        name: newGroupTitle,
        description: newGroupDescription || 'No group description',
        createdBy: userId
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (groupResponse.status === 200 || groupResponse.status === 201) {
        let newGroupId;
        
        if (groupResponse.data.group) {
          newGroupId = groupResponse.data.group._id || groupResponse.data.group.id;
        } else if (groupResponse.data._id) {
          newGroupId = groupResponse.data._id;
        } else if (groupResponse.data.id) {
          newGroupId = groupResponse.data.id;
        } else if (typeof groupResponse.data === 'string') {
          newGroupId = groupResponse.data;
        }
        
        if (!newGroupId) {
          console.error('Group ID not found:', groupResponse.data);
          Alert.alert('Warning', 'Group created but could not create channel: Group ID not found');
        } else {
          const randomChannelName = generateRandomChannelName();
          
          await createChannelWithName(newGroupId, randomChannelName, userToken);
          
          setNewGroupTitle('');
          setNewGroupDescription('');
          setIsNewGroupModalVisible(false);
          
          fetchData();
        }
      } else {
        Alert.alert('Error', 'Could not create group. Please try again.');
      }
    } catch (error) {
      console.error('Group creation error:', error.response?.data || error);
      
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const dummyFriends = [
    { id: '1', name: 'Ahmet Yılmaz', photoUrl: "https://arkeofili.com/wp-content/uploads/2014/12/ata7.jpg", lastActive: '2 hours ago' },
    { id: '2', name: 'Mehmet Demir', photoUrl: "https://media.licdn.com/dms/image/v2/D4D12AQEBWX-CTbuenQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1720729957965?e=2147483647&v=beta&t=KEE8zC0coVUnh8LA4I2DULzewVjUHJrXu_b1VSZh2b8", lastActive: '5 min ago' },
    { id: '3', name: 'Ayşe Kaya', photoUrl: "https://agtechtr.wordpress.com/wp-content/uploads/2017/04/tarihte-yasamis-tum-insan-turleri-396e411.jpg", lastActive: 'Yesterday' },
    { id: '4', name: 'Fatma Çelik', photoUrl: "https://www.indyturk.com/sites/default/files/styles/1368x911/public/article/main_image/2023/05/09/1139836-1100657528.jpg?itok=sYj59Wq2", lastActive: 'Online' },
    { id: '5', name: 'Mustafa Şahin', photoUrl: "https://arkeofili.com/wp-content/uploads/2014/12/ata7.jpg", lastActive: '1 week ago' },
  ];

  const FriendCard = ({ friend }) => (
    <TouchableOpacity 
      style={styles.friendCard}
      onPress={() => handleFriendPress(friend.id)}
    >
      <Image 
        source={{ uri: friend.photoUrl || 'https://via.placeholder.com/65' }} 
        style={styles.groupsProfileImage}
        defaultSource={require('@/assets/images/angry.png')}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendStatus}>Friend • {friend.lastActive || 'Online'}</Text>
      </View>
      <TouchableOpacity style={styles.messageButton}>
        <Text style={{color:"white", fontSize:12}}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGroupCreationModal = () => {
    return (
      <Modal
        visible={isNewGroupModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsNewGroupModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              value={newGroupTitle}
              onChangeText={setNewGroupTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Group Description (optional)"
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
              multiline={true}
              numberOfLines={4}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setIsNewGroupModalVisible(false)}
                disabled={isCreatingGroup}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.createButton, isCreatingGroup && styles.disabledButton]} 
                onPress={createNewGroup}
                disabled={isCreatingGroup}
              >
                <Text style={styles.buttonText}>
                  {isCreatingGroup ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient
      colors={['#161638', '#714F60', '#B85B44']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Navbar />
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={buildCategories()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.key && styles.selectedCategoryButton
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.key && styles.selectedCategoryText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      </View>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {selectedCategory === 'friends' && !isLoading && !error && (
        <>
          {friendsError && (
            <View style={styles.infoBanner}>
              <Text style={styles.infoText}>{friendsError}</Text>
            </View>
          )}
          <FlatList
            data={friends.length > 0 ? friends : dummyFriends}
            renderItem={({ item }) => <FriendCard friend={item} />}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You haven't added any friends yet.</Text>
              </View>
            }
          />
        </>
      )}
      
      {selectedCategory === 'groups' && !isLoading && !error && (
        <FlatList
          data={joinedGroups}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleGroupPress(item.id)}
              style={styles.groupsCard}
            >
              <Image 
                source={ require( '@/assets/images/angry.png' )} 
                style={styles.groupsProfileImage}
                defaultSource={require('@/assets/images/angry.png')}
              />
              <View style={{ alignItems: 'flex-start', flex: 1 }}>
                <Text style={styles.groupstitle}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Image source={require('@/assets/images/users2.png')} style={{height:16, width:16, marginRight:4}} />
                  <Text style={styles.subText}>{item.membersCount} Members</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                <Image source={require('@/assets/images/share.png')} style={{height:16, width:16, marginRight:7}} />
                <Image source={require('@/assets/images/user-plus.png')} style={{height:16, width:16, marginRight:7}} />
                <Image source={require('@/assets/images/user-minus.png')} style={{height:16, width:16, marginRight:7}} />
                <Image source={require('@/assets/images/settings.png')} style={{height:16, width:16}} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.subText}>{item.activeBetsCount} Bets</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No groups found.</Text>
            </View>
          }
        />
      )}
      
      {selectedCategory !== 'groups' && selectedCategory !== 'friends' && !isLoading && !error && (
        <FlatList
          data={filteredBets}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <View style={styles.whiteOverlay} />
              <View style={styles.cardContent}>
                <Image 
                  source={{ uri: item.photoUrl || 'https://via.placeholder.com/65' }} 
                  style={styles.profileImage} 
                  defaultSource={require('@/assets/images/latte.jpeg')}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.groupText}>{item.groupName} / {item.channelName}</Text>
                  <View style={styles.iconsContainer}>
                    <View style={styles.percentCard}>
                      <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
                      <View style={styles.percentText}>
                        <Text style={{color:'#fff', fontSize:12}}>YES</Text>
                        <Text style={{color:'#fff', fontSize:12}}> {item.yesPercentage}%</Text>
                      </View>
                    </View>
                    <View style={styles.iconItem}>
                      <Image source={require("@/assets/images/scale.png")} style={{ width: 16, height: 16 }} />
                      <Text style={styles.iconText}>{item.totalPool} USDC</Text>
                    </View>
                    <View style={styles.iconItem}>
                      <Image source={require("@/assets/images/users2.png")} style={{ width: 16, height: 16 }} />
                      <Text style={styles.iconText}>{item.participantsCount}</Text>
                    </View>
                    <Image source={require("@/assets/images/send.png")} style={{ width: 16, height: 16, marginRight:10 }} />
                    <Image source={require("@/assets/images/star.png")} style={{ width: 16, height: 16 }} />
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bets found in this category.</Text>
            </View>
          }
        />
      )}
      
      {selectedCategory === 'groups' && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNewGroup}>
            <Image source={require('@/assets/images/layout-grid-add.png')} style={{width: 24, height: 24, marginRight: 5}} />
            <Text style={styles.buttonText}>New Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Image source={require('@/assets/images/sort-descending-2.png')} style={{width: 24, height: 24, marginRight: 5}} />
            <Text style={styles.buttonText}>Edit Sorting</Text>
          </TouchableOpacity>
        </View>
      )}
      {renderGroupCreationModal()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginVertical: 10,
    paddingLeft: 10,
    backgroundColor: 'transparent',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
    color: 'white',
  },
  cardContainer: {
    position: 'relative',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 10,
  },
  groupsProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  groupText: {
    fontSize: 12,
    color: '#ddd',
    marginBottom: 5,
  },
  groupstitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 4,
  },
  iconText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 5,
  },
  percentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(214, 214, 214, 0.45)",
    borderRadius: 13,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginRight: 8,
  },
  percentText: {
    flexDirection: "row",
  },
  percentImage: {
    width: 16,
    height: 16,
    tintColor: "#fff",
    marginRight: 3,
  },
  groupsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(46, 46, 94, 0.2)',
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  subText: {
    color: '#fff',
    fontSize: 14,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(94, 94, 94, 0.4)',
    borderRadius: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: 'rgba(58, 58, 123, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    backgroundColor: 'rgba(46, 46, 94, 0.9)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  createButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  disabledButton: {
    backgroundColor: '#7fb3ef',
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
    marginVertical: 5,
    padding: 12,
    borderRadius: 10,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 12,
    color: '#ddd',
  },
  messageButton: {
    padding: 8,
  },
  infoBanner: {
    backgroundColor: 'rgba(50, 50, 150, 0.5)',
    padding: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 6,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
});