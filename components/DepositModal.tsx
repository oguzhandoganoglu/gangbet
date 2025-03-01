import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import { CUSTODY_WALLET_ADDRESS } from '../services/aptosClient';
import { Ionicons } from '@expo/vector-icons';

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DepositModal({ visible, onClose }: DepositModalProps) {
  const walletAddress = CUSTODY_WALLET_ADDRESS;

  const copyToClipboard = () => {
    Clipboard.setString(walletAddress);
    
    if (Platform.OS === 'android') {
      ToastAndroid.show('Address copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Address copied to clipboard');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Deposit Address</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.depositLabel}>Your Deposit Address (USDC/MOVE)</Text>
          <TouchableOpacity 
            style={styles.addressContainer}
            onPress={copyToClipboard}
          >
            <Text style={styles.addressText}>{walletAddress}</Text>
            <View style={styles.copyIconContainer}>
              <Ionicons name="copy-outline" size={20} color="#4a90e2" />
              <Text style={styles.copyText}>Tap to copy</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.warningContainer}>
            <Ionicons name="warning-outline" size={20} color="#ffcc00" />
            <Text style={styles.warningText}>Only send USDC to this address. Other tokens may be lost.</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.startBetButton}
            onPress={onClose}
          >
            <Text style={styles.startBetText}>Start Betting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 5,
  },
  depositLabel: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 10,
  },
  addressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  addressText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  copyIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyText: {
    color: '#4a90e2',
    marginLeft: 5,
    fontSize: 14,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  warningText: {
    color: '#eee',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  startBetButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  startBetText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
}); 