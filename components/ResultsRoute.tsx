import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/elon.png'),
    claimAmount: '10 USDC',
    claim: true,
    result : false,
  },
  {
    id: '2',
    title: 'Elon Musk out as Head of DOGE before July?',
    image: require('@/assets/images/latte.jpeg'),
    claimAmount: '10 USDC',
    claim: false,
    result : true,
  },
  
];

export default function SecondRoute() {
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
                {item.result && (
                  <View style={styles.yesButton}>
                    <Image source={require('@/assets/images/thumb-up.png')} style={{ width: 16, height: 16 }} />
                    <Text style={styles.yesText}>YES</Text>
                  </View>
                )}
                {!item.result && (
                  <View style={styles.yesButton}>
                    <Image source={require('@/assets/images/thumb-down.png')} style={{ width: 16, height: 16 }} />
                    <Text style={styles.yesText}>NO</Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('@/assets/images/mood-suprised.png')} style={{ width: 16, height: 16 }} />
                  <Text style={styles.wonText}> Won</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16, marginRight:2 }} />
                  <Text style={styles.statText}>50K</Text>
                </View>
                <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16 }} />
              </View>
            </View>
          
            {!item.claim && (
              <View style={styles.claimContainer}>
                <Text style={styles.claimLabel}>Claim</Text>
                <TouchableOpacity style={styles.claimButton}>
                  <Text style={styles.claimText}>{item.claimAmount}</Text>
                </TouchableOpacity>
              </View>
            )}
            {item.claim && (
              <View style={styles.claimContainer}>
                <View style={styles.claimedButton}>
                  <Text style={styles.claimedText}>Claimed</Text>
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
    width: 84,
    height: 84,
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
    color: '#ddd',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#ddd',
    marginRight: 12,
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
});
