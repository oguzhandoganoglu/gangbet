import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SwippingScreen() {
  const [showFriendsOnly, setShowFriendsOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  type DataType = {
    id: number;
    title: string;
    content: string;
    category: string;
    type: string;
    image: any;
    image2: any;
    user: string;
  };
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const animatedValue = useState(new Animated.Value(0))[0];

  const [routes] = useState([
    { key: 'all', title: 'All' },
    { key: 'politics', title: 'Politics' },
    { key: 'sports', title: 'Sports' },
    { key: 'culture', title: 'Culture' },
    { key: 'world', title: 'World' },
  ]);

  // Örnek Statik Veri
  const exampleData = [
    { id: 1, title: 'Political News 1', content: 'Politics Content...', category: 'politics', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 2, title: 'Sports Update', content: 'Sports Content...', category: 'sports', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 3, title: 'Cultural Event', content: 'Culture Content...', category: 'culture', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 4, title: 'World News', content: 'World Content...', category: 'world', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 5, title: 'Political Discussion', content: 'Politics by Friends...', category: 'politics', type: 'friends', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 6, title: 'Friends Sports Talk', content: 'Sports by Friends...', category: 'sports', type: 'friends', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 7, title: 'World News', content: 'World Content...', category: 'world', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
  ];

  // Veri filtreleme işlemi
  useEffect(() => {
    const filtered = exampleData.filter(item =>
      (selectedCategory === 'all' || item.category === selectedCategory) &&
      (showFriendsOnly ? item.type === 'friends' : item.type === 'popular')
    );
    setFilteredData(filtered);
  }, [showFriendsOnly, selectedCategory]);

  const toggleSwitch = () => {
    setShowFriendsOnly(prev => !prev);
    Animated.timing(animatedValue, {
      toValue: showFriendsOnly ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 88],
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#1E1E4C' }}>
      <Text style={styles.header}>{showFriendsOnly ? 'Friends' : 'Popular'}</Text>

      <View style={styles.categoryContainer}>
        {routes.map(route => (
          <TouchableOpacity
            key={route.key}
            style={[
              styles.categoryButton,
            ]}
            onPress={() => setSelectedCategory(route.key)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === route.key && styles.selectedCategoryText,
              ]}
            >
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#ddd" />
        <TextInput
          style={styles.searchInput}
          placeholder=""
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Icon name="filter" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="star" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="line-chart" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="paper-plane" size={18} color="#ddd" style={styles.icon}/>
        <Icon name="hourglass-half" size={18} color="#ddd" style={styles.icon}/>
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            {/* Hafif beyaz tabaka */}
            <View style={styles.whiteOverlay} />

            {/* Asıl içerik */}
            <View style={styles.cardContent}>
              <Image source={item.image} style={styles.profileImage} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.userContainer}>
                  <Image source={item.image2} style={styles.profileImage2} />
                  <Text style={styles.userText}>{item.user}</Text>
                </View>
                <View style={styles.iconsContainer}>
                  <View style={styles.iconItem}>
                    <Icon name="hourglass-half" size={14} color="#ddd" />
                    <Text style={styles.iconText}>7D Left</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <Icon name="line-chart" size={14} color="#ddd" />
                    <Text style={styles.iconText}>50K</Text>
                  </View>
                  <Icon name="share" size={14} color="#ddd" style={styles.icon} />
                  <Icon name="send" size={14} color="#ddd" style={styles.icon} />
                  <Icon name="star" size={14} color="#ddd" style={styles.icon} />
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Toggle Button */}
      <View style={styles.toggleContainer}>
        <View style={styles.toggleBackground}>
          <Animated.View style={[styles.toggleCircle, { transform: [{ translateX }] }]} />
          <TouchableOpacity
            style={[styles.toggleButton, showFriendsOnly ? null : styles.selectedButton]}
            onPress={toggleSwitch}
          >
            <Text style={[styles.toggleText, showFriendsOnly ? null : styles.selectedText]}>
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, showFriendsOnly ? styles.selectedButton : null]}
            onPress={toggleSwitch}
          >
            <Text style={[styles.toggleText, showFriendsOnly ? styles.selectedText : null]}>
              Friends
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    paddingLeft: 15,
    backgroundColor: '#1E1E4C',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    paddingLeft:10
  },
  categoryButton: {
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  categoryText: {
    color: 'white',
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  toggleContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -90 }],
  },
  toggleBackground: {
    flexDirection: 'row',
    width: 180,
    height: 40,
    backgroundColor: '#610f87',
    borderRadius: 5,
    alignItems: 'center',
    padding: 2,
    position: 'relative',
  },
  toggleButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    zIndex: 1,
  },
  selectedButton: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'black',
  },
  toggleCircle: {
    position: 'absolute',
    width: 86,
    height: 34,
    backgroundColor: 'white',
    borderRadius: 0,
    zIndex: 0,
  },
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
    width: 65,
    height: 65,
    borderRadius: 0,
    marginRight: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    color: '#ddd',
    marginLeft: 5,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 5,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#000058',
    borderRadius: 5,
  },
});