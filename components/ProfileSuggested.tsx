import React, {useState} from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput } from 'react-native';

const exampleData = [
  {
    id: '1',
    title: 'User1',
    image: require('@/assets/images/user4.png'),
    claimAmount: '10 USDC',
    percent: '50,534',
    claim: true,
    result : false,
  },
  {
    id: '2',
    title: 'User2',
    image: require('@/assets/images/latte.jpeg'),
    claimAmount: '10 USDC',
    percent: '50,534',
    claim: false,
    result : true,
  },
  
];

export default function ProfileSuggested() {
  const [search, setSearch] = useState('');
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.wonText}>40 Friends</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
              <Image source={require('@/assets/images/user-plus.png')} style={{ width: 16, height: 16, marginRight:4 }} />  
              <Text style={{color:"#fff", fontSize:12, fontWeight:400, marginRight:30}}>Add</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Image source={require('@/assets/images/search.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder=""
            placeholderTextColor="#ccc"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
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
    marginBottom: 2,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 30,
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
    marginBottom: 5,
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
  searchBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: '30%',
    width: '45%',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    paddingVertical: 5,
  }
});
