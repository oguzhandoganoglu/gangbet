import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useUser } from "../app/UserContext";
import DepositModal from "./DepositModal";

export default function NavbarWallet() {
  const router = useRouter();
  const { user } = useUser();
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  
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
      {/* Kullanıcı balance değerini göster */}
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
      
      {/* Para Yatırma Modalı */}
      <DepositModal 
        visible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "flex-start",
    // Gradient arka plan, LinearGradient ile sağlanıyor artık
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  logo: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    marginLeft: 2,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Daha saydam
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
  },
  profileText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  balanceText: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
    marginVertical: 15,
    marginLeft: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 64,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Daha saydam
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 5,
  },
});