import BetCardFriends from '@/components/BetCardFriends';
import NavbarNotificaiton from '@/components/NavbarNotification';
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type BadgeProps = {
  text: string;
  isActive: boolean;
  onPress: () => void;
};

export default function FireScreen() {
  const [activeTab, setActiveTab] = useState("Friends");
  const navigation = useNavigation();
  const router = useRouter();

  const handleAddNewBet = () => {
    router.push("newBet/newBet" as any);
  };
  
  return (
    <LinearGradient
          colors={['#161638', '#714F60', '#B85B44']}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
      <NavbarNotificaiton />
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            <View style={styles.leftPlaceholder} />
            <View style={styles.tabs}>
              <Badge 
                text="Friends" 
                isActive={activeTab === "Friends"} 
                onPress={() => setActiveTab("Friends")} 
              />
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddNewBet}
            >
              <Ionicons name="add-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {activeTab === "Friends" && (
          <View style={styles.cardContainer}>
            <BetCardFriends />
          </View>
        )}
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
  },
  tabsContainer: {
    width: "100%",
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tabsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  leftPlaceholder: {
    width: 24,  // Same width as the addButton
  },
  tabs: {
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "center",
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#3a3a3c",
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
  addButton: {
    padding: 0,
    width: 24,
  },
});