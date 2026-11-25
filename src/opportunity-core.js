import {methods} from './creator-core.js';
import {normalizeCash} from './cash-core.js';
export const stages={idea:'Idea',sample:'Muestra preparada',offered:'Oferta presentada',agreed:'Acuerdo confirmado',closed:'No continuada'};
const next={idea:['sample','closed'],sample:['offered','closed'],offered:['agreed','closed'],agreed:[],closed:[]};
const idOk=x=>typeof x==='string'&&x.length>0&&x.length<=100;
const textOk=(x,max)=>typeof x==='string'&&x.length<=max;
const amount=x=>Number.isSafeInteger(x)&&x>=0&&x<=100000000000;
export function normalizeOpportunities(v){
 if(v===undefined)return [];
 if(!Array.isArray(v)||v.length>200)throw Error('Oportunidades inválidas');
 const seen=new Set();
 return v.map(x=>{
 if(!x||!idOk(x.id)||seen.has(x.id)||!textOk(x.title,160)||!x.title.trim()||!methods.some(m=>m.id===x.method)||!Object.hasOwn(stages,x.stage)||!textOk(x.notes,1000)||!amount(x.quote)||!amount(x.cost)||!Number.isInteger(x.minutes)||x.minutes<0||x.minutes>600000||!(x.project===null||idOk(x.project))||!(x.receivable===null||idOk(x.receivable))||x.receivable!==null&&x.stage!=='agreed'||x.stage==='agreed'&&x.quote===0)throw Error('Oportunidad inválida');
 seen.add(x.id);return {id:x.id,title:x.title.trim(),method:x.method,stage:x.stage,notes:x.notes,quote:x.quote,cost:x.cost,minutes:x.minutes,project:x.project,receivable:x.receivable};
 });
}
export function advanceOpportunity(x,stage){
 if(!Object.hasOwn(next,x.stage)||!next[x.stage].includes(stage)||stage==='agreed'&&x.quote<=0)throw Error('Transición no permitida');
 return {...x,stage};
}
export function linkReceivable(opportunities,cash,id,receivableId){
 const list=normalizeOpportunities(opportunities),d=normalizeCash(cash),x=list.find(o=>o.id===id);
 if(!x||x.stage!=='agreed'||x.receivable!==null||!idOk(receivableId)||d.receivables.some(e=>e.id===receivableId)||list.some(e=>e.receivable===receivableId))throw Error('Cuenta por cobrar no permitida');
 return {opportunities:normalizeOpportunities(list.map(o=>o.id===id?{...o,receivable:receivableId}:o)),cash:normalizeCash({...d,receivables:[...d.receivables,{id:receivableId,title:x.title,total:x.quote,received:0}]})};
}
export function opportunityStats(list,cash){
 const items=normalizeOpportunities(list),d=normalizeCash(cash);
 const linked=items.map(x=>d.receivables.find(r=>r.id===x.receivable)).filter(Boolean);
 return {total:items.length,offered:items.filter(x=>['offered','agreed'].includes(x.stage)).length,agreed:items.filter(x=>x.stage==='agreed').length,collected:linked.reduce((n,x)=>n+x.received,0),pending:linked.reduce((n,x)=>n+x.total-x.received,0)};
}
export function validateOpportunityLinks(list,cash,projects){
 const ids=new Set(),projectIds=new Set();
 for(const x of list){if(x.receivable!==null){const rec=cash.receivables.find(r=>r.id===x.receivable);if(!rec||rec.total!==x.quote||ids.has(x.receivable))throw Error('Cobro enlazado inválido');ids.add(x.receivable)}
 if(x.project!==null){const p=projects.find(p=>p.id===x.project);if(!p||p.method!==x.method||projectIds.has(x.project))throw Error('Proyecto enlazado inválido');projectIds.add(x.project)}}
 return list;
}
