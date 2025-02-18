import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function ProfileScreen() {
  return (
      <View style={styles.container}>
        <Text style={styles.title}>Boş Sayfa</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',       // Ekranın tamamını kaplasın
    height: '100%',      // Ekranın tamamını kaplasın
    resizeMode: 'cover', // Resmi ekrana göre kırparak tam doldurur
  },
  container: {
    flex: 1,
    // backgroundColor: 'rgba(255, 255, 255, 0.8)', // İstersen saydam katman ekleyebilirsin
    backgroundColor: 'transparent', // Arka plan tamamen şeffaf olsun
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000', // Arka plan açık renkliyse yazı okunabilir olsun
  },
});
