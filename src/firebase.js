import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBIz0acLjCE4vy7EOeN4OJ7zI_0CdU4494",
  authDomain: "codeconnect-5a0d7.firebaseapp.com",
  databaseURL: "https://codeconnect-5a0d7-default-rtdb.firebaseio.com",
  projectId: "codeconnect-5a0d7",
  storageBucket: "codeconnect-5a0d7.firebasestorage.app",
  messagingSenderId: "25835159074",
  appId: "1:25835159074:web:a784051d7426dbea11147b",
  measurementId: "G-X8HBQF65NS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const auth = getAuth(app); // Add Firebase Authentication
export const googleProvider = new GoogleAuthProvider(); // Add GoogleAuthProvider



