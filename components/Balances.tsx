import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';

// Balances bileşeni için prop tipleri
interface BalancesProps {
  walletInfo?: {
    totalBalance: number;
    availableBalance: number;
    lockedBalance: number;
  };
  transactions?: Array<{
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  stats?: {
    deposit: number;
    withdraw: number;
    betAmount: number;
    claimAmount: number;
  };
}

export default function Balances({ walletInfo, transactions, stats }: BalancesProps) {
  // Tarihi formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // İşlem tipine göre ikon ve rengini belirle
  const getTransactionTypeDetails = (type: string) => {
    switch (type) {
      case 'deposit':
        return {
          icon: require('@/assets/images/qrcode.png'),
          color: '#50C878',
          label: 'Deposit'
        };
      case 'withdraw':
        return {
          icon: require('@/assets/images/send.png'),
          color: '#FF6347',
          label: 'Withdraw'
        };
      case 'bet':
        return {
          icon: require('@/assets/images/hourglass.png'),
          color: '#FFB74D',
          label: 'Bet'
        };
      case 'claim':
        return {
          icon: require('@/assets/images/thumb-up.png'),
          color: '#4CAF50',
          label: 'Claim'
        };
      default:
        return {
          icon: require('@/assets/images/refresh.png'),
          color: '#5B4FFF',
          label: 'Transaction'
        };
    }
  };

  if (!walletInfo) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Wallet information not available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Bakiye Kartları */}
      <View style={styles.balanceCardsContainer}>
        <View style={[styles.balanceCard, { backgroundColor: 'rgba(92, 79, 255, 0.2)' }]}>
          <Image source={require('@/assets/images/refresh.png')} style={styles.balanceIcon} />
          <View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>{walletInfo.totalBalance} USDC</Text>
          </View>
        </View>
        
        <View style={[styles.balanceCard, { backgroundColor: 'rgba(80, 200, 120, 0.2)' }]}>
          <Image source={require('@/assets/images/qrcode.png')} style={styles.balanceIcon} />
          <View>
            <Text style={styles.balanceLabel}>Available</Text>
            <Text style={styles.balanceValue}>{walletInfo.availableBalance} USDC</Text>
          </View>
        </View>
        
        <View style={[styles.balanceCard, { backgroundColor: 'rgba(255, 183, 77, 0.2)' }]}>
          <Image source={require('@/assets/images/hourglass.png')} style={styles.balanceIcon} />
          <View>
            <Text style={styles.balanceLabel}>Locked</Text>
            <Text style={styles.balanceValue}>{walletInfo.lockedBalance} USDC</Text>
          </View>
        </View>
      </View>

      {/* İstatistikler */}
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Transaction Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Deposits</Text>
              <Text style={styles.statValue}>{stats.deposit} USDC</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Withdrawals</Text>
              <Text style={styles.statValue}>{stats.withdraw} USDC</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Bet Amount</Text>
              <Text style={styles.statValue}>{stats.betAmount} USDC</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Claim Amount</Text>
              <Text style={styles.statValue}>{stats.claimAmount} USDC</Text>
            </View>
          </View>
        </View>
      )}

      {/* İşlem Geçmişi */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        
        {!transactions || transactions.length === 0 ? (
          <Text style={styles.noTransactionsText}>No transaction history found</Text>
        ) : (
          <FlatList
            data={transactions}
            renderItem={({ item }) => {
              const typeDetails = getTransactionTypeDetails(item.type);
              
              return (
                <View style={styles.transactionItem}>
                  <View style={[styles.transactionIconContainer, { backgroundColor: `${typeDetails.color}20` }]}>
                    <Image source={typeDetails.icon} style={[styles.transactionIcon, { tintColor: typeDetails.color }]} />
                  </View>
                  
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionType}>{typeDetails.label}</Text>
                    <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                  
                  <View style={styles.transactionAmountContainer}>
                    <Text style={[
                      styles.transactionAmount, 
                      { color: item.type === 'deposit' || item.type === 'claim' ? '#50C878' : '#fff' }
                    ]}>
                      {item.type === 'deposit' || item.type === 'claim' ? '+' : '-'}{item.amount} USDC
                    </Text>
                    <Text style={[
                      styles.transactionStatus,
                      { color: item.status === 'completed' ? '#50C878' : '#FFB74D' }
                    ]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                </View>
              );
            }}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            style={styles.transactionsList}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Saydam arka plan
    padding: 10,
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
    textAlign: 'center',
  },
  balanceCardsContainer: {
    marginBottom: 20,
  },
  balanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    // Saydamlık artırıldı
  },
  balanceIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Saydamlık artırıldı
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Saydamlık artırıldı
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Saydamlık artırıldı
    borderRadius: 10,
    padding: 15,
  },
  noTransactionsText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    padding: 20,
  },
  transactionsList: {
    marginTop: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionIcon: {
    width: 20,
    height: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  transactionDate: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  transactionStatus: {
    fontSize: 12,
  }
});