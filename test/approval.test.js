import {test} from 'node:test';
import assert from 'node:assert/strict';
import {makeIdentity, ApprovalSession} from '../src/approval.js';
const bytes=text=>new TextEncoder().encode(text);
const recipe={id:'sample',shades:['vanilla','taupe','chocolate'],intensity:40,pattern:'3colors1'};
const input={photo:bytes('test-only photo bytes'),recipe,output:bytes('test-only output bytes')};
// These are identity fixtures, not images or YouCam provenance evidence.
test('approval binds actual photo, recipe and output bytes, clearing on any change',async()=>{
 const initial=await makeIdentity(input);
 for(const changed of [{...input,photo:bytes('different photo')},{...input,recipe:{...recipe,intensity:60}},{...input,output:bytes('different output')}]){
  const session=new ApprovalSession();session.update('sample',initial);session.approve('sample',initial);
  assert.deepEqual(session.approvedIds(),['sample']);
  session.update('sample',await makeIdentity(changed));assert.deepEqual(session.approvedIds(),[]);
  assert.throws(()=>session.approve('sample',initial),/changed/);
 }
});
test('canonical object keys preserve identity; array order remains significant',async()=>{
 const a=await makeIdentity(input);
 const b=await makeIdentity({...input,recipe:{pattern:'3colors1',intensity:40,shades:recipe.shades,id:'sample'}});
 assert.deepEqual(a,b);
 assert.notDeepEqual(a,await makeIdentity({...input,recipe:{...recipe,shades:[...recipe.shades].reverse()}}));
});
test('missing inputs and non-JSON recipes cannot acquire identities',async()=>{
 await assert.rejects(makeIdentity({...input,photo:new Uint8Array()}),/empty/);
 await assert.rejects(makeIdentity({...input,output:null}),/bytes/);
 await assert.rejects(makeIdentity({...input,recipe:{...recipe,intensity:NaN}}),/JSON/);
 await assert.rejects(makeIdentity({...input,recipe:{...recipe,extra:undefined}}),/JSON/);
});
test('rejection, removal and reset clear approval without mutating other looks',async()=>{
 const identity=await makeIdentity(input),session=new ApprovalSession();
 session.update('a',identity);session.update('b',identity);session.approve('a',identity);session.approve('b',identity);
 session.reject('a');assert.deepEqual(session.approvedIds(),['b']);
 session.remove('b');assert.deepEqual(session.approvedIds(),[]);
 assert.throws(()=>session.approve('b',identity),/unavailable/);
 session.update('a',identity);session.approve('a',identity);session.clear();assert.deepEqual(session.approvedIds(),[]);
});
test('caller mutations cannot alter stored approval identities',async()=>{
 const identity=await makeIdentity(input),session=new ApprovalSession();
 session.update('a',identity);session.approve('a',identity);
 const changed={...identity,outputHash:'a'.repeat(64)};session.update('a',changed);changed.outputHash=identity.outputHash;
 assert.deepEqual(session.approvedIds(),[]);
 assert.throws(()=>session.approve('a',identity),/changed/);
});
