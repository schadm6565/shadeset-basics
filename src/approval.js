// Integrity tokens are not proof of a render's origin. Asset provenance must be
// established separately before any image is presented as a genuine preview.
function canonical(value) {
 if(value===null||typeof value==='string'||typeof value==='boolean')return JSON.stringify(value);
 if(typeof value==='number'&&Number.isFinite(value))return JSON.stringify(value);
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value&&Object.getPrototypeOf(value)===Object.prototype)return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key])).join(',')+'}';
 throw new Error('Recipe must contain finite JSON values only');
}
async function digest(bytes) {
 if(!(bytes instanceof Uint8Array))throw new Error('Image bytes are required');
 if(!bytes.length)throw new Error('Image bytes cannot be empty');
 // Copy synchronously before the asynchronous digest, so caller mutation cannot
 // change the bytes half-way through computing a single identity.
 const hash=await globalThis.crypto.subtle.digest('SHA-256',new Uint8Array(bytes));
 return [...new Uint8Array(hash)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
export async function makeIdentity({photo,recipe,output}) {
 const recipeBytes=new TextEncoder().encode(canonical(recipe));
 const [photoHash,recipeHash,outputHash]=await Promise.all([digest(photo),digest(recipeBytes),digest(output)]);
 return Object.freeze({photoHash,recipeHash,outputHash});
}
const keys=['photoHash','recipeHash','outputHash'];
function copyIdentity(identity) {
 if(!identity||!keys.every(key=>typeof identity[key]==='string'&&/^[a-f0-9]{64}$/.test(identity[key])))throw new Error('Invalid approval identity');
 return Object.freeze(Object.fromEntries(keys.map(key=>[key,identity[key]])));
}
function same(a,b){return !!a&&!!b&&keys.every(key=>a[key]===b[key]);}
export class ApprovalSession {
 #current=new Map();
 #approved=new Map();
 update(id,identity){
  const snapshot=copyIdentity(identity);
  if(!same(snapshot,this.#current.get(id)))this.#approved.delete(id);
  this.#current.set(id,snapshot);
 }
 approve(id,displayedIdentity){
  const current=this.#current.get(id);
  if(!current)throw new Error('Preview unavailable');
  if(!same(current,displayedIdentity))throw new Error('Preview changed; inspect and approve it again');
  this.#approved.set(id,copyIdentity(current));
 }
 reject(id){this.#approved.delete(id);}
 remove(id){this.#approved.delete(id);this.#current.delete(id);}
 clear(){this.#approved.clear();}
 approvedIds(){return [...this.#approved].filter(([id,identity])=>same(identity,this.#current.get(id))).map(([id])=>id);}
}
