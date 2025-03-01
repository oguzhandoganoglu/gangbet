import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { resolveMarket } from '../services/predictionMarketService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://51.21.28.186:5001';

export default function ResolveBetModal({ 
  visible, 
  onClose, 
  betId, 
  betTitle,
  marketAddress
}) {
  const [selectedOutcome, setSelectedOutcome] = useState(null); // 1=Evet, 2=Hayır
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Kullanıcı bilgilerini al
  React.useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserId(parsedUserData._id);
          setUserToken(parsedUserData.token);
        }
      } catch (error) {
        console.error("AsyncStorage'dan kullanıcı bilgileri alınırken hata:", error);
      }
    };

    getUserData();
  }, []);

  const handleResolveBet = async () => {
    if (!userId || !userToken) {
      Alert.alert("Hata", "Kullanıcı girişi yapılmamış. Lütfen tekrar giriş yapın.");
      return;
    }

    if (!selectedOutcome) {
      Alert.alert("Hata", "Lütfen bir sonuç seçin (Evet veya Hayır).");
      return;
    }

    setLoading(true);

    try {
      // 1. Önce backend API'ye bahis sonuçlandırma isteği gönder
      const response = await axios.post(`${API_BASE_URL}/api/bets/${betId}/resolve`, {
        outcome: selectedOutcome === 1 ? "yes" : "no"
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Backend bahis sonuçlandırma yanıtı:", response.data);

      // 2. Sonra blokzincirde bahisi sonuçlandır
      const blockchainResult = await resolveMarket(
        marketAddress,
        selectedOutcome
      );
      
      console.log("Blokzincir işlem sonucu:", blockchainResult);

      Alert.alert(
        "Başarılı", 
        "Bahis başarıyla sonuçlandırıldı!",
        [{ text: "Tamam", onPress: onClose }]
      );
    } catch (error) {
      console.error("Bahis sonuçlandırma hatası:", error);
      
      if (error.response) {
        Alert.alert("Hata", `Sunucu hatası: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        Alert.alert("Hata", "Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.");
      } else {
        Alert.alert("Hata", `İstek hatası: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bahis Sonuçlandır</Text>
          <Text style={styles.betTitle}>{betTitle}</Text>
          
          <Text style={styles.label}>Sonuç:</Text>
          <View style={styles.outcomeContainer}>
            <TouchableOpacity 
              style={[
                styles.outcomeButton, 
                selectedOutcome === 1 && styles.selectedOutcome
              ]}
              onPress={() => setSelectedOutcome(1)}
            >
              <Text style={styles.outcomeText}>Evet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.outcomeButton, 
                selectedOutcome === 2 && styles.selectedOutcome
              ]}
              onPress={() => setSelectedOutcome(2)}
            >
              <Text style={styles.outcomeText}>Hayır</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleResolveBet}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "İşleniyor..." : "Sonuçlandır"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // PlaceBetModal ile aynı stiller
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  betTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  outcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  outcomeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedOutcome: {
    backgroundColor: '#6c5ce7',
    borderColor: '#6c5ce7',
  },
  outcomeText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#6c5ce7',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 