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
    title: "Enhancing Bottom-Up Human Pose Estimation with Multi-Scale Training",
    description: "This project advances the state-of-the-art in human pose estimation by integrating multi-scale training with the HRNet architecture. It focuses on bottom-up approaches, which detect all body keypoints in an image and group them into skeletons for each person—ideal for crowded or multi-person scenes. The workflow includes advanced data preparation, multi-scale data augmentation, curriculum learning, and specialized loss functions. The system is evaluated on standard benchmarks (COCO, CrowdPose, MPII) and demonstrates improved accuracy, robustness to occlusion and scale, and computational efficiency. Applications include sports analytics, surveillance, healthcare, and animation.",
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
