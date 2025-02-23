import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const localImage = require("@/assets/images/latte.jpeg");

const profileImages = [
  require('@/assets/images/char1.png'),  // Yerel dosya yolunu kullanarak
  require('@/assets/images/char2.png'),
  require('@/assets/images/alp.png'),
  require('@/assets/images/more.png')
];

type HeaderProps = {
  title: string;
};

type StatsProps = {
  volume: string;
  date: string;
};

type ImageSectionProps = {
  imageSource: any;
};

type PriceButtonProps = {
  price: number;
};



const BetCardFriends = () => {


  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.card}>
        <Header title="First Point TR LTD. STi. 2030'da gelecek."/>
        <Stats volume="29,251" date="Jan 31, 2026" />
        <ImageSection imageSource={localImage} />
        <ActionButtons /> 
        <ProfileImageRow imageSources={profileImages} />
      </View>
      <PriceButton price={10} />
    </View>
  );
};


const Header: React.FC<HeaderProps> = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const Stats: React.FC<StatsProps> = ({ volume, date }) => (
  <View style={styles.stats}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={require("@/assets/images/chart-line.png")} style={{ width: 24, height: 24 }} />
      <Text style={styles.statText}>{volume} Volume</Text>
    </View>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image source={require("@/assets/images/calendar-minus.png")} style={{ width: 24, height: 24 }} />
      <Text style={styles.statText}>{date}</Text>
    </View>
  </View>
);

const ImageSection: React.FC<ImageSectionProps> = ({ imageSource }) => (
  <Image source={imageSource} style={styles.image} resizeMode="cover"/>
);

const ActionButtons = () => (
  <View style={styles.actionButtons}>
    <TouchableOpacity>
      <Image source={require("@/assets/images/arrow-back.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/share.png")} style={styles.actionbuttonimage}  />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/info-circle.png")} style={styles.actionbuttonimage}  />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/star.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
  </View>
);

const PriceButton: React.FC<PriceButtonProps> = ({ price }) => (
  <TouchableOpacity style={styles.priceButton}>
    <Text style={styles.priceText}>${price}</Text>
  </TouchableOpacity>
);

const ProfileImageRow: React.FC<{ imageSources: any[] }> = ({ imageSources }) => (
  <View style={styles.profileContainer}>
    {imageSources.map((imageSource, index) => (
      <Image key={index} source={imageSource} style={styles.profileImage} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 6,
    width: "100%",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom:  8,
  },
  header: {
    marginVertical: 8,
    marginHorizontal: 6,
  },
  title: {
    color: "white",
    fontWeight: 700,
    fontSize: 24,
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
  },
  stats: {
    marginVertical: 8,
    marginHorizontal: 6,
  },
  statText: {
    color: "white",
    fontSize: 16,
    fontWeight: 400,
    marginLeft: 6,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    zIndex: 1, 
    bottom: 30
  },
  actionbuttonimage: {
    width: 45,
    height: 45,
    marginHorizontal: 8,
    backgroundColor: "#5E5E5E5C",
    borderRadius: 30,
    padding: 7,
  },
  priceButton: {
    borderColor: "white",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  priceText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 9,
    marginBottom: -25,
    zIndex: 1,
    bottom: 30,
  },
  profileImage: {
    width: 20, 
    height: 20, 
    borderRadius: 20, 
    marginLeft: -6,
  },
});

export default BetCardFriends;
