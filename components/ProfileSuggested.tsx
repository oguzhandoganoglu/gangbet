import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useUser } from '../app/UserContext';

// API veri tipi
interface FriendRequestData {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  status: string;
  createdAt: string;
}

interface ProfileSuggestedProps {
  data: Array<{
    id: string;
    username: string;
  }>;
}

export default function ProfileSuggested({ data = [] }: ProfileSuggestedProps) {
  const [search, setSearch] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequestData[]>([]);
  const { user } = useUser();

  // Fetch friend requests when component mounts
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const fetchFriendRequests = async () => {
    if (!user || !user._id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await axios.get(`${baseUrl}/api/friends/requests/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      setFriendRequests(response.data.friendRequests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      Alert.alert('Error', 'Failed to fetch friend requests');
    }
  };

  const handleAcceptFriendRequest = async (friendId: string) => {
    if (!user || !user._id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      const baseUrl = 'http://51.21.28.186:5001';
      const response = await axios.post(`${baseUrl}/api/friends/accept`, {
        userId: user._id,
        friendId: friendId
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      Alert.alert('Success', response.data.message);
      // Refresh friend requests after accepting
      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to accept friend request');
    }
  };

  // Arama filtresi uygula
  const filteredData = friendRequests.filter(request =>
    request.user.username.toLowerCase().includes(search.toLowerCase())
  );

  if (friendRequests.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No friend requests found</Text>
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
              <Text style={styles.title}>{item.user.username}</Text>
              <View style={styles.actions}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.wonText}>Friend Request</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => handleAcceptFriendRequest(item.user._id)}
            >
              <Image
                source={require('@/assets/images/user-plus.png')}
                style={{ width: 16, height: 16, marginRight:4, tintColor: '#fff' }}
              />
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Image source={require('@/assets/images/search.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friend requests..."
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
    backgroundColor: 'transparent',
    padding: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
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
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
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