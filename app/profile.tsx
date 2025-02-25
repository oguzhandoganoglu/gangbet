import NavbarProfile from '@/components/NavbarProfile';
import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import TabBarComponent2 from '@/components/TabBarComponent2';

import ActiveBets from '@/components/ActiveBets';
import Wins from '@/components/Wins';
import BetHistory from '@/components/BetHistory';
import Balances from '@/components/Balances';

export default function ProfileScreen() {
      const [index, setIndex] = useState(0);
      const [routes] = useState([
        { key: 'first', title: 'Active Bets' },
        { key: 'second', title: 'Wins' },
        { key: 'third', title: 'Bet History' },
        { key: 'forth', title: 'Balances' },
      ]);
    
      const renderScene = SceneMap({
        first: ActiveBets,
        second: Wins,
        third: BetHistory,
        forth: Balances,
      });
  return (
    <View style={styles.container}>
      <NavbarProfile />
      <View style={{width: '100%', flex:1}} >
        <TabView
                  navigationState={{ index, routes }}
                  renderScene={renderScene}
                  onIndexChange={setIndex}
                  initialLayout={{ width: Dimensions.get('window').width }}
                  renderTabBar={props => <TabBarComponent2 {...props} />}
                  style={{flex:1}}
                />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: 'gray',
  },
});
