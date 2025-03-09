import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native'; 
import { useUser } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';

const friend = {id:'2', name: 'Mehmet Demir', photoUrl: "https://media.licdn.com/dms/image/v2/D4D12AQEBWX-CTbuenQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1720729957965?e=2147483647&v=beta&t=KEE8zC0coVUnh8LA4I2DULzewVjUHJrXu_b1VSZh2b8", lastActive: '5 min ago', friendsCount:"25", totalBets:"45"}


const allNotifications = [
  { 
    id: 1, 
    bet:'Bu bir bet', 
    sender: 'Ahmet Yılmaz', 
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
    time: '2 saat önce',
    groupId: null
  },
  { 
    id: 2, 
    bet:'Bu bir bet',
    sender: 'Mehmet Demir', 
    content: 'Galatasaray vs Fenerbahçe maçı için bahis önerisi gönderdi',
    time: '3 saat önce',
    groupId: 1
  },
  { 
    id: 3, 
    bet:'Bu bir bet',
    sender: 'Ayşe Kaya', 
    groupName: 'Basketbol Grubu',
    time: '5 saat önce',
    groupId: 2
  },
  { 
    id: 4, 
    bet:'Bu bir bet',
    sender: 'Zeynep Öztürk', 
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
    time: '1 gün önce',
    groupId: null
  },
  { 
    id: 5, 
    bet:'Bu bir bet', 
    sender: 'Burak Yılmaz', 
    content: 'Real Madrid vs Barcelona maçı için bahis önerisi gönderdi',
    time: '1 gün önce',
    groupId: 3
  },
];


const BetsRoute = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabText}>Friends Content</Text>
  </View>
);

const FriendsRoute = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabText}>Friends Content</Text>
  </View>
);

const GroupsRoute = () => (
  <View style={styles.tabContent}>
    <Text style={styles.tabText}>Groups Content</Text>
  </View>
);

const renderScene = SceneMap({
  bets: BetsRoute,
  friends: FriendsRoute,
  groups: GroupsRoute,
});

export default function ProfileDetailScreen() {
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

    const renderTabBar = props => (
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
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image source={require('@/assets/images/back.png')} style={styles.backIcon} />
                    </TouchableOpacity>

                    <View style={styles.headerContainer}>
                        <View style={styles.headerRow}>
                            <Image style={styles.gangImage} source={{ uri: friend.photoUrl || 'https://via.placeholder.com/65' }}  />
                            <Text style={styles.gangName}>{friend.name}</Text>
                        </View>
                        <View>
                          <TouchableOpacity>
                            <Text style={{color:"white"}}>Remove</Text>
                          </TouchableOpacity>
                        </View>
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
        backgroundColor: 'transparent', // İçerik arka planını şeffaf yap
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
        paddingTop: 70,
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
        backgroundColor: 'transparent', // TabView arka planını şeffaf yap
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent', // Tab içeriği arka planını şeffaf yap
    },
    tabText: {
        color: 'white',
        fontSize: 16,
    },
});