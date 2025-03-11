
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const exampleData = [
  { id: '1', title: 'Elon Musk out as Head of DOGE before July?', status: 'Pending' },
  { id: '2', title: 'Elon Musk out as Head of DOGE before July?', status: 'Result' },
  { id: '3', title: 'Elon Musk out as Head of DOGE before July?', status: 'Result' },
  { id: '4', title: 'Elon Musk out as Head of DOGE before July?', status: 'Pending' },
];

export default function GangActiveBets() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBetId, setSelectedBetId] = useState(null);
  interface ApiBet {
    _id: string;
    title: string;
    description: string;
    photoUrl?: string;
    createdBy: {
      _id: string;
      username: string;
    };
    channel: string;
    totalPool: number;
    totalYesAmount: number;
    totalNoAmount: number;
    yesUsersCount: number;
    noUsersCount: number;
    yesOdds: number;
    noOdds: number;
    minBetAmount: number;
    maxBetAmount: number;
    status: string;
    result: string;
    endDate: string;
    participants: Array<{
      user: string;
      choice: string;
      amount: number;
    }>;
  }

  const fetchBets = async () => {
    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await fetch(`${baseUrl}/api/bets/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bets');
      }
      
      const data = await response.json();
      const activeBets = data.bets.filter(bet => bet.status === 'active');

      
      setBets(activeBets);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bets:', err);
      setLoading(false);
    }
  };

  const handleFinalisePress = (betId) => {
    setSelectedBetId(betId);
    setModalVisible(true);
  };


  const handleYesPress = async () => {
    // Backend'e istek gönder
   
    try {
      const payload = { betId: selectedBetId, result: 'yes' };
      const response = await fetch('http://51.21.28.186:5001/api/bets/resolve', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message);
      } else {
        Alert.alert("Error", "Something went wrong: " + data.message);
      }
  
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not send the result: " + error.message);
    }
  };

  const handleNoPress = async () => {
    // Backend'e istek gönder
    try {
      const response = await fetch('https://your-backend-api.com/endpoint', {
        method: 'POST',
        body: JSON.stringify({ result: 'no', betId: selectedBetId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Başarılı işlem
      Alert.alert("Success", "Result recorded");
      setModalVisible(false);
    } catch (error) {
      // Hata durumunda
      Alert.alert("Error", "Could not send the result");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
      fetchBets();
    }, []);


  return (
    <View style={styles.container}>
      <LinearGradient
              colors={['#161638', '#714F60', '#B85B44']}
              style={styles.loadingContainer}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
            >
      <FlatList
        data={bets}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.mainCard}>
            <View style={styles.card}>
              {item.result === "waiting" && (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/alert-triangle.png')} style={styles.iconStyle} />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400' }}>Need Finalise</Text>
                </View>
              )}
              {item.result === "ended" && (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/gavel.png')} style={styles.iconStyle} />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400' }}>Finalised</Text>
                </View>
              )}
            </View>
            {item.result === "waiting" && (
              <View style={styles.card}>
                <View style={{flex: 1, paddingRight: 10}}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.buttons}>
                    <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 7 }}>%{item.yesUsersCount/((item.yesUsersCount+item.noUsersCount))*100}</Text>
                    <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 21 }}>{item.participants.length}  Members</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleFinalisePress(item._id)} style={styles.card2}>
                  <Image source={require('@/assets/images/power.png')} style={styles.iconStyle2} />
                  <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Finalise</Text>
                </TouchableOpacity>
              </View>
            )}
            {item.status === "ended" && (
              <View style={styles.card}>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.buttons}>
                    <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 7 }}>%{item.yesUsersCount/((item.yesUsersCount+item.noUsersCount))*100}</Text>
                    <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginRight: 21 }}>{item.participants.length} Members</Text>

                  </View>
                </View>
                <View style={styles.card3}>
                  <Image source={require('@/assets/images/thumb-up.png')} style={styles.iconStyle2} />
                  <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Yes!</Text>
                </View>
              </View>
            )}
          </View>
        )}
        
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={{ color: '#000', fontSize: 16 }}>X</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>What is the result?</Text>
            <TouchableOpacity onPress={handleYesPress} style={styles.resultButton}>
              <Text style={{ color: '#fff', fontSize: 16 }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNoPress} style={styles.resultButton}>
              <Text style={{ color: '#fff', fontSize: 16 }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.seeAllButton}>
      <View style={styles.seeAllIconGroup}>
        <Image source={require('@/assets/images/search.png')} style={styles.iconStyle} />
        <Image source={require('@/assets/images/vector.png')} style={{ width: 4, height: 16, marginHorizontal: 10 }} />
      </View>
      
      <View style={styles.seeAllIconGroup}>
        <Image source={require('@/assets/images/seeding.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>Latest</Text>
      </View>
      
      <View style={styles.seeAllIconGroup}>
        <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>Time Ended</Text>
      </View>
      
      <View style={styles.seeAllIconGroup}>
        <Image source={require('@/assets/images/new-section.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>New Bet</Text>
      </View>
    </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4C',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  card2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    paddingVertical: 6,  // 8'den 6'ya düşürdüm
    paddingHorizontal: 4,
    borderRadius: 20,
    minWidth: 72,       // 78'den 72'ye düşürdüm
    justifyContent: 'center',
  },
  card3: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 20,
    minWidth: 70,
  },
  cardYes: {
    backgroundColor: 'rgba(69, 170, 69, 0.6)',
  },
  cardNo: {
    backgroundColor: 'rgba(220, 53, 69, 0.6)',
  },
  subcard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 5,
    tintColor: '#fff',
  },
  iconStyle2: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    flexShrink: 1,
    width: '70%',  // Burada %90'dan %70'e düşürdüm
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  resultButton: {
    backgroundColor: '#1E1E4C',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '50%',
    alignItems: 'center',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Öğeleri yatay olarak eşit dağıtır
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    flexWrap: 'nowrap', // Öğelerin alt satıra geçmesini engeller
  },
  seeAllIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  seeAllText: {
    fontSize: 12, // 14'ten 12'ye düşürdüm
    fontWeight: '600',
    color: '#fff',
    marginLeft: 3,
  },

});