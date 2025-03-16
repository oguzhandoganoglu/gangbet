import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native'; 
import { useUser } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import ProfileBets from '@/components/ProfileBets';
import ProfileFriends from '@/components/ProfileFriends';
import ProfileGangs from '@/components/ProfileGangs';
import Navbar from '@/components/Navbar';
import NavbarNotificaiton from '@/components/NavbarNotification';

const friend = {
  id: '2', 
  name: 'Mehmet Demir', 
  photoUrl: "https://media.licdn.com/dms/image/v2/D4D12AQEBWX-CTbuenQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1720729957965?e=2147483647&v=beta&t=KEE8zC0coVUnh8LA4I2DULzewVjUHJrXu_b1VSZh2b8", 
  lastActive: '5 min ago', 
  friendsCount: "25", 
  totalBets: "45"
};

// Örnek veri setleri
const exampleBets = [
  {
    id: '1',
    title: 'Bitcoin will reach $100k by end of 2025',
    photoUrl: 'https://tinderapp-bet-images.s3.eu-north-1.amazonaws.com/bet-photos/1740813122515.jpg',
    channelName: 'Crypto Predictions',
    userChoice: 'yes',
    amount: 50,
    endDate: new Date(Date.now() + 86400000 * 30).toISOString() // 30 gün sonra
  },
  {
    id: '2',
    title: 'Tesla will release a new model this year',
    photoUrl: 'https://tinderapp-bet-images.s3.eu-north-1.amazonaws.com/bet-photos/1740813122515.jpg',
    channelName: 'Tech News',
    userChoice: 'no',
    amount: 25,
    endDate: new Date(Date.now() + 86400000 * 15).toISOString() // 15 gün sonra
  },
  {
    id: '3',
    title: 'Turkey will win Eurovision 2025',
    photoUrl: 'https://tinderapp-bet-images.s3.eu-north-1.amazonaws.com/bet-photos/1740813122515.jpg',
    channelName: 'Entertainment',
    userChoice: 'yes',
    amount: 35,
    endDate: new Date(Date.now() + 86400000 * 60).toISOString() // 60 gün sonra
  }
];

const exampleFriends = [
  { id: '1', username: 'Ahmet Yılmaz' },
  { id: '2', username: 'Zeynep Öztürk' },
  { id: '3', username: 'Fatma Çelik' },
  { id: '4', username: 'Mustafa Şahin' }
];

const exampleGroups = [
  { id: '1', name: 'Crypto Enthusiasts', membersCount: 34 },
  { id: '2', name: 'Sports Bettors', membersCount: 56 },
  { id: '3', name: 'Tech Predictions', membersCount: 28 }
];

// Özel tab render fonksiyonları
const BetsRoute = () => (
  <ProfileBets data={exampleBets} />
);

const FriendsRoute = () => {
  // Özel bir FriendsList bileşeni oluşturmak için
  const CustomFriendsList = ({ data }) => {
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={require('@/assets/images/user4.png')}
                style={styles.profileImage}
              />
              <View style={styles.content}>
                <Text style={styles.title}>{item.username}</Text>
                <View style={styles.actions}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.wonText}>Friends</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  return <CustomFriendsList data={exampleFriends} />;
};

const GroupsRoute = () => (
  <ProfileGangs data={exampleGroups} />
);

// Özel SceneMap oluşturma
const renderScene = SceneMap({
  bets: BetsRoute,
  friends: FriendsRoute,
  groups: GroupsRoute,
});

