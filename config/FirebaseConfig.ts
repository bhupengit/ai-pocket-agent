// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCex4ARkZH5UUCgtRAjAO5o0C7VtVV6nzM",
  authDomain: "ai-pocket-agent-fd220.firebaseapp.com",
  projectId: "ai-pocket-agent-fd220",
  storageBucket: "ai-pocket-agent-fd220.firebasestorage.app",
  messagingSenderId: "198653723525",
  appId: "1:198653723525:web:bdd7bc9456150113773aec",
  measurementId: "G-536HYDDHDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app);
export const storage = getStorage(app)