// Lokasi: app/index.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Button,
  type ListRenderItem, // Import tipe untuk renderItem FlatList
} from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { auth, db } from '../../firebaseConfig';
import { getLoginInfo } from '../../storage';

// 1. Definisikan tipe data Mahasiswa
interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
}

export default function HomeScreen() {
  // 2. Gunakan tipe Mahasiswa[] (array of Mahasiswa) untuk state list
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const dbRef = ref(db, 'mahasiswa');
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        // Tipe 'list' akan otomatis dicek oleh TypeScript
        const list: Mahasiswa[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
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
    fetchMahasiswa();
    const storedInfo = getLoginInfo();
    console.log('Data dari MMKV di HomeScreen:', storedInfo);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert('Logout Gagal', error.message);
    }
  };

  // 3. Tentukan tipe untuk 'renderItem' menggunakan ListRenderItem
  const renderItem: ListRenderItem<Mahasiswa> = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.nama}</Text>
      <Text>
        {item.nim} - {item.jurusan}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Data Mahasiswa</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={mahasiswaList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={fetchMahasiswa}
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
});