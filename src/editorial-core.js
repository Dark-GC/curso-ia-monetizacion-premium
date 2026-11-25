import {sources} from './creator-core.js';
export const editorialStatuses={BASELINE:'Huella inicial',UNCHANGED:'Huella sin cambios',REVIEW_REQUIRED:'Revisión pendiente',UNAVAILABLE:'Fuente inaccesible'};
const digestOk=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
export function normalizeEditorial(input,now=Date.now()){
 if(!input||typeof input!=='object'||Array.isArray(input)||typeof input.checkedAt!=='string'||!Number.isFinite(Date.parse(input.checkedAt))||Date.parse(input.checkedAt)>now||!input.sources||typeof input.sources!=='object'||Array.isArray(input.sources))throw Error('Informe editorial inválido');
 const out={};
 for(const id of Object.keys(sources)){
  const x=input.sources[id];if(!x||!Object.hasOwn(editorialStatuses,x.status))throw Error('Fuente editorial incompleta');
  if(x.status==='UNAVAILABLE'){
   if(typeof x.error!=='string'||!x.error.trim()||x.error.length>160)throw Error('Motivo inválido');
   out[id]={status:x.status,error:x.error};if(digestOk(x.previousSha256))out[id].previousSha256=x.previousSha256;
  }else{
   if(!digestOk(x.sha256)||!Number.isInteger(x.bytes)||x.bytes<1||x.bytes>3000000||typeof x.url!=='string'||x.url.length>1000)throw Error('Huella inválida');
   const u=new URL(x.url),expected=new URL(sources[id].url);
   if(u.protocol!=='https:'||u.hostname!==expected.hostname||u.username||u.password||u.port)throw Error('Origen editorial inválido');
   out[id]={status:x.status,sha256:x.sha256,bytes:x.bytes,url:u.href};
  }
 }
 if(Object.keys(input.sources).some(id=>!Object.hasOwn(sources,id)))throw Error('Fuente desconocida');
 return {checkedAt:new Date(input.checkedAt).toISOString(),sources:out};
}
export function editorialSummary(report){
 const counts={BASELINE:0,UNCHANGED:0,REVIEW_REQUIRED:0,UNAVAILABLE:0};
 for(const x of Object.values(report.sources))counts[x.status]++;
 return counts;
}
