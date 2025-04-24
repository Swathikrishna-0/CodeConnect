import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3poBkSW2WFATckoGMk6Zey23_XmqiTbk",
  authDomain: "codeconnect-5b29a.firebaseapp.com",
  databaseURL: "https://codeconnect-5b29a-default-rtdb.firebaseio.com", 
  projectId: "codeconnect-5b29a",
  storageBucket: "codeconnect-5b29a.firebasestorage.app",
  messagingSenderId: "65956255801",
  appId: "1:65956255801:web:5a53b8570a0e4a198095e8",
  measurementId: "G-N5MRD79KSW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
