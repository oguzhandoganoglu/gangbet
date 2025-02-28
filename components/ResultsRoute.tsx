import React, {useState, useEffect} from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useUser } from "../app/UserContext";


function getRemainingMinutes(endDateFromDatabase: Date) {
  const targetDate = new Date(endDateFromDatabase);  // Stringi Date nesnesine dönüştür
  const currentDate = new Date();  // Şu anki tarih

  // Hedef tarih ile şu anki tarih arasındaki farkı milisaniye cinsinden hesapla
  const differenceInMilliseconds = targetDate.getTime() - currentDate.getTime();

  // Milisaniyeyi dakikaya çevirmek için 1000 (saniye) * 60 (dakika) ile bölüyoruz
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
  const { user } = useUser(); // useUser hook'unu kullanıyoruz
  const userId = user?._id; // Kullanıcı ID'si


  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimAmount, setClaimAmount] = useState(0);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await fetch(`http://51.21.28.186:5001/api/bets/user/${userId}`);
        const data = await response.json();
        setBets(data.bets);
      } catch (error) {
        console.error('Error fetching bets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, []);  // Verileri yalnızca ilk renderda al

  useEffect(() => {
    // bets verisi değiştiğinde bu fonksiyon çalışacak
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


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
      <FlatList
        data={bets.filter(bet => bet.status === "ended")}
        keyExtractor={(_, index) => index.toString()} 
        renderItem={({ item }) => {
          // Her kart için kalan süreyi hesapla
          const remainingMinutes = getRemainingMinutes(item.endDate);

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
              
                {(item.participants.length>0) && (item?.participants?.find(p => p.user === userId) )&& 
                (item?.participants?.find(p => p.user === userId).choice!=item.result) &&
                (
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
                {(item.participants.length>0) && (item?.participants?.find(p => p.user === userId) )&& 
                (item?.participants?.find(p => p.user === userId).choice===item.result) &&(
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
            {(item.participants.length>0) && 
            (item?.participants?.find(p => p.user === userId) )&& 
            (item?.participants?.find(p => p.user === userId).choice===item.result) &&
            (item?.claimedBy.length>0) &&
            (item?.claimedBy.find(p => p.user === userId)) &&
            (
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claimed</Text>
                <TouchableOpacity style={styles.claimedButton}>
                  <Text style={styles.claimedText}>{}</Text>
                </TouchableOpacity>
              </View>
            )}
            {
            (item.participants.length>0) && 
            (item?.participants?.find(p => p.user === userId) )&& 
            (item?.participants?.find(p => p.user === userId).choice===item.result) &&
            (
              ((item?.claimedBy.length>0) &&
              (item?.claimedBy.find(p => p.user != userId))) ||
              (item?.claimedBy.length===0) 
            )&&
            (
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claim</Text>
                <TouchableOpacity style={styles.claimButton}>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Hafif transparan arka plan
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', // Kenarlık ekledim
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
  }
});