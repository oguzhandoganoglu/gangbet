import React, { useState, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import TabBarComponent from '@/components/TabBarComponent';
import FirstRoute from '@/components/ResultsRoute';
import SecondRoute from '@/components/FriendsRoute';
import ThirdRoute from '@/components/GroupsRoute';
import ForthRoute from '@/components/ManagedRoute';
import NavbarNotificaiton from '@/components/NavbarNotification';
import Navbar from '@/components/Navbar';

export default function NotificationScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Last Results' },
    { key: 'second', title: 'Friends' },
    { key: 'third', title: 'Gangs' },
    { key: 'forth', title: 'Managed' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    forth: ForthRoute,
  });

  // Navbar'ı useMemo ile render ediyoruz.
  const renderNavbar = useMemo(() => {
    switch (index) {
      case 0:
        return <NavbarNotificaiton />;
      case 1:
        return <NavbarNotificaiton />;
      case 2:
        return <NavbarNotificaiton />;
      case 3:
        return <NavbarNotificaiton />;
      default:
        return <NavbarNotificaiton />;
    }
  }, [index]); // Navbar yalnızca index değiştiğinde yeniden render edilir

  return (
    <LinearGradient
      colors={['#161638', '#714F60', '#B85B44']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {renderNavbar}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => <TabBarComponent {...props} />}
        style={{ flex: 1 }}
      />
    </LinearGradient>
  );
}