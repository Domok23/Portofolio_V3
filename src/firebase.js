import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore"; // Perbarui ini


// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB-lfUt1adpQ0KYcFFW_oAWTJVfHDOOZy8",
//   authDomain: "portofolio-web-3e8e8.firebaseapp.com",
//   projectId: "portofolio-web-3e8e8",
//   storageBucket: "portofolio-web-3e8e8.appspot.com",
//   messagingSenderId: "25195509306",
//   appId: "1:25195509306:web:2b635dcf997137bf612703"
// };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNrsJbFNJIB2iK4F9MLibddZrA75br19c",
  authDomain: "portofoliov5-3206b.firebaseapp.com",
  projectId: "portofoliov5-3206b",
  storageBucket: "portofoliov5-3206b.firebasestorage.app",
  messagingSenderId: "1003831526103",
  appId: "1:1003831526103:web:10c34022da47d1c6d66692",
  measurementId: "G-4Y59YF9M7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
