import Navbar from '@/components/Navbar';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ActiveBets() {
  return (
    <View style={styles.container}>
        <View>
            <Text>Boş Sayfa</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#341F97',
  },
  text: {
    fontSize: 20,
  },
});