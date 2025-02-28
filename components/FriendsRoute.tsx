import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useUser } from "../app/UserContext";



const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    user: 'Alptoksoz traded YES',
    image: require('@/assets/images/elon.png'),
    image2: require('@/assets/images/alp.png'),
    invite: true,
    invitePerson: 'Alptoksoz',
  },
  {
    id: '2',
    title: 'Bitcoin hits 50k mark again!',
    user: 'CryptoGuy traded YES',
    image: require('@/assets/images/elon.png'),
    image2: require('@/assets/images/alp.png'),
    invite: false,
    invitePerson: null,
  },
];



export default function SecondRoute() {
  interface Friends {
    id: string;
    username: string;
    email: string;
  }
  const { user } = useUser(); // useUser hook'unu kullanıyoruz
  const userId = user?._id; // Kullanıcı ID'si


  const [bets, setBets] = useState<any[]>([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendsBets = async () => {
      try {
        // 1️⃣ Kullanıcının arkadaşlarını çek
        const friendsResponse = await fetch(`http://51.21.28.186:5001/api/friends/list/${userId}`);
        console.log("Friends Response Status:", friendsResponse.status); // HTTP durum kodunu kontrol et
        const friendsText = await friendsResponse.text();
        console.log("Friends Response Text:", friendsText); // API'nin döndürdüğü ham yanıtı yazdır
    
        // JSON'a çevirmeye çalışmadan önce kontrol edelim
        try {
          var friendsData = JSON.parse(friendsText);
        } catch (jsonError) {
          console.error("Friends JSON Parse Hatası:", jsonError);
          return;
        }
    
        console.log("Friends Data:", friendsData);
    
        if (!friendsData || !friendsData.friends || friendsData.friends.length === 0) {
          setLoading(false);
          return;
        }
    
        const friendsList = friendsData.friends.map((f) => ({
          id: f._id,
          username: f.username,
          image: null,
        }));
    
        setFriends(friendsList);
    
        // 2️⃣ Arkadaşların katıldığı betleri çek
        const betsPromises = friendsList.map(async (friend: { id: any; username: any; }) => {
          const betResponse = await fetch(`http://51.21.28.186:5001/api/bets/user/${friend.id}`);
          console.log(`Bet Response for ${friend.username} (Status: ${betResponse.status}):`, betResponse);
    
          const betText = await betResponse.text();
          console.log("Bet Response Text:", betText); // API'nin yanıtını kontrol et
    
          // JSON Parse hata verirse kod kırılmasın
          try {
            var friendBets = JSON.parse(betText);
          } catch (jsonError) {
            console.error("Bet JSON Parse Hatası:", jsonError);
            return []; // Boş bir dizi döndür
          }
    
          // Check if the response is an array
          if (Array.isArray(friendBets)) {
            return friendBets.map((bet) => ({ ...bet, participant: friend }));
          } else {
            console.warn(`Invalid bets data for ${friend.username}`, friendBets);
            return []; // Return an empty array if the data is not an array
          }
        });
    
        const allBets = await Promise.all(betsPromises);
        setBets(allBets.flat());
    
      } catch (error) {
        console.error("Betleri çekerken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };
    
    

    fetchFriendsBets();
  }, [userId]);

  // Arkadaşın adını ve profil fotoğrafını bul
  const getFriendInfo = (friendId: any) => {
    const friend = friends.find((f) => f.id === friendId);
    return friend ? friend : { name: "Unknown", image: null };
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E4C' }}>
       {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
      <FlatList
        data={friends}
        keyExtractor={(_, index) => index.toString()} 
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            {/* Hafif beyaz tabaka */}
            <View style={styles.whiteOverlay} />
            
            {/* Asıl içerik */}
            <View style={styles.cardContent}>
              <Image source={item.image} style={styles.profileImage} />
              {!item.invite && (
                
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.userContainer}>
                  <Image source={item.image2} style={styles.profileImage2} />
                  <Text style={styles.userText}>{item.user}</Text>
                </View>
                <View style={styles.iconsContainer}>
                  <View style={styles.iconItem}>
                    <Image source={require('@/assets/images/hourglass.png')} style={{ width: 16, height: 16 }} />
                    <Text style={styles.iconText}>7D Left</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16 }} />
                    <Text style={styles.iconText}>50K</Text>
                  </View>
                  <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                  <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                  <Image source={require('@/assets/images/star.png')} style={{ width: 16, height: 16}} />
                </View>
              </View>
              )}
              {item.invite && (
                
                <View style={styles.textContainer}>
                  <View style={styles.userContainer}>
                    <Image source={item.image2} style={styles.profileImage2} />
                    <Text style={styles.userText}>{item.invitePerson} Inveted You</Text>
                  </View>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.iconsContainer}>
                    <View style={styles.iconItem}>
                      <Image source={require('@/assets/images/hourglass.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.iconText}>7D Left</Text>
                    </View>
                    <View style={styles.iconItem}>
                      <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.iconText}>50K</Text>
                    </View>
                    <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                    <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                    <Image source={require('@/assets/images/star.png')} style={{ width: 16, height: 16}} />
                  </View>
                </View>
                )}
            </View>
          </View>
        )}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    borderRadius: 0,
    marginBottom: 2,
    overflow: 'hidden',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 0,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 4,
    marginRight: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  profileImage2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  userText: {
    fontSize: 14,
    color: '#ddd',
    fontWeight: '600',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 4,
  },
  iconText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 2,
    marginTop: 2,
  },
  icon: {
    marginRight: 10,
  },
});