import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJK972fyuyKHCgTC-lXNcMTkGPpN8QwdM",
  authDomain: "netfloux-48fc5.firebaseapp.com",
  projectId: "netfloux-48fc5",
  storageBucket: "netfloux-48fc5.appspot.com",
  messagingSenderId: "946171167019",
  appId: "1:946171167019:web:edbf4fa15be902b4e7456e",
  measurementId: "G-FSDKL6H238"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const firestore = getFirestore();

export { app, analytics, auth, firestore };