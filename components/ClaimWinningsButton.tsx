import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { claimWinnings } from '../services/predictionMarketService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://51.21.28.186:5001';

export default function ClaimWinningsButton({ betId, marketAddress }) {
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

  const handleClaimWinnings = async () => {
    if (!userId || !userToken) {
      Alert.alert("Hata", "Kullanıcı girişi yapılmamış. Lütfen tekrar giriş yapın.");
      return;
    }

    setLoading(true);

    try {
      // 1. Önce backend API'ye kazanç talep etme isteği gönder
      const response = await axios.post(`${API_BASE_URL}/api/bets/${betId}/claim-winnings`, {
        userId: userId
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Backend kazanç talep etme yanıtı:", response.data);

      // 2. Sonra blokzincirde kazanç talep et
      const blockchainResult = await claimWinnings(
        marketAddress,
        userId // Kullanıcı adresi
      );
      
      console.log("Blokzincir işlem sonucu:", blockchainResult);

      Alert.alert("Başarılı", "Kazancınız başarıyla talep edildi!");
    } catch (error) {
      console.error("Kazanç talep etme hatası:", error);
      
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
    <TouchableOpacity 
      style={styles.button}
      onPress={handleClaimWinnings}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={styles.buttonText}>Kazancı Talep Et</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4cd137',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 