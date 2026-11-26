import {test,expect} from '@playwright/test';
const raw=JSON.stringify({done:['prompt'],projects:[{id:'p',method:'ads',title:'Proyecto ficticio',done:[0]}],records:[],future:{keep:true}});
const req={operationId:'op-1',idempotencyKey:'key-1',capability:'workspace.plan',dataClass:'synthetic',at:'2026-11-25T20:00:00.000Z',network:false,operation:'local',costCentavos:0};
test.beforeEach(async({page})=>{await page.goto('/foundation-e2e/lab.html');await page.evaluate(raw=>localStorage.setItem('monetiza-os-v4-preview',raw),raw)});
test('actual IndexedDB migration requires explicit review and survives reload',async({page})=>{
 const a=await page.evaluate(async raw=>{const m=await import('/src/foundation/isolated-store.js');const db=await m.openIsolatedDatabase();let rejected=false;try{await m.initializeIsolated(db,raw)}catch{rejected=true}const before=await m.readIsolated(db);const record=await m.initializeIsolated(db,raw,{acceptNormalization:true});db.close();return {rejected,before,revision:record.revision,legacy:localStorage.getItem('monetiza-os-v4-preview')}},raw);
 expect(a).toEqual({rejected:true,before:null,revision:1,legacy:raw});
 await page.reload();
 const b=await page.evaluate(async()=>{const m=await import('/src/foundation/isolated-store.js');const db=await m.openIsolatedDatabase();const v=await m.readIsolated(db);const recovery=m.exportIsolatedRecovery(v);db.close();return {original:recovery.originalRaw,title:JSON.parse(recovery.normalizedCurrent).projects[0].title,legacy:localStorage.getItem('monetiza-os-v4-preview')}});
 expect(b).toEqual({original:raw,title:'Proyecto ficticio',legacy:raw});
});
test('actual IndexedDB abort preserves original, revision and valid ledger',async({page})=>{
 const a=await page.evaluate(async({raw,req})=>{const m=await import('/src/foundation/isolated-store.js');const db=await m.openIsolatedDatabase();await m.initializeIsolated(db,raw,{acceptNormalization:true});const saved=await m.applyIsolated(db,1,{type:'reserve',request:req});const replay=await m.applyIsolated(db,2,{type:'reserve',request:req});let rejected=0;for(const command of [{type:'transition',operationId:'op-1',state:'completed',result:'OK',at:req.at},{type:'reserve',request:{...req,network:true}},{type:'replace-workspace',workspace:{bad:true}}]){try{await m.applyIsolated(db,2,command)}catch{rejected++}}const after=await m.readIsolated(db);db.close();return {saved:saved.record.revision,replay:replay.status,rejected,revision:after.revision,audit:after.audit.length,original:after.originalRaw,legacy:localStorage.getItem('monetiza-os-v4-preview')}},{raw,req});
 expect(a).toEqual({saved:2,replay:'EXISTS',rejected:3,revision:2,audit:1,original:raw,legacy:raw});
});
test('two browser tabs cannot both commit same revision',async({page,context})=>{
 await page.evaluate(async raw=>{const m=await import('/src/foundation/isolated-store.js');const db=await m.openIsolatedDatabase();await m.initializeIsolated(db,raw,{acceptNormalization:true});db.close()},raw);
 const second=await context.newPage();await second.goto('/foundation-e2e/lab.html');
 const apply=(p,id)=>p.evaluate(async id=>{const m=await import('/src/foundation/isolated-store.js');const db=await m.openIsolatedDatabase();try{const x=await m.applyIsolated(db,1,{type:'measurement',measurement:{caseId:id,task:'research',mode:'manual',durationMs:1000,quality:80,rubricVersion:'v1',origin:'synthetic'}});return {status:x.status}}catch(e){return {status:e.message}}finally{db.close()}},id);
 const results=await Promise.all([apply(page,'a'),apply(second,'b')]);expect(results.map(x=>x.status).sort()).toEqual(['Revision conflict','SAVED']);
 const after=await second.evaluate(async()=>{const m=await import('/src/foundation/isolated-store.js');const db=await m.openIsolatedDatabase();const x=await m.readIsolated(db);db.close();return {revision:x.revision,count:x.measurements.length,legacy:localStorage.getItem('monetiza-os-v4-preview')}});
 expect(after).toEqual({revision:2,count:1,legacy:raw});
});
test('real transaction request failure rolls back prior state',async({page})=>{
 const a=await page.evaluate(async({raw,req})=>{const m=await import('/src/foundation/isolated-store.js');const db=await m.openIsolatedDatabase();await m.initializeIsolated(db,raw,{acceptNormalization:true});const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(){throw new DOMException('Simulated storage failure','QuotaExceededError')};let failed=false;try{await m.applyIsolated(db,1,{type:'reserve',request:req})}catch{failed=true}finally{IDBObjectStore.prototype.put=put}const after=await m.readIsolated(db);db.close();return {failed,revision:after.revision,audit:after.audit.length,legacy:localStorage.getItem('monetiza-os-v4-preview')}},{raw,req});
 expect(a).toEqual({failed:true,revision:1,audit:0,legacy:raw});
});
