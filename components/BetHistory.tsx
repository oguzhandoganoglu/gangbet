import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import router

// BetHistory bileşeni için prop tipi
interface BetHistoryProps {
  data: Array<{
    id: string;
    _id: string; // Make sure _id exists for API calls
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

export default function BetHistory({ data }: BetHistoryProps) {
  const router = useRouter(); // Initialize router

  // Bet detay sayfasına yönlendirme işlevi
  const navigateToBetDetail = (betId: string) => {
    router.push({ pathname: "/bet/[betId]", params: { betId: betId } });
  };

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bet history found</Text>
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
            onPress={() => navigateToBetDetail(item._id || item.id)}
            activeOpacity={0.7}
          >
            <Image 
              source={{ uri: item.photoUrl }} 
              style={styles.profileImage}
              defaultSource={require('@/assets/images/placeholder.png')}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.details}>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupText}>{item.groupName} / {item.channelName}</Text>
                </View>
                
                <View style={styles.betInfo}>
                  <View style={[
                    styles.choiceLabel,
                    { backgroundColor: item.userChoice === "yes" ? "rgba(80, 200, 120, 0.6)" : "rgba(255, 99, 71, 0.6)" }
                  ]}>
                    <Text style={styles.choiceText}>{item.userChoice.toUpperCase()}</Text>
                  </View>
                  
                  <View style={[
                    styles.resultLabel,
                    { 
                      backgroundColor: item.hasWon ? "rgba(80, 200, 120, 0.3)" : "rgba(255, 99, 71, 0.3)",
                      borderColor: item.hasWon ? "#50C878" : "#FF6347"
                    }
                  ]}>
                    <Text style={[
                      styles.resultText,
                      { color: item.hasWon ? "#50C878" : "#FF6347" }
                    ]}>
                      {item.hasWon ? "WIN" : "LOSE"}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.amountContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('@/assets/images/scale.png')} style={styles.amountIcon} />
                    <Text style={styles.amountText}>{item.amount} USDC</Text>
                  </View>
                  
                  {item.hasClaim && item.claimStatus === "completed" && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                      <Image source={require('@/assets/images/send.png')} style={styles.amountIcon} />
                      <Text style={styles.claimedText}>Claimed</Text>
                    </View>
                  )}
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  details: {
    flex: 1,
  },
  groupInfo: {
    marginBottom: 4,
  },
  groupText: {
    fontSize: 12,
    color: '#aaa',
  },
  betInfo: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  choiceLabel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  choiceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  resultLabel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  amountText: {
    fontSize: 12,
    color: '#fff',
  },
  claimedText: {
    fontSize: 12,
    color: '#50C878',
  }
});