# Firebase Authentication + MMKV + Firestore - React Native

Aplikasi React Native dengan Expo yang mengimplementasikan:
1. ✅ **Firebase Authentication** (Login/Register)
2. ✅ **MMKV Storage** (Simpan info login secara lokal)
3. ✅ **Firebase Firestore** (Database cloud untuk data mahasiswa)
4. ✅ **TypeScript** (Type safety)

## 📋 Fitur yang Sudah Diimplementasi

### 1. Firebase Authentication
- **Register**: Membuat akun baru dengan email & password
- **Login**: Masuk dengan akun yang sudah ada
- **Logout**: Keluar dari aplikasi
- **Auto-redirect**: Otomatis redirect ke home jika sudah login

### 2. MMKV Storage
- **Simpan otomatis**: Saat login berhasil, info user (uid & email) disimpan ke MMKV
- **Bersihkan otomatis**: Saat logout, data dihapus dari MMKV
- **Tampilan di UI**: Info login ditampilkan di home screen
- **Persistent**: Data tetap ada meskipun app ditutup

### 3. Firebase Firestore
- **Fetch data**: Mengambil semua data mahasiswa dari collection `mahasiswa`
- **Realtime update**: Pull-to-refresh untuk update data terbaru
- **TypeScript interface**: Type-safe data handling
- **Empty state**: Menampilkan pesan jika tidak ada data

### 4. Seed Data (Development Helper)
- **Tombol populate**: Tambah data sample mahasiswa dengan satu klik
- **5 data sample**: Otomatis menambahkan 5 mahasiswa contoh

## 🚀 Cara Menggunakan

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Firebase
Pastikan `firebaseConfig.ts` sudah terisi dengan kredensial Firebase Anda.

### 3. Jalankan Aplikasi
```bash
npx expo start
```

### 4. Populate Data Mahasiswa (Pertama Kali)
1. Buka aplikasi
2. Di halaman login, klik tombol "📊 Tambah Data Sample Mahasiswa"
3. Data akan ditambahkan ke Firestore
4. Login untuk melihat data

### 5. Verifikasi MMKV
Setelah login, buka console/terminal untuk melihat log:
```
Data dari MMKV di HomeScreen: { uid: "...", email: "..." }
```

## 📁 Struktur File Penting

```
├── app/
│   ├── _layout.tsx          # Auth state management & routing
│   ├── index.tsx            # Home screen (data mahasiswa)
│   └── login.tsx            # Login/Register screen
├── firebaseConfig.ts        # Firebase configuration
├── storage.ts               # MMKV functions (save/get/clear)
└── utils/
    └── seedData.ts          # Helper untuk populate data sample
```

## 🔧 Konfigurasi Firebase Firestore

### Struktur Data di Firestore:
```
Collection: mahasiswa
├── Document ID (auto-generated)
│   ├── nama: string
│   ├── nim: string
│   └── program_studi: string
```

### Contoh Document:
```json
{
  "nama": "Budi Santoso",
  "nim": "12345001",
  "program_studi": "Teknik Informatika"
}
```

## 🛠️ Yang Sudah Diperbaiki

### ❌ Masalah Sebelumnya:
1. ❌ Mix Firebase Realtime Database dengan Firestore
2. ❌ MMKV tidak dibersihkan saat logout
3. ❌ Info login tidak ditampilkan di UI
4. ❌ Tidak ada data sample untuk testing

### ✅ Solusi:
1. ✅ Menggunakan Firestore methods yang benar (`collection`, `getDocs`)
2. ✅ Menambahkan `clearLoginInfo()` saat logout
3. ✅ Menampilkan user info dari MMKV di home screen
4. ✅ Membuat helper function untuk seed data
5. ✅ Menambahkan empty state component
6. ✅ Pull-to-refresh functionality

## 📱 Flow Aplikasi

```
Start App
    ↓
Check Auth State (_layout.tsx)
    ↓
├─ Sudah Login? → Home Screen (index.tsx)
│                   ├─ Load data dari MMKV
│                   ├─ Fetch data mahasiswa dari Firestore
│                   └─ Tampilkan di FlatList
│
└─ Belum Login? → Login Screen (login.tsx)
                   ├─ Register baru
                   ├─ Login
                   └─ Populate data sample (optional)
```

## 📊 MMKV Implementation Details

### saveLoginInfo (storage.ts)
- Dipanggil otomatis saat auth state berubah ke logged in
- Menyimpan: `{ uid, email }`

### getLoginInfo (storage.ts)
- Dipanggil di `index.tsx` untuk menampilkan info user
- Return: `LoginInfo | null`

### clearLoginInfo (storage.ts)
- Dipanggil saat logout
- Menghapus data dari MMKV

## 🔐 Firebase Rules (Recommended)

Untuk development, set Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mahasiswa/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 📝 TypeScript Interfaces

### Mahasiswa
```typescript
interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  program_studi: string;
}
```

### LoginInfo
```typescript
interface LoginInfo {
  uid: string;
  email: string | null;
}
```

## ✅ Checklist Implementasi

- [x] Firebase Authentication (Register/Login/Logout)
- [x] MMKV Storage (Save/Get/Clear login info)
- [x] Firebase Firestore (Fetch data mahasiswa)
- [x] Display MMKV data di UI
- [x] TypeScript type safety
- [x] Pull-to-refresh
- [x] Empty state handling
- [x] Seed data helper
- [x] Auto cleanup on logout
- [x] Auth state persistence

## 🎯 Cara Testing

1. **Test Register**:
   - Masukkan email & password
   - Klik "Register"
   - Check console untuk log MMKV

2. **Test Login**:
   - Masukkan email & password
   - Klik "Login"
   - Akan redirect ke home screen
   - Info login muncul di atas

3. **Test Firestore**:
   - Klik tombol "Tambah Data Sample"
   - Login
   - Data mahasiswa muncul di list

4. **Test MMKV Persistence**:
   - Login
   - Tutup app
   - Buka app lagi
   - Masih tetap login (tidak perlu login ulang)

5. **Test Logout**:
   - Klik tombol "Logout"
   - Data MMKV terhapus
   - Redirect ke login screen

## 🐛 Troubleshooting

### Data mahasiswa tidak muncul?
- Pastikan sudah klik tombol "Tambah Data Sample"
- Check Firebase Console > Firestore > Collection "mahasiswa"
- Pastikan Firestore rules mengizinkan read

### MMKV tidak persist?
- Check console log saat login
- Pastikan `saveLoginInfo()` dipanggil di `_layout.tsx`

### Auto-login tidak bekerja?
- Firebase Authentication sudah handle persistence secara otomatis
- Check `onAuthStateChanged` di `_layout.tsx`

## 📚 Dependencies

```json
{
  "firebase": "^12.6.0",
  "react-native-mmkv": "^4.0.0",
  "expo-router": "~6.0.14"
}
```

---

**Status**: ✅ Semua fitur sudah lengkap dan berfungsi dengan baik!
