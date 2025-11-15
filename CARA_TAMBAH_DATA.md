# Cara Menambahkan Data Mahasiswa di Firebase Console

## Langkah-langkah:

1. **Buka Firebase Console**
   - Buka https://console.firebase.google.com
   - Pilih project Anda: `project-pbp-33b18`

2. **Masuk ke Firestore Database**
   - Klik menu **Firestore Database** di sidebar kiri
   - Jika belum ada collection, klik **Start collection**

3. **Buat Collection**
   - Collection ID: `mahasiswa`
   - Klik **Next**

4. **Tambah Document Pertama**
   - Document ID: Biarkan **Auto-ID** (otomatis)
   - Tambahkan fields:
   
   | Field | Type | Value |
   |-------|------|-------|
   | `nama` | string | `Budi Santoso` |
   | `nim` | string | `12345001` |
   | `program_studi` | string | `Teknik Informatika` |

   - Klik **Save**

5. **Tambah Document Lainnya**
   - Klik **Add document**
   - Ulangi untuk menambah mahasiswa lain

## Contoh Data:

### Document 1:
```
nama: "Budi Santoso"
nim: "12345001"
program_studi: "Teknik Informatika"
```

### Document 2:
```
nama: "Siti Nurhaliza"
nim: "12345002"
program_studi: "Sistem Informasi"
```

### Document 3:
```
nama: "Ahmad Dahlan"
nim: "12345003"
program_studi: "Teknik Komputer"
```

### Document 4:
```
nama: "Dewi Lestari"
nim: "12345004"
program_studi: "Teknik Informatika"
```

### Document 5:
```
nama: "Rudi Tabuti"
nim: "12345005"
program_studi: "Sistem Informasi"
```

## Verifikasi di Aplikasi:

1. Jalankan aplikasi: `npx expo start`
2. Login dengan akun Anda
3. Data mahasiswa akan muncul di home screen
4. Pull to refresh untuk update data terbaru

## ⚠️ Catatan Penting:

- **Field name harus sama persis**: `nama`, `nim`, `program_studi` (bukan `jurusan`)
- **Type harus string** untuk semua field
- Collection name: **mahasiswa** (huruf kecil semua)
- Jangan lupa set Firestore Rules agar user yang sudah login bisa read/write

## Firestore Rules (Optional):

Di Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mahasiswa/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Ini memastikan hanya user yang sudah login yang bisa akses data mahasiswa.
