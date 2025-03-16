import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function NavbarNotificaiton() {
  return (
    <LinearGradient 
      colors={["rgba(108, 92, 231, 0.2)", "rgba(52, 31, 151, 0.1)"]} 
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GANGBET👍</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <Text style={styles.profileText2}>0xu381213123...</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "flex-start",
    backgroundColor: 'transparent', // Saydam arka plan
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
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Hafif saydam arka plan
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
  },
  profileText: {
    color: "white",
    fontSize: 10,
    fontWeight: '400',
  },
  profileText2: {
    color: "white",
    fontSize: 11,
    fontWeight: '600',
  },
});