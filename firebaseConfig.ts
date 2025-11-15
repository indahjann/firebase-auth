import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLl0PUmyPRUIO_alHxdHjnd8zk13w2h0o",
  authDomain: "project-pbp-33b18.firebaseapp.com",
  projectId: "project-pbp-33b18",
  storageBucket: "project-pbp-33b18.firebasestorage.app",
  messagingSenderId: "1067511199348",
  appId: "1:1067511199348:web:e2e718766c5331b23ec321",
  measurementId: "G-PN1NB0FV48"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
