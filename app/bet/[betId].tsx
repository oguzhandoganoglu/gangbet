import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Örnek veri tipi
interface BetDetailProps {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  groupName: string;
  channelName: string;
  createdAt: string;
  endDate: string;
  remainingTime: number;
  userChoice: string;
  amount: number;
  totalPool: number;
  yesOdds: string;
  noOdds: string;
  yesCount: number;
  noCount: number;
  participants: Array<{
    id: string;
    name: string;
    photoUrl: string;
    choice: string;
    amount: number;
  }>;
}

export default function BetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [betDetail, setBetDetail] = useState<BetDetailProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Burada gerçek bir API çağrısı yapılacak
    // Örnek veri
    const mockData: BetDetailProps = {
      id: id as string,
      title: "Will Bitcoin reach $100k by the end of 2025?",
      description: "This bet is about whether Bitcoin will reach $100,000 before December 31, 2025. The price must be recorded on at least two major exchanges (Binance, Coinbase, etc.) to be considered valid.",
      photoUrl: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcS2CHe7B3Ca4IP1HBjFALkqkeU43BjeDYAtGuP32PxP2XPSZWnByb0xArOAOEdP5lcykP_lUkxAM4HUkK8",
      groupName: "Crypto Predictions",
      channelName: "Bitcoin",
      createdAt: "2025-01-15T10:30:00Z",
      endDate: "2025-12-31T23:59:59Z",
      remainingTime: 25920000000, // ~300 days in milliseconds
      userChoice: "yes",
      amount: 50,
      totalPool: 2500,
      yesOdds: "1.8",
      noOdds: "2.2",
      yesCount: 28,
      noCount: 17,
      participants: [
        {
          id: "user1",
          name: "Alex K.",
          photoUrl: "https://img.piri.net/mnresize/900/-/resim/upload/2016/05/30/04/37/217427f5110815_r21179_g20481200.jpg",
          choice: "yes",
          amount: 100
        },
        {
          id: "user2",
          name: "Maya R.",
          photoUrl: "https://media.licdn.com/dms/image/v2/D4D03AQE299ihB7MtYA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718247078973?e=2147483647&v=beta&t=mTH71ST2CCz01kbmtS9tBs6LT8SsZHHKfyLu9yOAstI",
          choice: "no",
          amount: 75
        },
        {
          id: "user3",
          name: "Sam T.",
          photoUrl: "https://www.webtekno.com/images/editor/default/0003/44/5eaf4a544ba84f094ce2cc5c9c1ff7353413f9d4.jpeg",
          choice: "yes",
          amount: 50
        }
      ]
    };
    
    setTimeout(() => {
      setBetDetail(mockData);
      setLoading(false);
    }, 500);
  }, [id]);

  // Kalan süreyi formatla
  const formatRemainingTime = (milliseconds: number) => {
    if (milliseconds <= 0) return "Ended";
    
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} days, ${hours} hours left`;
    } else {
      const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m left`;
    }
  };

  // Tarih formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading bet details...</Text>
      </SafeAreaView>
    );
  }

  if (!betDetail) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Bet not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Yes ve No yüzdeleri
  const totalVotes = betDetail.yesCount + betDetail.noCount;
  const yesPercentage = Math.round((betDetail.yesCount / totalVotes) * 100) || 0;
  const noPercentage = Math.round((betDetail.noCount / totalVotes) * 100) || 0;

  return (
    <LinearGradient
            colors={['#161638', '#714F60', '#B85B44']}
            style={{flex: 1}}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image 
            source={require('@/assets/images/arrow-back.png')} 
            style={styles.backIcon} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bet Details</Text>
        <View style={styles.spacer} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {/* Bet Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: betDetail.photoUrl }} 
            style={styles.betImage}
            defaultSource={require('@/assets/images/angry.png')}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.imageOverlay}
          >
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{betDetail.groupName}</Text>
              <Text style={styles.channelName}>{betDetail.channelName}</Text>
            </View>
          </LinearGradient>
        </View>
        
        {/* Bet Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.title}>{betDetail.title}</Text>
          
          {/* Time Info */}
          <View style={styles.timeContainer}>
            <Image 
              source={require('@/assets/images/hourglass.png')} 
              style={styles.icon} 
            />
            <Text style={styles.timeText}>
              {formatRemainingTime(betDetail.remainingTime)}
            </Text>
          </View>
          
          {/* Description */}
          <Text style={styles.description}>{betDetail.description}</Text>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Pool</Text>
              <Text style={styles.statValue}>{betDetail.totalPool} USDC</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>End Date</Text>
              <Text style={styles.statValue}>{formatDate(betDetail.endDate)}</Text>
            </View>
          </View>
          
          {/* User Choice */}
          <View style={styles.choiceContainer}>
            <Text style={styles.choiceTitle}>Your Choice</Text>
            <View style={[
              styles.choiceCard,
              { backgroundColor: betDetail.userChoice === 'yes' ? 'rgba(80, 200, 120, 0.6)' : 'rgba(255, 99, 71, 0.6)' }
            ]}>
              <Image 
                source={
                  betDetail.userChoice === 'yes' 
                    ? require('@/assets/images/thumb-up.png') 
                    : require('@/assets/images/thumb-down.png')
                } 
                style={styles.choiceIcon} 
              />
              <View style={styles.choiceDetails}>
                <Text style={styles.choiceText}>
                  {betDetail.userChoice.toUpperCase()}
                </Text>
                <Text style={styles.oddsText}>
                  {betDetail.userChoice === 'yes' ? betDetail.yesOdds : betDetail.noOdds}x
                </Text>
              </View>
              <View style={styles.stakeInfo}>
                <Text style={styles.stakeLabel}>Your Stake</Text>
                <Text style={styles.stakeValue}>{betDetail.amount} USDC</Text>
              </View>
            </View>
          </View>
          
          {/* Voting Stats */}
          <View style={styles.votingContainer}>
            <Text style={styles.votingTitle}>Voting Stats</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <View style={styles.progressLabel}>
                  <View style={[styles.progressDot, {backgroundColor: 'rgba(80, 200, 120, 0.9)'}]} />
                  <Text style={styles.progressLabelText}>Yes ({betDetail.yesCount})</Text>
                </View>
                <Text style={styles.progressPercent}>{yesPercentage}%</Text>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, {
                    width: `${yesPercentage}%`,
                    backgroundColor: 'rgba(80, 200, 120, 0.9)'
                  }]} 
                />
              </View>
              
              <View style={styles.progressLabels}>
                <View style={styles.progressLabel}>
                  <View style={[styles.progressDot, {backgroundColor: 'rgba(255, 99, 71, 0.9)'}]} />
                  <Text style={styles.progressLabelText}>No ({betDetail.noCount})</Text>
                </View>
                <Text style={styles.progressPercent}>{noPercentage}%</Text>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, {
                    width: `${noPercentage}%`,
                    backgroundColor: 'rgba(255, 99, 71, 0.9)'
                  }]} 
                />
              </View>
            </View>
          </View>
          
          {/* Participants */}
          <View style={styles.participantsContainer}>
            <Text style={styles.participantsTitle}>Recent Participants</Text>
            
            {betDetail.participants.map(participant => (
              <View key={participant.id} style={styles.participantItem}>
                <Image 
                  source={{ uri: participant.photoUrl }} 
                  style={styles.participantImage}
                  defaultSource={require('@/assets/images/angry.png')}
                />
                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  <Text style={styles.participantStake}>{participant.amount} USDC</Text>
                </View>
                <View style={[
                  styles.participantChoice,
                  { backgroundColor: participant.choice === 'yes' ? 'rgba(80, 200, 120, 0.6)' : 'rgba(255, 99, 71, 0.6)' }
                ]}>
                  <Text style={styles.participantChoiceText}>
                    {participant.choice.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  betImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(50, 50, 50, 0.3)',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  groupInfo: {
    flexDirection: 'column',
  },
  groupName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  channelName: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#fff',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  choiceContainer: {
    marginBottom: 24,
  },
  choiceTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  choiceIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#fff',
  },
  choiceDetails: {
    flex: 1,
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  oddsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  stakeInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
  },
  stakeLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 4,
  },
  stakeValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  votingContainer: {
    marginBottom: 24,
  },
  votingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressLabelText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  progressPercent: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  participantsContainer: {
    marginBottom: 16,
  },
  participantsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  participantStake: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  participantChoice: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  participantChoiceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  }
});