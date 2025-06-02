import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
apiKey: "AIzaSyBIadjUYHNEFKpDKnTGHxKtLrOAC8ST0JA",
authDomain: "polyglotpal-16f33.firebaseapp.com",
projectId: "polyglotpal-16f33",
storageBucket: "polyglotpal-16f33.appspot.com",
messagingSenderId: "89747440954",
appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:89747440954:web:YOUR_APP_ID_HERE" // Bunu Firebase Console'dan alacaksınız
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;