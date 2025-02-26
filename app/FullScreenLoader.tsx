import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const FullScreenLoader = ( ) => {

  return (
    <View style={styles.loaderContainer}>
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.message}>Loading</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Yarı saydam arka plan
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ekranın üstünde görünmesi için
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  message: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default FullScreenLoader;
