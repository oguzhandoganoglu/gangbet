import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TabView } from 'react-native-tab-view';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; 
import GangActiveBets from '@/components/GangActiveBets';
import GangAllBets from '@/components/GangAllBets';
import GangMembers from '@/components/GangMembers';
import GangSettings from '@/components/GangSettings';
import TabBarComponent from '@/components/TabBarComponent';
import { useUser } from "../UserContext";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function GangDetailScreen() {
    const { gangId } = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const userId = user?._id;
    const [gangDetail, setGangDetail] = useState({
        name: '',
        description: '',
        members: [],
        admins: [],
        channels: [],
        activeBetsCount: 0,
        isUserAdmin: false,
        isUserMember: false,
        createdBy: '',
        createdAt: ''
    });
    const [groupBets, setGroupBets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGroupDetailData();
    }, [gangId]);

    const fetchGroupDetailData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://51.21.28.186:5001/api/pages/groups/detail/${gangId}/${userId}`);
            const data = response.data;
            
            setGangDetail(data.group);
            setGroupBets(data.groupBets || []);
            
            console.log("Group detail data:", data);
        } catch (error) {
            console.error("Error fetching group details:", error);
            setError("Failed to load group details");
        } finally {
            setLoading(false);
        }
    };

    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'first', title: 'Active Bets |' },
      { key: 'second', title: 'All Bets' },
      { key: 'third', title: 'Members' },
      { key: 'forth', title: 'Settings' },
    ]);

    // Fonksiyonel renderScene - şimdi API'den gelen verileri ilgili bileşenlere iletiyoruz
    const renderScene = ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case 'first':
          // Aktif bahisleri filtrele (status: "active")
          const activeBets = groupBets.filter(bet => bet.status === "active");
          return <GangActiveBets bets={activeBets} isLoading={loading} />;
        case 'second':
          // Tüm bahisleri gönder
          return <GangAllBets bets={groupBets} gangId={gangId} isLoading={loading} />;
        case 'third':
          // Üyeleri gönder
          return <GangMembers members={gangDetail.members} admins={gangDetail.admins} isLoading={loading} />;
        case 'forth':
          // Ayarlar için grup bilgilerini gönder
          return <GangSettings gangDetail={gangDetail} isLoading={loading} isAdmin={gangDetail.isUserAdmin} />;
        default:
          return null;
      }
    };

    if (error) {
        return (
            <LinearGradient
                colors={['#161638', '#714F60', '#B85B44']}
                style={styles.errorContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchGroupDetailData}>
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
            {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image source={require('@/assets/images/back.png')} style={styles.backIcon} />
            </TouchableOpacity> */}
            <TouchableOpacity 
                      style={styles.backButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Image 
                        source={require('@/assets/images/arrow-back.png')} 
                        style={styles.backIcon} 
                      />
                    </TouchableOpacity>

            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <Image style={styles.gangImage} source={require('@/assets/images/alp.png')} />
                    <Text style={styles.gangName}>{gangDetail.name}</Text>
                    <Image source={require('@/assets/images/qrcode.png')} style={{width:24, height:24}} />
                </View>
                <View style={{marginLeft: 'auto'}}>
                    <Image source={require('@/assets/images/logout.png')} style={{width:24, height:24}} />
                </View>
            </View>
            
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Image source={require('@/assets/images/users2.png')} style={styles.statIcon} />
                    <Text style={styles.statText}>{gangDetail.members.length} User</Text>
                </View>
                <View style={styles.statItem}>
                    <Image source={require('@/assets/images/gavel.png')} style={styles.statIcon} />
                    <Text style={styles.statText}>{gangDetail.activeBetsCount} Bets</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : (
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={props => <TabBarComponent {...props} />}
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        paddingTop: 60,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: 'white',
    },
    gangImage: {
        width: 51,
        height: 51,
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
    }
});