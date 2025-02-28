import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../app/UserContext";
import { wp, hp, fontSize } from '@/utils/responsive';

export default function Navbar() {
  const router = useRouter();
  const { user } = useUser();
  
  return (
    <View style={styles.container}>
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
          <Text style={styles.profileText}>
            {user ? `${user.balance.toFixed(1)} USDC` : "0.0 USDC"}
          </Text>z
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp(20),
    alignItems: "flex-start",
    backgroundColor: 'transparent', // Arka planı saydam yapıldı
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  logo: {
    fontSize: fontSize(14),
    color: "white",
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: wp(10),
    paddingVertical: hp(5),
    borderRadius: 20,
  },
  profileImage: {
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    marginRight: wp(5),
  },
  profileText: {
    color: "white",
    fontSize: fontSize(12),
    fontWeight: "500",
  },
});