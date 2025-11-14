import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// Gunakan import dari 'firebase/database' untuk Realtime Database
import { getDatabase, type Database } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLl0PUmyPRUIO_alHxdHjnd8zk13w2h0o",
  authDomain: "project-pbp-33b18.firebaseapp.com",
  projectId: "project-pbp-33b18",
  storageBucket: "project-pbp-33b18.firebasestorage.app",
  messagingSenderId: "1067511199348",
  appId: "1:1067511199348:web:e2e718766c5331b23ec321",
  measurementId: "G-PN1NB0FV48",
  databaseURL: "https://project-pbp-33b18-default-rtdb.asia-southeast1.firebasedatabase.app" // Tambahkan URL Realtime Database
};

// Inisialisasi Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Ekspor layanan dengan tipe yang jelas
export const auth: Auth = getAuth(app);
export const db: Database = getDatabase(app); // Ekspor Realtime Database