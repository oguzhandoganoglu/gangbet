import React from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// balances ve history dizilerindeki öğelerin türlerini tanımlıyoruz
interface BalanceItem {
  id: string;
  name: string;
  amount: string;
  value: string;
  icon: any; // icon türü uygun şekilde belirlenebilir
}

interface HistoryItem {
  id: string;
  name: string;
  amount: string;
  date: string;
  type: string;
  value: string;
  icon: any;
}

const balances: BalanceItem[] = [
  {
    id: "1",
    name: "MOVE",
    amount: "100 MOVE",
    value: "$100",
    icon: require("@/assets/images/move.png"),
  },
  {
    id: "2",
    name: "USDC",
    amount: "100 USD",
    value: "$100",
    icon: require("@/assets/images/usdc.png"),
  },
];

const history: HistoryItem[] = [
  {
    id: "1",
    name: "USDC",
    amount: "100 USD",
    date: "Jan 15, 2025",
    type: "In",
    value: "+$100",
    icon: require("@/assets/images/usdc.png"),
  },
  {
    id: "2",
    name: "USDC",
    amount: "100 USD",
    date: "Jan 15, 2025",
    type: "Out",
    value: "-$100",
    icon: require("@/assets/images/usdc.png"),
  },
  {
    id: "3",
    name: "USDC",
    amount: "100 USD",
    date: "Jan 15, 2025",
    type: "Earned",
    value: "+$100",
    icon: require("@/assets/images/usdc.png"),
  },
];

export default function Balances() {
  const renderBalanceItem = ({ item }: { item: BalanceItem }) => {
    if (!item) return null;
    return (
      <View key={item.id} style={styles.balanceCard}>
        {item.icon ? (
          <Image source={item.icon} style={styles.icon} />
        ) : (
          <Text style={styles.iconFallback}>No Icon</Text>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.tokenName}>{item.name}</Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>
        <Text style={styles.value}>{item.value}</Text>
      </View>
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    if (!item) return null;
    return (
      <View style={styles.historyCard}>
        {item.icon ? (
          <Image source={item.icon} style={styles.icon} />
        ) : (
          <Text style={styles.iconFallback}>No Icon</Text>
        )}
        <View style={styles.textContainer2}>
          <View style={{marginRight: 25}}>
            <Text style={styles.tokenName}>{item.name}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        
        <Text style={styles.type}>{item.type}</Text>
        <Text style={[styles.value, item.value.includes("+") ? styles.positive : styles.negative]}>
          {item.value}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#6C5CE7", "#341F97"]}>
      <FlatList
        data={[{ key: "balances" }, { key: "history" }]}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          if (item.key === "balances") {
            return (
              <View style={styles.header}>
                {balances.map((balance) => renderBalanceItem({ item: balance }))}
                <TouchableOpacity style={styles.button}>
                  <Image source={require("@/assets/images/eyeglass.png")} style={{ width: 24, height: 24, paddingRight: 10 }} />
                  <Text style={styles.buttonText}>Show Other Tokens</Text>
                </TouchableOpacity>
              </View>
            );
          }
          if (item.key === "history") {
            return (
              <View style={styles.header}>
                <Text style={styles.historyTitle}>History</Text>
                <FlatList
                  data={history}
                  keyExtractor={(item) => item.id}
                  renderItem={renderHistoryItem}
                />
                <TouchableOpacity style={styles.button2}>
                <Image source={require("@/assets/images/eyeglass.png")} style={{ width: 24, height: 24, paddingRight: 10 }} />
                  <Text style={styles.buttonText}>Show All</Text>
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 9,
  },
  header: {
    padding: 12,
    marginHorizontal: 6,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: "#1E1E4C",
  },
  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  icon: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  iconFallback: {
    width: 44,
    height: 44,
    marginRight: 12,
    backgroundColor: "#ccc", 
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    lineHeight: 44,
    color: "#000",
  },
  textContainer: {
    flex: 1,
  },
  textContainer2: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  tokenName: {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
  },
  amount: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: 400,
    marginTop:4
  },
  value: {
    color: "white",
    fontWeight: 400,
    fontSize: 14,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 15, 
    borderRadius: 15,
    marginVertical: 8,
    alignItems: "center",
    alignSelf: "flex-start", 
  },
  button2: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    paddingRight: 100,
    paddingLeft: 15,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: "center",
    alignSelf: "flex-start", 
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 400,
  },
  historyTitle: {
    color: "white",
    fontWeight: 400,
    fontSize: 16,
    marginBottom: 8,
    marginLeft:6
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  date: {
    color: "#FFFF",
    fontSize: 14,
    fontWeight: 400,
    marginRight: 10,
  },
  type: {
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
  },
  positive: {
    color: "#4CAF50", 
  },
  negative: {
    color: "#F44336", 
  },
});
