import React, {useState, useEffect} from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { useUser } from "../app/UserContext";

function getRemainingMinutes(endDateFromDatabase: Date) {
  const targetDate = new Date(endDateFromDatabase);
  const currentDate = new Date();
  const differenceInMilliseconds = targetDate.getTime() - currentDate.getTime();
  const differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
  return differenceInMinutes;
}

export default function FirstRoute() {
  interface Bet {
    id: string;
    title: string;
    photoUrl: string;
    result: string;
    claimAmount: string;
    claim: boolean;
    status: string;
    percent: string;
    participants: any[];
    claimedBy: any[];
    totalPool: number;
    yesUsersCount: number;
    noUsersCount: number;
    endDate: Date;
    yesOdds: number;
  }
  
  const { user } = useUser();
  const userId = user?._id;
  const baseUrl = 'http://51.21.28.186:5001'; // API temel URL'si

  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimAmount, setClaimAmount] = useState(0);
  const [claimLoading, setClaimLoading] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);

  useEffect(() => {
    fetchBets();
  }, []);

  useEffect(() => {
    if (bets.length > 0) {
      bets.forEach((bet) => {
        const totalAmount = bet.totalPool;
        const totalYes = bet.yesUsersCount;
        const totalNo = bet.noUsersCount;
        const result = bet.result;

        if (result === "yes") {
          setClaimAmount(totalAmount / totalYes);
        } else if (result === "no") {
          setClaimAmount(totalAmount / totalNo);
        }
      });
    }
  }, [bets]);

  const fetchBets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/bets/user/${userId}`);
      const data = await response.json();
      setBets(data.bets);
    } catch (error) {
      console.error('Error fetching bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimPress = (bet: Bet) => {
    setSelectedBet(bet);
    setShowClaimModal(true);
  };

  const submitClaim = async () => {
    if (!selectedBet || !userId) return;
    
    try {
      setClaimLoading(true);
      
      const response = await fetch(`${baseUrl}/api/claims/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          betId: selectedBet._id
        }),
      });
      
      const result = await response.json();
      
      // Claim işlemi başarılı olduğunda
      if (response.ok) {
        Alert.alert('Success', 'Your reward has been claimed successfully');
        // Betleri yeniden getir ve UI'ı güncelle
        fetchBets();
      } else {
        // Hata durumunda
        Alert.alert('Notification', result.message || 'Failed to claim your reward');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      Alert.alert('Error', 'An error occurred while claiming your reward');
    } finally {
      setClaimLoading(false);
      setShowClaimModal(false);
    }
  };

  const ClaimModal = () => {
    if (!selectedBet) return null;
    
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showClaimModal}
        onRequestClose={() => setShowClaimModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Allow Claiming Reward</Text>
            <Text style={styles.modalDescription}>
              Are you sure you want to claim {claimAmount} USDC for "{selectedBet.title}"?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowClaimModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={submitClaim}
                disabled={claimLoading}
              >
                {claimLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
      <FlatList
        data={bets.filter(bet => bet.status === "ended")}
        keyExtractor={(_, index) => index.toString()} 
        renderItem={({ item }) => {
          const remainingMinutes = getRemainingMinutes(item.endDate);
          
          // Kullanıcının katılımı ve sonuç kontrolü
          const userParticipated = item.participants.length > 0 && 
                                  item.participants.find(p => p.user === userId);
          const userChoiceMatchesResult = userParticipated && 
                                         userParticipated.choice === item.result;
          const userAlreadyClaimed = item.claimedBy.length > 0 && 
                                    item.claimedBy.find(p => p.user === userId);
          
          return (
          <View style={styles.card}>
            <Image source={{ uri: item.photoUrl }} style={styles.profileImage} />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.actions}>
                <View style={styles.percentCard}>
                  <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
                  <View style={styles.percentText}>
                    <Text style={{color:'#fff', fontSize:12, fontWeight: '400'}}>YES</Text>
                    <Text style={{color:'#fff', fontSize:12, fontWeight: '400'}}> {item.percent}</Text>
                  </View>
                </View>
              
                {(userParticipated && !userChoiceMatchesResult) && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, tintColor:"white" }} />
                      <Text style={styles.wonText}> %{(item.yesOdds)*10}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/ghost.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.wonText}> Lost!</Text>
                    </View>
                    <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginLeft:18 }} />
                    
                  </View>
                )}
                {(userParticipated && userChoiceMatchesResult) && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, tintColor:"white" }} />
                      <Text style={styles.wonText}> %{(item.yesOdds)*10}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/mood-suprised.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.wonText}> Won</Text>
                    </View>
                    <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16, marginLeft:8 }} />
                  </View>
                )}
              </View>
            </View>
            
            {(userParticipated && userChoiceMatchesResult && userAlreadyClaimed) && (
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claimed</Text>
                <TouchableOpacity style={styles.claimedButton} disabled={true}>
                  <Text style={styles.claimedText}>Claimed</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {(userParticipated && userChoiceMatchesResult && !userAlreadyClaimed) && (
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claim</Text>
                <TouchableOpacity 
                  style={styles.claimButton}
                  onPress={() => handleClaimPress(item)}
                >
                  <Text style={styles.claimText}>{claimAmount} USDC</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}}
      />
      )}
      
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
      
      <ClaimModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 1,
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
  yesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: 3,
    marginRight: 12,
  },
  yesText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  wonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ddd',
  },
  statText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ddd',
  },
  claimContainer: {
    alignItems: 'center',
  },
  claimLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 7,
  },
  claimedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  claimButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  claimedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  claimText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  seeAllButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },  
  percentCard : {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(214, 214, 214, 0.45)', 
    borderRadius: 13, 
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  percentText: {
    flexDirection: "row",
  },
  percentImage : { 
    width: 16, 
    height: 16,
    tintColor: "#fff",
  },
  percentImage2 : { 
    width: 16, 
    height: 16,
    tintColor: '#5E5E5E5C'
  },
  // Modal stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 14,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});