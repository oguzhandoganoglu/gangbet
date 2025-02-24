import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GangDetailScreen() {
  const { gangId } = useLocalSearchParams();
  
  const managedData = [
    { id: 1, gangName: "RKOS", gangImage: require('@/assets/images/elon.png'), gangMembers: 5, gangBets: 10, volume: "40K"},
    { id: 2, gangName: "06ankaralilar", gangImage: require('@/assets/images/latte.jpeg'), gangMembers: 5, gangBets: 10, volume: "40K" },
    { id: 3, gangName: "RKOS", gangImage: require('@/assets/images/yamanalp.png'), gangMembers: 5, gangBets: 10, volume: "40K" },
  ];

  // gangId'ye göre veriyi bul
  const gangDetails = managedData.find(gang => gang.id === Number(gangId));

  if (!gangDetails) {
    return (
      <View >
        <Text>Gang not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal:20, paddingVertical: 20}}>
            <View style={{flexDirection: 'row', flex: 1}}>
                <Image style={styles.gangImage} source={gangDetails.gangImage}  />
                <Text style={styles.gangName}>{gangDetails.gangName}</Text>
                <Image source={require('@/assets/images/qrcode.png')} style={{width:24, height:24}} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <Image source={require('@/assets/images/logout.png')} style={{width:24, height:24}} />
            </View>
        </View>
        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
            <Image source={require('@/assets/images/users2.png')} style={{width: 16, height: 16,}} />
            <Text style={styles.subtext}>{gangDetails.gangMembers} User</Text>
            <Image source={require('@/assets/images/gavel.png')} style={{width: 16, height: 16,}} />
            <Text style={styles.subtext}>{gangDetails.gangBets} Bets</Text>
            <Image source={require('@/assets/images/chart-line.png')} style={{width: 16, height: 16,}} />
            <Text style={styles.subtext}>{gangDetails.volume} Volume</Text>
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2E2E5E',    
    },
    gangImage: {
        width: 31,
        height: 31,
        borderRadius: 15,
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
    }
});
