import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAkgjQj7Zpt9EG497iaP4gzTFcrmYJAGPU",
  authDomain: "minitwittee.firebaseapp.com",
  databaseURL: "https://minitwittee-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "minitwittee",
  storageBucket: "minitwittee.firebasestorage.app",
  messagingSenderId: "79809658060",
  appId: "1:79809658060:web:1a17efdac0af1cb1d25669",
  measurementId: "G-G1Y51JQJV0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;