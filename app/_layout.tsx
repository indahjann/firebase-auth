// Lokasi: app/_layout.tsx

import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, type User } from 'firebase/auth'; // Import tipe User
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../firebaseConfig';
import { clearLoginInfo, saveLoginInfo } from '../storage';

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
    if (user === undefined) {
      setLoading(true);
      return;
    }

    setLoading(false); // Selesai loading

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (user) {
      // User sudah login
      if (inAuthGroup) {
        // Masih di halaman login/register -> redirect ke home
        console.log('✅ User logged in, redirecting to home...');
        setTimeout(() => router.replace('/'), 100);
      }
    } else {
      // User belum login
      if (!inAuthGroup) {
        // Tidak di halaman login/register -> redirect ke login
        console.log('❌ User not logged in, redirecting to login...');
        setTimeout(() => router.replace('/login'), 100);
      }
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
      <Stack.Screen name="register" />
    </Stack>
  );
};

export default RootLayout;