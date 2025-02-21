import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';

import WalletScreen from './index';
import GroupsScreen from './groups';
import NotificationScreen from './notification';
import SwippingScreen from './swiping';
import FireScreen from './fire';
import Index from '../../scripts/reset-project';

const Tab = createBottomTabNavigator();

export default function TabsLayout() {
  const router = useRouter();
  const EmptyScreen = () => <View />;

  return (
    <ImageBackground
      source={require('@/assets/images/betfriend-bg.png')} // Arka plan resminizin yolu
      style={styles.background}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        
        <Tab.Screen 
          name="home" 
          component={WalletScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={focused ? require('@/assets/images/wallet-filled.png') : require('@/assets/images/wallet.png')} style={{ width: 24, height: 24 }}/>
            ),
          }} 
        />

        <Tab.Screen 
          name="groups" 
          component={GroupsScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={focused ? require('@/assets/images/users2-filled.png') : require('@/assets/images/users2.png')} style={{ width: 24, height: 24 }}/>
            ),
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
          }} 
        />

        <Tab.Screen 
          name="profile" 
          component={SwippingScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={focused ? require('@/assets/images/layout-list-filled.png') : require('@/assets/images/layout-list.png')} style={{ width: 24, height: 24 }}/>
            ),
          }} 
        />

        <Tab.Screen 
          name="notification" 
          component={NotificationScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={focused ? require('@/assets/images/notification-filled.png') : require('@/assets/images/notification.png')} style={{ width: 24, height: 24 }}/>
            ),
          }} 
        />
        
      </Tab.Navigator>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#1E1E4C',
    height: 45,
    borderTopWidth: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    width: 48, // Daire boyutu
    height: 48,
    borderRadius: 24, // Yuvarlak yapmak için
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconImage: {
    width: 17,
    height: 20,
    tintColor: '#fff', // Görselin rengini değiştirmek için (gerekirse)
  },
});