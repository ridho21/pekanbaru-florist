import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyDsUeWrXemUoRkPEFcdvCBvrvrQXgCXS1U",
    authDomain: "https://car-rental-39b9e.firebaseapp.com/__/auth/action?mode=action&oobCode=code",
    databaseURL: "https://car-rental-39b9e-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "car-rental-39b9e",
    storageBucket: "gs://car-rental-39b9e.appspot.com",
    messagingSenderId: "163939117791",
    appId: "1:163939117791:android:f94dc42ce6e5b62962176a",
  };

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);