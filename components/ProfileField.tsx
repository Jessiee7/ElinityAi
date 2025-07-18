// components/ProfileField.tsx
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface ProfileFieldProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  placeholder?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
    />
  </View>
);

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: { color: "#b0b3c6", fontSize: 13, marginBottom: 4 },
  input: {
    backgroundColor: "#4B357A",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
  },
});

export default ProfileField;
