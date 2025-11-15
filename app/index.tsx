import { onAuthStateChanged, signOut } from 'firebase/auth';
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
import { clearLoginInfo, getLoginInfo } from '../storage';

// Definisikan tipe data Mahasiswa
interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
}

export default function HomeScreen() {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<{
    uid: string;
    email: string | null;
    loginTime?: string;
  } | null>(null);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      console.log('[FIRESTORE] Mengambil data mahasiswa...');
      const mahasiswaCollection = collection(db, 'mahasiswa');
      const snapshot = await getDocs(mahasiswaCollection);

      if (!snapshot.empty) {
        const list: Mahasiswa[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            nama: data.nama,
            nim: data.nim,
            // Support both new field `jurusan` and old `program_studi` for compatibility
            jurusan: data.jurusan ?? data.program_studi ?? '',
          } as Mahasiswa;
        });
        console.log(`[FIRESTORE] Berhasil ambil ${list.length} data mahasiswa`);
        setMahasiswaList(list);
      } else {
        console.log('[FIRESTORE] Data mahasiswa kosong');
        setMahasiswaList([]);
      }
    } catch (e: any) {
      console.error('[FIRESTORE] Error mengambil data:', e);
      Alert.alert('Error', 'Gagal mengambil data mahasiswa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[HOME] Screen dimuat');
    // Ambil info login dari MMKV
    const storedInfo = getLoginInfo();
    console.log('[HOME] Data user dari MMKV:', storedInfo);
    setUserInfo(storedInfo);

    // Fetch data mahasiswa only if Firebase already has a current user
    if (auth.currentUser) {
      fetchMahasiswa();
    } else {
      console.log('[HOME] Tidak ada user terautentikasi saat mount — melewatkan fetch');
      setLoading(false);
    }
  }, []);

  // Jika auth di-restore setelah app start, fetch setelah user tersedia
  useEffect(() => {
    console.log('[HOME] Menambahkan listener onAuthStateChanged untuk auto-fetch');
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('[HOME] onAuthStateChanged:', u ? `user ${u.email}` : 'no user');
      if (u) {
        fetchMahasiswa();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('[AUTH] Proses logout...');
      await signOut(auth);
      clearLoginInfo(); // Bersihkan MMKV
      console.log('[AUTH] Logout berhasil');
    } catch (error: any) {
      console.error('[AUTH] Logout gagal:', error);
      Alert.alert('Logout Gagal', error.message);
    }
  };



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
        {/* Header dengan Logout */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Data Mahasiswa App</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* MMKV Debug Section - INI YANG PENTING! */}
        <View style={styles.mmkvSection}>
          <Text style={styles.mmkvTitle}>MMKV Storage Debug</Text>
          <Text style={styles.mmkvSubtitle}>
            Data login disimpan di MMKV (persistent local storage)
          </Text>

          {userInfo ? (
            <View style={styles.mmkvDataContainer}>
              <View style={styles.mmkvRow}>
                <Text style={styles.mmkvLabel}>Status:</Text>
                <Text style={styles.mmkvValue}>Data tersimpan di MMKV</Text>
              </View>
              <View style={styles.mmkvRow}>
                <Text style={styles.mmkvLabel}>Email:</Text>
                <Text style={styles.mmkvValue}>{userInfo.email || 'N/A'}</Text>
              </View>
              <View style={styles.mmkvRow}>
                <Text style={styles.mmkvLabel}>UID:</Text>
                <Text style={styles.mmkvValue} numberOfLines={1}>
                  {userInfo.uid}
                </Text>
              </View>
              {userInfo.loginTime && (
                <View style={styles.mmkvRow}>
                  <Text style={styles.mmkvLabel}>Login:</Text>
                  <Text style={styles.mmkvValue}>
                    {new Date(userInfo.loginTime).toLocaleString('id-ID')}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.mmkvNoData}>Tidak ada data di MMKV</Text>
          )}
        </View>

        {/* Daftar Mahasiswa Section */}
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

  // MMKV Debug Section Styles
  mmkvSection: {
    backgroundColor: '#FFF3CD',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  mmkvTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mmkvSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  mmkvDataContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  mmkvRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  mmkvLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  mmkvValue: {
    fontSize: 14,
    color: '#007AFF',
    flex: 1,
  },
  mmkvNoData: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 15,
  },

  // Mahasiswa Section Styles
  mahasiswaSection: {
    margin: 15,
    marginTop: 0,
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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