import React, { useState } from 'react';
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
  ActivityIndicator,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function GangAllBets({ bets, gangId, isLoading }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newBetTitle, setNewBetTitle] = useState('');
  const [betDescription, setBetDescription] = useState('');
  const [minBetAmount, setMinBetAmount] = useState('');
  const [maxBetAmount, setMaxBetAmount] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [allGroups, setAllGroups] = useState([
    { id: gangId, name: 'Current Group' }
  ]);

  // Handle date picker
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Toggle group selection
  const toggleGroupSelection = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  // Image picker methods
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
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

      const result = await ImagePicker.launchCameraAsync({
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

  // Reset form fields
  const resetForm = () => {
    setNewBetTitle('');
    setBetDescription('');
    setMinBetAmount('');
    setMaxBetAmount('');
    setEndDate(new Date());
    setSelectedGroups([]);
    setImage(null);
  };

  // Create bet handler
  const handleCreateBet = async () => {
    // Validation
    if (!newBetTitle.trim()) {
      Alert.alert("Error", "Bet title is required");
      return;
    }

    if (!betDescription.trim()) {
      Alert.alert("Error", "Bet description is required");
      return;
    }

    if (!minBetAmount || !maxBetAmount) {
      Alert.alert("Error", "Min and max bet amounts are required");
      return;
    }

    setUploading(true);
    try {
      // Create form data for image upload if image exists
      let imageUrl = null;
      if (image) {
        const formData = new FormData();
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'upload.jpg',
        });
        
        // This would be your actual image upload API call
        // const uploadResponse = await fetch('YOUR_UPLOAD_API_ENDPOINT', {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        // });
        // const uploadResult = await uploadResponse.json();
        // imageUrl = uploadResult.imageUrl;
        
        // For now, we'll just use the local URI
        imageUrl = image;
      }
      
      // This would be the actual bet creation API call
      // const createBetResponse = await axios.post('http://51.21.28.186:5001/api/bets/create', {
      //   title: newBetTitle,
      //   description: betDescription,
      //   group: gangId,
      //   endDate: endDate,
      //   minBetAmount: minBetAmount,
      //   maxBetAmount: maxBetAmount,
      //   photoUrl: imageUrl
      // });
      
      // For now, just log the data
      console.log("Creating new bet:", {
        title: newBetTitle,
        description: betDescription,
        group: gangId,
        endDate: endDate,
        minBetAmount: minBetAmount,
        maxBetAmount: maxBetAmount,
        photoUrl: imageUrl
      });
      
      // Close modal and reset form
      setModalVisible(false);
      resetForm();
      
      // Show success message
      Alert.alert("Success", "Bet created successfully!");
      
      // You would need to refresh the bets list here
      // refreshBets();
      
    } catch (error) {
      console.error("Error creating bet:", error);
      Alert.alert("Error", "Failed to create bet. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading bets...</Text>
      </View>
    );
  }

  if (!bets || bets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image 
          source={require('@/assets/images/gavel.png')} 
          style={[styles.iconStyle, { width: 40, height: 40, marginBottom: 10 }]} 
        />
        <Text style={styles.emptyText}>No bets found</Text>
        <Text style={styles.emptySubText}>Create a new bet to get started</Text>
        
        <TouchableOpacity 
          style={styles.createBetButton}
          onPress={() => setModalVisible(true)}
        >
          <Image source={require('@/assets/images/new-section.png')} style={styles.iconStyle} />
          <Text style={styles.createBetText}>New Bet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bets}
        renderItem={({ item }) => (
          <View style={styles.mainCard}>
            <View style={styles.card}>
              {item.status === "expired" && (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/alert-triangle.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>Need Finalise</Text>
                </View>
              )}
              {item.status === "ended" && (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/gavel.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>Finalised</Text>
                </View>
              )}
              {item.status === "active" && (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                    {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>    
            <View style={styles.card}>
              <View style={{flex: 1}}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.buttons}>
                  <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400', marginRight:7}}>
                    {item.yesPercentage}%
                  </Text>
                  <Image source={require('@/assets/images/chart-line.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400', marginRight:7}}>
                    {item.totalPool} USDC
                  </Text>
                  <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400', marginRight:21}}>
                    {item.participantsCount} Members
                  </Text>
                  <Image source={require('@/assets/images/send.png')} style={styles.iconStyle} />
                  <Image source={require('@/assets/images/share.png')} style={styles.iconStyle} />
                </View>
              </View>
              
              {item.status === "expired" && (
                <View style={styles.card2}>
                  <Image source={require('@/assets/images/power.png')} style={styles.iconStyle2} />
                  <Text style={{color:'#000', fontSize:12, fontWeight:'400'}}>Finalise</Text>
                </View>
              )}
              
              {item.status === "ended" && (
                <View style={[
                  styles.card3,
                  item.result === 'yes' ? styles.cardYes : styles.cardNo
                ]}>
                  <Image 
                    source={
                      item.result === 'yes' 
                        ? require('@/assets/images/thumb-up.png') 
                        : require('@/assets/images/thumb-down.png')
                    }
                    style={styles.iconStyle2} 
                  />
                  <Text style={{color:'#000', fontSize:12, fontWeight:'400'}}>
                    {item.result === 'yes' ? 'Yes!' : 'No!'}
                  </Text>
                </View>
              )}
              
              {item.status === "active" && item.userParticipation && (
                <View style={[
                  styles.card3,
                  item.userParticipation.choice === 'yes' ? styles.cardYes : styles.cardNo
                ]}>
                  <Image 
                    source={
                      item.userParticipation.choice === 'yes' 
                        ? require('@/assets/images/thumb-up.png') 
                        : require('@/assets/images/thumb-down.png')
                    }
                    style={styles.iconStyle2} 
                  />
                  <Text style={{color:'#000', fontSize:12, fontWeight:'400'}}>
                    {item.userParticipation.choice === 'yes' ? 'Yes!' : 'No!'}
                  </Text>
                </View>
              )}
              
              {item.status === "active" && !item.userParticipation && (
                <View style={styles.betButtons}>
                  <TouchableOpacity style={styles.betButton}>
                    <Text style={styles.betButtonText}>Bet</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.seeAllButton}>
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('@/assets/images/search.png')} style={styles.iconStyle} />
        </TouchableOpacity>
        <Image source={require('@/assets/images/vector.png')} style={{width:4, height:16, marginRight:5, marginLeft:10}} />
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('@/assets/images/seeding.png')} style={styles.iconStyle} />
          <Text style={styles.seeAllText}>Latest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
          <Text style={styles.seeAllText}>Time Ended</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.newBetButton}>
            <Image source={require('@/assets/images/new-section.png')} style={styles.iconStyle} />
            <Text style={styles.seeAllText}>New Bet</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* New Bet Modal */}
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

                {/* Image Upload Section */}
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
                
                {/* Group Selection - For this implementation we just use the current group */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Group</Text>
                  <View style={styles.groupsContainer}>
                    {allGroups.map(group => (
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
                
                {/* Action Buttons */}
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
                    style={[
                      styles.button, 
                      styles.createButton,
                      uploading ? styles.disabledButton : null
                    ]} 
                    onPress={handleCreateBet}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Create Bet</Text>
                    )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4C',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4C',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  card2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    paddingVertical: 8, 
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 78,
  },
  card3: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, 
    paddingHorizontal: 11,
    borderRadius: 20,
    minWidth: 70,
  },
  cardYes: {
    backgroundColor: 'rgba(69, 170, 69, 0.6)',
  },
  cardNo: {
    backgroundColor: 'rgba(220, 53, 69, 0.6)',
  },
  subcard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 5,
    tintColor: '#fff',
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
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    flexShrink: 1,
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
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 10,
  },
  createBetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  createBetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newBetButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  betButtons: {
    flexDirection: 'row',
  },
  betButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  betButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Modal styles
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
    justifyContent: 'center',
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
  disabledButton: {
    opacity: 0.6,
  },
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
  }
});