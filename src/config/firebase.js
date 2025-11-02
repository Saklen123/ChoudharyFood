// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAd3wBUkHM9yrRrREFiz4bi7XL_vCKAoSI",
    authDomain: "choudharymart-f72db.firebaseapp.com",
    projectId: "choudharymart-f72db",
    storageBucket: "choudharymart-f72db.firebasestorage.app",
    messagingSenderId: "380395433620",
    appId: "1:380395433620:web:a720db861b2a3addbf4e81"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);