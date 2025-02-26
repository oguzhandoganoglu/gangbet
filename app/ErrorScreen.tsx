import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

interface ErrorScreenProps {
  error: Error;
  onRetry: () => void; // Tekrar denemek için fonksiyon
}

const ErrorScreen = ({ error, onRetry }: ErrorScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>Hata: {error.message}</Text>
      <Button title="Tekrar Dene" onPress={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  errorMessage: {
    color: '#721c24',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ErrorScreen;
