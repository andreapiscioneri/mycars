// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3Bd_DCtxDE_YKdh25EL4LI-hXlUaSsos",
  authDomain: "test1-47917.firebaseapp.com",
  projectId: "test1-47917",
  storageBucket: "test1-47917.firebasestorage.app",
  messagingSenderId: "42755419974",
  appId: "1:42755419974:web:5122684f498ba72f443f47",
  measurementId: "G-EV68JT8YD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, db, storage, auth, provider }; 