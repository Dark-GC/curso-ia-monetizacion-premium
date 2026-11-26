// Editorial starting points, not live entitlement or hardware verification.
import {resources} from '../learning-resources.js';
const ID=/^[a-zA-Z0-9_-]{1,80}$/;
const fields=['cost','card','quota','region','rights','hardware'];
const values=['yes','no','unknown'];
const exact=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const types={
 krita:'desktop',kdenlive:'desktop',audacity:'desktop',shotcut:'desktop',blender:'desktop',
 'ms-basic':'learning','ms-advanced':'learning',yt:'policy'
};
const alternatives={krita:['manual-design'],kdenlive:['shotcut','manual-edit'],audacity:['manual-voice'],shotcut:['kdenlive','manual-edit'],blender:['manual-design'],'ms-basic':['ms-advanced','manual-practice'],'ms-advanced':['ms-basic','manual-practice'],yt:['manual-policy']};
const manual={
 'manual-design':'Diseñar con recursos propios y una herramienta disponible.',
 'manual-edit':'Preparar guion, lista de planos y edición con recursos disponibles.',
 'manual-voice':'Grabar una narración propia si hay equipo disponible.',
 'manual-practice':'Practicar con ejemplos propios sin contratar servicios.',
 'manual-policy':'Consultar las condiciones oficiales antes de publicar.'
};
export const resourceCatalog=Object.freeze(resources.map(r=>Object.freeze({id:r.id,name:r.name,url:r.url,kind:r.kind,mode:types[r.id],editorialNote:r.cost,editorialDate:r.checked,alternatives:Object.freeze(alternatives[r.id]||[]),baseline:Object.freeze(Object.fromEntries(fields.map(k=>[k,'unknown'])))})));
export function resourceAlternatives(id){
 const r=resourceCatalog.find(x=>x.id===id);if(!r)throw Error('Unknown resource');
 return r.alternatives.map(a=>({id:a,label:manual[a]||resourceCatalog.find(x=>x.id===a)?.name||a,kind:Object.hasOwn(manual,a)?'manual':'catalog',verified:false}));
}
// All assertions refer to this user's intended task and current environment, not general product claims.
export function normalizeResourceCheck(v,now=Date.now()){
 if(!Number.isFinite(now)||!exact(v,['id','checkedAt','origin','checks'])||typeof v.id!=='string'||!ID.test(v.id)||!resourceCatalog.some(r=>r.id===v.id)||!date(v.checkedAt)||v.checkedAt>new Date(now).toISOString().slice(0,10)||!['user-reported','synthetic'].includes(v.origin)||!exact(v.checks,fields)||fields.some(k=>!values.includes(v.checks[k])))throw Error('Invalid resource verification');
 return {id:v.id,checkedAt:v.checkedAt,origin:v.origin,checks:Object.fromEntries(fields.map(k=>[k,v.checks[k]]))};
}
export const REVIEW_AGE_DAYS=30;
export function evaluateResource(id,verification=null,now=Date.now()){
 const resource=resourceCatalog.find(r=>r.id===id);if(!resource||!Number.isFinite(now))throw Error('Unknown resource or clock');
 const v=verification===null?null:normalizeResourceCheck(verification,now);
 if(v&&v.id!==id)throw Error('Resource verification mismatch');
 const today=Date.parse(new Date(now).toISOString().slice(0,10));
 const stale=v!==null&&(today-Date.parse(v.checkedAt))/86400000>=REVIEW_AGE_DAYS;
 const checks=v?.checks||resource.baseline;
 const blocked=fields.filter(k=>checks[k]==='no'),unknown=fields.filter(k=>checks[k]==='unknown');
 // No 'yes' from editorial descriptions; stale assertions require review.
 const status=blocked.length?'blocked':!v||stale||unknown.length?'review':'ready-to-test';
 return {resource,verification:v,status,stale,blocked,unknown,alternatives:resourceAlternatives(id),verifiedBySystem:false,guaranteedFree:false};
}
