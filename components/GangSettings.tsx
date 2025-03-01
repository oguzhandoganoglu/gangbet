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
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from "../app/UserContext";

export default function GangSettings({ gangDetail, isLoading, isAdmin }) {
  const router = useRouter();
  const { user } = useUser();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [groupName, setGroupName] = useState(gangDetail?.name || '');
  const [groupDescription, setGroupDescription] = useState(gangDetail?.description || '');
  const [privateGroup, setPrivateGroup] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('@/assets/images/user-plus.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Invite Members</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('@/assets/images/user-minus.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Manage Members</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('@/assets/images/power.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Finalise Pending Bets</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4C',
    padding: 15,
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
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
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
    marginBottom: 20,
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