export default function SwippingScreen() {
 const { userId } = useLocalSearchParams();
     const navigation = useNavigation();
     const { user } = useUser();
 
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
 
     const [index, setIndex] = useState(0);
     const [routes] = useState([
       { key: 'bets', title: 'Bets' },
       { key: 'friends', title: 'Friends' },
       { key: 'groups', title: 'Groups' },
     ]);
 
     interface Notification {
         id: number;
         bet: string;
         sender: string;
         avatar?: string;
         content?: string;
         time: string;
         groupId: number | null;
         groupName?: string;
     }
 
     interface Route {
         key: string;
         title: string;
     }
 
     interface Friend {
         id: string;
         name: string;
         photoUrl: string;
         lastActive: string;
         friendsCount: string;
         totalBets: string;
     }
     
     const handleLogout = () => {
         // Implement logout functionality here
         // For example:
         // logout();
         // navigation.navigate('Login');
         alert('Logging out...');
     };
 
     const renderTabBar = (props: any) => (
         <TabBar
             {...props}
             indicatorStyle={{ backgroundColor: 'white' }}
             style={{ backgroundColor: 'transparent' }}
             labelStyle={{ color: 'white', fontSize: 12 }}
         />
     );
 
     if (error) {
         return (
             <LinearGradient
                 colors={['#161638', '#714F60', '#B85B44']}
                 style={styles.errorContainer}
                 start={{ x: 0, y: 0 }}
                 end={{ x: 1, y: 1 }}
             >
                 <Text style={styles.errorText}>{error}</Text>
                 <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
                     <Text style={styles.retryButtonText}>Retry</Text>
                 </TouchableOpacity>
             </LinearGradient>
         );
     }
 
     return (
       <LinearGradient
         colors={['#161638', '#714F60', '#B85B44']}
         style={styles.container}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 1 }}
       >
         <SafeAreaView style={styles.safeArea}>
             <View style={styles.content}>
                 <NavbarNotificaiton />
                 <View style={styles.headerContainer}>
                     <View style={styles.headerRow}>
                         <Image style={styles.gangImage} source={{ uri: friend.photoUrl || 'https://via.placeholder.com/65' }}  />
                         <Text style={styles.gangName}>{friend.name}</Text>
                     </View>
                     <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Logout</Text>
                     </TouchableOpacity>
                 </View>
                 
                 <View style={styles.statsContainer}>
                     <View style={styles.statItem}>
                         <Image source={require('@/assets/images/users2.png')} style={styles.statIcon} />
                         <Text style={styles.statText}>{friend.friendsCount}</Text>
                     </View>
                     <View style={styles.statItem}>
                         <Image source={require('@/assets/images/gavel.png')} style={styles.statIcon} />
                         <Text style={styles.statText}>{friend.totalBets} Bets</Text>
                     </View>
                 </View>
                
 
                 <TabView
                     navigationState={{ index, routes }}
                     renderScene={renderScene}
                     onIndexChange={setIndex}
                     initialLayout={{ width: Dimensions.get('window').width }}
                     renderTabBar={renderTabBar}
                     style={styles.tabView}
                 />
             </View>
         </SafeAreaView>
       </LinearGradient>
     );
 }
 
 const styles = StyleSheet.create({
     safeArea: {
         flex: 1,
     },
     container: {
         flex: 1,
     },
     content: {
         flex: 1,
         backgroundColor: 'transparent',
     },
     errorContainer: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         padding: 20,
     },
     errorText: {
         color: '#fff',
         fontSize: 18,
         marginBottom: 20,
         textAlign: 'center',
     },
     retryButton: {
         backgroundColor: 'rgba(255, 255, 255, 0.2)',
         paddingVertical: 12,
         paddingHorizontal: 24,
         borderRadius: 8,
     },
     retryButtonText: {
         color: 'white',
         fontSize: 16,
         fontWeight: '500',
     },
     headerContainer: {
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'space-between',
         paddingHorizontal: 20,
         paddingBottom: 20,
         paddingTop: 0,
     },
     headerRow: {
         flexDirection: 'row',
         alignItems: 'center',
         flex: 1,
     },
     backButton: {
         position: 'absolute',
         top: 20,
         left: 20,
         zIndex: 10,
         backgroundColor: 'rgba(255, 255, 255, 0.2)',
         borderRadius: 20,
         padding: 8,
     },
     backIcon: {
         width: 16,
         height: 16,
         tintColor: 'white',
     },
     gangImage: {
         width: 65,
         height: 65,
         borderRadius: 30,
     },
     gangName: {
         color: 'white',
         fontWeight: '700',
         fontSize: 24,
         marginLeft: 10,
         marginRight: 10,
     },
     logoutButton: {
         paddingHorizontal: 15,
         paddingVertical: 8,
         borderRadius: 15,
         backgroundColor: 'rgba(255, 255, 255, 0.2)',
     },
     logoutText: {
         color: 'white',
         fontWeight: '500',
         fontSize: 14,
     },
     statsContainer: {
         flexDirection: 'row',
         paddingHorizontal: 20,
         marginBottom: 15,
     },
     statItem: {
         flexDirection: 'row',
         alignItems: 'center',
         marginRight: 20,
     },
     statIcon: {
         width: 16,
         height: 16,
         tintColor: 'white',
     },
     statText: {
         color: '#fff',
         fontSize: 12,
         fontWeight: '400',
         marginLeft: 5,
     },
     loadingContainer: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
     },
     loadingText: {
         color: 'white',
         fontSize: 16,
         textAlign: 'center',
     },
     tabView: {
         flex: 1,
         backgroundColor: 'transparent',
     },
     tabContent: {
         flex: 1,
         alignItems: 'center',
         justifyContent: 'center',
         backgroundColor: 'transparent',
     },
     tabText: {
         color: 'white',
         fontSize: 16,
     },
     buttonContainer: {
         flexDirection: 'row',
         justifyContent: 'center',
         alignItems: 'center',
         marginBottom: 15,
         paddingHorizontal: 20,
     },
     actionButton: {
         paddingHorizontal: 12,
         paddingVertical: 6,
         borderRadius: 15,
         backgroundColor: 'rgba(255, 255, 255, 0.2)',
         marginHorizontal: 8,
     },
     // ProfileFriends özel stil tanımları
     card: {
         flexDirection: 'row',
         alignItems: 'center',
         backgroundColor: 'rgba(255, 255, 255, 0.1)',
         borderRadius: 2,
         padding: 20,
         marginBottom: 2,
     },
     profileImage: {
         width: 36,
         height: 36,
         borderRadius: 30,
         marginRight: 10,
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
     wonText: {
         fontSize: 12,
         color: '#ddd',
         marginRight: 12,
     },
 });