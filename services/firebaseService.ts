import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxUcc8bTZSkDsBoMQ9k1ZXkE6xW94ayls",
  authDomain: "undangan-darul-huda.firebaseapp.com",
  projectId: "undangan-darul-huda",
  storageBucket: "undangan-darul-huda.firebasestorage.app",
  messagingSenderId: "126337720953",
  appId: "1:126337720953:web:6e0f739b964e30fd9d6aa8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
export type { User };

