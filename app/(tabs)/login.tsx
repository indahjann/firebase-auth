import React from 'react';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../../firebaseConfig';

export default function LoginScreen() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    
    const handleRegister = async () => {
        if (email === '' || password == '') {
            Alert.alert('Error', 'Email dan password tidak boleh kosong')
            return;
        }
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            Alert.alert('Register Gagal', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    //fungsi login
    const handleLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Error', 'Email dan password tidak boleh kosong')
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            Alert.alert('Login Gagal', error.message);
        } finally {
            setLoading(false);
        }
    };
    return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login / Register</Text>
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
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Login" onPress={handleLogin} />
          <View style={{ marginVertical: 10 }} />
          <Button title="Register" onPress={handleRegister} color="gray" />
        </>
      )}
    </SafeAreaView>
  );
}

// (Salin 'styles' dari App.js sebelumnya)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
});


