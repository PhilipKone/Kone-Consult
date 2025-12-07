import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCoFJWEc8z1Z-kddKR8T-QggAFCdm4Y7wI",
    authDomain: "daywise-ays8t.firebaseapp.com",
    projectId: "daywise-ays8t",
    storageBucket: "daywise-ays8t.firebasestorage.app",
    messagingSenderId: "690549644365",
    appId: "1:690549644365:web:d895858fbde5497b1c5004"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
