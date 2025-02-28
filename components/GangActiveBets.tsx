import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function GangActiveBets({ bets, isLoading }) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading active bets...</Text>
      </View>
    );
  }

  if (!bets || bets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image 
          source={require('@/assets/images/gavel.png')} 
          style={[styles.iconStyle, { width: 40, height: 40, marginBottom: 10 }]} 
        />
        <Text style={styles.emptyText}>No active bets found</Text>
        <Text style={styles.emptySubText}>Create a new bet to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bets}
        renderItem={({ item }) => (
          <View style={styles.mainCard}>
            <View style={styles.card}>
              {new Date() > new Date(item.endDate) ? (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/alert-triangle.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>Need Finalise</Text>
                </View>
              ) : (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400'}}>
                    {new Date(item.endDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>    
            <View style={styles.card}>
              <View style={{flex: 1}}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.buttons}>
                  <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400', marginRight:7}}>
                    {item.yesPercentage}%
                  </Text>
                  <Image source={require('@/assets/images/chart-line.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400', marginRight:7}}>
                    {item.totalPool} USDC
                  </Text>
                  <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:'400', marginRight:21}}>
                    {item.participantsCount} Members
                  </Text>
                  <Image source={require('@/assets/images/send.png')} style={styles.iconStyle} />
                  <Image source={require('@/assets/images/share.png')} style={styles.iconStyle} />
                </View>
              </View>
              
              {item.userParticipation ? (
                <View style={[
                  styles.card3,
                  item.userParticipation.choice === 'yes' ? styles.cardYes : styles.cardNo
                ]}>
                  <Image 
                    source={
                      item.userParticipation.choice === 'yes' 
                        ? require('@/assets/images/thumb-up.png') 
                        : require('@/assets/images/thumb-down.png')
                    } 
                    style={styles.iconStyle2} 
                  />
                  <Text style={{color:'#000', fontSize:12, fontWeight:'400'}}>
                    {item.userParticipation.choice === 'yes' ? 'Yes!' : 'No!'}
                  </Text>
                </View>
              ) : (
                <View style={styles.betButtons}>
                  <TouchableOpacity style={styles.betButton}>
                    <Text style={styles.betButtonText}>Bet</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.seeAllButton}>
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('@/assets/images/search.png')} style={styles.iconStyle} />
        </TouchableOpacity>
        <Image source={require('@/assets/images/vector.png')} style={{width:4, height:16, marginRight:5, marginLeft:10}} />
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('@/assets/images/seeding.png')} style={styles.iconStyle} />
          <Text style={styles.seeAllText}>Latest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
          <Text style={styles.seeAllText}>End Soon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Image source={require('@/assets/images/chart-line.png')} style={styles.iconStyle} />
          <Text style={styles.seeAllText}>Highest Pool</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4C',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E4C',
    padding: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  card2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    paddingVertical: 8, 
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 78,
  },
  card3: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, 
    paddingHorizontal: 11,
    borderRadius: 20,
    minWidth: 70,
  },
  cardYes: {
    backgroundColor: 'rgba(69, 170, 69, 0.6)',
  },
  cardNo: {
    backgroundColor: 'rgba(220, 53, 69, 0.6)',
  },
  subcard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 10,
  },
  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 5,
    tintColor: '#fff',
  },
  iconStyle2: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    flexShrink: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 10,
  },
  betButtons: {
    flexDirection: 'row',
  },
  betButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  betButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});