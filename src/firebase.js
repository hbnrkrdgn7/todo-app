// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYVRr5CMdatFqTLMg9yQiBhi56_Set9jk",
  authDomain: "todolist-94b87.firebaseapp.com",
  projectId: "todolist-94b87",
  storageBucket: "todolist-94b87.firebasestorage.app",
  messagingSenderId: "580934731620",
  appId: "1:580934731620:web:ea81151533681c13ebdc71",
  measurementId: "G-HXP6Z7X7PT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
