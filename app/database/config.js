// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpBbPHdVU3F1wgKEsu0xUthu7mKK9DLzw",
  authDomain: "authantication-3107c.firebaseapp.com",
  projectId: "authantication-3107c",
  storageBucket: "authantication-3107c.firebasestorage.app",
  messagingSenderId: "779397607738",
  appId: "1:779397607738:web:7f95e6acd30aeb75f7e003"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Only initialize analytics on the client-side
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export default app;
