// firebaseconfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ You ARE using this

const firebaseConfig = {
  apiKey: "AIzaSyBYF9LcLlh2U1iDSzFwfWYGXkefPAIKD84",
  authDomain: "inshpho-app.firebaseapp.com",
  projectId: "inshpho-app",
  storageBucket: "inshpho-app.firebasestorage.app",
  messagingSenderId: "1081862846137",
  appId: "1:1081862846137:web:7c36ff593c429641700d68",
  measurementId: "G-PFSEYWZP3R"
};

const app = initializeApp(firebaseConfig);

// ✅ These are used and exported
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };
