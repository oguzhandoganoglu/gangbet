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

  const submitClaim = async (betId) => {
       
       try {
         
         const response = await fetch(`http://51.21.28.186:5001/api/claims/request`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             userId: user?._id,
             betId: betId._id
           }),
         });
         
         const result = await response.json();
         
         // Claim işlemi başarılı olduğunda
         if (response.ok) {
           Alert.alert('Success', 'Your reward has been claimed successfully');
           // Betleri yeniden getir ve UI'ı güncell
         } else {
           // Hata durumunda
           Alert.alert('Notification', result.message || 'Failed to claim your reward');
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
            onPress={() => submitClaim(item._id)}
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
                  { backgroundColor: item.userChoice === 'yes' ? 'rgba(80, 200, 120, 0.6)' : 'rgba(255, 99, 71, 0.6)' }
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
    backgroundColor: 'transparent',
    padding: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(255, 183, 77, 0.8)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  claimButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
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