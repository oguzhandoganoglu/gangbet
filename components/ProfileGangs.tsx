import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

// API veri tipi
interface GroupData {
  id: string;
  name: string;
  membersCount: number;
}

interface ProfileGangsProps {
  data: GroupData[];
}

export default function ProfileGangs({ data = [] }: ProfileGangsProps) {
  const router = useRouter();

  const handleGroupPress = (groupId: string) => {
    router.push({ pathname: "/gang/[gangId]", params: { gangId: groupId } });
  };

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No groups found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Gangs</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.groupCard}
            activeOpacity={0.7}
            onPress={() => handleGroupPress(item.id)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.groupInitial}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.memberCount}>{item.membersCount} members</Text>
            </View>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleGroupPress(item.id)}
            >
              <Image
                source={require('@/assets/images/info-circle.png')}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 15,
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
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 92, 231, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberCount: {
    color: '#ddd',
    fontSize: 12,
  },
  actionButton: {
    padding: 5,
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  createIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    marginRight: 10,
  },
  createText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  }
});