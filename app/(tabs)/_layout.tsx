import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import FullScreenLoader from '@/app/FullScreenLoader';
import ErrorScreen from '../ErrorScreen';
import WalletScreen from './index';
import GroupsScreen from './groups';
import NotificationScreen from './notification';
import SwippingScreen from './swiping';
import FireScreen from './fire';
import Index from '../../scripts/reset-project';
import {Stack, Redirect} from 'expo-router';
import {AuthBoundary} from '@privy-io/expo';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const router = useRouter();
  const EmptyScreen = () => <View />;
  
  return (
    <AuthBoundary
      loading={<FullScreenLoader />}
      error={(error) => <ErrorScreen error={error} onRetry={() => router.replace('/')} />}
      unauthenticated={<Redirect href={{ pathname: '/sign-in' }} />}
    >
      <ImageBackground
        source={require('@/assets/images/betfriend-bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar,
            tabBarBackground: () => (
              <View style={{ flex: 1, backgroundColor: 'transparent' }} />
            ),
            // Her sayfanın kendi arka planını görmek için 
            // sayfanın arka planını da transparan yapalım
            cardStyle: { backgroundColor: 'transparent' },
            // Temel stilleri değiştirelim
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          }}
          sceneContainerStyle={{ backgroundColor: 'transparent' }}
        >
          <Tab.Screen
            name="home"
            component={WalletScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image source={focused ? require('@/assets/images/wallet-filled.png') : require('@/assets/images/wallet.png')} style={{ width: 24, height: 24 }}/>
              ),
              // Bu sayfanın da arka planını kontrol edelim
              cardStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Tab.Screen
            name="groups"
            component={GroupsScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image source={focused ? require('@/assets/images/users2-filled.png') : require('@/assets/images/users2.png')} style={{ width: 24, height: 24 }}/>
              ),
              cardStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Tab.Screen
            name="fire"
            component={FireScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={[styles.iconContainer]}>
                  <Image
                    source={focused ? require('@/assets/images/fire-filled.png') : require('@/assets/images/fire.png')}
                    style={styles.iconImage}
                  />
                </View>
              ),
              cardStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Tab.Screen
            name="notification"
            component={NotificationScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image source={focused ? require('@/assets/images/notification-filled.png') : require('@/assets/images/notification.png')} style={{ width: 24, height: 24 }}/>
              ),
              cardStyle: { backgroundColor: 'transparent' },
            }}
          />
          <Tab.Screen
            name="profile"
            component={SwippingScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Image source={focused ? require('@/assets/images/users2-filled.png') : require('@/assets/images/users2.png')} style={{ width: 24, height: 24 }}/>
              ),
              cardStyle: { backgroundColor: 'transparent' },
            }}
          />
        </Tab.Navigator>
      </ImageBackground>
    </AuthBoundary>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0, // Android için gölgeyi kaldırır
    borderTopWidth: 0,
    position: 'absolute', // Tab bar'ı mutlak konuma alır
    height: 50,
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconImage: {
    width: 17,
    height: 20,
    tintColor: '#fff',
  },
});