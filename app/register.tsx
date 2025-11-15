import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi password tidak sama');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    console.log('[REGISTER] Mencoba registrasi dengan email:', email);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('[REGISTER] Registrasi berhasil untuk:', user.email);

      // ❗ User otomatis login setelah register → kita force logout
      try {
        await signOut(auth);
        console.log('[REGISTER] User di-logout otomatis (menghindari auto-login)');
      } catch (err) {
        console.warn('[REGISTER] Gagal logout otomatis:', err);
      }

      Alert.alert(
        'Registrasi Berhasil',
        'Akun Anda telah dibuat. Silakan login.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/login');
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('[REGISTER] Registrasi gagal:', error.code);
      let msg = error.message;

      if (error.code === 'auth/email-already-in-use') msg = 'Email sudah terdaftar';
      if (error.code === 'auth/invalid-email') msg = 'Email tidak valid';
      if (error.code === 'auth/weak-password') msg = 'Password terlalu lemah';

      Alert.alert('Registrasi Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Buat Akun Baru</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Daftar</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, fontSize: 16 },
  registerButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  registerButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: '#666' },
  loginLink: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
});
