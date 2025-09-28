import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyjbCfs7hhiAYcjDMSZusXHwZkxNpW8jk",
  authDomain: "gfardan-e0a5f.firebaseapp.com",
  projectId: "gfardan-e0a5f",
  storageBucket: "gfardan-e0a5f.firebasestorage.app",
  messagingSenderId: "725559357045",
  appId: "1:725559357045:web:756b258569a3addc99923c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

