// firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD99bgsmYwXWlGKPJLgH325T7d83kQPK38',
  authDomain: 'cim-3a74f.firebaseapp.com',
  projectId: 'cim-3a74f',
  storageBucket: 'cim-3a74f.appspot.com',
  messagingSenderId: '1072991451271',
  appId: '1:1072991451271:web:ba009fe73b570ff46f6022',
};

// ✅ Use existing app if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
