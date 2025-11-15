import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLl0PUmyPRUIO_alHxdHjnd8zk13w2h0o",
  authDomain: "project-pbp-33b18.firebaseapp.com",
  projectId: "project-pbp-33b18",
  storageBucket: "project-pbp-33b18.firebasestorage.app",
  messagingSenderId: "1067511199348",
  appId: "1:1067511199348:web:e2e718766c5331b23ec321",
  measurementId: "G-PN1NB0FV48"
};

const app: FirebaseApp = initializeApp(firebaseConfig);

// Try to initialize Auth with React Native persistence (AsyncStorage) if available.
// Fallback to getAuth(app) when the react-native-specific module isn't present.
let authInstance: Auth;
try {
  // Require at runtime to avoid TypeScript resolution issues in some environments
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rnAuth = require('firebase/auth/react-native');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const { initializeAuth, getReactNativePersistence } = rnAuth;

  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  }) as Auth;
  console.log('[FIREBASE] Initialized auth with React Native persistence (AsyncStorage)');
} catch (e) {
  console.warn('[FIREBASE] Could not initialize react-native auth persistence, falling back to getAuth:', e);
  authInstance = getAuth(app);
}

export const auth: Auth = authInstance;
export const db: Firestore = getFirestore(app);