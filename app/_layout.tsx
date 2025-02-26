import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import {PrivyProvider} from '@privy-io/expo';

import {Slot} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PrivyProvider
    appId={'cm6wqx6sk02bpm1wmsdi7zwri'}
    clientId={'client-WY5gJVh4xfgKSFeXukcRh3YHqa1Fmx4MT3cMJUPPwUT7X'}
  >
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Slot ile alt ekranları yerleştirme */}
        <Slot />
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  </PrivyProvider>
);
}