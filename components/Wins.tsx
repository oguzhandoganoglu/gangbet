import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../app/UserContext';

// Wins bileşeni için prop tipi
interface WinsProps {
  data: Array<{
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
}

export default function Wins({ data }: WinsProps) {
  const { user } = useUser();

  // Ödül talep etme işlevi
  const handleClaim = async (betId: string) => {
    if (!user || !user.token) {
      Alert.alert('Error', 'You need to be logged in to claim');
      return;
    }
    
    try {
      const baseUrl = 'http://51.21.28.186:5001'; // API base URL
      const response = await fetch(`${baseUrl}/api/bets/claim/${betId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Claim submitted successfully!');
      } else {
        Alert.alert('Error', result.message || 'Failed to claim reward');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      Alert.alert('Error', 'An error occurred while claiming your reward');
    }
  };

  // Ödül durumunu gösterme
  const renderClaimStatus = (item) => {
    if (item.claimStatus === 'completed') {
      return (
        <View style={styles.claimContainer}>
          <View style={styles.claimedButton}>
            <Text style={styles.claimedText}>Claimed</Text>
          </View>
        </View>
      );
    } else if (item.claimStatus === 'pending') {
      return (
        <View style={styles.claimContainer}>
          <View style={styles.pendingButton}>
            <Text style={styles.pendingText}>Pending</Text>
          </View>
        </View>
      );
    } else {
      // Henüz talep edilmemiş, talep edilebilir
      return (
        <View style={styles.claimContainer}>
          <Text style={styles.claimLabel}>Claim</Text>
          <TouchableOpacity 
            style={styles.claimButton}
            onPress={() => handleClaim(item.id)}
          >
            <Text style={styles.claimText}>{item.amount * 2} USDC</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No wins found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: item.photoUrl }} 
              style={styles.profileImage}
              defaultSource={require('@/assets/images/angry.png')}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.actions}>
                <View style={[
                  styles.percentCard, 
                  { backgroundColor: item.userChoice === 'yes' ? '#50C878' : '#FF6347' }
                ]}>
                  <Image 
                    source={
                      item.userChoice === 'yes' 
                        ? require('@/assets/images/thumb-up.png') 
                        : require('@/assets/images/thumb-down.png')
                    } 
                    style={styles.percentImage} 
                  />
                  <View style={styles.percentText}>
                    <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                      {item.userChoice.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                  <Image source={require('@/assets/images/mood-suprised.png')} style={{ width: 16, height: 16 }} />
                  <Text style={styles.wonText}> Won</Text>
                </View>
                <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16 }} />
              </View>
            </View>
          
            {renderClaimStatus(item)}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4C',
    padding: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#1E1E4C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    padding: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  wonText: {
    fontSize: 12,
    color: '#ddd',
    marginRight: 12,
  },
  claimContainer: {
    alignItems: 'center',
  },
  claimLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  claimedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pendingButton: {
    backgroundColor: '#FFB74D',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  claimButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  claimedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  pendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  claimText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  percentCard : {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#D6D6D673', 
    borderRadius: 13, 
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  percentText: {
    flexDirection: 'row',
  },
  percentImage : { 
    width: 16, 
    height: 16,
    tintColor: '#fff',
  }
});