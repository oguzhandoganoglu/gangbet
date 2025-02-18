import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ResultCard() {
  return (
    <View style={styles.card}>
      <Image source={require('@/assets/images/elon.png')} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Elon Musk out as Head of DOGE before July?
          </Text>
          <View style={styles.percentContainer}>
            <Text style={styles.percentage}>40% YES</Text>
            <Text style={styles.multiplier}>2.5x</Text>
          </View>
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
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginRight: 15,
  },
  content: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  percentContainer: {
    position: 'relative',
    width: 70, // Genişliği ihtiyaca göre ayarla
    height: 20, // Yüksekliği ihtiyaca göre ayarla
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  multiplier: {
    fontSize: 12,
    color: '#aaa',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    top: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 12,
    color: '#ddd',
    marginLeft: 5,
  },
  icon: {
    marginRight: 10,
  },
});


