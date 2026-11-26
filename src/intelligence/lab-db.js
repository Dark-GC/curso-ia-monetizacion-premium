import {emptyIntelligenceLab,validateLab,applyLab} from './lab-state.js';
export const INTELLIGENCE_DB='monetiza-intelligence-synthetic-v1';
const STORE='lab',KEY='state';
export function openLab(factory=globalThis.indexedDB){return new Promise((resolve,reject)=>{
 if(!factory){reject(Error('IndexedDB no disponible'));return}
 const req=factory.open(INTELLIGENCE_DB,1);let blocked=false;
 req.onupgradeneeded=()=>req.result.createObjectStore(STORE);
 req.onblocked=()=>{blocked=true;reject(Error('Base de datos bloqueada'))};
 req.onerror=()=>reject(req.error||Error('No se pudo abrir el laboratorio'));
 req.onsuccess=()=>{const db=req.result;if(blocked){db.close();return}db.onversionchange=()=>db.close();resolve(db)};
})}
export function readLab(db){return new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(KEY);let value,error;
 req.onsuccess=()=>{try{value=req.result===undefined?emptyIntelligenceLab():validateLab(req.result)}catch(e){error=e;tx.abort()}};
 tx.oncomplete=()=>resolve(value);tx.onabort=()=>reject(error||tx.error||Error('Lectura abortada'));
})}
export function commitLab(db,revision,command){return new Promise((resolve,reject)=>{
 const tx=db.transaction(STORE,'readwrite'),store=tx.objectStore(STORE),req=store.get(KEY);let result,error;
 req.onsuccess=()=>{try{const current=req.result===undefined?emptyIntelligenceLab():validateLab(req.result);if(current.revision!==revision)throw Error('Conflicto de revisión: recarga el laboratorio');result=applyLab(current,command);if(result.status==='SAVED')store.put(result.state,KEY)}catch(e){error=e;tx.abort()}};
 tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(error||tx.error||Error('Escritura abortada'));
})}
