
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCHqt_9_4T4HPFSuqHiJeiZDnMMHVDhZ9Q",
    authDomain: "buzzmate-cf1b1.firebaseapp.com",
    projectId: "buzzmate-cf1b1",
    storageBucket: "buzzmate-cf1b1.firebasestorage.app",
    messagingSenderId: "169873996296",
    appId: "1:169873996296:web:ac1d0203ae4a64eaa86fbd",
    measurementId: "G-DKTHT1HH7J"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);