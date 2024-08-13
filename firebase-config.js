// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// // Your web app's Firebase configuration
// export const firebaseConfig = {
//   apiKey: "AIzaSyAVgpHoaYV0qFTYPM3jnLtuY3XHpI7DVlk",
//   authDomain: "tdah-ef69a.firebaseapp.com",
//   projectId: "tdah-ef69a",
//   storageBucket: "tdah-ef69a.appspot.com",
//   messagingSenderId: "186599533071",
//   appId: "1:186599533071:web:7cdfe41da68034c615d17a"
// };

// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// --------------------------------------
// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// // Your web app's Firebase configuration
// export const firebaseConfig = {
//   apiKey: "AIzaSyAVgpHoaYV0qFTYPM3jnLtuY3XHpI7DVlk",
//   authDomain: "tdah-ef69a.firebaseapp.com",
//   projectId: "tdah-ef69a",
//   storageBucket: "tdah-ef69a.appspot.com",
//   messagingSenderId: "186599533071",
//   appId: "1:186599533071:web:7cdfe41da68034c615d17a"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// export const db = getFirestore(app);

// // Initialize Firebase Auth with persistence
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

//-------------

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth';
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Configuración de Firebase
export const firebaseConfig = {
  // apiKey: "AIzaSyAVgpHoaYV0qFTYPM3jnLtuY3XHpI7DVlk",
  // authDomain: "tdah-ef69a.firebaseapp.com",
  // projectId: "tdah-ef69a",
  // storageBucket: "tdah-ef69a.appspot.com",
  // messagingSenderId: "186599533071",
  // appId: "1:186599533071:web:7cdfe41da68034c615d17a"

  //TDAH
  apiKey: "AIzaSyADsw-g2cjX0K6tlZS3N-z6L6oEPTY_IWI",
  authDomain: "pruebatdah-a13c3.firebaseapp.com",
  projectId: "pruebatdah-a13c3",
  storageBucket: "pruebatdah-a13c3.appspot.com",
  messagingSenderId: "296119458098",
  appId: "1:296119458098:web:aa910d88300c78ae5c5f2b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Firebase Auth con persistencia para React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage) // Configuración de persistencia
});
