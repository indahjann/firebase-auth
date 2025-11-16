import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/navbar';
import { auth, db } from '../firebaseConfig';
import { getLoginInfo } from '../storage';

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

  /**
   * Fetch data mahasiswa dari Firestore
   */
  const fetchMahasiswa = async () => {
    if (!auth.currentUser) {
      console.log('[FIRESTORE] User belum authenticated, skip fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('[FIRESTORE] Mengambil data mahasiswa untuk user:', auth.currentUser.email);

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
      // Tidak tampilkan alert error karena bisa terjadi saat app reload
    } finally {
      setLoading(false);
    }
  };

  // Listen to Firebase Auth state dan fetch data saat user ready
  useEffect(() => {
    console.log('[INDEX] Setup auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('[INDEX] User authenticated:', user.email);
        // Firebase Auth ready, fetch data
        fetchMahasiswa();
      } else {
        // Firebase Auth belum ready atau user belum login
        const loginInfo = getLoginInfo();
        
        if (loginInfo) {
          // Ada data di MMKV, tunggu Firebase Auth restore session
          console.log('[INDEX] MMKV menunjukkan user pernah login, tunggu Firebase Auth...');
          
          // Tunggu maksimal 10 detik untuk Firebase Auth ready
          let retries = 0;
          while (!auth.currentUser && retries < 20) {
            await new Promise(resolve => setTimeout(resolve, 500));
            retries++;
            
            if (auth.currentUser) {
              console.log('[INDEX] Firebase Auth ready setelah', retries * 500, 'ms');
              fetchMahasiswa();
              return;
            }
          }
          
          console.log('[INDEX] Firebase Auth timeout setelah 10 detik');
          setLoading(false);
        } else {
          console.log('[INDEX] No user authenticated');
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
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
          <Text style={styles.headerTitle}>Data Mahasiswa</Text>
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
      
      <Navbar />
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
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
