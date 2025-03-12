import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from "../app/UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

interface ProfileSettingsViewProps {
    onClose: () => void;
  }

  export default function ProfileSettingsView({ onClose }: ProfileSettingsViewProps) {
  const router = useRouter();
  const { user, logout } = useUser();
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [userImage, setUserImage] = useState(user?.photoUrl || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  interface ProfileSettingsViewProps {
  onClose: () => void;
}
  // Kullanıcı verilerini çek
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!user || !user._id || !user.token) {
      setLoading(false);
      return;
    }

    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await fetch(`${baseUrl}/api/pages/profile/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
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
        setUserImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };
  
  // Calculate win rate
  const calculateWinRate = () => {
    if (!userData || !userData.user) return 'N/A';
    
    const totalBets = userData.totalWonBets + userData.totalLostBets;
    if (totalBets === 0) return '0%';
    
    const winRate = (userData.totalWonBets / totalBets) * 100;
    return `${winRate.toFixed(2)}%`;
  };
  
  // Total earnings calculation
  const calculateTotalEarnings = () => {
    if (!userData || !userData.user) return { total: 0, won: 0, lost: 0 };
    
    return {
      total: userData.totalEarnings || 0,
      won: userData.totalWonAmount || 0,
      lost: userData.totalLostAmount || 0
    };
  };
  
  // Handle update profile
  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }
    
    setIsUpdating(true);
    try {
      // API call would go here
      // For demo purposes, we'll just show a success message
      setTimeout(() => {
        Alert.alert('Success', 'Profile updated successfully');
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
      setIsUpdating(false);
    }
  };
  
  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      // Here you would make an API call to delete the account
      // For demo, we'll just log the user out
      setTimeout(() => {
        setShowDeleteAccountModal(false);
        logout();
        router.replace('/login');
      }, 1000);
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account');
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)} USDC`;
  };
  
  if (loading) {
    return (
      <LinearGradient
        colors={['#161638', '#714F60', '#B85B44']}
        style={styles.loadingContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </LinearGradient>
    );
  }
  
  const earnings = calculateTotalEarnings();
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#161638', '#714F60', '#B85B44']}
        style={styles.gradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Image source={require('@/assets/images/back.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Settings</Text>
          <View style={{width: 40}} />
        </View>
        
        {/* Profile Image and Name Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: userImage || 'https://via.placeholder.com/120' }}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={styles.changeImageButton}
              onPress={pickImage}
            >
              <Text style={styles.changeImageText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor="#999"
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.updateButton, isUpdating && styles.disabledButton]} 
            onPress={handleUpdateProfile}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.updateButtonText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Win Rate</Text>
            <Text style={styles.infoValue}>{calculateWinRate()}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Earnings</Text>
            <Text style={styles.infoValue}>{formatCurrency(earnings.total)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Won</Text>
            <Text style={[styles.infoValue, {color: '#4CAF50'}]}>{formatCurrency(earnings.won)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Total Lost</Text>
            <Text style={[styles.infoValue, {color: '#FF5252'}]}>{formatCurrency(earnings.lost)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Joined On</Text>
            <Text style={styles.infoValue}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Text>
          </View>
        </View>
        
        {/* Account Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => {
              logout();
              router.replace('/login');
            }}
          >
            <Image source={require('@/assets/images/logout.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]}
            onPress={() => setShowDeleteAccountModal(true)}
          >
            <Image source={require('@/assets/images/trash.png')} style={[styles.actionIcon, styles.dangerIcon]} />
            <Text style={[styles.actionText, styles.dangerText]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        
        {/* Delete Account Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteAccountModal}
          onRequestClose={() => setShowDeleteAccountModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.confirmModalContent}>
              <Text style={styles.confirmTitle}>Delete Account?</Text>
              <Text style={styles.confirmText}>
                Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setShowDeleteAccountModal(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]} 
                  onPress={handleDeleteAccount}
                >
                  <Text style={styles.buttonText}>Delete</Text>
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
  gradient: {
    flex: 1,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  // Profile section
  profileSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
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
  inputContainer: {
    width: '100%',
    marginBottom: 20,
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
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  // Stats section
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  },
  // Action buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  confirmModalContent: {
    width: '80%',
    backgroundColor: '#1E1E4C',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});