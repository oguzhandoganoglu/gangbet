import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from "../app/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export default function GangSettings({ gangDetail, isLoading, isAdmin }) {
  const router = useRouter();
  const { user } = useUser();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showRemoveAdminModal, setShowRemoveAdminModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [groupName, setGroupName] = useState(gangDetail?.name || '');
  const [groupDescription, setGroupDescription] = useState(gangDetail?.description || '');
  const [groupImage, setGroupImage] = useState(gangDetail?.photoUrl || null);
  const [privateGroup, setPrivateGroup] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Örnek kullanıcılar listesi
  const sampleUsers = [
    { id: '1', name: 'Ahmet Yılmaz', photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg', isAdmin: true },
    { id: '2', name: 'Mehmet Demir', photoUrl: 'https://randomuser.me/api/portraits/men/33.jpg', isAdmin: false },
    { id: '3', name: 'Ayşe Kaya', photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg', isAdmin: false },
    { id: '4', name: 'Fatma Çelik', photoUrl: 'https://randomuser.me/api/portraits/women/45.jpg', isAdmin: false },
    { id: '5', name: 'Mustafa Şahin', photoUrl: 'https://randomuser.me/api/portraits/men/36.jpg', isAdmin: false },
  ];
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Pick image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setGroupImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  // Handle update group settings
  const handleUpdateGroup = async () => {
    if (!isAdmin) {
      Alert.alert('Error', 'Only admins can update group settings');
      return;
    }
    
    if (!groupName.trim()) {
      Alert.alert('Error', 'Group name cannot be empty');
      return;
    }
    
    setIsUpdating(true);
    try {
      // Here you would make an API call to update the group
      // For demo purposes, we'll just show a success message
      setTimeout(() => {
        Alert.alert('Success', 'Group settings updated successfully');
        setShowEditModal(false);
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating group:', error);
      Alert.alert('Error', 'Failed to update group settings');
      setIsUpdating(false);
    }
  };
  
  // Handle add/remove admin
  const handleAddAdmin = (userId) => {
    Alert.alert('Success', 'User has been granted admin privileges');
    setShowAddAdminModal(false);
  };
  
  const handleRemoveAdmin = (userId) => {
    Alert.alert('Success', 'Admin privileges have been revoked');
    setShowRemoveAdminModal(false);
  };
  
  // Handle delete group
  const handleDeleteGroup = async () => {
    try {
      // Here you would make an API call to delete the group
      // For demo purposes, we'll just navigate back
      setTimeout(() => {
        setShowDeleteGroupModal(false);
        router.back();
      }, 1000);
    } catch (error) {
      console.error('Error deleting group:', error);
      Alert.alert('Error', 'Failed to delete group');
    }
  };
  
  // Handle leave group
  const handleLeaveGroup = async () => {
    try {
      // Here you would make an API call to leave the group
      // For demo purposes, we'll just navigate back
      setShowLeaveModal(false);
      router.back();
    } catch (error) {
      console.error('Error leaving group:', error);
      Alert.alert('Error', 'Failed to leave group');
    }
  };
  
  // Render user item for admin modals
  const renderUserItem = ({ item, type }) => (
    <View style={styles.userItem}>
      <Image 
        source={{ uri: item.photoUrl }}
        style={styles.userAvatar}
        defaultSource={require('@/assets/images/angry.png')}
      />
      <Text style={styles.userName}>{item.name}</Text>
      <TouchableOpacity 
        style={[
          styles.userActionButton,
          type === 'add' ? styles.addButton : styles.removeButton
        ]}
        onPress={() => type === 'add' ? handleAddAdmin(item.id) : handleRemoveAdmin(item.id)}
      >
        <Image 
          source={
            type === 'add' 
              ? require('@/assets/images/user-plus.png') 
              : require('@/assets/images/user-minus.png')
          } 
          style={styles.userActionIcon} 
        />
      </TouchableOpacity>
    </View>
  );
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }
  
  if (!gangDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load group details</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Group Info Section */}
      <LinearGradient
        colors={['#161638', '#714F60', '#B85B44']}
        style={styles.loadingContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Group Information</Text>
            {isAdmin && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setShowEditModal(true)}
              >
                <Image source={require('@/assets/images/edit.png')} style={styles.editIcon} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Group Name</Text>
            <Text style={styles.infoValue}>{gangDetail.name}</Text>
          </View>
          
          {gangDetail.description && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoValue}>{gangDetail.description}</Text>
            </View>
          )}
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created By</Text>
            <Text style={styles.infoValue}>{gangDetail.createdBy}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created On</Text>
            <Text style={styles.infoValue}>{formatDate(gangDetail.createdAt)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Members</Text>
            <Text style={styles.infoValue}>{gangDetail.members.length}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Active Bets</Text>
            <Text style={styles.infoValue}>{gangDetail.activeBetsCount}</Text>
          </View>
        </View>
        
        {/* Admin Controls Section - Only visible to admins */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin Controls</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowAddAdminModal(true)}
            >
              <Image source={require('@/assets/images/user-plus.png')} style={styles.actionIcon} />
              <Text style={styles.actionText}>Add Admin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowRemoveAdminModal(true)}
            >
              <Image source={require('@/assets/images/user-minus.png')} style={styles.actionIcon} />
              <Text style={styles.actionText}>Delete Admin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => setShowDeleteGroupModal(true)}
            >
              <Image source={require('@/assets/images/trash.png')} style={[styles.actionIcon, styles.dangerIcon]} />
              <Text style={[styles.actionText, styles.dangerText]}>Delete Group</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* User Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]}
            onPress={() => setShowLeaveModal(true)}
          >
            <Image source={require('@/assets/images/logout.png')} style={[styles.actionIcon, styles.dangerIcon]} />
            <Text style={[styles.actionText, styles.dangerText]}>Leave Group</Text>
          </TouchableOpacity>
        </View>
        
        {/* Edit Group Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showEditModal}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Group</Text>
              
              {/* Group Image */}
              <View style={styles.groupImageContainer}>
                <Image 
                  source={{ uri: groupImage || 'https://via.placeholder.com/120' }}
                  style={styles.groupImage}
                />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.changeImageText}>Change Photo</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Group Name</Text>
                <TextInput
                  style={styles.input}
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="Enter group name"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  placeholder="Enter group description"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Private Group</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#4285F4" }}
                  thumbColor={privateGroup ? "#fff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setPrivateGroup}
                  value={privateGroup}
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => {
                    setShowEditModal(false);
                    setGroupName(gangDetail.name);
                    setGroupDescription(gangDetail.description || '');
                    setGroupImage(gangDetail.photoUrl);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton, isUpdating && styles.disabledButton]} 
                  onPress={handleUpdateGroup}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Add Admin Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showAddAdminModal}
          onRequestClose={() => setShowAddAdminModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Admin</Text>
              <Text style={styles.modalSubtitle}>Select a member to make admin:</Text>
              
              <FlatList
                data={sampleUsers.filter(user => !user.isAdmin)}
                renderItem={({ item }) => renderUserItem({ item, type: 'add' })}
                keyExtractor={(item) => item.id}
                style={styles.userList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>No members available to be added as admin.</Text>
                }
              />
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { marginTop: 10 }]} 
                onPress={() => setShowAddAdminModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Remove Admin Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRemoveAdminModal}
          onRequestClose={() => setShowRemoveAdminModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Remove Admin</Text>
              <Text style={styles.modalSubtitle}>Select an admin to remove privileges:</Text>
              
              <FlatList
                data={sampleUsers.filter(user => user.isAdmin && user.id !== '1')} // Exclude the first admin (assumed to be the creator)
                renderItem={({ item }) => renderUserItem({ item, type: 'remove' })}
                keyExtractor={(item) => item.id}
                style={styles.userList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>No other admins in this group.</Text>
                }
              />
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, { marginTop: 10 }]} 
                onPress={() => setShowRemoveAdminModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Delete Group Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteGroupModal}
          onRequestClose={() => setShowDeleteGroupModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmTitle}>Delete Group?</Text>
              <Text style={styles.confirmText}>
                Are you sure you want to permanently delete this group? This action cannot be undone and all group data will be lost.
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setShowDeleteGroupModal(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.leaveButton]} 
                  onPress={handleDeleteGroup}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        
        {/* Leave Group Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showLeaveModal}
          onRequestClose={() => setShowLeaveModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmTitle}>Leave Group?</Text>
              <Text style={styles.confirmText}>
                Are you sure you want to leave this group? You'll need to be invited back to rejoin.
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setShowLeaveModal(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.leaveButton]} 
                  onPress={handleLeaveGroup}
                >
                  <Text style={styles.buttonText}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4C',
    padding: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  editIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
    marginRight: 5,
  },
  editText: {
    color: '#fff',
    fontSize: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    marginRight: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#fff',
    top: 5
  },
  dangerIcon: {
    tintColor: '#dc3545',
  },
  dangerText: {
    color: '#dc3545',
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
    backgroundColor: '#1E1E4C',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    maxHeight: '80%',
  },
  confirmModalContent: {
    width: '80%',
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
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Group image
  groupImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  changeImageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
  },
  // User list styles
  userList: {
    maxHeight: 300,
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  userActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userActionIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  addButton: {
    backgroundColor: '#4caf50',
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  emptyListText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  // Input styles
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  saveButton: {
    backgroundColor: '#4285F4',
  },
  leaveButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  }
});