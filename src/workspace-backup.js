import {methods,lessons,validRecord} from './creator-core.js';
import {normalizeLabProgress} from './learning-resources.js';
import {normalizeResearch} from './research-core.js';
import {normalizeTrackWork} from './academy-tracks.js';
import {normalizeOpportunities,validateOpportunityLinks} from './opportunity-core.js';
import {blankCash,normalizeCash} from './cash-core.js';
import {defaultRoute,normalizeRoute} from './adaptive-core.js';
import {normalizePromptLibrary} from './prompt-master.js';
export const WORKSPACE_KEY='monetiza-os-v4-preview';
export const MAX_BACKUP_BYTES=10000000;
const uniqueIds=rows=>{const seen=new Set();return rows.every(r=>{if(!r||typeof r.id!=='string'||!r.id.trim()||r.id.length>100||seen.has(r.id))return false;seen.add(r.id);return true})};
export const emptyWorkspace=()=>({done:[],projects:[],records:[],labProgress:{},research:[],promptLibrary:[],route:defaultRoute(),cash:blankCash(),opportunities:[],trackWork:{}});
export function normalizeWorkspace(x){
 if(!x || typeof x!=='object'||Array.isArray(x)) throw Error('Formato inválido');
 if(!Array.isArray(x.done)||!Array.isArray(x.projects)||!Array.isArray(x.records)) throw Error('Respaldo inválido');
 if(x.done.length>1000||x.projects.length>500||x.records.length>1000||!x.records.every(validRecord)||!uniqueIds(x.records)||!uniqueIds(x.projects)||!x.records.every(r=>r.title.trim())) throw Error('Datos fuera de límites');
 if(!x.projects.every(p=>p&&typeof p.id==='string'&&methods.some(m=>m.id===p.method)&&typeof p.title==='string'&&p.title.trim().length>0&&p.title.length<=160&&Array.isArray(p.done)&&p.done.length<=100&&p.done.every(i=>Number.isInteger(i)&&i>=0&&i<methods.find(m=>m.id===p.method).steps.length))) throw Error('Proyecto inválido');
 return {trackWork:normalizeTrackWork(x.trackWork),opportunities:validateOpportunityLinks(normalizeOpportunities(x.opportunities),normalizeCash(x.cash),x.projects),cash:normalizeCash(x.cash),route:normalizeRoute(x.route),promptLibrary:normalizePromptLibrary(x.promptLibrary),research:normalizeResearch(x.research),labProgress:normalizeLabProgress(x.labProgress),done:[...new Set(x.done.filter(id=>lessons.some(l=>l.id===id)))],projects:x.projects.map(p=>({id:p.id,method:p.method,title:p.title,done:[...new Set(p.done)]})),records:x.records.map(r=>({id:r.id,title:r.title,income:r.income,cost:r.cost,views:r.views}))};
}

export function parseWorkspaceBackup(text){
 if(typeof text!=='string'||text.length>MAX_BACKUP_BYTES||new TextEncoder().encode(text).length>MAX_BACKUP_BYTES)throw Error('Respaldo demasiado grande');
 return normalizeWorkspace(JSON.parse(text));
}
export function serializeWorkspace(data){
 const text=JSON.stringify(normalizeWorkspace(data));
 if(text.length>MAX_BACKUP_BYTES||new TextEncoder().encode(text).length>MAX_BACKUP_BYTES)throw Error('Respaldo demasiado grande');
 return text;
}
export function persistReplacement(storage,data){
 const text=serializeWorkspace(data);
 storage.setItem(WORKSPACE_KEY,text);
 return JSON.parse(text);
}
