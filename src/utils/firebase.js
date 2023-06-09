import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDzsDpPnZeCruwlPZYDrNkY0gc1DSsjHjc",
    authDomain: "pinturas-34469.firebaseapp.com",
    databaseURL: "https://pinturas-34469-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pinturas-34469",
    storageBucket: "pinturas-34469.appspot.com",
    messagingSenderId: "110499205270",
    appId: "1:110499205270:web:95995080541a49088af2b7",
    measurementId: "G-MT0D1J0LD8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const auth = getAuth(app)

export { 
  auth, app
};