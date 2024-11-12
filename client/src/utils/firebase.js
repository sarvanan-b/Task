// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskmanager-d381c.firebaseapp.com",
  projectId: "taskmanager-d381c",
  storageBucket: "taskmanager-d381c.firebasestorage.app",
  messagingSenderId: "509967450080",
  appId: "1:509967450080:web:421fbb21dc07a937e1b585"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);