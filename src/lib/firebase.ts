import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  collection,
  query,
  updateDoc,
  setDoc,
  doc,
  getDoc,
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
const db = getFirestore(app);

export const getUtterances = async () => {
  const collectionRef = collection(db, 'quotes');
  const collectionSnap = await getDocs(collectionRef);
  const utterances: any = [];
  collectionSnap.forEach((doc) =>
    utterances.push({
      id: doc.id,
      charlieUttrance: doc.data().charlieUttrance,
    }),
  );
  return utterances;
};

export const incrementCounterDB = async (id: string) => {
  const quoteRef = doc(db, 'quotes', id);
  await updateDoc(quoteRef, {
    charlieUttrance: increment(1),
  });
};
