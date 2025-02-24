import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/elon.png'),
    claimAmount: '10 USDC',
    claim: true,
    result : "Pending",
    percent : '50,534',
  },
  {
    id: '2',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    claimAmount: '10 USDC',
    claim: false,
    result : "Ended",
    percent : '50,534',
  },
  {
    id: '3',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    claimAmount: '10 USDC',
    claim: true,
    result : "Won",
    percent : '50,534',
  },
  {
    id: '4',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/elon.png'),
    claimAmount: '10 USDC',
    claim: true,
    result : "Lost",
    percent : '50,534',
  },
  {
    id: '5',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    claimAmount: '10 USDC',
    claim: false,
    result : "Won",
    percent : '50,534',
  },
  
];

export default function GangActiveBets() {
  return (
    <View style={styles.container}>
      <FlatList
        data={exampleData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.profileImage} />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.actions}>
                <View style={styles.percentCard}>
                  <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
                    <View style={styles.percentText}>
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400}}>YES</Text>
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400}}> {item.percent}</Text>
                 </View>
                </View>
                {(item.result==="Lost")&& (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, tintColor:"white" }} />
                      <Text style={styles.wonText}> %40</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/ghost.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.wonText}> Lost!</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.statText}>50K</Text>
                    </View>
                    <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginLeft:18 }} />
                    <Image source={require('@/assets/images/star.png')} style={{ width: 16, height: 16, marginLeft:6 }} />
                  </View>
                )}
                {(item.result==="Won")&& (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, tintColor:"white" }} />
                      <Text style={styles.wonText}> %40</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/mood-suprised.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.wonText}> Won</Text>
                    </View>
                    <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16, marginLeft:8 }} />
                  </View>
                )}
                {(item.result==="Pending")&& (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, tintColor:"white" }} />
                      <Text style={styles.statText}> %40</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/hourglass.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.statText}>30M Left</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.statText}>50K</Text>
                    </View>
                    <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginLeft:12 }} />
                    <Image source={require('@/assets/images/star.png')} style={{ width: 16, height: 16, marginLeft:6 }} />
                  </View>
                )}
                {(item.result==="Ended")&& (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, tintColor:"white" }} />
                      <Text style={styles.statText}> %40</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/gavel.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.statText}>Ended</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 4 }}>
                      <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.statText}>50K</Text>
                    </View>
                    <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginLeft:12 }} />
                    <Image source={require('@/assets/images/star.png')} style={{ width: 16, height: 16, marginLeft:6 }} />
                  </View>
                )}
              </View>
            </View>
            {(item.claim) && (item.result==="Won") && (
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claimed</Text>
                <TouchableOpacity style={styles.claimedButton}>
                  <Text style={styles.claimedText}>{item.claimAmount}</Text>
                </TouchableOpacity>
              </View>
            )}
            {(!item.claim) && (item.result==="Won") && (
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claim</Text>
                <TouchableOpacity style={styles.claimButton}>
                  <Text style={styles.claimText}>{item.claimAmount}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
        {/* "See All" Butonu */}
      <TouchableOpacity style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E4C',
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
    fontWeight: 'semibold',
    marginLeft: 2,
  },
  wonText: {
    fontSize: 12,
    fontWeight: 400,
    color: '#ddd',
  },
  statText: {
    fontSize: 12,
    fontWeight: 400,
    color: '#ddd',
  },
  claimContainer: {
    alignItems: 'center',
  },
  claimLabel: {
    fontSize: 13,
    fontWeight: 'semibold',
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
    fontWeight: 'semibold',
    color: '#fff',
  },
  claimText: {
    fontSize: 12,
    fontWeight: 'semibold',
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
    fontWeight: 'semibold',
    color: '#fff',
    textAlign: 'center',
  },  
  percentCard : {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor:"#D6D6D673", 
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
