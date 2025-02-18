import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <ImageBackground
      source={require('@/assets/images/betfriend-bg.png')}
      style={styles.backgroundImage}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default Background;