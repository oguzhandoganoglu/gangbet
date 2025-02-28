import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function NavbarNotificaiton() {
  return (
    <LinearGradient colors={["#6C5CE7", "#341F97"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GANGBET👍</Text>
        <TouchableOpacity style={styles.profileContainer}>
          <Text style={styles.profileText}>Total Won</Text>
          <Text style={styles.profileText2}>4 Bets</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "flex-start",
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
    fontWeight: 400,
  },
  profileText2: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
  },
});
