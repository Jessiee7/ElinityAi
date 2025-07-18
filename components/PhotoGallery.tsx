// components/PhotoGallery.tsx
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface PhotoGalleryProps {
  photos: string[];
  onAdd: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onAdd }) => (
  <View style={styles.gallery}>
    <FlatList
      data={photos}
      horizontal
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.photo} />
      )}
      keyExtractor={(item, idx) => item + idx}
      ListFooterComponent={
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <Image
            source={require("@/assets/images/icons/edit.png")}
            style={styles.addIcon}
          />
        </TouchableOpacity>
      }
    />
  </View>
);

const styles = StyleSheet.create({
  gallery: { flexDirection: "row", marginTop: 8 },
  photo: { width: 60, height: 60, borderRadius: 12, marginRight: 8 },
  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#4B357A",
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: { width: 28, height: 28 },
});

export default PhotoGallery;
