// Lokasi: app/_layout.tsx

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged, type User } from 'firebase/auth'; // Import tipe User
import { auth } from '../../firebaseConfig';
import { saveLoginInfo, clearLoginInfo } from '../../storage';
import { Stack, useRouter, useSegments } from 'expo-router';

// Custom Hook untuk memisahkan logika auth
const useAuth = () => {
  // Tipe state User bisa:
  // - undefined: saat pertama kali load, belum dicek
  // - User: jika login
  // - null: jika logout
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Parameter currentUser otomatis bertipe 'User | null'
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        saveLoginInfo(currentUser); // SIMPAN KE MMKV
        setUser(currentUser);
      } else {
        clearLoginInfo(); // HAPUS DARI MMKV
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user };
};

const RootLayout = () => {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true); // Tipe state loading

  useEffect(() => {
    // Tunggu sampai status user-nya jelas (bukan undefined)
    if (user === undefined) return;

    setLoading(false); // Selesai loading

    const inAuthGroup = segments[0] === 'login';

    if (user && inAuthGroup) {
      // User login tapi masih di hal. login -> lempar ke home
      router.replace('/');
    } else if (!user && !inAuthGroup) {
      // User logout tapi TIDAK di hal. login -> lempar ke login
      router.replace('/login');
    }
  }, [user, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Tampilan navigasi
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
  );
};

export default RootLayout;