import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function NavbarProfile() {
  const router = useRouter();
  return (
    <LinearGradient colors={["#6C5CE7", "#341F97"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>GANGBET👍</Text>
        <TouchableOpacity style={styles.profileContainer} onPress={() => router.push("/profile")} >
          <Image
            source={require("@/assets/images/settings.png")}
            style={styles.settingsImage}
          />
          <Text style={styles.profileText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.uplinecontainer}>
        <View >
          <Image source={require("@/assets/images/user1.png")} style={styles.profileImage}/>
        </View>
        <View>
          <View style={styles.uplinecontainer}>
            <View style={styles.xbuttonContainer}>
              <Image source={require("@/assets/images/xlogo.png")} style={styles.xImage}/>
              <Text style={styles.xtext}>@gangbetuser_x</Text>
            </View>
            <Image source={require("@/assets/images/qrcode.png")} style={styles.qrImage}/>
            <Image source={require("@/assets/images/logout.png")} style={styles.qrImage}/>
          </View>
          <View style={styles.bottomlinecontainer}> 
            <Text style={styles.friendsText}>54 Friends</Text>
            <Text style={styles.friendsText}>20 Groups</Text>
          </View>
        </View>
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
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 10,
  },
  profileImage: {
    width: 81,
    height: 81,
    borderRadius: 40,
    marginRight: 5,
  },
  settingsImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
    tintColor: "white",
  },
  qrImage: {
    width: 24,
    height: 24,
    marginLeft: 8,
    tintColor: "white",
  },
  xImage: {
    width: 18,
    height: 16,
    marginRight: 5,
    tintColor: "white",
  },
  xbuttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  uplinecontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomlinecontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 5,
  },
  profileText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  xtext: {
    fontSize: 12,
    color: "white",
    fontWeight: 700,
  },
  friendsText: {
    fontSize: 16,
    color: "white",
    fontWeight: 400,
    marginRight: 10,
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
