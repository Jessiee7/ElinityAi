// components/ProfileSection.tsx
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileSectionProps {
  title: string;
  icon: any;
  onEdit?: () => void;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  icon,
  onEdit,
  children,
}) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
          <Image
            source={require("@/assets/images/icons/edit.png")}
            style={styles.editIcon}
          />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#3B2562",
    borderRadius: 18,
    marginVertical: 10,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: { width: 22, height: 22, marginRight: 8 },
  title: { color: "#fff", fontWeight: "700", fontSize: 16, flex: 1 },
  editBtn: { padding: 4 },
  editIcon: { width: 18, height: 18 },
  content: {},
});

export default ProfileSection;
