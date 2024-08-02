// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAW0ZCP7a2YJ0VC_t0Esm5VIxEaq8u5fA4",
  authDomain: "chatapp-4a007.firebaseapp.com",
  projectId: "chatapp-4a007",
  storageBucket: "chatapp-4a007.appspot.com",
  messagingSenderId: "356074873149",
  appId: "1:356074873149:web:6d21657aa9fd9639d56554",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);

