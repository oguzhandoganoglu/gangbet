import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const localImage = require("@/assets/images/latte.jpeg");
const profileImages = [
  require("@/assets/images/char1.png"),
  require("@/assets/images/char2.png"),
  require("@/assets/images/alp.png"),
  require("@/assets/images/more.png")
];

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.3;

type Bet = {
  title: string;
  volume: string;
  date: string;
};

type HeaderProps = {
  title?: string;
};

type StatsProps = {
  volume?: string;
  date?: string;
};

type ImageSectionProps = {
  imageSource: any;
};

type PriceButtonProps = {
  price: number;
  selected: boolean;
  onPress: () => void;
};


const BetCardPopular: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([{
    title: "First Point TR LTD. STi. 2030'da gelecek.",
    volume: "29,251",
    date: "Jan 31, 2026"
  }]);

  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(
          event.translationX > 0 ? width : -width,
          {},
          () => runOnJS(removeTopCard)()
        );
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const removeTopCard = () => {
    setBets((prevBets) => prevBets.slice(1));
  };
  const [selectedPrice, setSelectedPrice] = React.useState(5);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Header title={bets[0]?.title} />
        <Stats volume={bets[0]?.volume} date={bets[0]?.date} />
        <ImageSection imageSource={localImage} />
        <ActionButtons />
        <View style={{ flexDirection: "row", borderColor: "gray", borderWidth:1, paddingVertical:4, borderRadius: 8, alignSelf:"center", justifyContent: "center" }}>
            <PriceButton price={5} selected={selectedPrice === 5} onPress={() => setSelectedPrice(5)} />
            <PriceButton price={10} selected={selectedPrice === 10} onPress={() => setSelectedPrice(10)} />
        </View>
      </Animated.View>
    </PanGestureHandler>
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
  <Image source={imageSource} style={styles.image} resizeMode="cover" />
);

const ActionButtons: React.FC = () => (
  <View style={styles.actionButtons}>
    <TouchableOpacity>
      <Image source={require("@/assets/images/arrow-back.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/share.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/info-circle.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/send.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image source={require("@/assets/images/star.png")} style={styles.actionbuttonimage} />
    </TouchableOpacity>
  </View>
);

const PriceButton: React.FC<PriceButtonProps> = ({ price, selected, onPress }) => (
  <TouchableOpacity 
    style={[styles.button, selected ? styles.selected : styles.unselected]} 
    onPress={onPress}
  >
    <Text style={[styles.text, selected ? styles.selectedText : styles.unselectedText]}>
      ${price}
    </Text>
  </TouchableOpacity>
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
    marginHorizontal: 15,
    backgroundColor: "#2A2E37",
    tintColor: "white",
    borderRadius: 30,
    padding: 7,
  },
  priceButton: {
    borderColor: "white",
    backgroundColor: "#5E5E5E5C",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 22,
    alignSelf: "center",
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
  button: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selected: {
    backgroundColor: "gray",
  },
  unselected: {
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  unselectedText: {
    color: "#666666",
  },
});

export default BetCardPopular;
