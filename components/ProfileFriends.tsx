import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../app/UserContext';
import axios from 'axios';

// API veri tipi
interface FriendData {
  id: string;
  username: string;
}

interface ProfileFriendsProps {
  data: FriendData[];
}

export default function ProfileFriends({ data = [] }: ProfileFriendsProps) {
  const [search, setSearch] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const { user } = useUser();

  // Arama filtresi uygula
  const filteredData = data.filter(friend =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendFriendRequest = async () => {
    if (!user || !user._id || !friendSearch) {
      Alert.alert('Error', 'Please enter a valid username');
      return;
    }

    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await axios.post(`${baseUrl}/api/friends/add`, {
        userId: user._id,
        friendId: friendSearch
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      Alert.alert('Success', response.data.message);
      setFriendSearch(''); // Clear the search input after successful request
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send friend request');
    }
  };

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No friends found</Text>
        <View style={styles.addFriendContainer}>
        <View style={styles.searchBar}>
          <Image source={require('@/assets/images/search.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter friend's user ID"
            placeholderTextColor="#ccc"
            value={friendSearch}
            onChangeText={setFriendSearch}
          />
          <TouchableOpacity onPress={handleSendFriendRequest} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchBarContainer}>
      </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={require('@/assets/images/user4.png')}
              style={styles.profileImage}
            />
            <View style={styles.content}>
              <Text style={styles.title}>{item.username}</Text>
              <View style={styles.actions}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.wonText}>Friends</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('@/assets/images/bell-off.png')} style={{ width: 16, height: 16, marginRight:2 }} />
              <Image source={require('@/assets/images/user-minus.png')} style={{ width: 16, height: 16, marginRight:4 }} />
              <Text style={{color:"#fff", fontSize:12, fontWeight:'400'}}>Remove</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.addFriendContainer}>
        <View style={styles.searchBar}>
          <Image source={require('@/assets/images/search.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter friend's user ID"
            placeholderTextColor="#ccc"
            value={friendSearch}
            onChangeText={setFriendSearch}
          />
          <TouchableOpacity onPress={handleSendFriendRequest} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchBarContainer}>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
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
  wonText: {
    fontSize: 12,
    color: '#ddd',
    marginRight: 12,
  },
  addFriendContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: '25%',
    width: '50%',
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
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
  }
});