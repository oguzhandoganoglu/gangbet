import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// ActiveBets bileşeni için prop tipi
interface ActiveBetsProps {
  data: Array<{
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
}

export default function ActiveBets({ data }: ActiveBetsProps) {
  const router = useRouter();

  // Bet detay sayfasına yönlendirme fonksiyonu
  const navigateToBetDetail = (betId: string) => {
    router.push({ pathname: "/bet/[betId]", params: { betId: betId } });
  };

  // Kalan süreyi formatla (milisaniye -> saat:dakika formatına)
  const formatRemainingTime = (milliseconds: number) => {
    if (milliseconds <= 0) return "Ended";
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}D Left`;
    }
    
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}H Left`;
    } else {
      return `${minutes}M Left`;
    }
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active bets found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigateToBetDetail(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.photoUrl }} 
                style={styles.profileImage} 
                defaultSource={require('@/assets/images/angry.png')}
              />
             
            </View>
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
                    <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                      {' '}{item.userChoice === 'yes' ? item.yesOdds : item.noOdds}x
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                    <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, marginRight:1, marginLeft:10 }} />
                    <Text style={styles.percent}>{item.amount} USDC</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('@/assets/images/hourglass.png')} style={{ width: 16, height: 16, marginRight:1, marginLeft:10 }} />
                    <Text style={styles.percent}>{formatRemainingTime(item.remainingTime)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Saydam arka plan
    padding: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'transparent', // Saydam arka plan
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Saydam kart arka planı
    borderRadius: 2,
    padding: 10,
    marginBottom: 1,
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
    marginLeft: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 60,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 9,
    paddingLeft:12
  },
  percent: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FEFEFE',
  },
  imageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
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
  },
  percentImage2 : { 
    width: 16, 
    height: 16,
    tintColor: '#5E5E5E5C'
  }
});