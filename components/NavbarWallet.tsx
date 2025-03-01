import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Clipboard, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useUser } from "../app/UserContext";
import QRCode from 'react-native-qrcode-svg';
import { CUSTODY_WALLET_ADDRESS } from "../services/aptosClient";

export default function NavbarWallet() {
  const router = useRouter();
  const { user } = useUser();
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  
  // Copy address to clipboard
  const copyToClipboard = () => {
    Clipboard.setString(CUSTODY_WALLET_ADDRESS);
    Alert.alert("Success", "Address copied to clipboard!");
  };
  
  return (
    <LinearGradient 
      colors={["rgba(108, 92, 231, 0.1)", "rgba(52, 31, 151, 0.1)"]} 
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>GANGBET👍</Text>
        <TouchableOpacity 
          style={styles.profileContainer} 
          onPress={() => router.push("/profile")}
        >
          <Image
            source={require("@/assets/images/user1.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Show user balance */}
      <Text style={styles.balanceText}>
        {user ? `${user.balance.toFixed(1)} USDC` : "0.0 USDC"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setDepositModalVisible(true)}
        >
          <Image source={require('@/assets/images/qrcode.png')} style={{ width: 24, height: 24 }} />
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('@/assets/images/send.png')} style={{ width: 24, height: 24 }} />
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('@/assets/images/refresh.png')} style={{ width: 24, height: 24 }} />
          <Text style={styles.buttonText}>Convert</Text>
        </TouchableOpacity>
      </View>
      
      {/* Deposit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={depositModalVisible}
        onRequestClose={() => setDepositModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient 
            colors={["rgba(108, 92, 231, 0.95)", "rgba(52, 31, 151, 0.95)"]} 
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Deposit Funds</Text>
            <Text style={styles.modalText}>
              Send APT to the address below to deposit funds to your account.
            </Text>
            
            <View style={styles.qrContainer}>
              <QRCode
                value={CUSTODY_WALLET_ADDRESS}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>
            
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>Custody Wallet Address:</Text>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                  {CUSTODY_WALLET_ADDRESS}
                </Text>
              </View>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.warningText}>
              Note: Deposit may take a few minutes depending on blockchain confirmation.
            </Text>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setDepositModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6c5ce7",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  profileText: {
    fontSize: 14,
    color: "#666",
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#6c5ce7",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'white',
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  qrContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: 'white',
    fontWeight: '500',
  },
  addressTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 12,
    color: 'white',
  },
  copyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});