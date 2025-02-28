import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useUser } from "../app/UserContext"; // UserContext'i import ediyoruz

export default function Navbar() {
  const router = useRouter(); // Gerekirse yönlendirme için
  const { user } = useUser(); // useUser hook'unu kullanıyoruz

  return (
    <LinearGradient colors={["#6C5CE7", "#341F97"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GANGBET👍</Text>
        <TouchableOpacity 
          style={styles.profileContainer}
          onPress={() => router.push("/profile")} // İsteğe bağlı: profil sayfasına gitmek için
        >
          <Image
            source={require("@/assets/images/user1.png")}
            style={styles.profileImage}
          />
          <Text style={styles.profileText}>
            {user ? `${user.balance.toFixed(1)} USDC` : "0.0 USDC"}
          </Text>
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
});