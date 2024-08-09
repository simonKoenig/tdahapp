import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAVgpHoaYV0qFTYPM3jnLtuY3XHpI7DVlk",
  authDomain: "tdah-ef69a.firebaseapp.com",
  projectId: "tdah-ef69a",
  storageBucket: "tdah-ef69a.appspot.com",
  messagingSenderId: "186599533071",
  appId: "1:186599533071:web:7cdfe41da68034c615d17a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);