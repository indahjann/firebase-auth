import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, type User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { auth } from '../firebaseConfig';
import { clearLoginInfo, saveLoginInfo } from '../storage';

const RootLayout = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const segments = useSegments();
  const router = useRouter();

  console.log('[LAYOUT] Component rendered, user state:', user?.email || String(user));

  // Auth listener
  useEffect(() => {
    console.log('[AUTH] Memulai auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('[AUTH] ⚡ Auth state changed:', currentUser?.email || 'null');
      
      if (currentUser) {
        console.log('[AUTH] Saving user info to MMKV...');
        saveLoginInfo(currentUser);
        console.log('[AUTH] Setting user state...');
        setUser(currentUser);
        console.log('[AUTH] User state updated!');
      } else {
        console.log('[AUTH] Clearing login info...');
        clearLoginInfo();
        setUser(null);
      }
    });

    return () => {
      console.log('[AUTH] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Navigation handler - optimized tanpa delay
  useEffect(() => {
    if (user === undefined) {
      // Masih loading auth state
      console.log('[ROUTING] Menunggu auth state...');
      return;
    }

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
    
    console.log('[ROUTING] ========== NAVIGATION CHECK ==========');
    console.log('[ROUTING] Current segment:', segments[0] || 'root');
    console.log('[ROUTING] User:', user ? `logged in (${user.email})` : 'not logged in');
    console.log('[ROUTING] In auth group:', inAuthGroup);

    if (user && inAuthGroup) {
      // User login tapi masih di login/register page
      console.log('[ROUTING] ✅ Redirecting to HOME...');
      router.replace('/');
    } else if (!user && !inAuthGroup) {
      // User tidak login tapi tidak di auth pages
      console.log('[ROUTING] ✅ Redirecting to LOGIN...');
      router.replace('/login');
    } else {
      console.log('[ROUTING] ✓ Already in correct route');
    }
    console.log('[ROUTING] =======================================');
  }, [user, segments]);

  // Loading screen
  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default RootLayout;