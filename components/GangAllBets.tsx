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
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker'; 

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
  const [modalVisible, setModalVisible] = useState(false);
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

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const userId = "currentUserId"; // Gerçek kullanıcı ID'sini buraya eklemelisiniz
        const response = await fetch(`http://51.21.28.186:5001/api/pages/groups/detail/${gangId}/${userId}`);
        const data = await response.json();
        setBets(data.group);
        console.log(data);
      } catch (error) {
        console.error("Error fetching bets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
    // İzinleri kontrol et (Expo için)
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, [gangId]);

  const handleCreateBet = async () => {
    setUploading(true);
    try {
      // Eğer resim varsa önce yükleme yapabilirsiniz
      let imageUrl = null;
      if (image) {
        // Burada resmi sunucuya yükleme işlemi yapılır
        // Bu örnek için basitleştirilmiş bir uygulama
        const formData = new FormData();
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });
        
        // Resim upload API çağrısı
        // const uploadResponse = await fetch('YOUR_UPLOAD_API_ENDPOINT', {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // });
        // const uploadResult = await uploadResponse.json();
        // imageUrl = uploadResult.imageUrl;
        
        // Demo için
        imageUrl = image;
      }
      
      // Yeni bahis oluşturma işlemi
      console.log("Creating new bet:", {
        title: newBetTitle,
        description: betDescription,
        groups: selectedGroups,
        endDate: endDate,
        minAmount: minBetAmount,
        maxAmount: maxBetAmount,
        imageUrl: imageUrl
      });
      
      // Modal'ı kapat ve state'i temizle
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error("Error creating bet:", error);
      Alert.alert("Error", "Failed to create bet. Please try again.");
    } finally {
      setUploading(false);
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
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
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
      <FlatList
        data={exampleData}
        renderItem={({ item }) => (
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
            {item.status === "Pending" && (
              <View style={styles.card}>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.buttons}>
                    <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 7 }}>%40</Text>
                    <Image source={require('@/assets/images/chart-line.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 7 }}>50K</Text>
                    <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 21 }}>7 Members</Text>
                    <Image source={require('@/assets/images/send.png')} style={styles.iconStyle} />
                    <Image source={require('@/assets/images/share.png')} style={styles.iconStyle} />
                  </View>
                </View>
                <View style={styles.card2}>
                  <Image source={require('@/assets/images/power.png')} style={styles.iconStyle2} />
                  <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Finalise</Text>
                </View>
              </View>
            )}
            {item.status === "Result" && (
              <View style={styles.card}>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.buttons}>
                    <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 7 }}>%40</Text>
                    <Image source={require('@/assets/images/chart-line.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 7 }}>50K</Text>
                    <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 21 }}>7 Members</Text>
                    <Image source={require('@/assets/images/send.png')} style={styles.iconStyle} />
                    <Image source={require('@/assets/images/share.png')} style={styles.iconStyle} />
                  </View>
                </View>
                <View style={styles.card3}>
                  <Image source={require('@/assets/images/thumb-up.png')} style={styles.iconStyle2} />
                  <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Yes!</Text>
                </View>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.seeAllButton}>
        <Image source={require('@/assets/images/search.png')} style={styles.iconStyle} />
        <Image source={require('@/assets/images/vector.png')} style={{ width: 4, height: 16, marginRight: 5, marginLeft: 80 }} />
        <Image source={require('@/assets/images/seeding.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>Latest</Text>
        <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>Time Ended</Text>
        
        {/* New Bet butonu - Tıklandığında modal açılacak */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.newBetButton}>
            <Image source={require('@/assets/images/new-section.png')} style={styles.iconStyle} />
            <Text style={styles.seeAllText}>New Bet</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* New Bet Popup Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Create New Bet</Text>
                
                {/* Bet Title */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bet Title</Text>
                  <TextInput
                    style={styles.input}
                    value={newBetTitle}
                    onChangeText={setNewBetTitle}
                    placeholder="Enter bet title"
                    placeholderTextColor="#999"
                  />
                </View>
                
                {/* Bet Description */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bet Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={betDescription}
                    onChangeText={setBetDescription}
                    placeholder="Enter bet description"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Image Upload Section - YENİ EKLENEN KISIM */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bet Image</Text>
                  
                  {!image ? (
                    <TouchableOpacity 
                      style={styles.uploadButton} 
                      onPress={showImageOptions}
                    >
                      <Image 
                        source={require('@/assets/images/upload.png')} 
                        style={styles.uploadIcon}
                      />
                      <Text style={styles.uploadText}>Upload Image</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: image }} style={styles.previewImage} />
                      <View style={styles.imageOverlay}>
                        <TouchableOpacity 
                          style={styles.imageOption} 
                          onPress={showImageOptions}
                        >
                          <Image 
                            source={require('@/assets/images/edit.png')} 
                            style={styles.imageOptionIcon} 
                          />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.imageOption} 
                          onPress={removeImage}
                        >
                          <Image 
                            source={require('@/assets/images/trash.png')} 
                            style={styles.imageOptionIcon} 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
                
                {/* Which Groups */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Which Groups</Text>
                  <View style={styles.groupsContainer}>
                    {availableGroups.map(group => (
                      <TouchableOpacity 
                        key={group.id}
                        onPress={() => toggleGroupSelection(group.id)}
                        style={[
                          styles.groupItem,
                          selectedGroups.includes(group.id) && styles.selectedGroupItem
                        ]}
                      >
                        <Text style={[
                          styles.groupItemText,
                          selectedGroups.includes(group.id) && styles.selectedGroupItemText
                        ]}>
                          {group.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                {/* End Date */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>End Date</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePickerButton}
                  >
                    <Text style={styles.dateText}>{formatDate(endDate)}</Text>
                    <Image 
                      source={require('@/assets/images/hourglass.png')} 
                      style={styles.iconStyle} 
                    />
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
                
                {/* Min and Max Bet Amount */}
                <View style={styles.rowContainer}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.inputLabel}>Min Bet Amount</Text>
                    <TextInput
                      style={styles.input}
                      value={minBetAmount}
                      onChangeText={setMinBetAmount}
                      placeholder="Min amount"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  
                  <View style={[styles.inputContainer, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Max Bet Amount</Text>
                    <TextInput
                      style={styles.input}
                      value={maxBetAmount}
                      onChangeText={setMaxBetAmount}
                      placeholder="Max amount"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                
                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => {
                      setModalVisible(false);
                      resetForm();
                    }}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.button, styles.createButton]} 
                    onPress={handleCreateBet}
                  >
                    <Text style={styles.buttonText}>Create Bet</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4C',
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
    alignItems: 'flex-start',
  },
  card2: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 20,
    minWidth: 78,
  },
  card3: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 20,
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
    width: '90%',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 10,
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
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#1E1E4C',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  dateText: {
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
  imageContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
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
});