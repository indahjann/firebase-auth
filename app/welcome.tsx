import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/navbar';
import { getLoginInfo } from '../storage';

export default function WelcomeScreen() {
  const loginInfo = getLoginInfo();
  const userName = loginInfo?.email?.split('@')[0] || 'Pengguna';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Selamat Datang!</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.infoText}>
          Gunakan menu di bawah untuk navigasi
        </Text>
      </View>
      
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  userName: {
    fontSize: 24,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
