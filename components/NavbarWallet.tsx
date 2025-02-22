import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function NavbarWallet() {
  return (
    <LinearGradient colors={["#6C5CE7", "#341F97"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GANGBET👍</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source={require("@/assets/images/user1.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.balanceText}>4,350.5 USDC</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "flex-start"
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 5,
  },
});
