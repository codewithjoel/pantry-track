// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1bXYunotg5jysEh806qmP_CfT4TPfVNo",
  authDomain: "pantry-tracker-c2ece.firebaseapp.com",
  projectId: "pantry-tracker-c2ece",
  storageBucket: "pantry-tracker-c2ece.appspot.com",
  messagingSenderId: "489862803454",
  appId: "1:489862803454:web:11a032138425c3aae21aaf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);