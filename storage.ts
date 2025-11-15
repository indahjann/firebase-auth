import { User } from 'firebase/auth';
import { createMMKV } from 'react-native-mmkv';

// ============================================
// MMKV Storage untuk menyimpan data lokal
// ============================================

export const storage = createMMKV();

// Interface untuk data login yang disimpan
interface LoginInfo {
  uid: string;
  email: string | null;
  loginTime: string;
}

/**
 * Menyimpan informasi login user ke MMKV storage
 * Dipanggil saat user berhasil login
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
 * Mengambil informasi login dari MMKV storage
 * Return null jika tidak ada data (belum login / sudah logout)
 */
export const getLoginInfo = (): LoginInfo | null => {
  try {
    const value = storage.getString('loginInfo');
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('[MMKV] Gagal mengambil dari storage:', e);
    return null;
  }
};

/**
 * Menghapus SEMUA data dari MMKV saat logout
 * Memastikan tidak ada sisa data login
 */
export const clearLoginInfo = (): void => {
  try {
    storage.clearAll();
    console.log('[MMKV] Semua data DIHAPUS dari storage');
  } catch (e) {
    console.error('[MMKV] Gagal menghapus dari storage:', e);
  }
};

