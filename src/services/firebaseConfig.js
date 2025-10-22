import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Configuración Firebase MVP 2.0
const firebaseConfig = {
  apiKey: "AIzaSyCdwv023kCqLXO8UDxRzlz2kygJiW7F6V8",
  authDomain: "mvp-plataforma-deportiva.firebaseapp.com",
  projectId: "mvp-plataforma-deportiva",
  storageBucket: "mvp-plataforma-deportiva.firebasestorage.app",
  messagingSenderId: "872751327215",
  appId: "1:872751327215:android:0beffe3f397caac637381a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Colecciones de Firestore
export const COLLECTIONS = {
  USERS: 'users',
  ESTABLISHMENTS: 'establishments',
  RESERVATIONS: 'reservations',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  TOKEN_PURCHASES: 'token_purchases'
};