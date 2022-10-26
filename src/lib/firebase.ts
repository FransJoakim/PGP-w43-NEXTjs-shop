import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  collection,
  updateDoc,
  addDoc,
  doc,
  getDocs,
  increment,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBDHDVPELgDqBJTk19vtX6QiHbCFjPvU1A',
  authDomain: 'quotes-next-salt.firebaseapp.com',
  projectId: 'quotes-next-salt',
  storageBucket: 'quotes-next-salt.appspot.com',
  messagingSenderId: '1049142311175',
  appId: '1:1049142311175:web:6daff1b26b7dcad23beda2',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const incrementCounterDB = async (id: string) => {
  const quoteRef = doc(db, 'quotes', id);
  await updateDoc(quoteRef, {
    charlieUttrance: increment(1),
  });
};

export const addComment = async (quoteId: string, comment: string) => {
  const commentRef = collection(db, 'quotes', quoteId, 'comments');
  const result = await addDoc(commentRef, {
    value: comment,
  });
  return result.id;
};
