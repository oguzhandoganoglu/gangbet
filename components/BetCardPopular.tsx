import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, ImageBackground } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { useUser } from '../app/UserContext';
import { LinearGradient } from "expo-linear-gradient";

const profileImages = [
  require("@/assets/images/char1.png"),
  require("@/assets/images/char2.png"),
  require("@/assets/images/alp.png"),
  require("@/assets/images/more.png")
];

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3;

// API'den gelen bahis veri tipi
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

type HeaderProps = {
  title?: string;
};

type StatsProps = {
  volume?: string;
  date?: string;
};

type PriceButtonProps = {
  price: number;
  onYesPress: () => void;
  onNoPress: () => void;
};

type ProfileImageRowProps = {
  yesCount: number;
  noCount: number;
};

const BetCardFriends: React.FC = () => {
  const [bets, setBets] = useState<ApiBet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const translateX = useSharedValue(0);

  // API'den bahisleri çekme
  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await fetch(`${baseUrl}/api/bets/all`, {
        headers: {
          'Authorization': `Bearer ${user?.token || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bets');
      }
      
      const data = await response.json();
      // Sadece aktif bahisleri filtrele
      const activeBets = data.bets.filter(bet => bet.status === 'active');
      // Kullanıcının zaten katıldığı bahisleri filtrele
      const availableBets = user ? activeBets.filter(bet =>
        !bet.participants?.some(p => p.user === user._id)
      ) : activeBets;
      
      setBets(availableBets);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bets:', err);
      setLoading(false);
    }
  };

  // Bahis yerleştirme
  const placeBet = async (betId: string, choice: 'yes' | 'no') => {
    if (!user || !user._id) {
      Alert.alert('Error', 'You need to be logged in to place a bet');
      return;
    }
    
    const currentBet = bets[currentIndex];
    if (!currentBet) return;
    
    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await fetch(`${baseUrl}/api/bets/place`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          betId,
          userId: user._id,
          choice,
          amount: currentBet.minBetAmount
        })
      });
      
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', `Bet placed successfully on ${choice.toUpperCase()}!`);
        removeTopCard();
      } else {
        Alert.alert('Error', result.message || 'Failed to place bet');
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      Alert.alert('Error', 'An error occurred while placing your bet');
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Sağa kaydırma - Evet
        translateX.value = withSpring(
          width,
          {},
          () => runOnJS(handleYesSwipe)()
        );
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Sola kaydırma - Hayır
        translateX.value = withSpring(
          -width,
          {},
          () => runOnJS(handleNoSwipe)()
        );
      } else {
        // Yeterince kaydırılmadı, geri getir
        translateX.value = withSpring(0);
      }
    },
  });

  const handleYesSwipe = () => {
    const currentBet = bets[currentIndex];
    if (currentBet) {
      placeBet(currentBet._id, 'yes');
    }
  };

  const handleNoSwipe = () => {
    const currentBet = bets[currentIndex];
    if (currentBet) {
      placeBet(currentBet._id, 'no');
    }
  };

  const removeTopCard = () => {
    setBets((prevBets) => prevBets.filter((_, index) => index !== currentIndex));
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Kalan zamanı hesapla
  const getRemainingTime = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    const now = new Date();
    const diffInDays = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays > 365) {
      return `${Math.floor(diffInDays / 365)} years`;
    } else if (diffInDays > 30) {
      return `${Math.floor(diffInDays / 30)} months`;
    } else {
      return `${diffInDays} days`;
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>Loading bets...</Text>
      </View>
    );
  }

  if (bets.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>No available bets!</Text>
      </View>
    );
  }

  const currentBet = bets[currentIndex];

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <ImageBackground
          source={currentBet.photoUrl ? { uri: currentBet.photoUrl } : require("@/assets/images/latte.jpeg")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.gradientOverlay}>
            {/* Opaklığı azalan gradient */}
            <LinearGradient
              colors={["rgba(0, 0, 0, 1)", "rgba(49, 44, 96, 0.01)"]}
              style={styles.topGradient}
            />
            
            {/* Ana içerik alanı */}
            <View style={styles.contentContainer}>
              {/* Title bileşeni gradient üzerinde olacak */}
              <View style={styles.headerWrapper}>
                <Header title={currentBet.title} />
              </View>
              <Stats
                volume={`${currentBet.totalPool}`}
                date={getRemainingTime(currentBet.endDate)}
              />
              <View style={styles.spacer} />
              <ActionButtons />
              <ProfileImageRow
                yesCount={currentBet.yesUsersCount}
                noCount={currentBet.noUsersCount}
              />
               
              {/* Butonlar gradient üzerinde olacak */}
              <View style={styles.buttonWrapper}>
                
                <PriceButton
                  price={currentBet.minBetAmount}
                  onYesPress={() => placeBet(currentBet._id, 'yes')}
                  onNoPress={() => placeBet(currentBet._id, 'no')}
                />
                
              </View>
            </View>
          </View>
        </ImageBackground>
        <LinearGradient
              colors={["rgba(0, 0, 0, 0.1)", "rgb(0, 0, 0)"]}
              style={styles.botGradient}
            />
      </Animated.View>
    </PanGestureHandler>
  );
};

const Header: React.FC<HeaderProps> = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const Stats: React.FC<StatsProps> = ({ volume, date }) => (
  <View style={styles.stats}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={require("@/assets/images/chart-line.png")} style={{ width: 24, height: 24 }} />
      <Text style={styles.statText}>{volume} Volume</Text>
    </View>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={require("@/assets/images/calendar-minus.png")} style={{ width: 24, height: 24 }} />
      <Text style={styles.statText}>{date}</Text>
    </View>
  </View>
);

const ActionButtons: React.FC = () => (
  <View style={styles.actionButtons}>
    <TouchableOpacity>
      <Image source={require("@/assets/images/arrow-back.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/share.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/info-circle.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/star.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
  </View>
);

const PriceButton: React.FC<PriceButtonProps> = ({ price, onYesPress, onNoPress }) => (
  <View style={styles.priceButtonContainer}>
    <TouchableOpacity style={[styles.priceButton, styles.yesButton]} onPress={onYesPress}>
      <Text style={styles.priceText}>YES ${price}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.priceButton, styles.noButton]} onPress={onNoPress}>
      <Text style={styles.priceText}>NO ${price}</Text>
    </TouchableOpacity>
  </View>
);

const ProfileImageRow: React.FC<ProfileImageRowProps> = ({ yesCount, noCount }) => (
  <View style={styles.profileContainer}>
    {profileImages.map((imageSource, index) => (
      <Image key={index} source={imageSource} style={styles.profileImage} />
    ))}
    <View style={styles.userCountContainer}>
      <Text style={styles.userCountText}>{yesCount} Yes / {noCount} No</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    width: "100%",
    minHeight: 100,
    height:"85%",
    overflow: 'hidden', // Önemli: Köşelerin düzgün görünmesi için
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    flex: 1,
  },
  headerWrapper: {
    zIndex: 2, // gradient'in üzerine çıkarmak için
    position: 'relative', // z-index'in çalışması için
  },
  buttonWrapper: {
    zIndex: 2, // gradient'in üzerine çıkarmak için
    position: 'relative', // z-index'in çalışması için
  },
  topGradient: {
    height: 150,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  botGradient: {
    height: 150,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 20,
    position: 'relative', // z-index'lerin düzgün çalışması için
  },
  spacer: {
    flex: 1,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  header: {
    marginVertical: 8,
    marginHorizontal: 6,
  },
  title: {
    color: "white",
    fontWeight: '700',
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
  },
  stats: {
    marginVertical: 8,
    marginHorizontal: 6,
  },
  statText: {
    color: "white",
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  actionbuttonimage: {
    width: 45,
    height: 45,
    marginHorizontal: 8,
    backgroundColor: "rgba(94, 94, 94, 0.5)",
    borderRadius: 30,
    padding: 7,
  },
  priceButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  priceButton: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
  },
  yesButton: {
    backgroundColor: "rgba(80, 200, 120, 0.3)",
    borderColor: "#50C878",
  },
  noButton: {
    backgroundColor: "rgba(255, 99, 71, 0.3)",
    borderColor: "#FF6347",
  },
  priceText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 9,
    marginBottom: 16,
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: -6,
  },
  userCountContainer: {
    marginLeft: 10,
  },
  userCountText: {
    color: 'white',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});

export default BetCardFriends;