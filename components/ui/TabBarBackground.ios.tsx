import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';

export default function CustomTabBarBackground() {
  return (
    <View style={styles.background} />
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1e293b', // Dark blue/indigo background
    borderRadius: 30,
  },
});

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
