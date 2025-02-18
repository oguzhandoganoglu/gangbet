import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars, faFire, faUser, faUserFriends, faBell } from '@fortawesome/free-solid-svg-icons';

import HomeScreen from './index';
import GroupsScreen from './groups';
import NotificationScreen from './notification';
import ProfileScreen from './profile';

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
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faUser} size={30} color={focused ? '#fff' : '#888'} />
            ),
          }} 
        />

        <Tab.Screen 
          name="groups" 
          component={GroupsScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faUserFriends} size={30} color={focused ? '#fff' : '#888'} />
            ),
          }} 
        />

        <Tab.Screen 
          name="add" 
          component={EmptyScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity 
                onPress={() => router.push('/create')} 
                style={[props.style, styles.addButton, { transform: [{ translateX: 10 }] }]}
              >
                <FontAwesomeIcon icon={faFire} size={25} color="#000" />
              </TouchableOpacity>
            ),
          }} 
        />

        <Tab.Screen 
          name="profile" 
          component={ProfileScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faBars} size={30} color={focused ? '#fff' : '#888'} />
            ),
          }} 
        />

        <Tab.Screen 
          name="notification" 
          component={NotificationScreen} 
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesomeIcon icon={faBell} size={30} color={focused ? '#fff' : '#888'} />
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
    height: 85,
    borderTopWidth: 0,
  },
  addButton: {
    width: 55,
    height: 55,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
});