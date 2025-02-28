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

export default function GangDetailScreen() {
    const { gangId } = useLocalSearchParams();
    const navigation = useNavigation();
    const { user } = useUser();
    const userId = user?._id;
    const [gangDetail, setGangDetail] = useState({
        gangImage: '',
        name: '',
        members: [],
        gangBets: 0,
        volume: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const response = await fetch(`http://51.21.28.186:5001/api/pages/groups/detail/${gangId}/${userId}`);
                const data = await response.json();
                setGangDetail(data.group);
                console.log(data);
            } catch (error) {
                console.error("Error fetching bets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBets();
    }, [gangId]);

    const [index, setIndex] = useState(1);
    const [routes] = useState([
      { key: 'first', title: 'Active Bets |' },
      { key: 'second', title: 'All Bets' },
      { key: 'third', title: 'Members' },
      { key: 'forth', title: 'Settings' },
    ]);

    // Fonksiyonel renderScene
    const renderScene = ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case 'first':
          return <GangActiveBets />;
        case 'second':
          return <GangAllBets gangId={Array.isArray(gangId) ? gangId[0] : gangId} />; // Burada "All Bets" sekmesine gangId geçiyoruz
        case 'third':
          return <GangMembers />;
        case 'forth':
          return <GangSettings />;
        default:
          return null;
      }
    };

    if (!gangDetail) {
        return (
        <View>
            <Text>Gang not found</Text>
        </View>
        );
    }

    return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('@/assets/images/back.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal:20, paddingBottom:20, paddingTop: 60}}>
            <View style={{flexDirection: 'row', flex: 1}}>
                <Image style={styles.gangImage} source={require('@/assets/images/alp.png')}  />
                <Text style={styles.gangName}>{gangDetail.name}</Text>
                <Image source={require('@/assets/images/qrcode.png')} style={{width:24, height:24}} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <Image source={require('@/assets/images/logout.png')} style={{width:24, height:24}} />
            </View>
        </View>
        <View style={{flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15}}>
            <Image source={require('@/assets/images/users2.png')} style={{width: 16, height: 16,}} />
            <Text style={styles.subtext}>{gangDetail.members.length} User</Text>
            <Image source={require('@/assets/images/gavel.png')} style={{width: 16, height: 16,}} />
            <Text style={styles.subtext}>4 Bets</Text>
        </View>

        {loading ? (
            <Text style={styles.loadingText}>Loading bets...</Text>
        ) : (
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={props => <TabBarComponent {...props} />}
              />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E4C',    
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    gangImage: {
        width: 51,
        height: 51,
        borderRadius: 30,
    },
    gangName: {
        color: 'white',
        fontWeight: 700,
        fontSize: 24,
        marginLeft: 10,
        marginRight: 10,
    },
    subtext: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 400,
        marginLeft: 5,
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    }
});
