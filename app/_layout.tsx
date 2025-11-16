import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { auth } from '../firebaseConfig';
import { getLoginInfo, saveLoginInfo } from '../storage';

// ============================================
// Auth Context untuk share authentication state
// ============================================

const AuthContext = createContext<{
  setIsAuthenticated: (value: boolean) => void;
} | null>(null);

/**
 * Hook untuk mengakses authentication context
 * Digunakan di screen yang butuh kontrol langsung atas auth state (misal: logout)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
};

// ============================================
// Root Layout Component
// ============================================

const RootLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [hasInitialRouted, setHasInitialRouted] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  console.log('[LAYOUT] Render, isAuthenticated:', isAuthenticated);

  // ============================================
  // 1. INITIAL LOAD - Cek sesi login dari MMKV
  // ============================================
  useEffect(() => {
    console.log('[INIT] Mengambil user dari MMKV...');

    const saved = getLoginInfo();

    if (saved) {
      // User sudah pernah login dan datanya masih tersimpan
      console.log('[INIT] USER DITEMUKAN di MMKV:', saved.email);
      setIsAuthenticated(true);
    } else {
      // Belum ada data login
      console.log('[INIT] Tidak ada user di MMKV');
      setIsAuthenticated(false);
    }
  }, []);

  // ============================================
  // 2. FIREBASE AUTH LISTENER
  // ============================================
  useEffect(() => {
    console.log('[AUTH] Memulai auth listener...');

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      console.log('[AUTH] ⚡ Firebase user changed:', currentUser?.email || 'null');

      const stored = getLoginInfo();
      console.log('[AUTH] MMKV stored:', stored?.email || 'null');

      // CASE 1: User berhasil login
      if (currentUser) {
        saveLoginInfo(currentUser);
        setIsAuthenticated(true);
        console.log('[AUTH] User login & disimpan ke MMKV');
        return;
      }

      // CASE 2: User logout
      if (!currentUser && !stored) {
        console.log('[AUTH] User logout confirmed');
        setIsAuthenticated(false);
        console.log('[AUTH] User state set to FALSE');
        return;
      }

      // CASE 3: App reload - Firebase kasih null sementara
      // MMKV masih ada data → abaikan, user tetap login
      if (!currentUser && stored) {
        console.log('[AUTH] Firebase NULL diabaikan (MMKV masih ada - app reload)');
        return;
      }
    });

    return unsub;
  }, []);

  // ============================================
  // 3. ROUTING - Auto navigate berdasarkan auth state
  // ============================================
  useEffect(() => {
    if (isAuthenticated === undefined) return; // Masih loading, jangan navigate

    const inAuth = segments[0] === 'login' || segments[0] === 'register';
    const isRootOrEmpty = !segments[0];

    console.log('[ROUTING] isAuthenticated =', isAuthenticated, 'segment =', segments[0]);

    // Initial routing: redirect ke welcome saat pertama kali load jika sudah login
    if (isAuthenticated && isRootOrEmpty && !hasInitialRouted) {
      router.replace('/welcome');
      setHasInitialRouted(true);
      console.log('[ROUTING] → WELCOME (initial load)');
      return;
    }

    // Protect routes: redirect ke login jika belum login
    if (!isAuthenticated && !inAuth) {
      router.replace('/login');
      console.log('[ROUTING] → LOGIN');
    }
  }, [isAuthenticated, segments]);

  // ============================================
  // LOADING UI
  // ============================================
  if (isAuthenticated === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Memuat sesi...</Text>
      </View>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <AuthContext.Provider value={{ setIsAuthenticated }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </AuthContext.Provider>
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

