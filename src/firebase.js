import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "chat-d71e0.firebaseapp.com",
  projectId: "chat-d71e0",
  storageBucket: "chat-d71e0.appspot.com",
  messagingSenderId: "612491305987",
  appId: "1:612491305987:web:683d9dc8cfb7807a879a36"
};
// console.log(firebaseConfig.apiKey)

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
