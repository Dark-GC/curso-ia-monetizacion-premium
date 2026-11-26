// In-memory structured ledger. No persistence, telemetry, real execution, or cryptographic proof.
import {LOCAL_CAPABILITIES,evaluateCapability} from './capability-policy.js';
export const MAX_EVENTS=1000;
const ID=/^[a-zA-Z0-9_-]{1,80}$/;
const timestamp=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString()===v;
const exact=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const transitions=Object.freeze({planned:['running','cancelled'],running:['completed','failed','cancelled'],completed:[],failed:[],cancelled:[]});
const results=Object.freeze({planned:['NONE'],running:['NONE'],completed:['OK'],failed:['VALIDATION','UNAVAILABLE','TIMEOUT','INTERNAL'],cancelled:['CANCELLED']});
const keys=['operationId','idempotencyKey','capability','dataClass','state','result','at','costCentavos'];
export function normalizeAuditEvent(e){
 if(!exact(e,keys)||typeof e.operationId!=='string'||!ID.test(e.operationId)||typeof e.idempotencyKey!=='string'||!ID.test(e.idempotencyKey)||!LOCAL_CAPABILITIES.includes(e.capability)||!['synthetic','public','personal'].includes(e.dataClass)||!Object.hasOwn(results,e.state)||!results[e.state].includes(e.result)||!timestamp(e.at)||e.costCentavos!==0)throw Error('Invalid audit event');
 return Object.freeze(Object.fromEntries(keys.map(k=>[k,e[k]])));
}
function build(events){
 if(!Array.isArray(events)||events.length>MAX_EVENTS)throw Error('Ledger capacity exceeded');
 const list=[],byId=new Map(),byKey=new Map();
 for(const raw of events){
  const e=normalizeAuditEvent(raw),prev=byId.get(e.operationId),owner=byKey.get(e.idempotencyKey);
  if(!prev){
   if(e.state!=='planned'||owner!==undefined)throw Error('Invalid operation identity');
  }else if(prev.idempotencyKey!==e.idempotencyKey||prev.capability!==e.capability||prev.dataClass!==e.dataClass||!transitions[prev.state].includes(e.state)||e.at<prev.at)throw Error('Invalid operation transition');
  byId.set(e.operationId,e);byKey.set(e.idempotencyKey,e.operationId);list.push(e);
 }
 return {list,byId,byKey};
}
export function validateLedger(events){return Object.freeze(build(events).list)}
// Identity reservation, not execution deduplication. No claim of atomic durable storage.
export function reserveOperation(events,request){
 const l=build(events);
 if(!exact(request,['operationId','idempotencyKey','capability','dataClass','at','network','operation','costCentavos']))throw Error('Invalid operation request');
 const d=evaluateCapability(request);
 if(!d.allowed)throw Error(d.reason);
 const e=normalizeAuditEvent({operationId:request.operationId,idempotencyKey:request.idempotencyKey,capability:request.capability,dataClass:request.dataClass,state:'planned',result:'NONE',at:request.at,costCentavos:0});
 const owner=l.byKey.get(e.idempotencyKey);
 if(owner!==undefined){
  const previous=l.byId.get(owner);
  if(owner!==e.operationId||previous.capability!==e.capability||previous.dataClass!==e.dataClass)throw Error('Idempotency conflict');
  return {events:Object.freeze(l.list),status:'EXISTS',operation:previous};
 }
 if(l.byId.has(e.operationId))throw Error('Operation ID conflict');
 return {events:validateLedger([...l.list,e]),status:'RESERVED',operation:e};
}
export function transitionOperation(events,operationId,state,result,at){
 const l=build(events),previous=l.byId.get(operationId);
 if(!previous)throw Error('Unknown operation');
 return validateLedger([...l.list,{...previous,state,result,at}]);
}
// Fixed source metadata, not evidence that the source is true or currently reachable.
export function normalizeProvenance(p){
 if(!exact(p,['sourceId','scope','status','checkedAt'])||typeof p.sourceId!=='string'||!ID.test(p.sourceId)||!['public-source','user-reported','synthetic'].includes(p.scope)||!['available','unavailable','stale','unknown'].includes(p.status)||!(p.checkedAt===null||timestamp(p.checkedAt))||(p.status!=='unknown'&&p.checkedAt===null))throw Error('Invalid provenance');
 return Object.freeze({...p});
}
