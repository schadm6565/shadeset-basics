import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const allowed = new Map([
 ['/', ['index.html','text/html']], ['/index.html',['index.html','text/html']],
 ['/LICENSE',['LICENSE','text/plain']],
 ...['app','catalogue','optimiser'].map(name=>[`/src/${name}.js`,[`src/${name}.js`,'text/javascript']]),
 ['/src/style.css',['src/style.css','text/css']]
]);
const server=createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 let path;try{path=new URL(req.url,'http://127.0.0.1').pathname;}catch{res.writeHead(400);res.end();return;}
 const entry=allowed.get(path);
 if(!entry){res.writeHead(404);res.end('Not found');return;}
 try{
  const content=await readFile(new URL(entry[0],import.meta.url));
  res.writeHead(200,{'Content-Type':`${entry[1]}; charset=utf-8`,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'"});
  res.end(req.method==='HEAD'?undefined:content);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(5173,'127.0.0.1',()=>process.stdout.write('LookKit: http://127.0.0.1:5173\n'));
