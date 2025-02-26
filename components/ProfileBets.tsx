import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/elon.png'),
    user: 'Alptoksoz Created New Bet!',
    percent: '50,534',
    claim: true,
    result : "Begin",
  },
  {
    id: '2',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    user: 'Alptoksoz Has Resulted the Bet',
    percent: '50,534',
    claim: false,
    result : "Pending",
  },
];

export default function ProfileBets() {
  return (
    <View style={styles.container}>
      <FlatList
        data={exampleData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.profileImage} />
            </View>
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
                {(item.result === "Begin") && (
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                      <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16, marginRight:1, marginLeft:10 }} />
                      <Text style={styles.percent}>%40</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={require('@/assets/images/hourglass.png')} style={{ width: 16, height: 16, marginRight:1, marginLeft:10 }} />
                      <Text style={styles.percent}>1H Left</Text>
                    </View>
                  </View>
                )}
                {(item.result === "Pending") && (
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                      <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage2} />
                      <Text style={styles.percent}>%40 (2.5x)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                      <Image source={require('@/assets/images/alert-circle.png')} style={{ width: 16, height: 16, marginRight:2 }} />
                      <Text style={styles.percent}>Waiting</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                      <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginRight:2 }} />
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    padding: 10,
    marginBottom: 1,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10,
  },
  content: {
    flex: 1,
    marginLeft: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 60,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  percent: {
    fontSize: 12,
    fontWeight: 400,
    color: '#FEFEFE',
  },
  imageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  overlay: {
    position: 'absolute',
    bottom: 8,
    left: '60%',
    transform: [{ translateX: -30 }],
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  overlayIcon: {
    width: 16,
    height: 16,
    marginRight: 2,
  },
  overlayText: {
    fontSize: 8,
    fontWeight: 700,
    color: '#000',
    paddingTop: 3
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
