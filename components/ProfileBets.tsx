import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// API'den gelen bahis veri tipi
interface BetData {
  id: string;
  title: string;
  photoUrl: string;
  channelName: string;
  userChoice: string;
  amount: number;
  endDate: string;
}

interface ProfileBetsProps {
  data: BetData[];
}

export default function ProfileBets({ data = [] }: ProfileBetsProps) {
  const router = useRouter();

  // Bet detay sayfasına yönlendirme fonksiyonu
  const navigateToBetDetail = (betId: string) => {
    router.push({ pathname: "/bet/[betId]", params: { betId: betId } });
  };

  // Kalan zamanı hesapla
  const calculateRemainingTime = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return "Ended";
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    
    if (diffDays > 0) {
      return `${diffDays}D Left`;
    } else {
      return `${diffHours}H Left`;
    }
  };

  if (data.length === 0) {
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
            activeOpacity={0.7}
            onPress={() => navigateToBetDetail(item.id)}
          >
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: item.photoUrl }}
                  defaultSource={require('@/assets/images/placeholder.png')} 
                  style={styles.profileImage} 
                />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.actions}>
                  <View style={styles.percentCard}>
                    <Image 
                      source={
                        item.userChoice === 'yes' 
                          ? require('@/assets/images/thumb-up.png')
                          : require('@/assets/images/thumb-down.png')
                      } 
                      style={styles.percentImage} 
                    />
                    <View style={styles.percentText}>
                      <Text style={styles.choiceText}>
                        {item.userChoice.toUpperCase()}
                      </Text>
                      <Text style={styles.choiceText}> 
                        {item.amount} USDC
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Image source={require('@/assets/images/scale.png')} style={styles.detailIcon} />
                      <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail">{item.channelName}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image source={require('@/assets/images/hourglass.png')} style={styles.detailIcon} />
                      <Text style={styles.detailText}>{calculateRemainingTime(item.endDate)}</Text>
                    </View>
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
    backgroundColor: 'transparent',
    padding: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    padding: 10,
    marginBottom: 1,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 30,
  },
  content: {
    flex: 1,
    left: 10
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
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flexShrink: 1,
  },
  detailIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: '#fff',
    flexShrink: 0,
  },
  detailText: {
    fontSize: 10,
    color: '#ddd',
    marginRight: 0,
    flexShrink: 1,
    maxWidth: 100,
  },
  imageContainer: {
    position: 'relative',
    width: 36,
    height: 36,
    top: 5
  },
  percentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 13,
    paddingHorizontal: 5,
    paddingVertical: 5,
    flexShrink: 0,
  },
  percentText: {
    flexDirection: "row",
  },
  percentImage: {
    width: 16,
    height: 16,
    tintColor: "#fff",
    marginRight: 4,
  },
  choiceText: {
    color: '#fff', 
    fontSize: 12, 
    fontWeight: '400',
  },
});