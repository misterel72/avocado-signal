import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';

async function setup(){
 const dom=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://pilot.example',runScripts:'outside-only'});
 const w=dom.window;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};
 w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 const model=(await readFile(new URL('../src/model.js',import.meta.url),'utf8')).replace(/^export /gm,'');
 const main=(await readFile(new URL('../src/main.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'');
 w.eval(`const configured=false;const watchAuth=async()=>{};const login=async()=>{throw new Error('Firebase is not connected yet.');};${model}\n${main}`);
 return {dom,w,doc:w.document,click:selector=>w.document.querySelector(selector).click()};
}
test('demo supports create, edit, filtering, drafts and suppression',async()=>{
 const {dom,w,doc,click}=await setup();
 try{
  click('#demo');assert.match(doc.body.textContent,/Fictional demo data/);
  click('#add');
  const form=doc.querySelector('#prospect-form');
  form.elements.business.value='UI Test Business';form.elements.contact.value='Sample Person';form.elements.email.value='sample@example.com';
  form.elements.value.value='1500';form.elements.stage.value='Proposal';form.elements.nextFollowUp.value=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Qatar'}).format(new Date());
  form.elements.draftSubject.value='A useful next step';form.elements.draftBody.value='Fictional review note.';
  form.dispatchEvent(new w.Event('submit',{cancelable:true}));
  assert.match(doc.querySelector('#notice').textContent,/saved/);
  click('[data-view="Prospects"]');
  const search=doc.querySelector('#search');search.value='UI Test';search.dispatchEvent(new w.Event('input'));
  assert.equal(doc.querySelectorAll('tbody tr').length,1);
  click('[data-edit]');
  const edit=doc.querySelector('#prospect-form');edit.elements.suppressed.checked=true;edit.elements.suppressed.dispatchEvent(new w.Event('change'));
  assert.equal(edit.elements.draftBody.readOnly,true);
  edit.dispatchEvent(new w.Event('submit',{cancelable:true}));
  click('[data-view="Follow-ups"]');assert.doesNotMatch(doc.querySelector('#workspace').textContent,/UI Test Business/);
  click('[data-view="Drafts"]');assert.doesNotMatch(doc.querySelector('#workspace').textContent,/UI Test Business/);
  click('[data-view="Prospects"]');assert.match(doc.querySelector('#workspace').textContent,/UI Test Business/);
  click('#leave');assert.ok(doc.querySelector('#demo'));assert.doesNotMatch(doc.body.textContent,/UI Test Business/);
 }finally{dom.window.close();}
});
test('demo catches validation failures and sign-in explains pending configuration',async()=>{
 const {dom,w,doc,click}=await setup();
 try{
  click('#signin');await new Promise(resolve=>setTimeout(resolve,0));assert.match(doc.querySelector('#notice').textContent,/not connected/);
  click('#demo');click('#add');const form=doc.querySelector('#prospect-form');
  form.elements.business.value='Invalid value';form.elements.value.value='-1';form.dispatchEvent(new w.Event('submit',{cancelable:true}));
  assert.equal(doc.querySelector('#form-error').hidden,false);assert.equal(doc.querySelector('#save').disabled,false);
 }finally{dom.window.close();}
});
