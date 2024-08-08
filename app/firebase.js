// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "pantry-tracker-c2ece.firebaseapp.com",
  projectId: "pantry-tracker-c2ece",
  storageBucket: "pantry-tracker-c2ece.appspot.com",
  messagingSenderId: "489862803454",
  appId: "API_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
