// Experimental isolated IndexedDB store. Never reads/writes the legacy localStorage key.
import {prepareLegacyMigration,decodeEnvelope,encodeEnvelope,rollbackEnvelope} from './workspace-envelope.js';
import {validateLedger,reserveOperation,transitionOperation} from './audit-contract.js';
import {normalizeMeasurement,compareMeasurements} from './benchmark-contract.js';
export const DB_NAME='monetiza-os-x-lab-v1';
const STORE='workspace', KEY='isolated', MAX_REV=Number.MAX_SAFE_INTEGER-1;
// The combined record includes the original raw backup; the combined byte cap is intentional.
const LIMIT=10000000;
const exact=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const size=v=>new TextEncoder().encode(JSON.stringify(v)).length;
export function validateIsolatedRecord(v){
 if(!exact(v,['version','revision','originalRaw','envelope','audit','measurements'])||v.version!==1||!Number.isSafeInteger(v.revision)||v.revision<1||v.revision>MAX_REV||typeof v.originalRaw!=='string'||v.originalRaw.length>LIMIT||typeof v.envelope!=='string'||v.envelope.length>LIMIT||!Array.isArray(v.audit)||!Array.isArray(v.measurements))throw Error('Invalid isolated record');
 prepareLegacyMigration(v.originalRaw);
 decodeEnvelope(v.envelope);
 const audit=validateLedger(v.audit),measurements=v.measurements.map(normalizeMeasurement);
 compareMeasurements(measurements);
 const record={version:1,revision:v.revision,originalRaw:v.originalRaw,envelope:v.envelope,audit:[...audit],measurements};
 if(size(record)>LIMIT)throw Error('Combined isolated record exceeds limit');
 return record;
}
export function initialIsolatedRecord(raw){
 const m=prepareLegacyMigration(raw);
 return {record:validateIsolatedRecord({version:1,revision:1,originalRaw:m.originalRaw,envelope:m.envelope,audit:[],measurements:[]}),normalizationChanged:m.normalizationChanged};
}
export function openIsolatedDatabase(factory=globalThis.indexedDB){
 return new Promise((resolve,reject)=>{
  if(!factory){reject(Error('IndexedDB unavailable'));return}
  const req=factory.open(DB_NAME,1);
  req.onupgradeneeded=()=>{req.result.createObjectStore(STORE)};
  req.onblocked=()=>reject(Error('IndexedDB open blocked'));
  req.onerror=()=>reject(req.error||Error('IndexedDB open failed'));
  req.onsuccess=()=>{const db=req.result;db.onversionchange=()=>db.close();resolve(db)};
 });
}
export function readIsolated(db){
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(KEY);
  let value=null;
  req.onsuccess=()=>{try{value=req.result===undefined?null:validateIsolatedRecord(req.result)}catch(e){reject(e);tx.abort()}};
  tx.oncomplete=()=>resolve(value);
  tx.onabort=()=>reject(tx.error||Error('Read aborted'));
  tx.onerror=()=>reject(tx.error||Error('Read failed'));
 });
}
// All comparisons and writes occur inside one readwrite transaction, across tabs in the same DB.
// Never run async side effects in the transaction. A successful commit is not a backup guarantee.
function mutate(db,transform){
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),req=store.get(KEY);
  let result, failure;
  req.onsuccess=()=>{
   try{
    const current=req.result===undefined?null:validateIsolatedRecord(req.result);
    const next=transform(current);
    result=next.result;
    if(next.record!==undefined)store.put(validateIsolatedRecord(next.record),KEY);
   }catch(e){failure=e;tx.abort()}
  };
  tx.oncomplete=()=>resolve(result);
  tx.onabort=()=>reject(failure||tx.error||Error('Transaction aborted'));
  tx.onerror=()=>{ /* request errors abort; resolve/reject only on transaction completion */ };
 });
}
export function initializeIsolated(db,raw,{acceptNormalization=false}={}){
 const initial=initialIsolatedRecord(raw);
 if(initial.normalizationChanged&&!acceptNormalization)return Promise.reject(Error('Normalization requires explicit review'));
 return mutate(db,current=>{
  if(current!==null)throw Error('Isolated workspace already exists');
  return {record:initial.record,result:initial.record};
 });
}
export function applyIsolated(db,expectedRevision,command){
 return mutate(db,current=>{
  if(!current||current.revision!==expectedRevision)throw Error('Revision conflict');
  if(!command||typeof command!=='object')throw Error('Invalid command');
  let next={...current,revision:current.revision+1};
  if(command.type==='replace-workspace'&&exact(command,['type','workspace']))next.envelope=encodeEnvelope(command.workspace);
  else if(command.type==='reserve'&&exact(command,['type','request'])){
   const r=reserveOperation(current.audit,command.request);
   if(r.status==='EXISTS')return {result:{status:'EXISTS',record:current}};
   next.audit=[...r.events];
  }else if(command.type==='transition'&&exact(command,['type','operationId','state','result','at']))next.audit=[...transitionOperation(current.audit,command.operationId,command.state,command.result,command.at)];
  else if(command.type==='measurement'&&exact(command,['type','measurement']))next.measurements=[...current.measurements,normalizeMeasurement(command.measurement)];
  else throw Error('Invalid isolated command');
  next=validateIsolatedRecord(next);
  return {record:next,result:{status:'SAVED',record:next}};
 });
}
export function exportIsolatedRecovery(record){
 const v=validateIsolatedRecord(record);
 return {originalRaw:v.originalRaw,normalizedCurrent:rollbackEnvelope(v.envelope),isolatedRecord:JSON.stringify(v)};
}
