import { createMMKV } from 'react-native-mmkv'; // PERBAIKAN IMPORT
import { User } from 'firebase/auth';

// Inisialisasi MMKV storage
export const storage = createMMKV();

// 1. Definisikan tipe data yang akan disimpan
interface LoginInfo {
  uid: string;
  email: string | null; // email bisa jadi null
}

/**
 * Menyimpan data login pengguna
 * Kita beri tipe 'User' pada parameter
 */
export const saveLoginInfo = (user: User): void => {
  try {
    const userInfo: LoginInfo = {
      uid: user.uid,
      email: user.email,
    };
    storage.set('loginInfo', JSON.stringify(userInfo));
    console.log('Info login disimpan di MMKV:', userInfo);
  } catch (e) {
    console.error('Gagal menyimpan ke MMKV', e);
  }
};

/**
 * Mengambil data login pengguna
 * Kita beri tahu TypeScript tipe kembaliannya
 */
export const getLoginInfo = (): LoginInfo | null => {
  try {
    const value = storage.getString('loginInfo');
    // Parse sebagai LoginInfo atau kembalikan null
    return value ? (JSON.parse(value) as LoginInfo) : null;
  } catch (e) {
    console.error('Gagal mengambil dari MMKV', e);
    return null;
  }
};

/**
 * Menghapus data login (untuk logout)
 * Tipe kembaliannya adalah 'void' (tidak ada)
 */
export const clearLoginInfo = (): void => {
  try {
    storage.remove('loginInfo');
    console.log('Info login dihapus dari MMKV.');
  } catch (e) {
    console.error('Gagal menghapus dari MMKV', e);
  }
};