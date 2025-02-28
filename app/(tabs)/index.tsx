import NavbarWallet from '@/components/NavbarWallet';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient';
import TabBarComponent2 from '@/components/TabBarComponent2';
import ActiveBets from '@/components/ActiveBets';
import Wins from '@/components/Wins';
import BetHistory from '@/components/BetHistory';
import Balances from '@/components/Balances';
import { useUser } from '../UserContext';
import { opacity } from 'react-native-reanimated/lib/typescript/Colors';
import Background from '@/components/ui/Background';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

// Wallet veri tipi 
interface WalletData {
  wallet: {
    totalBalance: number;
    availableBalance: number;
    lockedBalance: number;
  };
  activeUserBets: Array<{
    id: string;
    title: string;
    photoUrl: string;
    groupName: string;
    channelName: string;
    endDate: string;
    remainingTime: number;
    userChoice: string;
    amount: number;
    totalPool: number;
    yesOdds: string;
    noOdds: string;
  }>;
  endedUserBets: Array<{
    id: string;
    title: string;
    photoUrl: string;
    groupName: string;
    channelName: string;
    userChoice: string;
    amount: number;
    result: string;
    hasWon: boolean;
    hasClaim: boolean;
    claimStatus: string | null;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  transactionStats: {
    deposit: number;
    withdraw: number;
    betAmount: number;
    claimAmount: number;
  };
}

export default function WalletScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Active Bets' },
    { key: 'second', title: 'Wins' },
    { key: 'third', title: 'Bet History' },
    { key: 'forth', title: 'Balances' },
  ]);
  
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useUser();
  
  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user || !user._id) {
        setLoading(false);
        setError('User not logged in');
        return;
      }
      
      try {
        const baseUrl = 'http://51.21.28.186:5001';
        const response = await fetch(`${baseUrl}/api/pages/wallet/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch wallet data');
        }
        
        const data = await response.json();
        setWalletData(data);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWalletData();
  }, [user]);
  
  // Bileşenleri veri ile oluşturmak için renderScene fonksiyonunu güncelleme
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <ActiveBets data={walletData?.activeUserBets || []} />;
      case 'second':
        return <Wins data={walletData?.endedUserBets.filter(bet => bet.hasWon) || []} />;
      case 'third':
        return <BetHistory data={walletData?.endedUserBets || []} />;
      case 'forth':
        return <Balances walletInfo={walletData?.wallet} transactions={walletData?.transactions} stats={walletData?.transactionStats} />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <LinearGradient
        colors={['#161638', '#714F60', '#B85B44']}
        style={styles.loadingContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <ActivityIndicator size="large" color="#5B4FFF" />
      </LinearGradient>
    );
  }
  
  if (error) {
    return (
      <LinearGradient
        colors={['#161638', '#714F60', '#B85B44']}
        style={styles.errorContainer}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      >
        <Text style={styles.errorText}>{error}</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#161638', '#714F60', '#B85B44']}
      style={{flex: 1}}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <NavbarWallet/>
      <View style={styles.container}>
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
    backgroundColor: 'transparent', // Arka plan saydamlığı için
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
  },
});