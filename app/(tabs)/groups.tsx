import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '@/components/Navbar';
import { useRouter } from 'expo-router';

export default function NotificationScreen() {

   const [selectedCategory, setSelectedCategory] = useState('all');
   const [searchText, setSearchText] = useState('');
// DataType türü (örnekData için)
type DataType = {
  id: number;
  title: string;
  category: string;
  image: any;
  traded: string;
  result: string;
};

// Yeni bir tür tanımlayalım (managedData için)
type ManagedDataType = {
  id: number;
  gangName: string;
  gangImage: any;
  gangMembers: number;
  gangBets: number;
};

// State'i her iki türe uygun hale getirelim
const [filteredData, setFilteredData] = useState<(DataType | ManagedDataType)[]>([]);
 
   const [routes] = useState([
     { key: 'managed', title: 'Managed |' },
     { key: 'all', title: 'All' },
     { key: 'rkos', title: 'RKOS' },
     { key: '06ankaralilar', title: '06ankaralilar' },
     { key: 'culture', title: 'Culture' },
     { key: 'world', title: 'World' },
   ]);
 
   // Örnek Statik Veri
   const exampleData = [
     { id: 1, title: 'Elon Musk out as Head of DOGE before July?', category: 'rkos', image: require('@/assets/images/elon.png'), traded:"NO", result:""},
     { id: 2, title: 'Elon Musk out as Head of DOGE before July?', category: '06ankaralilar', image: require('@/assets/images/latte.jpeg'), traded:"YES", result:"50,534"},
     { id: 3, title: 'Elon Musk out as Head of DOGE before July?', category: 'rkos', image: require('@/assets/images/yamanalp.png'), traded:"YES", result:"50,534"},
   ];

   const managedData = [
    { id: 1, gangName: "RKOS", gangImage: require('@/assets/images/elon.png'), gangMembers: 5, gangBets: 10},
    { id: 2, gangName: "06ankaralilar", gangImage: require('@/assets/images/latte.jpeg'), gangMembers: 5, gangBets: 10},
    { id: 3, gangName: "RKOS", gangImage: require('@/assets/images/yamanalp.png'), gangMembers: 5, gangBets: 10},
   ];
 
   // Veri filtreleme işlemi
   useEffect(() => {
    if (selectedCategory === 'managed') {
      setFilteredData(managedData); // Managed seçilirse managedData kullan
    } else {
      const filtered = exampleData.filter(item =>
        selectedCategory === 'all' || item.category === selectedCategory
      );
      setFilteredData(filtered);
    }
  }, [selectedCategory]);
 
  const router = useRouter();
   return (
     <View style={{ flex: 1, backgroundColor: '#1E1E4C' }}>
       <Navbar />
       <Text style={styles.header}>Gangs</Text>
 
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
          renderItem={({ item }) => {
            if ('gangName' in item) {
              // ManagedDataType türü için
              return (
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/gang/[gangId]", params: { gangId: item.id.toString() } })}
                style={styles.managedCard}
              >
                <View style={styles.managedCard}>
                  <Image source={item.gangImage} style={styles.managedProfileImage} />
                  <View style={{ alignItems: 'flex-start'}}>
                    <Text style={styles.managedtitle}>{item.gangName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                      <Image source={require('@/assets/images/users2.png')} style={{height:16, width:16, marginRight:4}} />
                      <Text style={styles.subText}>{item.gangMembers} Members</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
                    <Image source={require('@/assets/images/share.png')} style={{height:16, width:16, marginRight:7}} />
                    <Image source={require('@/assets/images/user-plus.png')} style={{height:16, width:16, marginRight:7}} />
                    <Image source={require('@/assets/images/user-minus.png')} style={{height:16, width:16, marginRight:7}} />
                    <Image source={require('@/assets/images/settings.png')} style={{height:16, width:16}} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 30 }}>
                    <Text style={styles.subText}>{item.gangBets} Bets</Text>
                  </View>
                </View>
              </TouchableOpacity>
              );
            } else {
            // DataType türü için
              return (
                <View style={styles.cardContainer}>
                  <View style={styles.whiteOverlay} />
                    <View style={styles.cardContent}>
                      <Image source={item.image} style={styles.profileImage} />
                      <View style={styles.textContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <View style={styles.iconsContainer}>
                          {item.traded === "YES" && (
                            <View style={styles.percentCard}>
                              <Image source={require('@/assets/images/thumb-up.png')} style={styles.percentImage} />
                              <View style={styles.percentText}>
                                <Text style={{color:'#fff', fontSize:12}}>YES</Text>
                                <Text style={{color:'#fff', fontSize:12}}> {item.result}</Text>
                              </View>
                            </View>
                          )}
                          <View style={styles.iconItem}>
                            <Image source={require("@/assets/images/scale.png")} style={{ width: 16, height: 16 }} />
                            <Text style={styles.iconText}>%40</Text>
                          </View>
                          <View style={styles.iconItem}>
                            <Image source={require("@/assets/images/mood-suprised.png")} style={{ width: 16, height: 16 }} />
                            <Text style={styles.iconText}>Won</Text>
                          </View>
                          <View style={styles.iconItem}>
                            <Image source={require("@/assets/images/chart-line.png")} style={{ width: 16, height: 16 }} />
                            <Text style={styles.iconText}>50K</Text>
                          </View>
                          <Image source={require("@/assets/images/send.png")} style={{ width: 16, height: 16, marginRight:10 }} />
                          <Image source={require("@/assets/images/star.png")} style={{ width: 16, height: 16 }} />
                        </View>
                      </View>
                    </View>
                  </View>
                );
             }
            }}
      keyExtractor={(item) => item.id.toString()}
    />
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
     marginTop: 20
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
   managedProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
   managedtitle: {
    fontSize: 16,
    fontWeight: 700,
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
     marginRight: 6,
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
  percentImage2 : { 
    width: 16, 
    height: 16,
    tintColor: '#5E5E5E5C'
  },
  managedCard: {
    flexDirection: 'row',
    backgroundColor: '#2E2E5E',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  subText: {
    color: '#ccc',
    fontSize: 14,
  },
 });