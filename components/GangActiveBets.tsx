import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GangActiveBets() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBetId, setSelectedBetId] = useState(null);
  
  // Kalan zamanı hesapla
  const formatRemainingTime = (endDateStr) => {
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
    try {
      const response = await fetch('https://your-backend-api.com/endpoint', {
        method: 'POST',
        body: JSON.stringify({ result: 'no', betId: selectedBetId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      Alert.alert("Success", "Result recorded");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Could not send the result");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetchBets();
  }, []);

  // Kullanıcının bahse yaptığı seçimi belirle (normalde API'dan gelmeli)
  const getUserChoice = (item) => {
    // Bu örnek için rastgele bir seçim yapıyoruz
    // Gerçek uygulamada kullanıcının gerçek seçimi API'dan alınmalı
    return Math.random() > 0.5 ? 'yes' : 'no';
  };

  // Kullanıcının bahis miktarını belirle (normalde API'dan gelmeli)
  const getUserAmount = (item) => {
    // Bu örnek için rastgele bir miktar
    // Gerçek uygulamada kullanıcının gerçek bahis miktarı API'dan alınmalı
    return Math.floor(Math.random() * 100) + 10;
  };

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
          renderItem={({ item }) => {
            const userChoice = getUserChoice(item);
            const userAmount = getUserAmount(item);
            
            return (
              <View style={styles.mainCard}>
                {/* Status banner */}
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
                
                {/* Main card content */}
                <View style={styles.cardContent}>
                  {/* Bet Image */}
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: item.photoUrl || 'https://tinderapp-bet-images.s3.eu-north-1.amazonaws.com/bet-photos/1740813122515.jpg' }} 
                      style={styles.profileImage} 
                      defaultSource={require('@/assets/images/angry.png')}
                    />
                  </View>
                  
                  {/* Bet Details */}
                  <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    
                    <View style={styles.actions}>
                      {/* User Choice Card */}
                      {item.result !== "ended" && (
                        <View style={[
                          styles.percentCard, 
                          { backgroundColor: userChoice === 'yes' ? 'rgba(80, 200, 120, 0.6)' : 'rgba(255, 99, 71, 0.6)' }
                        ]}>
                          <Image 
                            source={
                              userChoice === 'yes' 
                                ? require('@/assets/images/thumb-up.png') 
                                : require('@/assets/images/thumb-down.png')
                            } 
                            style={styles.percentImage} 
                          />
                          <View style={styles.percentText}>
                            <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                              {userChoice.toUpperCase()}
                            </Text>
                            <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                              {' '}{userAmount} USDC
                            </Text>
                          </View>
                        </View>
                      )}
                      
                      {/* Additional stats */}
                      <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                          <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                          <Text style={styles.detailText}>%{Math.round(item.yesUsersCount/((item.yesUsersCount+item.noUsersCount || 1))*100) || 0}</Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                          <Text style={styles.detailText}>{item.participants ? item.participants.length : 0} Members</Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
                          <Text style={styles.detailText}>{formatRemainingTime(item.endDate)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  {/* Finalise/Result Button */}
                  {item.result === "waiting" && (
                    <TouchableOpacity 
                      onPress={() => handleFinalisePress(item._id)} 
                      style={styles.finaliseButton}
                    >
                      <Image source={require('@/assets/images/power.png')} style={styles.iconStyle2} />
                      <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Finalise</Text>
                    </TouchableOpacity>
                  )}
                  
                  {item.result === "yes" && (
                    <View style={styles.resultButton}>
                      <Image source={require('@/assets/images/thumb-up.png')} style={styles.iconStyle2} />
                      <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>Yes!</Text>
                    </View>
                  )}
                  
                  {item.result === "no" && (
                    <View style={[styles.resultButton, { backgroundColor: 'rgba(255, 99, 71, 0.8)' }]}>
                      <Image source={require('@/assets/images/thumb-down.png')} style={styles.iconStyle2} />
                      <Text style={{ color: '#000', fontSize: 12, fontWeight: '400' }}>No!</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
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
              <TouchableOpacity onPress={handleYesPress} style={styles.modalResultButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNoPress} style={styles.modalResultButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  finaliseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 35,
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(80, 200, 120, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  subcard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 5,
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
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    paddingRight: 70,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  imageContainer: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    flex: 1,
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  percentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  percentText: {
    flexDirection: 'row',
  },
  percentImage: {
    width: 16,
    height: 16,
    tintColor: '#fff',
    marginRight: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 12,
    color: '#fff',
  },
// Modalın CSS stillerini düzeltmek için aşağıdaki değişiklikleri yapın:

// Modal içindeki butonlar için yeni bir stil ekleyin
modalResultButton: {
  backgroundColor: '#1E1E4C',
  padding: 10,
  borderRadius: 5,
  marginVertical: 5,
  width: '50%',
  alignItems: 'center',
},

modalButtonText: {
  color: '#fff', 
  fontSize: 16
},

// Modalın kendisi için diğer düzeltmeleri de ekleyin
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
  zIndex: 10,
},

});