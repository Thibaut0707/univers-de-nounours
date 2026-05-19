import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjJ6Qt-jq6pjfpkbI7h67NcuU2pWs0QQ",
  authDomain: "univers-de-nounours.firebaseapp.com",
  projectId: "univers-de-nounours",
  storageBucket: "univers-de-nounours.firebasestorage.app",
  messagingSenderId: "907203451442",
  appId: "1:907203451442:web:5402ea529764fd9dc2ba2b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);