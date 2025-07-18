// components/DashboardCard.tsx
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DashboardCardProps {
  icon: string; // Filename, e.g., "Group1.png"
  title: string;
  onPress?: () => void;
  fullWidth?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  onPress,
  fullWidth,
}) => (
  <TouchableOpacity
    style={[styles.card, fullWidth && styles.fullWidth]}
    activeOpacity={0.85}
    onPress={onPress}
  >
    {!fullWidth ? (
      <>
        <View style={styles.iconRow}>
          <View style={styles.iconContainer}>
            <Image
              source={getIconSource(icon)}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.arrowCircle}>
            <Image
              source={require("@/assets/images/icons/arrow.png")}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
      </>
    ) : (
      <View style={[styles.iconRow]}>
        <View
          style={[
            styles.iconContainer,
            {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            },
          ]}
        >
          <Image
            source={getIconSource(icon)}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          <Text style={[styles.title, { marginTop: 0 }]}>{title}</Text>
        </View>

        <View style={styles.arrowCircle}>
          <Image
            source={require("@/assets/images/icons/arrow.png")}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
        </View>
      </View>
    )}
  </TouchableOpacity>
);

// Helper to resolve icon path
function getIconSource(filename: string) {
  // Add all your icons here for static require
  const icons: Record<string, any> = {
    "Group1.png": require("@/assets/images/icons/Group1.png"),
    "Group2.png": require("@/assets/images/icons/Group2.png"),
    "Group3.png": require("@/assets/images/icons/Group3.png"),
    "Group4.png": require("@/assets/images/icons/Group4.png"),
    "Group5.png": require("@/assets/images/icons/Group5.png"),
    "Group6.png": require("@/assets/images/icons/Group6.png"),
    // Add more as needed
  };
  return icons[filename] || require("@/assets/images/icons/Group1.png"); // fallback
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    // minHeight: 110,
    backgroundColor: "#23244A",
    borderRadius: 18,
    margin: 8,
    padding: 16,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fullWidth: {
    flexBasis: "90%",
    padding: 16,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    borderRadius: 10,
    padding: 8,
    alignSelf: "flex-start",
  },
  arrowCircle: {
    //backgroundColor: "#2F2963",
    borderRadius: 12,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 18,
    textAlign: "left",
  },
});

export default memo(DashboardCard);
