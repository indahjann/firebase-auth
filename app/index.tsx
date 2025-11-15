import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig';
import { clearLoginInfo } from '../storage';
import { useAuth } from './_layout';

// ============================================
// Interface & Types
// ============================================

interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
}

// ============================================
// Home Screen Component
// ============================================

export default function HomeScreen() {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  /**
   * Fetch data mahasiswa dari Firestore
   */
  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      console.log('[FIRESTORE] Mengambil data mahasiswa...');

      const mahasiswaCollection = collection(db, 'mahasiswa');
      const snapshot = await getDocs(mahasiswaCollection);

      const list: Mahasiswa[] = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          nama: data.nama,
          nim: data.nim,
          jurusan: data.jurusan,
        };
      });

      setMahasiswaList(list);
      console.log(`[FIRESTORE] Berhasil ambil ${list.length} data mahasiswa`);
    } catch (e: any) {
      console.error('[FIRESTORE] Error:', e);
      Alert.alert('Error', 'Gagal mengambil data mahasiswa.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle logout user
   * 1. Clear MMKV storage
   * 2. Set isAuthenticated ke false
   * 3. Navigate ke login page
   * 4. Sign out dari Firebase (background)
   */
  const handleLogout = async () => {
    try {
      console.log('[LOGOUT] Memulai logout...');
      
      clearLoginInfo(); // Hapus semua data MMKV
      setIsAuthenticated(false); // Langsung set auth state ke false
      console.log('[LOGOUT] isAuthenticated set to FALSE');
      
      router.replace('/login'); // Navigate ke login page
      
      await signOut(auth); // Logout dari Firebase (background)
      console.log('[LOGOUT] Firebase signOut selesai');
    } catch (error: any) {
      console.error('[LOGOUT] Error:', error);
      Alert.alert('Logout Gagal', error.message);
    }
  };

  // Fetch data saat screen pertama kali dibuka
  useEffect(() => {
    fetchMahasiswa();
  }, []);

  /**
   * Render item untuk FlatList
   */
  const renderItem: ListRenderItem<Mahasiswa> = ({ item }) => (
    <View style={styles.mahasiswaCard}>
      <Text style={styles.mahasiswaName}>{item.nama}</Text>
      <Text style={styles.cardText}>NIM: {item.nim}</Text>
      <Text style={styles.cardText}>Jurusan: {item.jurusan}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Data Mahasiswa App</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Daftar Mahasiswa */}
        <View style={styles.mahasiswaSection}>
          <Text style={styles.sectionTitle}>Daftar Mahasiswa</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Mengambil data...</Text>
            </View>
          ) : mahasiswaList.length > 0 ? (
            <FlatList
              data={mahasiswaList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              refreshing={loading}
              onRefresh={fetchMahasiswa}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada data mahasiswa</Text>
              <Text style={styles.emptySubtext}>
                Tambahkan data di Firebase Console
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  mahasiswaSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  mahasiswaCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 3,
  },
  mahasiswaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#666',
    marginTop: 3,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
