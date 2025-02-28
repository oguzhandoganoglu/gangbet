import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '@/components/Navbar';
import { useRouter } from 'expo-router';

import axios from 'axios'; 

import { useUser } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';

export default function NotificationScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  
  // State tanımlamaları
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [betsWithGroups, setBetsWithGroups] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API'den veri çekme
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
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
    if (selectedCategory === 'all') {
      // Tüm bahisleri göster
      setFilteredBets(betsWithGroups);
    } else if (selectedCategory === 'managed') {
      // Yönetilen grupları göster - burada yalnızca grupları gösteriyoruz
      setFilteredBets([]);
    } else {
      // Seçilen gruba ait bahisleri filtrele
      const filtered = betsWithGroups.filter(bet => bet.groupName === selectedCategory);
      setFilteredBets(filtered);
    }
  }, [selectedCategory, betsWithGroups]);

  // Grup detayı sayfasına gitme
  const handleGroupPress = (groupId) => {
    router.push({ pathname: "/gang/[gangId]", params: { gangId: groupId } });
  };

  // Kategorileri oluşturma (managed, all, ve grup isimleri)
  const buildCategories = () => {
    const basicCategories = [
      { key: 'managed', title: 'Managed |' },
      { key: 'all', title: 'All' }
    ];
    
    // Grup isimlerini kategori olarak ekle
    const groupCategories = joinedGroups.map(group => ({
      key: group.name, // Grup adını key olarak kullan
      title: group.name,
      id: group.id // Grup ID'sini sakla
    }));
    
    return [...basicCategories, ...groupCategories];
  };

  return (
    <LinearGradient
      colors={['#161638', '#714F60', '#B85B44']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Navbar />
      <Text style={styles.header}>Gangs</Text>
      
      {/* Kategori butonları - joinedGroups'taki grup isimlerini içerir */}
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
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#ddd" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#ccc"
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
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
      
      {/* Error state */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Managed kategori seçiliyse grupları göster */}
      {selectedCategory === 'managed' && !isLoading && !error && (
        <FlatList
          data={joinedGroups}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(item.name); // Grup adını kategori olarak ayarla
              }}
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
      
      {/* Bahisleri göster - managed kategorisi olmadığında */}
      {selectedCategory !== 'managed' && !isLoading && !error && (
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
    backgroundColor: 'transparent',
    marginTop: 20
  },
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
  managedProfileImage: {
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
  managedtitle: {
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
  icon: {
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    padding: 5,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 88, 0.3)',
    borderRadius: 25,
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
  managedCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(46, 46, 94, 0.6)',
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
    bottom: 70,
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
  // Yeni eklenen stiller
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