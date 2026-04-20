import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// --- SWAP THESE VALUES WITH THE ONES FROM YOUR FIREBASE CONSOLE ---
const firebaseConfig = {
  apiKey: "AIzaSyC6-7DBGUDLUSR7Zmlyjyq74efJymF2xVI",
  authDomain: "ngo-connect-95421.firebaseapp.com",
  projectId: "ngo-connect-95421",
  storageBucket: "ngo-connect-95421.appspot.com",
  messagingSenderId: "774081360196",
  appId: "1:774081360196:web:c76958d5b85bdf3e83e711"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- SPEED FIX: Enable Offline Persistence ---
// This allows the app to load data from the local cache instantly
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time.
        console.warn("Persistence failed: Multiple tabs open");
    } else if (err.code === 'unimplemented') {
        // The current browser does not support persistence
        console.warn("Persistence is not supported by this browser");
    }
});

export { auth, db };