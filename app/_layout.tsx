import { useEffect, useState } from 'react';
import { Slot, router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem('user');
      const isAuthPage = pathname === '/login' || pathname === '/register';

      if (!user && !isAuthPage) {
        router.replace('/login');
      }

      if (user && isAuthPage) {
        router.replace('./tabs/index'); // Redirect to home tab
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return <Slot />;
}

