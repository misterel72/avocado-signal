import {test, before, after, beforeEach} from 'node:test';
import {readFile} from 'node:fs/promises';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,getDocs,collection,query,limit,updateDoc,deleteDoc,serverTimestamp} from 'firebase/firestore';
import {validated,demoRows} from '../src/model.js';
let env;
const db=(uid='owner',verified=true)=>env.authenticatedContext(uid,{email_verified:verified}).firestore();
const record=()=>({...validated(demoRows()[0]),createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
const target=database=>doc(database,'users/owner/prospects/one');
before(async()=>{env=await initializeTestEnvironment({projectId:'demo-avocado-pilot',firestore:{rules:await readFile(new URL('../firestore.rules',import.meta.url),'utf8'),host:'127.0.0.1',port:8080}});});
after(async()=>env?.cleanup());
beforeEach(async()=>{await env.clearFirestore();await env.withSecurityRulesDisabled(async ctx=>setDoc(doc(ctx.firestore(),'pilotMembers/owner'),{enabled:true}));});
test('unauthenticated and unapproved users cannot read or create prospects',async()=>{
 await assertFails(getDoc(target(env.unauthenticatedContext().firestore())));
 await assertFails(setDoc(doc(db('visitor'),'users/visitor/prospects/one'),record()));
 await assertFails(setDoc(target(db('owner',false)),record()));
});
test('members can save their own records but cannot access another user',async()=>{
 await assertSucceeds(setDoc(target(db()),record()));
 await assertSucceeds(getDoc(target(db())));
 await assertFails(getDoc(target(db('visitor'))));
 await assertSucceeds(getDocs(query(collection(db(),'users/owner/prospects'),limit(201))));
 await assertFails(getDocs(collection(db(),'users/owner/prospects')));
 await assertFails(getDocs(query(collection(db(),'users/owner/prospects'),limit(202))));
});
test('users cannot grant or enumerate membership, delete records or change creation time',async()=>{
 await assertFails(setDoc(doc(db(),'pilotMembers/owner'),{enabled:true}));
 await assertFails(getDocs(collection(db(),'pilotMembers')));
 await assertSucceeds(setDoc(target(db()),record()));
 await assertFails(deleteDoc(target(db())));
 await assertFails(updateDoc(target(db()),{createdAt:new Date(0),updatedAt:serverTimestamp()}));
 await assertSucceeds(updateDoc(target(db()),{stage:'Archived',updatedAt:serverTimestamp()}));
});
test('schema validation rejects extra fields, invalid stages, value and timestamps',async()=>{
 for(const change of [{value:-1},{stage:'Unknown'},{notes:'x'.repeat(4001)},{extra:'x'},{updatedAt:new Date(0)},{conceptUrl:'javascript:alert(1)'}])await assertFails(setDoc(target(db()),{...record(),...change}));
});
