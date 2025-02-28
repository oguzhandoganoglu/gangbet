import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '@/components/Navbar';
import { useRouter } from 'expo-router';
import axios from 'axios'; 
import { useUser } from "../UserContext";

export default function NotificationScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  
  // DataType için tip tanımı (örnekData için)
  type DataType = {
    id: number;
    title: string;
    category: string;
    image: any;
    traded: string;
    result: string;
  };

  // ManagedDataType için tip tanımı (gruplar için)
  type ManagedDataType = {
    id: string;
    gangName: string;
    gangImage: { uri: string }; // Resim URL'i
    gangMembers: number;
    gangBets: number;
  };
  // API'den gelecek gruplar verisi için tip tanımı
  type ApiGroupType = {
    id: string;
    name: string;
    image: string;
    membersCount: number;
    activeBetsCount: number;
    createdBy: string;
    createdAt: string;
  };
  const { user } = useUser(); // useUser hook'unu kullanıyoruz
  const userId = user?._id; // Kullanıcı ID'si
  const [filteredData, setFilteredData] = useState<(DataType | ManagedDataType)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [routes] = useState([
    { key: 'managed', title: 'Managed |' },
    { key: 'all', title: 'All' },
    { key: 'rkos', title: 'RKOS' },
    { key: '06ankaralilar', title: '06ankaralilar' },
    { key: 'culture', title: 'Culture' },
    { key: 'world', title: 'World' },
  ]);

  // Örnek Statik Veri
  const exampleData = [
    { id: 1, title: 'Elon Musk out as Head of DOGE before July?', category: 'rkos', image: require('@/assets/images/elon.png'), traded:"NO", result:""},
    { id: 2, title: 'Elon Musk out as Head of DOGE before July?', category: '06ankaralilar', image: require('@/assets/images/latte.jpeg'), traded:"YES", result:"50,534"},
    { id: 3, title: 'Elon Musk out as Head of DOGE before July?', category: 'rkos', image: require('@/assets/images/yamanalp.png'), traded:"YES", result:"50,534"},
  ];

  // API'den grupları getirme fonksiyonu
  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://51.21.28.186:5001/api/pages/groups/all/${userId}`);
    
      const { joinedGroups } = response.data; 
      
    
      const formattedData: ManagedDataType[] = joinedGroups.map((group: ApiGroupType) => ({
        id: group.id,
        gangName: group.name,
        gangImage: { uri: group.image },
        gangMembers: group.membersCount,
        gangBets: group.activeBetsCount,
      }));
      
      if (selectedCategory === 'managed') {
        setFilteredData(formattedData);
      }
    
      setManagedData(formattedData);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Group name is required');
      return;
    }

    setIsCreatingGroup(true);
    
    try {
      const response = await axios.post('http://51.21.28.186:5001/api/groups/create', {
        name: newGroupName,
        description: newGroupDescription,
        createdBy: userId,
      });
      
      Alert.alert('Success', 'Group created successfully');
      setIsNewGroupModalVisible(false);
      setNewGroupName('');
      setNewGroupDescription('');
      
    
      fetchGroups();
      
    } catch (err) {
      console.error('Error creating group:', err);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  
  const [managedData, setManagedData] = useState<ManagedDataType[]>([]);

  
  useEffect(() => {
    fetchGroups();
  }, []);

  
  useEffect(() => {
    if (selectedCategory === 'managed') {
      setFilteredData(managedData);
    } else {
      const filtered = exampleData.filter(item =>
        selectedCategory === 'all' || item.category === selectedCategory
      );
      setFilteredData(filtered);
    }
  }, [selectedCategory, managedData]);

  const router = useRouter();
  
  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E4C' }}>
      <Navbar />
      <Text style={styles.header}>Gangs</Text>

      <View style={styles.categoryContainer}>
        {routes.map(route => (
          <TouchableOpacity
            key={route.key}
            style={[
              styles.categoryButton,
            ]}
            onPress={() => setSelectedCategory(route.key)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === route.key && styles.selectedCategoryText,
              ]}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#ddd" />
        <TextInput
          style={styles.searchInput}
          placeholder=""
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Icon name="filter" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="star" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="line-chart" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="paper-plane" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="hourglass-half" size={18} color="#ddd" style={styles.icon}/>
      </View>

      {/* Loading state */}
      {isLoading && selectedCategory === 'managed' && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      )}

      {/* Error state */}
      {error && selectedCategory === 'managed' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchGroups}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={filteredData}
        renderItem={({ item }) => {
          if ('gangName' in item) {
            // ManagedDataType türü için
            return (
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/gang/[gangId]", params: { gangId: item.id.toString() } })}
              style={styles.managedCard}
            >
              <View style={styles.managedCard}>
                <Image source={item.gangImage} style={styles.managedProfileImage} />
                <View style={{ alignItems: 'flex-start'}}>
                  <Text style={styles.managedtitle}>{item.gangName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <Image source={require('@/assets/images/users2.png')} style={{height:16, width:16, marginRight:4}} />
                    <Text style={styles.subText}>{item.gangMembers} Members</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
                  <Image source={require('@/assets/images/share.png')} style={{height:16, width:16, marginRight:7}} />
                  <Image source={require('@/assets/images/user-plus.png')} style={{height:16, width:16, marginRight:7}} />
                  <Image source={require('@/assets/images/user-minus.png')} style={{height:16, width:16, marginRight:7}} />
                  <Image source={require('@/assets/images/settings.png')} style={{height:16, width:16}} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
                  <Text style={styles.subText}>{item.gangBets} Bets</Text>
                </View>
              </View>
            </TouchableOpacity>
            );
          } else {
          // DataType türü için
            return (
              <View style={styles.cardContainer}>
                <View style={styles.whiteOverlay} />
                  <View style={styles.cardContent}>
                    <Image source={item.image} style={styles.profileImage} />
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{item.title}</Text>
                      <View style={styles.iconsContainer}>
                        {item.traded === "YES" && (
                          <View style={styles.percentCard}>
                            <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
                            <View style={styles.percentText}>
                              <Text style={{color:'#fff', fontSize:12}}>YES</Text>
                              <Text style={{color:'#fff', fontSize:12}}> {item.result}</Text>
                            </View>
                          </View>
                        )}
                        <View style={styles.iconItem}>
                          <Image source={require("@/assets/images/scale.png")} style={{ width: 16, height: 16 }} />
                          <Text style={styles.iconText}>%40</Text>
                        </View>
                        <View style={styles.iconItem}>
                          <Image source={require("@/assets/images/mood-suprised.png")} style={{ width: 16, height: 16 }} />
                          <Text style={styles.iconText}>Won</Text>
                        </View>
                        <View style={styles.iconItem}>
                          <Image source={require("@/assets/images/chart-line.png")} style={{ width: 16, height: 16 }} />
                          <Text style={styles.iconText}>50K</Text>
                        </View>
                        <Image source={require("@/assets/images/send.png")} style={{ width: 16, height: 16, marginRight:10 }} />
                        <Image source={require("@/assets/images/star.png")} style={{ width: 16, height: 16 }} />
                      </View>
                    </View>
                  </View>
                </View>
              );
           }
          }}
        keyExtractor={(item) => item.id.toString()}
        // Empty list state için
        ListEmptyComponent={
          selectedCategory === 'managed' && !isLoading && !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No groups found.</Text>
            </View>
          ) : null
        }
      />
      {selectedCategory === 'managed' && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setIsNewGroupModalVisible(true)}
          >
            <Image source={require('@/assets/images/layout-grid-add.png')} style={{width: 24, height: 24, marginRight: 5}} />
            <Text style={styles.buttonText}>New Group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
          <Image source={require('@/assets/images/sort-descending-2.png')} style={{width: 24, height: 24, marginRight: 5}} />
            <Text style={styles.buttonText}>Edit Sorting</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* New Group Modal */}
      <Modal
        visible={isNewGroupModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsNewGroupModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <TextInput
                style={styles.input}
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholder="Enter group name"
                placeholderTextColor="#888"
                maxLength={30}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newGroupDescription}
                onChangeText={setNewGroupDescription}
                placeholder="Enter group description"
                placeholderTextColor="#888"
                multiline={true}
                numberOfLines={4}
                maxLength={200}
              />
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setIsNewGroupModalVisible(false);
                  setNewGroupName('');
                  setNewGroupDescription('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.createButton,
                  isCreatingGroup && styles.disabledButton
                ]} 
                onPress={createNewGroup}
                disabled={isCreatingGroup}
              >
                <Text style={styles.modalButtonText}>
                  {isCreatingGroup ? 'Creating...' : 'Create Group'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    paddingLeft: 15,
    backgroundColor: '#1E1E4C',
    marginTop: 20
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    paddingLeft:10
  },
  categoryButton: {
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  toggleContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -90 }],
  },
  toggleBackground: {
    flexDirection: 'row',
    width: 180,
    height: 40,
    backgroundColor: '#610f87',
    borderRadius: 5,
    alignItems: 'center',
    padding: 2,
    position: 'relative',
  },
  toggleButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    zIndex: 1,
  },
  selectedButton: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'black',
  },
  toggleCircle: {
    position: 'absolute',
    width: 86,
    height: 34,
    backgroundColor: 'white',
    borderRadius: 0,
    zIndex: 0,
  },
  cardContainer: {
    position: 'relative',
    borderRadius: 0,
    marginBottom: 2,
    overflow: 'hidden',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 0,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 0,
    marginRight: 6,
  },
  managedProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  managedtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  profileImage2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  userText: {
    fontSize: 14,
    color: '#ddd',
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
    marginLeft: 4,
  },
  iconText: {
    fontSize: 12,
    color: '#ddd',
    marginLeft: 5,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 5,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#000058',
    borderRadius: 5,
  },
  percentCard : {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor:"#D6D6D673", 
    borderRadius: 13, 
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  percentText: {
    flexDirection: "row",
  },
  percentImage : { 
    width: 16, 
    height: 16,
    tintColor: "#fff",
  },
  percentImage2 : { 
    width: 16, 
    height: 16,
    tintColor: '#5E5E5E5C'
  },
  managedCard: {
    flexDirection: 'row',
    backgroundColor: '#2E2E5E',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 4,
    backgroundColor: '#5E5E5E5C',
    borderRadius: 4,
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
  // Yeni eklenen stiller
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#3a3a7b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#2E2E5E',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1E1E4C',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    fontSize: 16,
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#444471',
  },
  createButton: {
    backgroundColor: '#610f87',
  },
  disabledButton: {
    backgroundColor: '#444471',
    opacity: 0.7,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});