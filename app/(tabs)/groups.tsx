import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '@/components/Navbar';
import { useRouter } from 'expo-router';
import axios from 'axios'; 
import { useUser } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';

// API temel URL'sini bir değişkende tanımlayalım
const API_BASE_URL = 'http://51.21.28.186:5001';

export default function NotificationScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const { user } = useUser();
  const userId = user?._id;
  const userToken = user?.token;
  const router = useRouter();
  
  // State tanımlamaları
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [betsWithGroups, setBetsWithGroups] = useState([]);
  const [filteredBets, setFilteredBets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [currentGroupId, setCurrentGroupId] = useState('');

  // API'den veri çekme
  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    if (!userId) {
      setError('Kullanıcı girişi yapılmamış');
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
      
      // Katılınan grupları kaydet
      setJoinedGroups(data.joinedGroups || []);
      
      // Grup bahislerini kaydet
      setBetsWithGroups(data.betsWithGroups || []);
      
      // Başlangıçta tüm bahisleri göster
      setFilteredBets(data.betsWithGroups || []);
      
    } catch (err) {
      console.error('Veri çekerken hata oluştu:', err);
      setError('Veri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Kategori değiştiğinde bahisleri filtrele
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

  const handleNewGroup = () => {
    setIsNewGroupModalVisible(true);
  };

  // Rastgele bir kanal adı oluştur
  const generateRandomChannelName = () => {
    const prefixes = ['Genel', 'Sohbet', 'Tartışma', 'Toplantı', 'Proje', 'Etkinlik', 'Duyuru'];
    const suffixes = ['Kanalı', 'Odası', 'Grubu', 'Alanı', 'Köşesi', 'Merkezi'];
    
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    return `${randomPrefix} ${randomSuffix}`;
  };

  const createNewGroup = async () => {
    // Form doğrulama
    if (!newGroupTitle.trim()) {
      Alert.alert('Hata', 'Lütfen grup adı girin');
      return;
    }

    if (!userId) {
      Alert.alert('Hata', 'Kullanıcı girişi yapılmamış');
      return;
    }

    setIsCreatingGroup(true);

    try {
      // 1. Grup oluşturma
      const groupResponse = await axios.post(`${API_BASE_URL}/api/groups/create`, {
        name: newGroupTitle,
        description: newGroupDescription || 'Grup açıklaması yok',
        createdBy: userId
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Grup oluşturma yanıtı:', JSON.stringify(groupResponse.data, null, 2));

      // Grup oluşturma başarılı mı kontrol et
      if (groupResponse.status === 200 || groupResponse.status === 201) {
        // API yanıtından grup ID'sini al
        let newGroupId;
        
        // Yanıt yapısını kontrol et ve doğru ID'yi bul
        if (groupResponse.data.group) {
          newGroupId = groupResponse.data.group._id || groupResponse.data.group.id;
        } else if (groupResponse.data._id) {
          newGroupId = groupResponse.data._id;
        } else if (groupResponse.data.id) {
          newGroupId = groupResponse.data.id;
        } else if (typeof groupResponse.data === 'string') {
          newGroupId = groupResponse.data;
        }
        
        console.log('Bulunan Grup ID:', newGroupId);
        
        if (!newGroupId) {
          console.error('Grup ID bulunamadı:', groupResponse.data);
          Alert.alert('Uyarı', 'Grup oluşturuldu ancak kanal oluşturulamadı: Grup ID bulunamadı');
        } else {
          // Grup oluşturuldu, şimdi otomatik olarak kanal oluştur
          setCurrentGroupId(newGroupId);
          
          // Rastgele bir kanal adı oluştur
          const randomChannelName = generateRandomChannelName();
          
          // Kanal oluşturma işlemini başlat
          createChannelWithName(newGroupId, randomChannelName);
          
          // Form alanlarını temizle
          setNewGroupTitle('');
          setNewGroupDescription('');
          setIsNewGroupModalVisible(false);
          
          // Grupları yeniden yükle
          fetchData();
        }
      } else {
        Alert.alert('Hata', 'Grup oluşturulamadı. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Grup oluşturma hatası:', error.response?.data || error);
      
      // Hata mesajını kullanıcıya göster
      const errorMessage = error.response?.data?.message || error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      Alert.alert('Hata', errorMessage);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Belirli bir isimle kanal oluşturma fonksiyonu
  const createChannelWithName = async (groupId, channelName) => {
    setIsCreatingChannel(true);

    try {
      // Kanal oluşturma isteği
      const channelData = {
        name: channelName,
        group: groupId,
        createdBy: userId
      };
      
      console.log('Kanal oluşturma isteği:', channelData);
      
      const channelResponse = await axios.post(`${API_BASE_URL}/api/channels/create`, channelData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Kanal oluşturma yanıtı:', channelResponse.data);
      
      Alert.alert('Başarılı', `Grup ve "${channelName}" kanalı başarıyla oluşturuldu`);
      
      // Kanal oluşturulduktan sonra grup detaylarını yeniden yükle
      fetchData();
    } catch (error) {
      console.error('Kanal oluşturma hatası:', error.response?.data || error);
      
      // Hata detaylarını görelim
      if (error.response) {
        console.error('Hata yanıtı:', error.response.status);
        console.error('Hata verileri:', error.response.data);
      }
      
      Alert.alert(
        'Uyarı', 
        `Grup oluşturuldu fakat kanal oluşturulamadı: ` + 
        (error.response?.data?.message || error.message || 'Bilinmeyen hata')
      );
    } finally {
      setIsCreatingChannel(false);
    }
  };

  // Modal içeriği için render fonksiyonu
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
              onPress={() => handleGroupPress(item.id)}
              style={styles.managedCard}
            >
              <Image 
                source={ require( '@/assets/images/angry.png' )} 
                style={styles.managedProfileImage}
                defaultSource={require('@/assets/images/angry.png')}
              />
              <View style={{ alignItems: 'flex-start', flex: 1 }}>
                <Text style={styles.managedtitle}>{item.name}</Text>
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
  // Yeni eklenen stiller
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 8,
    borderRadius: 5,
  },
  infoLabel: {
    color: '#ddd',
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 12,
  },
  infoValue: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
});