import {makeIdentity} from './approval.js';
export function renderRecipe(recipe,colours){
 const palettes=recipe.shades.map(shade=>{
  const color=colours[shade],texture=['taupe','gold','bronze'].includes(shade)?'shimmer':'matte';
  return {color,texture,colorIntensity:recipe.intensity,...(texture==='shimmer'?{shimmerColor:color,shimmerIntensity:35}:{})};
 });
 return {...recipe,colours:recipe.shades.map(shade=>({shade,colour:colours[shade]})),skinSmoothing:0,
  effects:[{category:'skin_smooth',skinSmoothStrength:0,skinSmoothColorIntensity:0},
   {category:'eye_shadow',pattern:{name:recipe.pattern},palettes}],version:'1.0'};
}
const imagePaths=new Set(['/public/sample.png',...['soft-taupe','golden-hour','plum-after-dark','caramel-glow','bronze-night','dusty-rose','smoky-stone'].map(id=>`/public/${id}.png`)]);
async function imageBytes(path,fetcher){
 if(!imagePaths.has(path))throw new Error('Unsupported preview path');
 const response=await fetcher(path,{cache:'no-store'});
 if(!response.ok||!response.headers.get('content-type')?.startsWith('image/png'))throw new Error('Preview image unavailable');
 const data=new Uint8Array(await response.arrayBuffer());
 if(data.length===0||data.length>10*1024*1024)throw new Error('Preview image size invalid');
 return data;
}
export async function loadPreviews(recipes,colours,fetcher=fetch){
 const response=await fetcher('/public/previews.json',{cache:'no-store'});
 if(!response.ok)throw new Error('Preview manifest unavailable');
 const manifest=await response.json();
 if(manifest.version!==1||manifest.provider!=='YouCam'||!Array.isArray(manifest.records)||manifest.records.length!==recipes.length)throw new Error('Genuine previews unavailable');
 if(manifest.photo!=='/public/sample.png')throw new Error('Unsupported sample photo path');
 const ids=new Set(manifest.records.map(record=>record.id));
 if(ids.size!==recipes.length||!recipes.every(recipe=>ids.has(recipe.id)))throw new Error('Preview set unavailable');
 for(const recipe of recipes){
  const record=manifest.records.find(r=>r.id===recipe.id);
  if(record.output!==`/public/${recipe.id}.png`||!imagePaths.has(record.output))throw new Error('Unsupported output path');
  if(record.endpoint!=='https://yce-api-01.makeupar.com/s2s/v2.0/task/makeup-vto'||record.skinSmoothing!==0||typeof record.funding!=='string'||!record.funding.trim()||typeof record.createdAt!=='string'||!Number.isFinite(Date.parse(record.createdAt)))throw new Error('Incomplete render provenance');
 }
 const photo=await imageBytes(manifest.photo,fetcher);
 return Promise.all(recipes.map(async recipe=>{
  const record=manifest.records.find(r=>r.id===recipe.id),output=await imageBytes(record.output,fetcher);
  const identity=await makeIdentity({photo,recipe:renderRecipe(recipe,colours),output});
  if(!Object.keys(identity).every(key=>identity[key]===record[key]))throw new Error('Preview identity does not match provenance');
  // Provenance must also be audited against the actual generation event before
  // release. Hashes check integrity; they cannot authenticate a provider.
  return {recipeId:recipe.id,photo,output,identity};
 }));
}
