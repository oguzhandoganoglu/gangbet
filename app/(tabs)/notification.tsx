import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import TabBarComponent from '@/components/TabBarComponent';
import FirstRoute from '@/components/ResultsRoute';
import SecondRoute from '@/components/FriendsRoute';
import ThirdRoute from '@/components/GroupsRoute';

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

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={props => <TabBarComponent {...props} />}
    />
  );
}