// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCmwvXAYRGgr_3U8CMdR7zTIa4xDn65O1Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "xpress-app-21cec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "xpress-app-21cec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "xpress-app-21cec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1002881310344",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1002881310344:web:af1c6ab78b577b1f8e093d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CQBC1H9V8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export for use in other modules
export { app, analytics };