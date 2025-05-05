// firebase/firebase-config.js
// Firebase initialization for CDN (compat) usage. No import/export. Uses global firebase object.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoFJWEc8z1Z-kddKR8T-QggAFCdm4Y7wI",
  authDomain: "daywise-ays8t.firebaseapp.com",
  projectId: "daywise-ays8t",
  storageBucket: "daywise-ays8t.appspot.com",
  messagingSenderId: "690549644365",
  appId: "1:690549644365:web:d895858fbde5497b1c5004",
  measurementId: "G-W1KGH910YG"
};

// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// No export statements; everything is attached to the global firebase object