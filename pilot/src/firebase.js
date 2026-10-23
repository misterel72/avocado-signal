import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence} from 'firebase/auth';
import {getFirestore, collection, doc, getDoc, getDocs, query, orderBy, limit, setDoc, serverTimestamp} from 'firebase/firestore';

const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
export const configured = Object.values(config).every(Boolean);
let auth, db;
if (configured) { const app=initializeApp(config); auth=getAuth(app); db=getFirestore(app); }
export async function watchAuth(callback) {
  if (!configured) return;
  await setPersistence(auth,browserSessionPersistence);
  return onAuthStateChanged(auth,callback);
}
export async function login() {
  if (!configured) throw new Error('Firebase is not connected yet. You can explore the demo below.');
  const provider=new GoogleAuthProvider(); provider.setCustomParameters({prompt:'select_account'});
  await signInWithPopup(auth,provider);
}
export const logout = () => signOut(auth);
export async function member(uid) { const snap=await getDoc(doc(db,'pilotMembers',uid)); return snap.exists() && snap.data().enabled===true; }
export async function loadProspects(uid) {
  const snap=await getDocs(query(collection(db,'users',uid,'prospects'),orderBy('updatedAt','desc'),limit(201)));
  return {rows:snap.docs.slice(0,200).map(d=>({...d.data(),id:d.id})), capped:snap.size>200};
}
export async function saveProspect(uid,id,data) {
  const ref=id?doc(db,'users',uid,'prospects',id):doc(collection(db,'users',uid,'prospects'));
  await setDoc(ref,{...data,...(!id?{createdAt:serverTimestamp()}:{}),updatedAt:serverTimestamp()},{merge:true});
}
