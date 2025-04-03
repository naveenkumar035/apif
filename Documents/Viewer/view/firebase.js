// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ26VlrtHWbeZZkEcdqc3eBHtM3ya8POI",
  authDomain: "viewer-12054.firebaseapp.com",
  projectId: "viewer-12054",
  storageBucket: "viewer-12054.firebasestorage.app",
  messagingSenderId: "783016258183",
  appId: "1:783016258183:web:bc9b5993eae37cb41b2622",
  measurementId: "G-BVJKVZ6MLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();

export {db, storage};
export default app;