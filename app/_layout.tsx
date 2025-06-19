import { Slot, useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const path = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('user');
      if (!user && path !== '/login' && path !== '/register') {
        router.replace('/login');
      }
      if (user && (path === '/login' || path === '/register')) {
        router.replace('/(tabs)');
      }
      setLoading(false);
    })();
  }, [path]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }
  return <Slot />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
