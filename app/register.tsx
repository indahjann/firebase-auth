import { Feather } from '@expo/vector-icons';
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
import { clearLoginInfo } from '../storage';
import { useAuth } from './_layout';

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

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

      // PENTING: Clear storage DULU sebelum signOut
      // Karena signOut akan trigger auth listener yang cek MMKV
      clearLoginInfo();
      setIsAuthenticated(false);
      console.log('[REGISTER] Storage cleared & isAuthenticated set to false');

      try {
        await signOut(auth);
        console.log('[REGISTER] Firebase signOut selesai');
      } catch (err) {
        console.warn('[REGISTER] Gagal logout otomatis:', err);
      }

      // Reset loading state
      setLoading(false);

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

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((s) => !s)}
          accessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowConfirmPassword((s) => !s)}
          accessibilityLabel={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

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
  input: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 12, height: 50, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, fontSize: 16 },
  registerButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  registerButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: '#666' },
  loginLink: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  passwordContainer: { position: 'relative', marginBottom: 15 },
  passwordInput: { paddingRight: 44 },
  eyeButton: { position: 'absolute', right: 12, top: 0, bottom: 14, justifyContent: 'center', padding: 4 },
});
