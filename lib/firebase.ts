import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyABqn65A9aMmMETPIgn_je8OHfjdeHcmw4",
  authDomain: "wildmind-212ae.firebaseapp.com",
  projectId: "wildmind-212ae",
  storageBucket: "wildmind-212ae.firebasestorage.app",
  messagingSenderId: "399679382904",
  appId: "1:399679382904:web:de8158abf4d5a698a4548d",
  measurementId: "G-28DC9XNVEB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Only initialize analytics on the client-side
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export default app; 