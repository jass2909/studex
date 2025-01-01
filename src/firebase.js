import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Optional if you need auth services

// Firebase configuration (replace with your own config)
const firebaseConfig = {
  apiKey: "AIzaSyDywNdRbif5BFi_q5hb7rUhzvrOXTGrrks",
  authDomain: "studex-e3c2a.firebaseapp.com",
  projectId: "studex-e3c2a",
  storageBucket: "studex-e3c2a.firebasestorage.app",
  messagingSenderId: "1076156754259",
  appId: "1:1076156754259:web:c0d7a65d58ce2f739519a6",
  measurementId: "G-PQD022RY3E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
