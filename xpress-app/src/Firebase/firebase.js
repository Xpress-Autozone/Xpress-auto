// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmwvXAYRGgr_3U8CMdR7zTIa4xDn65O1Y",
  authDomain: "xpress-app-21cec.firebaseapp.com",
  projectId: "xpress-app-21cec",
  storageBucket: "xpress-app-21cec.firebasestorage.app",
  messagingSenderId: "1002881310344",
  appId: "1:1002881310344:web:af1c6ab78b577b1f8e093d",
  measurementId: "G-CQBC1H9V8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export for use in other modules
export { app, analytics };