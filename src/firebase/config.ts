import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: (import.meta.env.VITE_FIREBASE_API_KEY || 'dummy_key') as string,
    authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy_domain') as string,
    projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy_project') as string,
    storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy_bucket') as string,
    messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'dummy_sender') as string,
    appId: (import.meta.env.VITE_FIREBASE_APP_ID || 'dummy_id') as string
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
    if (firebaseConfig.apiKey === 'dummy_key') {
        console.warn('Firebase Hub: Missing VITE_FIREBASE_API_KEY. Initializing in offline simulation mode.');
    }
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.error('Firebase Hub: Critical Initialization Error. Forcing local fallback.');
    app = {} as any;
    auth = {} as any;
    db = {} as any;
}

export { auth, db };
export default app;
