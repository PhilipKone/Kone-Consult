// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Export functions for use in other files
function loginUser(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

function registerUser(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function resetPassword(email) {
  return auth.sendPasswordResetEmail(email);
}

function logoutUser() {
  return auth.signOut();
} 