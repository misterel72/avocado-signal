import {test} from 'node:test';
import assert from 'node:assert/strict';
import {metrics,validated,demoRows,csv,due} from '../src/model.js';
const sample=()=>({...demoRows('2026-10-23')[0]});
test('follow-ups and open value exclude suppressed, won and archived records',()=>{
 const rows=demoRows('2026-10-23');assert.deepEqual(metrics(rows,'2026-10-23'),{active:4,value:4750,due:3,won:1});
 assert.equal(due({...sample(),stage:'Archived'},'2026-10-23'),false);
 assert.equal(due({...sample(),nextFollowUp:'2026-10-24'},'2026-10-23'),false);
 assert.equal(due({...sample(),nextFollowUp:'2026-10-01'},'2026-10-23'),true);
});
test('rejects invalid values, dates, unsafe links and oversized drafts',()=>{
 for(const change of [{value:NaN},{value:-1},{value:1000001},{stage:'Oops'},{business:''},{conceptUrl:'javascript:alert(1)'},{nextFollowUp:'2026-02-30'},{draftBody:'x'.repeat(8001)},{email:'oops'}])assert.throws(()=>validated({...sample(),...change}));
 assert.equal(validated({...sample(),value:'120.50'}).value,120.5);
});
test('CSV escapes quotes, newlines and spreadsheet formulas',()=>{
 const out=csv([{...sample(),business:'=SUM(A1:A2)',notes:'Hello "friend"\nNext line'}]);
 assert.ok(out.includes('"\'=SUM(A1:A2)"'));assert.ok(out.includes('"Hello ""friend""\nNext line"'));
});
