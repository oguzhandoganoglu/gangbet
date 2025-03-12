import NavbarProfile from '@/components/NavbarProfile';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import TabBarComponent2 from '@/components/TabBarComponent2';
import ProfileBets from '@/components/ProfileBets';
import ProfileFriends from '@/components/ProfileFriends';
import ProfileGangs from '@/components/ProfileGangs';
import ProfileSettingsView from '@/components/ProfileSettingsView'; // Ekleyin
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
}

export default function ProfileScreen() {
  const [index, setIndex] = useState(0);
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false); // Yeni state ekleyin
  const { user } = useUser();

  const [routes] = useState([
    { key: 'first', title: 'Bets' },
    { key: 'second', title: 'Friends' },
    { key: 'third', title: 'Gangs' },
  ]);

   // Settings görünümünü açmak için işleyici
   const handleSettingsPress = () => {
    setShowSettings(true);
  };

  // Settings görünümünü kapatmak için işleyici  
  const handleCloseSettings = () => {
    setShowSettings(false);
  };
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
      <NavbarProfile 
        userData={profileData?.user} 
        onSettingsPress={handleSettingsPress} // Prop ekleyin
      />
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
      
      {/* Settings sayfasını koşullu olarak gösterin */}
      {showSettings && (
        <View style={{...StyleSheet.absoluteFillObject, zIndex: 999}}>
          <ProfileSettingsView onClose={handleCloseSettings} />
        </View>
      )}
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