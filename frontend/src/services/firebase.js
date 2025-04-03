import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

// const firebaseConfig = {
//     apiKey: "AIzaSyAMdrkw3p55OD1jPfIlDRARmqnEcmA31Ks",
//     authDomain: "shiftly-v1.firebaseapp.com",
//     projectId: "shiftly-v1",
//     storageBucket: "shiftly-v1.firebasestorage.app",
//     messagingSenderId: "75818024250",
//     appId: "1:75818024250:web:840084b58256a2004ba403",
//     measurementId: "G-8NSW3BJMZK"
//   };