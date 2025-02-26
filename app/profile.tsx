import NavbarProfile from '@/components/NavbarProfile';
import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import TabBarComponent2 from '@/components/TabBarComponent2';

import ProfileBets from '@/components/ProfileBets';
import ProfileFriends from '@/components/ProfileFriends';
import ProfileNFTs from '@/components/ProfileNFTs';
import ProfileSuggested from '@/components/ProfileSuggested';
import ProfileGangs from '@/components/ProfileGangs';

export default function ProfileScreen() {
      const [index, setIndex] = useState(0);
      const [routes] = useState([
        { key: 'first', title: 'Bets' },
        { key: 'second', title: 'Friends' },
        { key: 'third', title: 'NFTs' },
        { key: 'forth', title: 'Suggested' },
        { key: 'fifth', title: 'Gangs' },
      ]);
    
      const renderScene = SceneMap({
        first: ProfileBets,
        second: ProfileFriends,
        third: ProfileNFTs,
        forth: ProfileSuggested,
        fifth: ProfileGangs
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
