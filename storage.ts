import { createMMKV } from 'react-native-mmkv';
import { User } from 'firebase/auth';

// Inisialisasi MMKV storage
export const storage = createMMKV();

// Definisikan tipe data yang akan disimpan
interface LoginInfo {
  uid: string;
  email: string | null;
  loginTime: string; // Tambahan untuk tracking
}

/**
 * Menyimpan data login pengguna ke MMKV
 */
export const saveLoginInfo = (user: User): void => {
  try {
    const userInfo: LoginInfo = {
      uid: user.uid,
      email: user.email,
      loginTime: new Date().toISOString(),
    };
    storage.set('loginInfo', JSON.stringify(userInfo));
    console.log('[MMKV] Data DISIMPAN ke storage:', userInfo);
  } catch (e) {
    console.error('[MMKV] Gagal menyimpan ke storage:', e);
  }
};

/**
 * Mengambil data login pengguna dari MMKV
 */
export const getLoginInfo = (): LoginInfo | null => {
  try {
    const value = storage.getString('loginInfo');
    const data = value ? (JSON.parse(value) as LoginInfo) : null;
    console.log('[MMKV] Data DIAMBIL dari storage:', data);
    return data;
  } catch (e) {
    console.error('[MMKV] Gagal mengambil dari storage:', e);
    return null;
  }
};

/**
 * Menghapus data login dari MMKV (untuk logout)
 */
export const clearLoginInfo = (): void => {
  try {
    // Gunakan .delete() atau .remove() tergantung versi MMKV
    // Coba delete dulu, kalau error fallback ke remove
    if ('delete' in storage) {
      (storage as any).delete('loginInfo');
    } else {
      storage.remove('loginInfo');
    }
    console.log('[MMKV] Data DIHAPUS dari storage');
  } catch (e) {
    console.error('[MMKV] Gagal menghapus dari storage:', e);
  }
};

/**
 * Debug: Ambil raw data untuk ditampilkan
 */
export const getRawMMKVData = (): string => {
  try {
    const value = storage.getString('loginInfo');
    return value || 'null';
  } catch (e) {
    return 'Error reading MMKV';
  }
};