// app/(tabs)/index.tsx
import DashboardCard from "@/components/DashboardCard";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const user = {
  name: "Suraj",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Replace with your avatar logic
};

const sections = [
  {
    data: [
      { icon: "Group1.png", title: "Explore your daily Recommendation" },
      { icon: "Group2.png", title: "Prompt your way to your people" },
    ],
  },
  {
    data: [
      { icon: "Group3.png", title: "Go to your Social Home", fullWidth: true },
    ],
  },
  {
    data: [
      { icon: "Group4.png", title: "Relationship Dashboard" },
      { icon: "Group5.png", title: "Question Cards" },
    ],
  },
  {
    data: [
      { icon: "Group6.png", title: "Relationship Coach" },
      { icon: "Group6.png", title: "Relationship Pad" },
    ],
  },
  {
    data: [
      { icon: "flower", title: "Your Relationship Home", fullWidth: true },
    ],
  },
  {
    data: [
      { icon: "mic", title: "Voice Journal" },
      { icon: "book", title: "Smart Journal" },
    ],
  },
  {
    data: [
      { icon: "chatbubbles", title: "ElinityAI chat" },
      { icon: "leaf", title: "AI coach or AI therapist" },
    ],
  },
  {
    data: [{ icon: "flower", title: "My Sanctuary", fullWidth: true }],
  },
];

const HomeScreen = () => {
  const renderSection = ({
    item,
  }: {
    item: { data: { icon: string; title: string }[] };
  }) => (
    <View style={styles.sectionRow}>
      {item.data.map(
        (
          card: { icon: string; title: string; fullWidth?: boolean },
          idx: number
        ) => (
          <DashboardCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            fullWidth={card.fullWidth}
            onPress={() => {
              /* navigation logic */
            }}
          />
        )
      )}
    </View>
  );

  const sectionList = useMemo(() => sections, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/Profile/ProfileCreate")}
          >
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.greeting}>Hey {user.name},</Text>
      <Text style={styles.subtitle}>What would You like to do?</Text>
      <FlatList
        data={sectionList}
        renderItem={renderSection}
        keyExtractor={(_, idx) => `section-${idx}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#15173C",
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    // marginTop: 8,
    // marginBottom: 18,
    justifyContent: "space-between",
    marginVertical: 15,
  },
  logo: {
    width: 35,
    height: 35,
    //resizeMode: "contain",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginRight: 14,
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(23, 29, 87, 0.9)",
    borderWidth: 0.4,
    borderColor: "#ccc",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
    marginLeft: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#b0b3c6",
    marginBottom: 18,
    marginLeft: 15,
  },
  listContent: {
    paddingBottom: 32,
    paddingHorizontal: 10,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 8,
  },
});

export default HomeScreen;
