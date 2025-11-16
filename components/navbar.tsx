import { usePathname, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../app/_layout';
import { auth } from '../firebaseConfig';
import { clearLoginInfo } from '../storage';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      clearLoginInfo();
      setIsAuthenticated(false);
      router.replace('/login');
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Logout Gagal', error.message);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navButton, isActive('/welcome') && styles.activeButton]}
        onPress={() => router.push('/welcome')}
      >
        <Text style={[styles.navText, isActive('/welcome') && styles.activeText]}>
          Welcome
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, isActive('/') && styles.activeButton]}
        onPress={() => router.push('/')}
      >
        <Text style={[styles.navText, isActive('/') && styles.activeText]}>
          Data
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.navText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#0051a8',
  },
  navButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  navText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    fontWeight: 'bold',
  },
});
