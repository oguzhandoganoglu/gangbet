import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { PrivyProvider } from '@privy-io/expo';
import { UserProvider } from './UserContext';

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
      <UserProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
              <Slot />
              <StatusBar style="auto" />
            </SafeAreaView>
          </SafeAreaProvider>
        </ThemeProvider>
      </UserProvider>
    </PrivyProvider>
  );
}