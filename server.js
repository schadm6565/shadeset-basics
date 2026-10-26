import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createUploadHandler,uploadConfig} from './upload-service.js';
const handleUpload=createUploadHandler(await uploadConfig());
import {livePriceCheck} from './price-check.js';
const allowed = new Map([
 ['/', ['index.html','text/html']], ['/index.html',['index.html','text/html']],
 ['/LICENSE',['LICENSE','text/plain']],
 ...["inter-tight-400.ttf", "inter-tight-500.ttf", "inter-tight-600.ttf", "jetbrains-mono-400.ttf", "jetbrains-mono-500.ttf"].map(name=>[`/public/fonts/${name}`, [`public/fonts/${name}`, 'font/ttf']]),
 ['/public/previews.json',['public/previews.json','application/json']],
 ['/public/favicon.svg',['public/favicon.svg','image/svg+xml']],
 ...['sample','soft-taupe','golden-hour','plum-after-dark','caramel-glow','bronze-night','dusty-rose','smoky-stone'].map(name=>[`/public/${name}.png`,[`public/${name}.png`,'image/png']]),
 ...['app','catalogue','optimiser','sources','approval','previews','upload-ui'].map(name=>[`/src/${name}.js`,[`src/${name}.js`,'text/javascript']]),
 ['/src/style.css',['src/style.css','text/css']]
]);
const server=createServer(async(req,res)=>{
 if(await handleUpload(req,res))return;
 if(req.method==='GET'&&req.url==='/api/prices'){try{const body=JSON.stringify(await livePriceCheck());res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(body);}catch{res.writeHead(502);res.end('{}');}return;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 let path;try{path=new URL(req.url,'http://127.0.0.1').pathname;}catch{res.writeHead(400);res.end();return;}
 const entry=allowed.get(path);
 if(!entry){res.writeHead(404);res.end('Not found');return;}
 try{
  const content=await readFile(new URL(entry[0],import.meta.url));
  res.writeHead(200,{'Content-Type':`${entry[1]}; charset=utf-8`,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob:; connect-src 'self'; frame-ancestors 'none'"});
  res.end(req.method==='HEAD'?undefined:content);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT)||5173,'127.0.0.1',()=>process.stdout.write(`ShadeSet: http://127.0.0.1:${Number(process.env.PORT)||5173}\n`));
