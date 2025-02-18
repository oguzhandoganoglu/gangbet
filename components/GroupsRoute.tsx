import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ThirdRoute() {
  return (
    <View style={styles.scene}>
      <Text>Groups İçeriği</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});