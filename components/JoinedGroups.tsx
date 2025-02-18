import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const exampleData = [
  {
    id: '1',
    title: 'PKOS',
    users: '7 User',
    bets: '10 Bet',
    image: require('@/assets/images/latte.jpeg'), // Profil Resmi Yolu
  },
  {
    id: '2',
    title: 'Crypto Club',
    users: '15 User',
    bets: '20 Bet',
    image: require('@/assets/images/alp.png'), // Profil Resmi Yolu
  },
];

export default function JoinedGroups() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E4C' }}>
      <FlatList
        data={exampleData}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
              <Image source={item.image} style={styles.profileImage} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.row}>
                  <View style={styles.userContainer}>
                    <Icon name="users" size={14} color="#ddd" />
                    <Text style={styles.userText}>{item.users}</Text>
                  </View>
                  <View style={styles.iconsRow}>
                    <Icon name="share" size={14} color="#ddd" style={styles.icon} />
                    <Icon name="bell-slash" size={14} color="#ddd" style={styles.icon} />
                    <Icon name="file" size={14} color="#ddd" style={styles.icon} />
                  </View>
                  <Text style={styles.bets}>{item.bets}</Text>
                </View>
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
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    fontSize: 14,
    color: '#ddd',
    marginLeft: 5,
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  bets: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});