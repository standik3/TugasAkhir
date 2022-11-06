import { boot } from 'quasar/wrappers'
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {getFirestore, collection, getDocs,serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  //config lain kalau quota exceed
  apiKey: "AIzaSyDCylfmP5fxqoUji6Zi4b9eS4guRo7qNes",
  authDomain: "biachat-ec8ca.firebaseapp.com",
  databaseURL: "https://biachat-ec8ca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "biachat-ec8ca",
  storageBucket: "biachat-ec8ca.appspot.com",
  messagingSenderId: "375106290788",
  appId: "1:375106290788:web:fa0bf1146ae1c4e3c64b71"
  //config lain kalau quota exceed
  // apiKey: "AIzaSyB5mhtFSR04cII510HLK3fC8xIDN5frvDA",
  // authDomain: "aplikasita-42b3f.firebaseapp.com",
  // databaseURL: "https://aplikasita-42b3f-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "aplikasita-42b3f",
  // storageBucket: "aplikasita-42b3f.appspot.com",
  // messagingSenderId: "767360354576",
  // appId: "1:767360354576:web:ef9d2e5f7f16281110fd95"
  //testes
  // apiKey: "AIzaSyDarn8t_RmAKOFM7tGwBQ_kC3Twu_tWXA0",
  // authDomain: "tugasakhir217116574-6685e.firebaseapp.com",
  // databaseURL: "https://tugasakhir217116574-6685e-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "tugasakhir217116574-6685e",
  // storageBucket: "tugasakhir217116574-6685e.appspot.com",
  // messagingSenderId: "1003352951677",
  // appId: "1:1003352951677:web:64ef962cdc544dcb741a14"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const timer = serverTimestamp();
console.log("Firebase test :",timer);
export {app,db,auth,timer}
// Get a list of cities from your database
export async function getCities(db) {
  const citiesCol = collection(db, 'users');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  // console.log("coba coba",cityList);
  return cityList;
}
export async function getGroup(db) {
  const citiesCol = collection(db, 'group');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  // console.log("coba coba",cityList);
  return cityList;
}
export async function getChat(db) {
  const citiesCol = collection(db, 'chats');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  // console.log("coba coba",cityList);
  return cityList;
}
export async function getFriend(db) {
  const citiesCol = collection(db, 'users');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  // console.log("coba coba",cityList);
  return cityList;
}
export async function getRuleBot(db) {
  const citiesCol = collection(db, 'rules');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  // console.log("coba coba",cityList);
  return cityList;
}
export async function getChatBot(db) {
  const citiesCol = collection(db, 'chatbots');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  // console.log("coba coba",cityList);
  return cityList;
}
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
})
