// Monitor editorial sin dependencias ni credenciales. No ejecuta contenido remoto.
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {sources} from '../src/creator-core.js';
const allowed=new Set(['support.google.com','support.tiktok.com','about.fb.com','github.com']);
const limit=3_000_000;
async function digest(raw){
 let u=new URL(raw);
 for(let redirects=0;redirects<=3;redirects++){
  if(u.protocol!=='https:'||!allowed.has(u.hostname)||u.username||u.password||u.port)throw Error('URL fuera de lista: '+u.hostname);
  const response=await fetch(u,{redirect:'manual',signal:AbortSignal.timeout(15000),headers:{accept:'text/html','user-agent':'MonetizaOS-EditorialCheck/1.0'}});
  if([301,302,303,307,308].includes(response.status)){const loc=response.headers.get('location');await response.body?.cancel();if(!loc)throw Error('Redirección sin destino');u=new URL(loc,u);continue;}
  if(!response.ok){await response.body?.cancel();throw Error('HTTP '+response.status);}
  if(!/text\/html/i.test(response.headers.get('content-type')||'')){await response.body?.cancel();throw Error('Tipo no esperado');}
  const reader=response.body.getReader(),hash=createHash('sha256');let size=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>limit)throw Error('Límite de tamaño');hash.update(value);}}finally{await reader.cancel().catch(()=>{});}
  return {sha256:hash.digest('hex'),url:u.href,bytes:size};
 }
 throw Error('Demasiadas redirecciones');
}
const path=process.argv[2]||'source-report.json';
const baseline=process.argv[3]||path;
let previous={};try{previous=JSON.parse(await readFile(baseline,'utf8')).sources||{};}catch{}
const report={checkedAt:new Date().toISOString(),notice:'Huella HTML: cambios pueden ser cosméticos. No valida hechos, políticas ni rentabilidad. Revisión humana requerida.',sources:{}};
for(const [id,s] of Object.entries(sources)){
 try{const current=await digest(s.url);const old=previous[id]?.sha256;report.sources[id]={...current,status:!old?'BASELINE':old===current.sha256?'UNCHANGED':'REVIEW_REQUIRED'};}
 catch(e){report.sources[id]={status:'UNAVAILABLE',error:String(e.message).slice(0,160),...(previous[id]?.sha256?{previousSha256:previous[id].sha256}: {})};}
}
await writeFile(path,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(Object.values(report.sources).some(s=>s.status==='UNAVAILABLE'))process.exitCode=1;
