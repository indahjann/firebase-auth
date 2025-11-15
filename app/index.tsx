// Lokasi: app/index.tsx

import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  type ListRenderItem, // Import tipe untuk renderItem FlatList
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { clearLoginInfo, getLoginInfo } from '../storage';

// 1. Definisikan tipe data Mahasiswa
interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  program_studi: string;
}

export default function HomeScreen() {
  // 2. Gunakan tipe Mahasiswa[] (array of Mahasiswa) untuk state list
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<{uid: string; email: string | null} | null>(null);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const mahasiswaCollection = collection(db, 'mahasiswa');
      const snapshot = await getDocs(mahasiswaCollection);

      if (!snapshot.empty) {
        const list: Mahasiswa[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Mahasiswa));
        setMahasiswaList(list);
      } else {
        console.log('Data tidak ditemukan');
        setMahasiswaList([]);
      }
    } catch (e: any) {
      console.error('Error fetching documents: ', e);
      Alert.alert('Error', 'Gagal mengambil data mahasiswa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ambil info login dari MMKV
    const storedInfo = getLoginInfo();
    console.log('Data dari MMKV di HomeScreen:', storedInfo);
    setUserInfo(storedInfo);
    
    // Fetch data mahasiswa
    fetchMahasiswa();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearLoginInfo(); // Bersihkan data dari MMKV
      Alert.alert('Logout Berhasil', 'Anda telah keluar.');
    } catch (error: any) {
      Alert.alert('Logout Gagal', error.message);
    }
  };

  // 3. Tentukan tipe untuk 'renderItem' menggunakan ListRenderItem
  const renderItem: ListRenderItem<Mahasiswa> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.nama}</Text>
      <Text>
        {item.nim} - {item.program_studi}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Data Mahasiswa</Text>
      
      {/* Tampilkan info user dari MMKV */}
      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Login sebagai: {userInfo.email}</Text>
          <Text style={styles.userInfoText}>UID: {userInfo.uid}</Text>
        </View>
      )}
      
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={mahasiswaList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={fetchMahasiswa}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Tidak ada data mahasiswa. Silakan tambahkan data di Firebase Console.
            </Text>
          }
        />
      )}
      <Button title="Logout" onPress={handleLogout} color="red" />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  userInfoText: {
    fontSize: 14,
    color: '#1565C0',
    marginBottom: 4,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});