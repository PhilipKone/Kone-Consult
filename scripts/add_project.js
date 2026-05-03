require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const { getAuth, signInAnonymously } = require("firebase/auth");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const projectData = {
    title: "Advanced Human Pose Estimation & Multi-Scale Data Architecture",
    description: "We developed a custom multi-scale training framework to improve accuracy in crowded scenes. Utilizing bottom-up detection methodologies and HRNet-inspired architectures, we optimized the system for robustness against occlusion. This demonstrates our capability in high-precision Computer Vision research and model evaluation for complex environmental datasets.",
    tools: "Python, PyTorch, COCO, Computer Vision",
    status: "published",
    createdAt: serverTimestamp(),
    githubUrl: "https://github.com/PhilipKone",
    liveUrl: ""
};

async function addProject() {
    try {
        await signInAnonymously(auth);
        console.log("Signed in anonymously");
        const docRef = await addDoc(collection(db, "projects"), projectData);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

addProject();
