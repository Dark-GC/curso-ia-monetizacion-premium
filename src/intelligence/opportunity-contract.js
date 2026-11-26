// Planning rubric, never a probability, demand forecast, or evidence of income.
import {methods} from '../creator-core.js';
import {normalizeResearch} from '../research-core.js';
const ID=/^[a-zA-Z0-9_-]{1,80}$/;
const exact=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const bounded=(v,n)=>typeof v==='string'&&v.trim().length>0&&v.length<=n;
const DIMENSIONS=Object.freeze(['skill','time','cost','rights','eligibility']);
export const DEFAULT_WEIGHTS=Object.freeze({skill:20,time:20,cost:25,rights:20,eligibility:15});
const tri=['yes','no','unknown'];
const keys=['id','method','problem','buyer','deliverable','minutes','costCentavos','skill','rights','eligibility','evidenceIds','origin'];
export function normalizeOpportunityCard(card){
 if(!exact(card,keys)||typeof card.id!=='string'||!ID.test(card.id)||!methods.some(m=>m.id===card.method)||!bounded(card.problem,300)||!bounded(card.buyer,160)||!bounded(card.deliverable,300)||!(card.minutes===null||Number.isInteger(card.minutes)&&card.minutes>0&&card.minutes<=600000)||!(card.costCentavos===null||Number.isSafeInteger(card.costCentavos)&&card.costCentavos>=0&&card.costCentavos<=100000000000)||![card.skill,card.rights,card.eligibility].every(x=>tri.includes(x))||!Array.isArray(card.evidenceIds)||card.evidenceIds.length>20||new Set(card.evidenceIds).size!==card.evidenceIds.length||!card.evidenceIds.every(x=>typeof x==='string'&&x.trim()&&x.length<=100)||!['synthetic','user-reported'].includes(card.origin))throw Error('Invalid opportunity card');
 return {...card,problem:card.problem.trim(),buyer:card.buyer.trim(),deliverable:card.deliverable.trim(),evidenceIds:[...card.evidenceIds]};
}
export function evaluateOpportunity(card,research,{minutes,weights=DEFAULT_WEIGHTS}={}){
 const c=normalizeOpportunityCard(card);
 if(!Number.isInteger(minutes)||minutes<1||minutes>1440||!exact(weights,DIMENSIONS)||DIMENSIONS.some(k=>!Number.isInteger(weights[k])||weights[k]<1||weights[k]>100)||DIMENSIONS.reduce((a,k)=>a+weights[k],0)!==100)throw Error('Invalid planning criteria');
 const rows=normalizeResearch(research),byId=new Map(rows.map(x=>[x.id,x]));
 const evidence=c.evidenceIds.map(id=>{if(!byId.has(id))throw Error('Missing evidence reference');const e=byId.get(id);return {id:e.id,kind:e.kind,url:e.url,date:e.date,origin:'user-reported',cost:e.cost,eligible:e.eligible}});
 const triScore=x=>x==='unknown'?null:x==='yes'?1:0;
 const values={skill:triScore(c.skill),time:c.minutes===null?null:c.minutes<=minutes?1:0,cost:c.costCentavos===null?null:c.costCentavos===0?1:0,rights:triScore(c.rights),eligibility:triScore(c.eligibility)};
 // Conflicting evidence requires review even when the card claims compatibility.
 const conflicts=evidence.some(e=>e.cost==='paid'||e.eligible==='no');
 const dimensions=DIMENSIONS.map(k=>({criterion:k,weight:weights[k],value:values[k]}));
 const unknown=dimensions.filter(d=>d.value===null).map(d=>d.criterion);
 const blocked=values.cost===0||values.rights===0||values.eligibility===0;
 const status=blocked?'blocked':conflicts?'review':unknown.length?'review':values.time===0||values.skill===0?'adjust':'ready-to-test';
 const score=unknown.length||conflicts?null:dimensions.reduce((n,d)=>n+d.weight*d.value,0);
 const demand=evidence.some(e=>e.kind==='sale')?'sale-reported':evidence.some(e=>e.kind==='buyer')?'buyer-interest-reported':evidence.some(e=>e.kind==='signal')?'signal-only':'unknown';
 return {id:c.id,method:c.method,origin:c.origin,status,score,dimensions,unknown,conflicts,demand,evidence,commerciallyVerified:false,profitForecast:null};
}
