import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    user: 'Alptoksoz traded YES',
    image: require('@/assets/images/elon.png'),
    image2: require('@/assets/images/alp.png'),
    invite: true,
    invitePerson: 'Alptoksoz',
  },
  {
    id: '2',
    title: 'Bitcoin hits 50k mark again!',
    user: 'CryptoGuy traded YES',
    image: require('@/assets/images/elon.png'),
    image2: require('@/assets/images/alp.png'),
    invite: false,
    invitePerson: null,
  },
];

export default function FirstRoute() {
  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E4C' }}>
      <FlatList
        data={exampleData}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            {/* Hafif beyaz tabaka */}
            <View style={styles.whiteOverlay} />
            
            {/* Asıl içerik */}
            <View style={styles.cardContent}>
              <Image source={item.image} style={styles.profileImage} />
              {!item.invite && (
                
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.userContainer}>
                  <Image source={item.image2} style={styles.profileImage2} />
                  <Text style={styles.userText}>{item.user}</Text>
                </View>
                <View style={styles.iconsContainer}>
                  <View style={styles.iconItem}>
                    <Image source={require('@/assets/images/hourglass.png')} style={{ width: 16, height: 16 }} />
                    <Text style={styles.iconText}>7D Left</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16 }} />
                    <Text style={styles.iconText}>50K</Text>
                  </View>
                  <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                  <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                  <Image source={require('@/assets/images/star.png')} style={{ width: 16, height: 16}} />
                </View>
              </View>
              )}
              {item.invite && (
                
                <View style={styles.textContainer}>
                  <View style={styles.userContainer}>
                    <Image source={item.image2} style={styles.profileImage2} />
                    <Text style={styles.userText}>{item.invitePerson} Inveted You</Text>
                  </View>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.iconsContainer}>
                    <View style={styles.iconItem}>
                      <Image source={require('@/assets/images/hourglass.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.iconText}>7D Left</Text>
                    </View>
                    <View style={styles.iconItem}>
                      <Image source={require('@/assets/images/chart-line.png')} style={{ width: 16, height: 16 }} />
                      <Text style={styles.iconText}>50K</Text>
                    </View>
                    <Image source={require('@/assets/images/share.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                    <Image source={require('@/assets/images/send.png')} style={{ width: 16, height: 16, marginRight:6 }} />
                    <Image source={require('@/assets/images/star.png')} style={{ width: 16, height: 16}} />
                  </View>
                </View>
                )}
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
    position: 'relative',
    borderRadius: 0,
    marginBottom: 2,
    overflow: 'hidden',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 0,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 4,
    marginRight: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  profileImage2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  userText: {
    fontSize: 14,
    color: '#ddd',
    fontWeight: '600',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 4,
  },
  iconText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 2,
    marginTop: 2,
  },
  icon: {
    marginRight: 10,
  },
});