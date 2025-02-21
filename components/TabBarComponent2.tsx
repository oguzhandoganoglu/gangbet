import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TabBar } from 'react-native-tab-view';

export default function TabBarComponent2(props: any) {
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
    paddingLeft: 14,
    height: 50,
    backgroundColor: '#341F97',
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: '400',
  },
  indicatorStyle: {
    backgroundColor: 'transparent',
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: 3,
  },
});