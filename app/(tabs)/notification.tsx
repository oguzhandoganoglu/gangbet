import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Navbar from '@/components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

// Notification Card Components
const FriendRequestCard = ({ notification }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardContent}>
      <Image 
        source={{ uri: notification.avatar || 'https://via.placeholder.com/65' }} 
        style={styles.profileImage} 
        defaultSource={require('@/assets/images/latte.jpeg')}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{notification.sender}</Text>
        <Text style={styles.groupText}>Arkadaşlık isteği • {notification.time}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={[styles.percentCard, { backgroundColor: '#4CAF50' }]}>
            <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
            <View style={styles.percentText}>
              <Text style={{color:'#fff', fontSize:12}}>KABUL ET</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.percentCard, { backgroundColor: '#FF5252', marginLeft: 8 }]}>
            <Image source={require('@/assets/images/thumb-up.png')} style={[styles.percentImage, { transform: [{ rotate: '180deg' }] }]} />
            <View style={styles.percentText}>
              <Text style={{color:'#fff', fontSize:12}}>REDDET</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const BetNotificationCard = ({ notification }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardContent}>
      <View style={[styles.profileImage, { backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="trophy-outline" size={24} color="#fff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{notification.sender}</Text>
        <Text style={styles.groupText}>{notification.content} • {notification.time}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={[styles.percentCard, { backgroundColor: '#2196F3' }]}>
            <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
            <View style={styles.percentText}>
              <Text style={{color:'#fff', fontSize:12}}>GÖRÜNTÜLE</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.iconItem}>
            <Image source={require('@/assets/images/scale.png')} style={{ width: 16, height: 16 }} />
            <Text style={styles.iconText}>25 USDC</Text>
          </View>
          <View style={styles.iconItem}>
            <Image source={require('@/assets/images/users2.png')} style={{ width: 16, height: 16 }} />
            <Text style={styles.iconText}>12</Text>
          </View>         
        </View>
      </View>
    </View>
  </View>
);

const GroupInviteCard = ({ notification }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardContent}>
      <View style={[styles.profileImage, { backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="people-outline" size={24} color="#fff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{notification.sender}</Text>
        <Text style={styles.groupText}>{notification.groupName} grubuna davet • {notification.time}</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={[styles.percentCard, { backgroundColor: '#4CAF50' }]}>
            <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
            <View style={styles.percentText}>
              <Text style={{color:'#fff', fontSize:12}}>KATIL</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.percentCard, { backgroundColor: '#FF5252', marginLeft: 8 }]}>
            <Image source={require('@/assets/images/thumb-up.png')} style={[styles.percentImage, { transform: [{ rotate: '180deg' }] }]} />
            <View style={styles.percentText}>
              <Text style={{color:'#fff', fontSize:12}}>REDDET</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.iconItem}>
            <Image source={require('@/assets/images/users2.png')} style={{ width: 16, height: 16 }} />
            <Text style={styles.iconText}>21</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

export default function NotificationScreen() {
  // Sample user groups
  const userGroups = [
    { id: 1, name: 'Futbol Severler' },
    { id: 2, name: 'Basketbol Grubu' },
    { id: 3, name: 'Tennis Club' },
  ];

  // Sample notification data
  const allNotifications = [
    { 
      id: 1, 
      type: 'friendRequest', 
      sender: 'Ahmet Yılmaz', 
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
      time: '2 saat önce',
      groupId: null
    },
    { 
      id: 2, 
      type: 'betNotification', 
      sender: 'Mehmet Demir', 
      content: 'Galatasaray vs Fenerbahçe maçı için bahis önerisi gönderdi',
      time: '3 saat önce',
      groupId: 1
    },
    { 
      id: 3, 
      type: 'groupInvite', 
      sender: 'Ayşe Kaya', 
      groupName: 'Basketbol Grubu',
      time: '5 saat önce',
      groupId: 2
    },
    { 
      id: 4, 
      type: 'friendRequest', 
      sender: 'Zeynep Öztürk', 
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg', 
      time: '1 gün önce',
      groupId: null
    },
    { 
      id: 5, 
      type: 'betNotification', 
      sender: 'Burak Yılmaz', 
      content: 'Real Madrid vs Barcelona maçı için bahis önerisi gönderdi',
      time: '1 gün önce',
      groupId: 3
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredNotifications, setFilteredNotifications] = useState(allNotifications);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter notifications when selectedFilter changes
  useEffect(() => {
    if (selectedFilter === 'All') {
      setFilteredNotifications(allNotifications);
    } else {
      const groupId = userGroups.find(group => group.name === selectedFilter)?.id;
      setFilteredNotifications(
        allNotifications.filter(notification => 
          notification.groupId === groupId || notification.groupId === null
        )
      );
    }
  }, [selectedFilter]);

  const renderNotificationItem = ({ item }) => {
    switch (item.type) {
      case 'friendRequest':
        return <FriendRequestCard notification={item} />;
      case 'betNotification':
        return <BetNotificationCard notification={item} />;
      case 'groupInvite':
        return <GroupInviteCard notification={item} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#161638', '#714F60', '#B85B44']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Navbar title="Bildirimler" />
        
        {/* Filter section - now transparent */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
          >
            <Text style={styles.filterButtonText}>{selectedFilter}</Text>
            <Ionicons 
              name={showFilterDropdown ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#fff"
            />
          </TouchableOpacity>
          
          {/* Filter dropdown - now with semi-transparent background */}
          {showFilterDropdown && (
            <View style={styles.filterDropdown}>
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  selectedFilter === 'All' && styles.selectedFilterOption
                ]}
                onPress={() => {
                  setSelectedFilter('All');
                  setShowFilterDropdown(false);
                }}
              >
                <Text style={styles.filterOptionText}>All</Text>
              </TouchableOpacity>
              
              {userGroups.map(group => (
                <TouchableOpacity 
                  key={group.id}
                  style={[
                    styles.filterOption,
                    selectedFilter === group.name && styles.selectedFilterOption
                  ]}
                  onPress={() => {
                    setSelectedFilter(group.name);
                    setShowFilterDropdown(false);
                  }}
                >
                  <Text style={styles.filterOptionText}>{group.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* Notifications list */}
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Bu kategoride bildirim bulunamadı.</Text>
            </View>
          }
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(224, 224, 224, 0.3)',
    zIndex: 10,
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  filterDropdown: {
    position: 'absolute',
    top: 76,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 20,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240, 240, 240, 0.1)',
  },
  selectedFilterOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  notificationsList: {
    padding: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
  },
  
  // Card styles - now transparent
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  groupText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  percentImage: {
    width: 12,
    height: 12,
    tintColor: '#fff',
    marginRight: 4,
  },
  percentText: {
    flexDirection: 'row',
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  iconText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
});