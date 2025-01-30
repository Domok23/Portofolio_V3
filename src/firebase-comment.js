import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyDJPq9a0YPoQYkpQ-Uaw7aXQRXzzqOKzFA",
//     authDomain: "web-kelas-tes.firebaseapp.com",
//     projectId: "web-kelas-tes",
//     storageBucket: "web-kelas-tes.appspot.com",
//     messagingSenderId: "890817433268",
//     appId: "1:890817433268:web:11e5258f8864a6174c11e1"
// };

const firebaseConfig = {
  apiKey: 'AIzaSyBNrsJbFNJIB2iK4F9MLibddZrA75br19c',
  authDomain: 'portofoliov5-3206b.firebaseapp.com',
  projectId: 'portofoliov5-3206b',
  storageBucket: 'portofoliov5-3206b.firebasestorage.app',
  messagingSenderId: '1003831526103',
  appId: '1:1003831526103:web:10c34022da47d1c6d66692',
  measurementId: 'G-4Y59YF9M7P',
};

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };