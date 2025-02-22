import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        GANGBET <Text style={styles.emoji}>👍</Text>
      </Text>
      <View style={styles.balanceContainer}>
        <Image 
          source={require('@/assets/images/user1.png')} // Profil resmi yolu
          style={styles.profileImage}
        />
        <Text style={styles.balanceText}>4,350 USDC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15, // Boşluğu artır
    backgroundColor: '#1E1E4C', // Yarı saydam arka plan rengi
    borderRadius: 0,
    margin: 0,
  },
  logo: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  emoji: {
    fontSize: 18,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Kapsayıcı için arka plan
    borderRadius: 20,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 5,
  },
  balanceText: {
    color: 'white',
    fontWeight: '500',
  },
});