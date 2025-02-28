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
  {
    id: '2',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    image2: require('@/assets/images/alp.png'),
    user: 'Alptoksoz Has Resulted the Bet',
    claimPersonNumber: '10',
    invitePerson: 'Alptoksoz',
    choose: "YES",
    claim: true,
    result : "Result",
  },
  {
    id: '3',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    image2: require('@/assets/images/alp.png'),
    user: 'Alptoksoz Has Resulted the Bet',
    claimPersonNumber: '10',
    invitePerson: 'Alptoksoz',
    choose: "NO",
    claim: true,
    result : "Result",
  },
  {
    id: '4',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    image2: require('@/assets/images/alp.png'),
    user: 'Alptoksoz Has Resulted the Bet',
    claimPersonNumber: '10',
    invitePerson: 'Alptoksoz',
    claim: false,
    result : "Begin",
  },
  
];

export default function ThirdRoute() {
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
              {(item.result==="Begin") && (!item.claim) && (
                <View style={styles.userContainer}>
                  <Image source={item.image2} style={styles.profileImage2} />
                  <Text style={styles.userText}>{item.invitePerson} Invited You</Text>
                </View>
              )}
              {(item.result==="Pending") && (
                <View style={styles.userContainer}>
                  <Image source={require('@/assets/images/alarm.png')} style={{ width: 18, height: 18, marginBottom:3 }} />
                  <Text style={styles.userText}>Time is Up. Waiting for Admin!</Text>
                </View>
              )}
              {(item.result==="Result") && (
                <View style={styles.userContainer}>
                  <Image source={item.image2} style={styles.profileImage2} />
                  <Text style={styles.userText}>{item.invitePerson} Has Resulted the Bet</Text>
                </View>
              )}
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.actions}>
                {(item.result==="Begin") && (!item.claim) && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('@/assets/images/users2.png')} style={{ width: 16, height: 16, }} />
                    <Text style={styles.claimPersons}> {item.claimPersonNumber} Members</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 14 }}>
                      <TouchableOpacity style={styles.yesButton}>
                        <Image source={require('@/assets/images/thumb-up.png')} style={{ width: 16, height: 16, tintColor:'white' }} />
                        <Text style={styles.yesText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.yesButton}>
                        <Image source={require('@/assets/images/thumb-down.png')} style={{ width: 16, height: 16, tintColor:'white' }} />
                        <Text style={styles.yesText}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                
                {(item.result==="Pending") && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('@/assets/images/users2.png')} style={{ width: 16, height: 16, }} />
                    <Text style={styles.claimPersons}> {item.claimPersonNumber} Members</Text>
                    <Image source={require('@/assets/images/alert-circle.png')} style={{ width: 16, height: 16, marginRight:2 }} />
                    <Text style={styles.claimPersons}>Waiting</Text>
                  </View>
                )}
                {(item.result==="Result") && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {(item.choose==="YES") && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 10, padding: 3, marginRight: 5 }}>
                        <Image source={require('@/assets/images/thumb-up.png')} style={{ width: 16, height: 16 }} />
                        <Text style={styles.claimPersons}>YES</Text>
                      </View>
                    )}
                    {(item.choose==="NO") && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 10, padding: 3, marginRight: 5 }}>
                        <Image source={require('@/assets/images/thumb-down.png')} style={{ width: 16, height: 16, }} />
                        <Text style={styles.claimPersons}>NO</Text>
                      </View>
                    )}
                    <Image source={require('@/assets/images/users2.png')} style={{ width: 16, height: 16, }} />
                    <Text style={styles.claimPersons}> {item.claimPersonNumber} Members</Text>
                    <Image source={require('@/assets/images/gavel.png')} style={{ width: 16, height: 16, marginRight:2 }} />
                    <Text style={styles.claimPersons}>Ended</Text>
                  </View>
                )}

              </View>
            </View>

            {((item.result==="Pending") || (item.result==="Result") )&& (
              <View style={styles.claimContainer}>
                <View style={styles.claimedButton}>
                  <Text style={styles.claimedText}>Result</Text>
                </View>
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
    backgroundColor: 'transparent',
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
    fontWeight: '400',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 14,
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
    fontWeight: '600',
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