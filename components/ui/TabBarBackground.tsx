import { StyleSheet, View } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
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
  return 0;
}
