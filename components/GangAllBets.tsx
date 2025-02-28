import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const exampleData = [
  {
    id: '1',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Pending'
  },
  {
    id: '2',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Result'
  },
  {
    id: '3',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Result'
  },
  {
    id: '4',
    title: 'Elon Musk out as Head of DOGE before July?',
    status: 'Pending'
  }
];

interface Bet {
  id: string;
  title: string;
  status: string;
}

interface GangAllBetsProps {
  gangId: string;
}

export default function GangAllBets({ gangId }: GangAllBetsProps) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

      useEffect(() => {
          const fetchBets = async () => {
              try {
                  const response = await fetch(`http://51.21.28.186:5001/api/pages/groups/detail/${gangId}/${userId}`);
                  const data = await response.json();
                  setBets(data.group);
                  console.log(data);
              } catch (error) {
                  console.error("Error fetching bets:", error);
              } finally {
                  setLoading(false);
              }
          };
  
          fetchBets();
      }, [gangId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={exampleData}
        renderItem={({ item }) => (
          <View style={styles.mainCard}>
            <View style={styles.card}>
              { item.status==="Pending" && (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/alert-triangle.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:400}}>Need Finalise</Text>
                </View>
              )}
              { item.status==="Result" && (
                <View style={styles.subcard}>
                  <Image source={require('@/assets/images/gavel.png')} style={styles.iconStyle} />
                  <Text style={{color:'#fff', fontSize:12, fontWeight:400}}>Finalised</Text>
                </View>
              )}
            </View>    
            { item.status==="Pending" && (
              <View style={styles.card}>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.buttons}>
                    <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400, marginRight:7}}>%40</Text>
                    <Image source={require('@/assets/images/chart-line.png')} style={styles.iconStyle} />
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400, marginRight:7}}>50K</Text>
                    <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400, marginRight:21}}>7 Members</Text>
                    <Image source={require('@/assets/images/send.png')} style={styles.iconStyle} />
                    <Image source={require('@/assets/images/share.png')} style={styles.iconStyle} />
                  </View>
                </View>
                <View style={styles.card2}>
                  <Image source={require('@/assets/images/power.png')} style={styles.iconStyle2} />
                  <Text style={{color:'#000', fontSize:12, fontWeight:400}}>Finelise</Text>
                </View>
              </View>
             )}
             { item.status==="Result" && (
              <View style={styles.card}>
                <View>
                  <Text style={styles.title}>{item.title}</Text>
                  <View style={styles.buttons}>
                    <Image source={require('@/assets/images/scale.png')} style={styles.iconStyle} />
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400, marginRight:7}}>%40</Text>
                    <Image source={require('@/assets/images/chart-line.png')} style={styles.iconStyle} />
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400, marginRight:7}}>50K</Text>
                    <Image source={require('@/assets/images/users2.png')} style={styles.iconStyle} />
                    <Text style={{color:'#fff', fontSize:12, fontWeight:400, marginRight:21}}>7 Members</Text>
                    <Image source={require('@/assets/images/send.png')} style={styles.iconStyle} />
                    <Image source={require('@/assets/images/share.png')} style={styles.iconStyle} />
                  </View>
                </View>
                <View style={styles.card3}>
                  <Image source={require('@/assets/images/thumb-up.png')} style={styles.iconStyle2} />
                  <Text style={{color:'#000', fontSize:12, fontWeight:400}}>Yes!</Text>
                </View>
              </View>
             )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.seeAllButton}>
        <Image source={require('@/assets/images/search.png')} style={styles.iconStyle} />
        <Image source={require('@/assets/images/vector.png')} style={{width:4, height:16, marginRight:5, marginLeft:80}} />
        <Image source={require('@/assets/images/seeding.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>Latest</Text>
        <Image source={require('@/assets/images/hourglass.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>Time Ended</Text>
        <Image source={require('@/assets/images/new-section.png')} style={styles.iconStyle} />
        <Text style={styles.seeAllText}>New Bet</Text>        
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
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  card2: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 8, 
    paddingHorizontal: 4,
    borderRadius: 20,
    minWidth: 78,
  },
  card3: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8, 
    paddingHorizontal: 11,
    borderRadius: 20,
  },
  subcard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconStyle: {
    width: 16,
    height: 16,
    marginRight: 5,
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
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    flexShrink: 1,  
    width: '90%',   
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', 
  },
  
  seeAllText: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#fff',
    marginRight: 10,
  },  
});
