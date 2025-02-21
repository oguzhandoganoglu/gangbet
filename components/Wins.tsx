import Navbar from '@/components/Navbar';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Wins() {
  return (
    <View >
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
  },
  text: {
    fontSize: 20,
  },
});