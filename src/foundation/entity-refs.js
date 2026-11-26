// Typed references are a new contract; never rename legacy IDs.
const kinds=Object.freeze(['method','project','opportunity','resource','experiment','evidence','record','asset','workflow']);
export const ENTITY_KINDS=kinds;
export function entityRef(kind,id){
 if(!kinds.includes(kind)||typeof id!=='string'||!id.trim()||id.length>100||/[\u0000-\u001f\u007f]/.test(id))throw Error('Invalid entity reference');
 return Object.freeze({kind,id});
}
export function referenceKey(ref){
 if(!ref||typeof ref!=='object'||Object.keys(ref).length!==2||!Object.hasOwn(ref,'kind')||!Object.hasOwn(ref,'id'))throw Error('Invalid entity reference');
 const r=entityRef(ref.kind,ref.id);
 return JSON.stringify([r.kind,r.id]);
}
export function indexEntities(entries){
 const index=new Map();
 for(const entry of entries){
  const key=referenceKey(entry.ref);
  if(index.has(key))throw Error('Duplicate entity reference');
  index.set(key,entry.value);
 }
 return index;
}
export function resolveEntity(index,ref){
 const key=referenceKey(ref);
 if(!index.has(key))throw Error('Missing entity reference');
 return index.get(key);
}
