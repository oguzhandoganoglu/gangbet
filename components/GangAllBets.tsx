import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const API_BASE_URL = 'http://51.21.28.186:5001';

const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Pending'
  },
  {
    id: '2',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Result'
  },
  {
    id: '3',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Result'
  },
  {
    id: '4',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Pending'
  }
];


// Örnek grup verileri
const exampleGroups = [
  { id: '1', name: 'Crypto Enthusiasts' },
  { id: '2', name: 'Tech Investors' },
  { id: '3', name: 'DeFi Experts' },
  { id: '4', name: 'NFT Collectors' },
  { id: '5', name: 'Bitcoin Maximalists' }
];



interface Bet {
  id: string;
  title: string;
  status: string;
}

interface Group {
  id: string;
  name: string;
}

interface GangAllBetsProps {
  gangId: string;
}

export default function GangAllBets({ gangId }: GangAllBetsProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);  // Bu satırı ekleyin
  const [selectedBetId, setSelectedBetId] = useState(null);
  const [newBetTitle, setNewBetTitle] = useState('');
  const [betDescription, setBetDescription] = useState('');
  const [minBetAmount, setMinBetAmount] = useState('');
  const [maxBetAmount, setMaxBetAmount] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>(exampleGroups);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [channels, setChannels] = useState<{_id: string, name: string}[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<any>(null);

  // Kullanıcı bilgilerini AsyncStorage'dan al
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserId(parsedUserData._id);
          setUserToken(parsedUserData.token);
        }
      } catch (error) {
        console.error("AsyncStorage'dan kullanıcı bilgileri alınırken hata:", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!userId) return; // Kullanıcı ID'si yoksa işlemi atla
      
      try {
        console.log(`Grup detayları getiriliyor: ${gangId}/${userId}`);
        const response = await fetch(`${API_BASE_URL}/api/pages/groups/detail/${gangId}/${userId}`);
        const data = await response.json();
        
        console.log("Grup API yanıtı:", data);
        
        // Grup verilerini sakla
        setGroupData(data.group);
        
        // Bahisleri ayarla
        if (data.group && data.group.bets) {
          setBets(data.group.bets);
        }
        
        // Kanalları ayarla
        if (data.group && data.group.channels) {
          setChannels(data.group.channels);
          console.log("Kanallar:", data.group.channels);
          
          // Eğer kanal varsa, ilk kanalı seç
          if (data.group.channels.length > 0) {
            setSelectedChannelId(data.group.channels[0].id);
            console.log("Seçilen kanal ID:", data.group.channels[0].id);
          }
        }
      } catch (error) {
        console.error("Grup detayları getirilirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
    
    // İzinleri kontrol et (Expo için)
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Üzgünüz, bu özelliği kullanmak için galeri izinlerine ihtiyacımız var!');
        }
      }
    })();
  }, [gangId, userId]);

  // Rastgele bir kanal ID'si seç
  const getRandomChannelId = () => {
    if (channels.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * channels.length);
    console.log(`Rastgele kanal seçildi: ${channels[randomIndex].name} (${channels[randomIndex].id})`);
    return channels[randomIndex].id;
  };

  const handleFinalisePress = (betId) => {
    setSelectedBetId(betId);
    setModalVisible(true);
  };

  const handleYesPress = async () => {
    try {
      const payload = { betId: selectedBetId, result: 'yes' };
      const response = await fetch('http://51.21.28.186:5001/api/bets/resolve', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
      } else {
        Alert.alert("Error", "Something went wrong: " + data.message);
      }

      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not send the result: " + error.message);
    }
  };

  const handleNoPress = async () => {
    try {
      const response = await fetch('https://your-backend-api.com/endpoint', {
        method: 'POST',
        body: JSON.stringify({ result: 'no', betId: selectedBetId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Alert.alert("Success", "Result recorded");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Could not send the result");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCreateBet = async () => {
    console.log("===== BAHİS OLUŞTURMA DETAYLARI =====");
    
    // Kullanıcı bilgilerini kontrol et
    console.log("Kullanıcı ID:", userId);
    console.log("Kullanıcı Token:", userToken ? "Mevcut" : "Yok");
    
    if (!userId || !userToken) {
      console.error("Hata: Kullanıcı bilgileri eksik!");
      Alert.alert("Hata", "Kullanıcı girişi yapılmamış. Lütfen tekrar giriş yapın.");
      return;
    }
    
    // Bahis başlığını kontrol et
    console.log("Bahis Başlığı:", newBetTitle);
    if (!newBetTitle.trim()) {
      console.error("Hata: Bahis başlığı boş!");
      Alert.alert("Hata", "Bahis başlığı boş olamaz.");
      return;
    }
    
    // Bahis açıklamasını kontrol et
    console.log("Bahis Açıklaması:", betDescription);
    if (!betDescription.trim()) {
      console.error("Hata: Bahis açıklaması boş!");
      Alert.alert("Hata", "Bahis açıklaması boş olamaz.");
      return;
    }
    
    // Bahis miktarlarını kontrol et
    console.log("Minimum Bahis Miktarı:", minBetAmount);
    console.log("Maksimum Bahis Miktarı:", maxBetAmount);
    if (!minBetAmount || !maxBetAmount) {
      console.error("Hata: Bahis miktarları eksik!");
      Alert.alert("Hata", "Minimum ve maksimum bahis miktarları belirtilmelidir.");
      return;
    }
    
    // Bitiş tarihini kontrol et
    console.log("Bitiş Tarihi:", endDate.toISOString());
    
    // Grup ID'sini kontrol et
    console.log("Grup ID:", gangId);
    
    // Mevcut kanalları kontrol et
    console.log("Mevcut Kanallar:", channels);
    
    // Rastgele bir kanal ID'si seç
    const channelId = getRandomChannelId();
    console.log("Seçilen Kanal ID:", channelId);
    
    if (!channelId) {
      console.error("Hata: Kanal bulunamadı!");
      Alert.alert("Hata", "Bu grup için kanal bulunamadı. Lütfen önce bir kanal oluşturun.");
      return;
    }
    
    // Resim durumunu kontrol et
    console.log("Resim:", image ? "Mevcut" : "Yok");
    
    // Tüm veriler hazır, bahis oluşturma işlemine devam et
    console.log("Tüm veriler hazır, bahis oluşturma işlemine devam ediliyor...");
    
    setUploading(true);
    
    try {
      // Sabit bir resim URL'si kullan
      const imageUrl = "https://tinderapp-bet-images.s3.eu-north-1.amazonaws.com/bet-photos/1740813122515.jpg";
      console.log("Kullanılacak resim URL'si:", imageUrl);
      
      // Postman koleksiyonundaki formata göre bahis oluşturma isteği
      const betData = {
        title: newBetTitle,
        description: betDescription,
        createdBy: userId,
        groupId: gangId,
        channelId: channelId,
        endDate: endDate.toISOString(),
        minBetAmount: parseInt(minBetAmount),
        maxBetAmount: parseInt(maxBetAmount),
        photoUrl: imageUrl  // API dokümantasyonuna göre doğru alan adı
      };
      
      console.log("Bahis oluşturma isteği gönderiliyor:", JSON.stringify(betData, null, 2));
      
      // API dokümantasyonuna göre doğru endpoint
      const response = await axios.post(`${API_BASE_URL}/api/bets/create`, betData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });
      
      console.log("Bahis oluşturma yanıtı:", JSON.stringify(response.data, null, 2));
      
      // Başarılı oluşturma
      Alert.alert("Başarılı", "Bahis başarıyla oluşturuldu!");
      
      // Formu sıfırla ve modalı kapat
      resetForm();
      setModalVisible(false);
      
      // Bahisleri yeniden yükle
      fetchGroupDetails();
    } catch (error) {
      console.error("Bahis oluşturulurken hata:", error);
      
      // Hata detaylarını göster
      if (error.response) {
        // Sunucu yanıtı ile dönen hata
        console.error("Sunucu yanıtı:", error.response.data);
        console.error("Durum kodu:", error.response.status);
        Alert.alert("Hata", `Sunucu hatası: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        console.error("İstek yapıldı ama yanıt alınamadı:", error.request);
        Alert.alert("Hata", "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
      } else {
        // İstek oluşturulurken bir hata oluştu
        console.error("İstek hatası:", error.message);
        Alert.alert("Hata", `İstek hatası: ${error.message}`);
      }
    } finally {
      setUploading(false);
      console.log("===== BAHİS OLUŞTURMA İŞLEMİ TAMAMLANDI =====");
    }
  };

  const resetForm = () => {
    setNewBetTitle('');
    setBetDescription('');
    setMinBetAmount('');
    setMaxBetAmount('');
    setEndDate(new Date());
    setSelectedGroups([]);
    setImage(null);
  };

  const toggleGroupSelection = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.3,
        maxWidth: 800,
        maxHeight: 600,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        console.log("Seçilen resim:", selectedAsset.uri);
        setImage(selectedAsset.uri);
        
        // Kullanıcıya bilgi verelim
        Alert.alert("Bilgi", "Fotoğraf seçildi. Bahis oluşturulurken fotoğraf yüklenecektir. Bu işlem biraz zaman alabilir.");
      }
    } catch (error) {
      console.error("Resim seçme hatası:", error);
      Alert.alert("Hata", "Resim seçilirken bir hata oluştu.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const showImageOptions = () => {
    Alert.alert(
      "Add Image",
      "Choose an option",
      [
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
   
    <View style={styles.container}>
       <LinearGradient
            colors={['#161638', '#714F60', '#B85B44']}
            style={styles.loadingContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
      <FlatList
  data={exampleData}
  renderItem={({ item }) => {
    // Rastgele kullanıcı seçimi ve miktarı (gerçek uygulamada API'dan gelecek)
    const userChoice = Math.random() > 0.5 ? 'yes' : 'no';
    const userAmount = Math.floor(Math.random() * 100) + 10;
    
    return (
      <View style={styles.mainCard}>
        <View style={styles.card}>
          {item.status === "Pending" && (
            <View style={styles.subcard}>
              <Image source={require('@/assets/images/alert-triangle.png')} style={styles.iconStyle} />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400' }}>Need Finalise</Text>
            </View>
          )}
          {item.status === "Result" && (
            <View style={styles.subcard}>
              <Image source={require('@/assets/images/gavel.png')} style={styles.iconStyle} />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400' }}>Finalised</Text>
            </View>
          )}
        </View>
        
        <View style={styles.cardContent}>
          {/* Bet Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://tinderapp-bet-images.s3.eu-north-1.amazonaws.com/bet-photos/1740813122515.jpg' }} 
              style={styles.profileImage} 
              defaultSource={require('@/assets/images/angry.png')}
            />
          </View>
          
          {/* Bet Details */}
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            
            <View style={styles.actions}>
              {/* User Choice Card */}
              {item.status === "Pending" && (
                <View style={[
                  styles.percentCard, 
                  { backgroundColor: userChoice === 'yes' ? 'rgba(80, 200, 120, 0.6)' : 'rgba(255, 99, 71, 0.6)' }
                ]}>
                  <Image 
                    source={
                      userChoice === 'yes' 
                        ? require('@/assets/images/thumb-up.png') 
                        : require('@/assets/images/thumb-down.png')
                    } 
                    style={styles.percentImage} 
                  />
                  <View style={styles.percentText}>
                    <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                      {userChoice.toUpperCase()}
                    </Text>
                    <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                      {' '}{userAmount} USDC
                    </Text>
                  </View>
                </View>
              )}
              
              {/* Additional stats */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                  <Text style={styles.detailText}>%40</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                  <Text style={styles.detailText}>7 Members</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
                  <Text style={styles.detailText}>2D Left</Text>
                </View>
              </View>
            </View>
          </View>
          
          

          {/* Finalise Button */}



          {/* Finalise Button */}
            {item.status === "Pending" && (
              <TouchableOpacity 
                onPress={() => handleFinalisePress(item.id)} 
                style={styles.finaliseButton}
              >
                <Image source={require('@/assets/images/power.png')} style={styles.iconStyle2} />
                <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Finalise</Text>
              </TouchableOpacity>
            )}
          
          {/* Result - Yes/No Button */}
          {item.status === "Result" && (
            <View style={styles.resultButton}>
              <Image source={require('@/assets/images/thumb-up.png')} style={styles.iconStyle2} />
              <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Yes!</Text>
            </View>
          )}
        </View>
      </View>
    );
  }}
  keyExtractor={(item) => item.id}
/>

       
      {/* New Bet Popup Modal */}
      <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={{ color: '#000', fontSize: 16 }}>X</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>What is the result?</Text>
              <TouchableOpacity onPress={handleYesPress} style={styles.modalResultButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNoPress} style={styles.modalResultButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center', // 'flex-start' yerine 'center' kullanın
    justifyContent: 'space-between', // Ekleyin
    width: '100%', // Ekleyin
  },
  card2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    paddingVertical: 6, // 8'den 6'ya düşürün
    paddingHorizontal: 8,
    borderRadius: 20,
    minWidth: 70, // 78'den 70'e düşürün
    justifyContent: 'center',
    flexShrink: 0, // Ekleyin
  },
  card3: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6, // 8'den 6'ya düşürün
    paddingHorizontal: 8,
    borderRadius: 20,
    minWidth: 70, // Ekleyin
    justifyContent: 'center',
    flexShrink: 0, // Ekleyin
  },
  subcard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  iconStyle2: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    flexShrink: 1,
    width: '75%', // %90 yerine %75 kullanın
  },
  // Modal ve Yeni Eklenen Stiller
  newBetButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 10,
  },
  createButton: {
    backgroundColor: '#4285F4',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Grup Seçimi Stilleri
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  groupItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedGroupItem: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  groupItemText: {
    color: '#fff',
    fontSize: 12,
  },
  selectedGroupItemText: {
    fontWeight: 'bold',
  },
  // Tarih seçici stilleri
  datePickerButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: '#fff',
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
    tintColor: '#fff',
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  imageOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  imageOptionIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  channelInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  channelInfoText: {
    color: '#fff',
    fontSize: 12,
  },
  imageUploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Öğeleri yatay olarak eşit dağıtır
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexWrap: 'nowrap', // Öğelerin alt satıra geçmesini engeller
  },
  seeAllIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  seeAllText: {
    fontSize: 12, // 14'ten 12'ye düşürdüm
    fontWeight: '600',
    color: '#fff',
    marginLeft: 3,
  },
  // Eklenecek ve değiştirilecek stiller
cardContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
},
imageContainer: {
  width: 60,
  height: 60,
  marginRight: 10,
},
profileImage: {
  width: 60,
  height: 60,
  borderRadius: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
},
content: {
  flex: 1,
},
actions: {
  flexDirection: 'column',
  justifyContent: 'flex-start',
},
percentCard: {
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 13,
  paddingHorizontal: 8,
  paddingVertical: 4,
  alignSelf: 'flex-start',
  marginBottom: 8,
},
percentText: {
  flexDirection: 'row',
},
percentImage: {
  width: 16,
  height: 16,
  tintColor: '#fff',
  marginRight: 4,
},
detailsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
},
detailItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 12,
},
detailText: {
  fontSize: 12,
  color: '#fff',
},
finaliseButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: "#fff",
  paddingVertical: 6,
  paddingHorizontal: 8,
  borderRadius: 20,
  justifyContent: 'center',
  position: 'absolute',
  right: 0,
  top: 0,
},
resultButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(80, 200, 120, 0.8)',
  paddingVertical: 6,
  paddingHorizontal: 8,
  borderRadius: 20,
  justifyContent: 'center',
  position: 'absolute',
  right: 0,
  top: 0,
},
// styles tanımlamanızda bunları ekleyin

modalResultButton: {
  backgroundColor: '#1E1E4C',
  padding: 10,
  borderRadius: 5,
  marginVertical: 5,
  width: '50%',
  alignItems: 'center',
},

modalButtonText: {
  color: '#fff', 
  fontSize: 16
},

// ModalContent ve closeButton stillerini güncelleme
modalContent: {
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  alignItems: 'center',
},

closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 10,
},
});