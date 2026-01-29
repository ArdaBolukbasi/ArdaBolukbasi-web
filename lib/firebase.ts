import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAn3LaUNHm-cfUIaeXHhGmF2VOGfJF2eUY",
    authDomain: "ardabolukbasicom.firebaseapp.com",
    projectId: "ardabolukbasicom",
    storageBucket: "ardabolukbasicom.firebasestorage.app",
    messagingSenderId: "388219108190",
    appId: "1:388219108190:web:34a445e8ccfea86c45adcf",
    measurementId: "G-BB8SNESP6D"
};

// Initialize Firebase (Singleton pattern to prevent re-initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Analytics (Client-side only)
let analytics;
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, db, storage, auth, analytics };
