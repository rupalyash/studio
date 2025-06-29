import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ1svXQo3wKtRUWj8BCmcNRBttFkaLOpQ",
  authDomain: "ai-hackathon-g10x.firebaseapp.com",
  projectId: "ai-hackathon-g10x",
  storageBucket: "ai-hackathon-g10x.appspot.com",
  messagingSenderId: "408362624675",
  appId: "1:408362624675:web:59a401b8f1d2b80cc4c116",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
