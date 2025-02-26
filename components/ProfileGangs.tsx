import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function ProfileGangs() {
  return (
    <View style={styles.container}>
      <Text style={{color:"#fff", fontSize:16, fontWeight:600, marginLeft:20, marginTop:20}}>Gangs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4C',
    padding: 1,
  },
  
});
