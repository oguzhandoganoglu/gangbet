import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '@/components/Navbar';
import { LinearGradient } from 'expo-linear-gradient'; // Expo-linear-gradient kullanımı
import { wp, hp, fontSize, isSmallDevice } from '@/utils/responsive';

export default function SwippingScreen() {
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
    { key: 'other', title: 'Other' },
  ]);

  // Örnek Statik Veri
  const exampleData = [
    { id: 1, title: 'Elon Musk out as Head of DOGE before July?', content: 'Politics Content...', category: 'politics', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 2, title: 'Elon Musk out as Head of DOGE before July?', content: 'Sports Content...', category: 'sports', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
    { id: 3, title: 'Elon Musk out as Head of DOGE before July?', content: 'Culture Content...', category: 'culture', type: 'popular', image: require('@/assets/images/elon.png'), image2: require('@/assets/images/alp.png'), user: 'CryptoGuy traded YES' },
   ];

  // Veri filtreleme işlemi
  useEffect(() => {
    const filtered = exampleData.filter(item =>
      (selectedCategory === 'all' || item.category === selectedCategory)
    );
    setFilteredData(filtered);
  },[selectedCategory]);

  return (
    <LinearGradient
      colors={['#161638', '#714F60', '#B85B44']} // İndigo, mor menekşe, arduvaz mavisi
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <Navbar />
      <Text style={styles.header}>Popular</Text>

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
        <Icon name="search" size={wp(20)} color="#ddd" />
        <TextInput
          style={styles.searchInput}
          placeholder=""
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
        <Icon name="filter" size={wp(12)} color="#ddd" style={styles.icon}/>
        <Icon name="star" size={wp(12)} color="#ddd" style={styles.icon}/>
        <Icon name="line-chart" size={wp(12)} color="#ddd" style={styles.icon}/>
        <Icon name="paper-plane" size={wp(12)} color="#ddd" style={styles.icon}/>
        <Icon name="hourglass-half" size={wp(12)} color="#ddd" style={styles.icon}/>
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
                <View style={styles.infoRow}>
                  <View style={styles.iconItem}>
                    <Icon name="thumbs-up" size={wp(12)} color="#ddd"  />
                    <Text style={styles.iconText}>YES 50,534</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <Icon name="balance-scale" size={wp(12)} color="#ddd" />
                    <Text style={styles.iconText}>%40</Text>
                  </View>
                  <View style={styles.iconItem}>
                    <Icon name="hourglass-half" size={wp(12)} color="#ddd" />
                    <Text style={styles.iconText}>7D Left</Text>
                  </View>
                  <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="paper-plane" size={wp(12)} color="#ddd" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="star" size={wp(12)} color="#ddd" />
                  </TouchableOpacity>
                </View>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // LinearGradient kullandığımız için arka plan rengini kaldırdık
  },
  header: {
    fontSize: fontSize(24),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    paddingLeft: wp(15),
    marginTop: hp(20),
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: hp(10),
    paddingLeft: wp(10),
  },
  categoryButton: {
    paddingVertical: hp(10),
    marginHorizontal: wp(5),
  },
  categoryText: {
    color: 'white',
    fontSize: fontSize(16),
    opacity: 0.6, // Seçili olmayan kategorileri daha soluk göster
  },
  selectedCategoryText: {
    fontWeight: 'bold',
    opacity: 1, // Seçili kategori tam opaklıkta
  },
  cardContainer: {
    position: 'relative',
    borderRadius: 0,
    marginBottom: hp(2),
    overflow: 'hidden',
    backgroundColor: 'rgba(138, 43, 226, 0.2)', // Daha saydam kart arkaplanı
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 0,
  },
  cardContent: {
    flexDirection: 'row',
    padding: wp(10),
    alignItems: 'center',
  },
  profileImage: {
    width: wp(50),
    height: wp(50),
    borderRadius: 0,
    marginRight: wp(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontSize(12),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: hp(15),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(6),
    flexWrap: isSmallDevice ? 'wrap' : 'nowrap', // Küçük cihazlarda satır atlama
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(15),
    marginBottom: isSmallDevice ? hp(5) : 0, // Küçük cihazlarda alt boşluk
  },
  iconText: {
    fontSize: fontSize(10),
    color: '#ddd',
    marginLeft: wp(5),
  },
  icon: {
    marginRight: wp(15),
  },
  actionButton: {
    marginRight: wp(20),
  },
  searchInput: {
    flex: 1,
    padding: wp(5),
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(10),
    marginBottom: hp(10),
    backgroundColor: 'rgba(18, 11, 69, 0.53)', // Daha saydam arama kutusu
    borderRadius: 30,
    height: hp(40), // Sabit yükseklik ekleyin
  },
});