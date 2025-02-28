import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/elon.png'),
    image2: require('@/assets/images/alp.png'),
    claimPersonNumber: '10',
    claim: true,
    invitePerson: "Alptoksoz",
    result : "Pending",
  },
  
];

export default function ForthRoute() {
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
                <View style={styles.userContainer}>
                  <Image source={require('@/assets/images/alarm.png')} style={{ width: 18, height: 18, marginBottom:3 }} />
                  <Text style={styles.userText}>Time is Up. Enter the Winner!</Text>
                </View>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.actions}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('@/assets/images/users2.png')} style={{ width: 16, height: 16, }} />
                    <Text style={styles.claimPersons}> {item.claimPersonNumber} Members</Text>
                    <Image source={require('@/assets/images/gavel.png')} style={{ width: 16, height: 16, marginRight:2 }} />
                    <Text style={styles.claimPersons}>Ended</Text>
                  </View>
              </View>
            </View>
              <View style={styles.claimContainer}>
                <View style={styles.claimedButton}>
                  <Text style={styles.claimedText}>Enter Result</Text>
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
    marginBottom: 10,
  },
  profileImage: {
    width: 84,
    height: 84,
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
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  yesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    padding: 6,
    marginRight: 10,
  },
  yesText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#fff',
    marginLeft: 4,
  },
  claimPersons: {
    fontSize: 12,
    color: '#fff',
    marginRight: 6,
  },
  statText: {
    fontSize: 12,
    color: '#ddd',
    marginRight: 12,
  },
  claimContainer: {
    alignItems: 'center',
    flexDirection: 'row',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 14,
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
    color: '#fff',
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
    userText: {
    fontSize: 12,
    color: '#ddd',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    width: 84,
    height: 84,
  },
  
  overlay: {
    position: 'absolute',
    bottom: 8, // Altta durmasını sağlıyor
    left: '42%',
    transform: [{ translateX: -30 }], // Ortalamak için
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  
  overlayIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  
  overlayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});
