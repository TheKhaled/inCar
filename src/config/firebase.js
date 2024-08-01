// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCec0DItnA0ENpKqTlvyXU6ACIqzF-x9f0",
  authDomain: "inmycar-e9dd7.firebaseapp.com",
  projectId: "inmycar-e9dd7",
  storageBucket: "inmycar-e9dd7.appspot.com",
  messagingSenderId: "720080239676",
  appId: "1:720080239676:web:52b2dd89c314a154ab9739",
  measurementId: "G-5Q295EJCK5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = new getFirestore(app);
export const storage = getStorage(app);
