// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBsFwyuEa4sIxYQv5K2-qoldJzafcEXu10",
    authDomain: "deals-hunter-dz.firebaseapp.com",
    projectId: "deals-hunter-dz",
    storageBucket: "deals-hunter-dz.firebasestorage.app",
    messagingSenderId: "407022029380",
    appId: "1:407022029380:web:f6d4f72fc3a704616a8a11",
    measurementId: "G-5T27V9B3PN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);