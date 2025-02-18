import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResultCard from './ResultCard';

export default function SecondRoute() {
  return (
    <View style={styles.scene}>
      <ResultCard />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: '#1E1E4C',
  },
});