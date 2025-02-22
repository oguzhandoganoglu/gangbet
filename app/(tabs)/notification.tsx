import React, { useState, useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import TabBarComponent from '@/components/TabBarComponent';
import FirstRoute from '@/components/ResultsRoute';
import SecondRoute from '@/components/FriendsRoute';
import ThirdRoute from '@/components/GroupsRoute';
import NavbarNotificaiton from '@/components/NavbarNotification';
import Navbar from '@/components/Navbar';

export default function NotificationScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Last Results' },
    { key: 'second', title: 'Friends' },
    { key: 'third', title: 'Gangs' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  // Navbar'ı useMemo ile render ediyoruz.
  const renderNavbar = useMemo(() => {
    switch (index) {
      case 0:
        return <NavbarNotificaiton />;
      case 1:
        return <Navbar />;
      case 2:
        return <Navbar />;
      default:
        return <NavbarNotificaiton />;
    }
  }, [index]); // Navbar yalnızca index değiştiğinde yeniden render edilir

  return (
    <View style={{ flex: 1 }}>
      {renderNavbar} 
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => <TabBarComponent {...props} />}
      />
    </View>
  );
}
