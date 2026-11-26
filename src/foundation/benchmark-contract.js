// Compare matched, completed tasks without inventing observations. No telemetry.
export const BENCHMARK_TASKS=Object.freeze(['research','preproduction','prompt-review','commercial-offer']);
const MAX_MS=86400000, ID=/^[a-zA-Z0-9_-]{1,80}$/;
const exact=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
export function normalizeMeasurement(m){
 if(!exact(m,['caseId','task','mode','durationMs','quality','rubricVersion','origin'])||typeof m.caseId!=='string'||!ID.test(m.caseId)||!BENCHMARK_TASKS.includes(m.task)||!['manual','assisted'].includes(m.mode)||!Number.isSafeInteger(m.durationMs)||m.durationMs<=0||m.durationMs>MAX_MS||!Number.isInteger(m.quality)||m.quality<0||m.quality>100||typeof m.rubricVersion!=='string'||!ID.test(m.rubricVersion)||!['synthetic','observed'].includes(m.origin))throw Error('Invalid benchmark measurement');
 return Object.freeze({...m});
}
export function compareMeasurements(measurements){
 if(!Array.isArray(measurements)||measurements.length>200)throw Error('Invalid benchmark collection');
 const groups=new Map();
 for(const raw of measurements){
  const m=normalizeMeasurement(raw),key=JSON.stringify([m.caseId,m.task,m.rubricVersion,m.origin]);
  const group=groups.get(key)||{};
  if(Object.hasOwn(group,m.mode))throw Error('Duplicate benchmark mode');
  group[m.mode]=m;groups.set(key,group);
 }
 const pairs=[],pending=[];
 for(const group of groups.values()){
  if(!group.manual||!group.assisted){pending.push(group.manual||group.assisted);continue}
  const a=group.manual,b=group.assisted;
  pairs.push({caseId:a.caseId,task:a.task,origin:a.origin,rubricVersion:a.rubricVersion,manualMs:a.durationMs,assistedMs:b.durationMs,reductionPercent:Math.round((a.durationMs-b.durationMs)/a.durationMs*10000)/100,qualityDelta:b.quality-a.quality,qualityPreserved:b.quality>=a.quality});
 }
 return {pairs,pending,observedPairs:pairs.filter(x=>x.origin==='observed').length,syntheticPairs:pairs.filter(x=>x.origin==='synthetic').length};
}
