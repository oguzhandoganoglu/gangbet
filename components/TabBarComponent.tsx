import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';

export default function TabBarComponent(props: any) {
  return (
    <TabBar
      {...props}
      renderLabel={({ route, focused }: { route: any; focused: boolean }) => (
        <Text style={[styles.labelStyle, { color: focused ? 'white' : 'lightgray' }]}>
          {route.title}
        </Text>
      )}
      style={styles.tabBar}
      indicatorStyle={styles.indicatorStyle}
      tabStyle={styles.tabStyle}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1E1E4C',
    paddingLeft: 9,
  },
  labelStyle: {
    fontSize: 16,
  },
  indicatorStyle: {
    backgroundColor: 'transparent',
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: 3,
  },
});