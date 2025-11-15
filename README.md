# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# Firebase Authentication + Firestore + MMKV - React Native

Aplikasi React Native dengan Expo yang mengimplementasikan:
- ✅ **Firebase Authentication** (Login & Register terpisah)
- ✅ **MMKV Storage** (Persistent login info)
- ✅ **Firebase Firestore** (Database mahasiswa)
- ✅ **TypeScript** (Type safety)

## 🚀 Fitur

### 1. Authentication Flow
- **Halaman Login** - Form login dengan link ke register
- **Halaman Register** - Form registrasi dengan validasi
- **Auto Redirect** - Setelah register sukses → Login
- **Persistent Login** - Tetap login meskipun app ditutup (menggunakan MMKV)

### 2. Data Mahasiswa
- **Fetch dari Firestore** - Menampilkan data mahasiswa
- **Pull to Refresh** - Update data terbaru
- **Empty State** - Pesan jika tidak ada data

### 3. MMKV Storage
- Menyimpan info login (uid & email)
- Auto save saat login
- Auto clear saat logout

## 📋 Cara Menggunakan

### 1. Install Dependencies
```bash
npm install
```

### 2. Tambahkan Data Mahasiswa
Lihat file `CARA_TAMBAH_DATA.md` untuk panduan lengkap.

Singkatnya:
1. Buka Firebase Console → Firestore
2. Buat collection `mahasiswa`
3. Tambah document dengan field: `nama`, `nim`, `jurusan`

### 3. Jalankan Aplikasi
```bash
npx expo start
```

### 4. Testing Flow
1. **Register** - Buat akun baru
2. **Login** - Masuk dengan akun yang sudah dibuat
3. **Lihat Data** - Data mahasiswa muncul di home
4. **Logout** - Keluar dari aplikasi
5. **Buka Ulang** - Tetap login (MMKV persistence)

## 📁 Struktur File

```
app/
├── _layout.tsx       # Auth state & routing management
├── index.tsx         # Home screen (data mahasiswa)
├── login.tsx         # Login screen
└── register.tsx      # Register screen

firebaseConfig.ts     # Firebase configuration
storage.ts            # MMKV functions
```

## 🔐 Firestore Structure

```
Collection: mahasiswa
├── Document (auto-ID)
│   ├── nama: string
│   ├── nim: string
│   └── jurusan: string
```

## 📱 User Flow

```
App Start
    ↓
Check Auth State
    ├─ Sudah Login? → Home Screen
    │                  ├─ Show user info (dari MMKV)
    │                  └─ Show data mahasiswa (dari Firestore)
    │
    └─ Belum Login? → Login Screen
                       └─ Klik "Daftar" → Register Screen
                                          └─ Success → Login Screen
```

## 🛠️ Dependencies

- `firebase` - Authentication & Firestore
- `react-native-mmkv` - Local storage
- `expo-router` - Navigation

## ✅ Checklist Tugas

- [x] Firebase Authentication (Register & Login)
- [x] Halaman Login & Register terpisah
- [x] Register sukses → Alert → Redirect ke Login
- [x] MMKV menyimpan info login
- [x] Firestore database mahasiswa
- [x] Fetch & tampilkan data mahasiswa
- [x] Logout dengan clear MMKV

---

**Developed for PBP Assignment - Semester 5**
