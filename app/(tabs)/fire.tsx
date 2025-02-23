import BetCardFriends from '@/components/BetCardFriends';
import Navbar from '@/components/Navbar';
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
type BadgeProps = {
  text: string;
  isActive: boolean;
  onPress: () => void;
};

export default function FireScreen() {

  const [activeTab, setActiveTab] = useState("Friends");

  return (
    <LinearGradient colors={["#6C5CE7", "#341F97"]} >
    <View >
        <Navbar />
        <View style={styles.container}>
            <View style={styles.tabsContainer}>
              <View style={styles.tabs}>
                <Badge text="Popular" isActive={activeTab === "Popular"} onPress={() => setActiveTab("Popular")} />
                <Badge text="Friends" isActive={activeTab === "Friends"} onPress={() => setActiveTab("Friends")} />
              </View>
            </View>
            {((activeTab === "Popular") &&
              <View>
                <Text style={styles.text}>Popular</Text>
              </View>
            )}
            {((activeTab === "Friends") &&
              <GestureHandlerRootView style={{ width: "100%"}}>
              <View style={styles.betfriendcontainer}>
                <BetCardFriends />
              </View>
              </GestureHandlerRootView>
            )}
        </View>
    </View>
    </LinearGradient>
  );
}

const Badge: React.FC<BadgeProps> = ({ text, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.badge, isActive ? styles.badgeActive : {}]}>
    <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : {}]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
  },
  betfriendcontainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 20,
  },
  tabsContainer: {
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginTop: 10,
    marginBottom: 20,
  },

  tabs: {
    paddingHorizontal:2,
    paddingVertical:4,
    flexDirection: "row",
    justifyContent: "center",

  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#3a3a3c",
    marginHorizontal: 4,
  },
  badgeActive: {
    backgroundColor: "white",
  },
  badgeText: {
    color: "gray",
    fontSize: 14,
  },
  badgeTextActive: {
    color: "black",
    fontWeight: "bold",
  },
});