// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDONP2uUnVVy9Au5vP9BlAbr3gDxlWA7U8",
  authDomain: "mycarsbergamo.firebaseapp.com",
  projectId: "mycarsbergamo",
  storageBucket: "mycarsbergamo.appspot.com",
  messagingSenderId: "194799387859",
  appId: "1:194799387859:web:1892045a63928dc3f7c026",
  measurementId: "G-ZYP3K3M7ZJ"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
