import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { TabBar } from 'react-native-tab-view';

export default function TabBarComponent(props) {
  return (
    <TabBar
      {...props}
      renderLabel={({ route, focused }) => (
        <Text
          style={[
            styles.labelStyle,
            { color: focused ? '#fff' : 'rgba(255,255,255,0.7)' }
          ]}
        >
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
    backgroundColor: 'transparent',
    paddingLeft: 9,
    elevation: 0, // Android için gölgeyi kaldırma
    shadowOpacity: 0, // iOS için gölgeyi kaldırma
  },
  labelStyle: {
    fontSize: 16,
    fontWeight: '500',
  },
  indicatorStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 2,
    borderRadius: 1,
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: 3,
    backgroundColor: 'transparent',
  },
});