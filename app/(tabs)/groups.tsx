import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import TabBarComponent from '@/components/TabBarComponent';
import JoinedGroups from '@/components/JoinedGroups';
import ManagedGroups from '@/components/ManagedGroups';

export default function NotificationScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Joined' },
    { key: 'second', title: 'Managed' },
  ]);

  const renderScene = SceneMap({
    first: JoinedGroups,
    second: ManagedGroups,
  });

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.header}>Groups</Text>
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

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 15,
    backgroundColor: '#1E1E4C',
  },
});