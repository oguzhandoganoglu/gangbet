import NavbarProfile from '@/components/NavbarProfile';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import TabBarComponent2 from '@/components/TabBarComponent2';
import ProfileBets from '@/components/ProfileBets';
import ProfileFriends from '@/components/ProfileFriends';
import ProfileNFTs from '@/components/ProfileNFTs';
import ProfileSuggested from '@/components/ProfileSuggested';
import ProfileGangs from '@/components/ProfileGangs';
import { useUser } from '../app/UserContext';

// API yanıt tipi
interface ProfileResponse {
  user: {
    id: string;
    username: string;
    email: string;
    walletAddress: string;
    balance: number;
    createdAt: string;
    friendsCount: number;
    groupsCount: number;
  };
  friends: Array<{
    id: string;
    username: string;
  }>;
  friendsCount: number;
  groupsCount: number;
  activeBetsCount: number;
  groups: Array<{
    id: string;
    name: string;
    membersCount: number;
  }>;
  activeBets: Array<{
    id: string;
    title: string;
    photoUrl: string;
    channelName: string;
    userChoice: string;
    amount: number;
    endDate: string;
  }>;
  suggestedFriends: Array<{
    id: string;
    username: string;
  }>;
}

export default function ProfileScreen() {
  const [index, setIndex] = useState(0);
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  const [routes] = useState([
    { key: 'first', title: 'Bets' },
    { key: 'second', title: 'Friends' },
    { key: 'third', title: 'NFTs' },
    { key: 'forth', title: 'Suggested' },
    { key: 'fifth', title: 'Gangs' },
  ]);

  // Profil verilerini çek
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    if (!user || !user._id || !user.token) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await fetch(`${baseUrl}/api/pages/profile/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // Her bir sekme için render fonksiyonları
  const renderScene = ({ route }: { route: { key: string } }) => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C5CE7" />
        </View>
      );
    }

    if (error || !profileData) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Failed to load data'}</Text>
        </View>
      );
    }

    switch (route.key) {
      case 'first':
        return <ProfileBets data={profileData.activeBets} />;
      case 'second':
        return <ProfileFriends data={profileData.friends} />;
      case 'third':
        return <ProfileNFTs />;
      case 'forth':
        return <ProfileSuggested data={profileData.suggestedFriends} />;
      case 'fifth':
        return <ProfileGangs data={profileData.groups} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#161638', '#714F60', '#B85B44']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <NavbarProfile userData={profileData?.user} />
      <View style={{width: '100%', flex:1}}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => <TabBarComponent2 {...props} />}
          style={{flex:1}}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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