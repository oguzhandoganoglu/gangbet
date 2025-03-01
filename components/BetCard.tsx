import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import PlaceBetModal from './PlaceBetModal';

export default function BetCard({ bet }) {
  const [betModalVisible, setBetModalVisible] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: bet.photoUrl || 'https://tinderapp-bet-images.s3.eu-north-1.amazonaws.com/bet-photos/1740665862974.png' }} 
        style={styles.image} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>{bet.title}</Text>
        <Text style={styles.description}>{bet.description}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.date}>Bitiş: {formatDate(bet.endDate)}</Text>
          <Text style={styles.amount}>
            {bet.minBetAmount} - {bet.maxBetAmount} USDC
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.betButton}
          onPress={() => setBetModalVisible(true)}
        >
          <Text style={styles.betButtonText}>Bahis Yap</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bahis yapma modalı */}
      <PlaceBetModal
        visible={betModalVisible}
        onClose={() => setBetModalVisible(false)}
        betId={bet._id}
        betTitle={bet.title}
        marketAddress={bet.marketAddress || bet.createdBy} // Blokzincir market adresi veya oluşturan kullanıcı
        minAmount={bet.minBetAmount}
        maxAmount={bet.maxBetAmount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  amount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6c5ce7',
  },
  betButton: {
    backgroundColor: '#6c5ce7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  betButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 