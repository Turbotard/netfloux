// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJK972fyuyKHCgTC-lXNcMTkGPpN8QwdM",
  authDomain: "netfloux-48fc5.firebaseapp.com",
  projectId: "netfloux-48fc5",
  storageBucket: "netfloux-48fc5.appspot.com",
  messagingSenderId: "946171167019",
  appId: "1:946171167019:web:edbf4fa15be902b4e7456e",
  measurementId: "G-FSDKL6H238"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export { app, analytics, auth };