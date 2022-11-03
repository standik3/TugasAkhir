import { boot } from 'quasar/wrappers'
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDCylfmP5fxqoUji6Zi4b9eS4guRo7qNes",
  authDomain: "biachat-ec8ca.firebaseapp.com",
  databaseURL: "https://biachat-ec8ca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "biachat-ec8ca",
  storageBucket: "biachat-ec8ca.appspot.com",
  messagingSenderId: "375106290788",
  appId: "1:375106290788:web:fa0bf1146ae1c4e3c64b71"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
console.log("Firebase test :",app);
export {app,db,auth}
// Get a list of cities from your database
export async function getCities(db) {
  const citiesCol = collection(db, 'users');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
})
