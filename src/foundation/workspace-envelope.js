// Isolated schema contract. No storage writes, network, or changes to RC1.
import {normalizeWorkspace,parseWorkspaceBackup,serializeWorkspace,MAX_BACKUP_BYTES} from '../workspace-backup.js';
export const SCHEMA='monetiza.workspace';
export const SCHEMA_VERSION=1;
export const EXPANSION_KEY='monetiza-os-x-workspace-v1';
const plain=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const exactKeys=(v,keys)=>plain(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const fits=s=>typeof s==='string'&&s.length<=MAX_BACKUP_BYTES&&new TextEncoder().encode(s).length<=MAX_BACKUP_BYTES;
function equal(a,b){
 if(a===b)return true;
 if(Array.isArray(a)||Array.isArray(b))return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>equal(v,b[i]));
 if(!plain(a)||!plain(b))return false;
 return Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k]));
}
export function encodeEnvelope(workspace){
 const data=normalizeWorkspace(workspace);
 const text=JSON.stringify({schema:SCHEMA,version:SCHEMA_VERSION,workspace:data});
 if(!fits(text))throw Error('Envelope exceeds size limit');
 return text;
}
export function decodeEnvelope(text){
 if(!fits(text))throw Error('Envelope exceeds size limit');
 const value=JSON.parse(text);
 if(!exactKeys(value,['schema','version','workspace'])||value.schema!==SCHEMA||value.version!==SCHEMA_VERSION)throw Error('Unsupported workspace schema');
 const normalized=normalizeWorkspace(value.workspace);
 if(!equal(normalized,value.workspace))throw Error('Noncanonical workspace; refusing silent data loss');
 return normalized;
}
// Caller must retain original raw backup; never mutate the original key.
export function prepareLegacyMigration(raw){
 const workspace=parseWorkspaceBackup(raw);
 const original=JSON.parse(raw);
 const envelope=encodeEnvelope(workspace);
 return {originalRaw:raw,envelope,normalizationChanged:!equal(original,workspace),rollback:serializeWorkspace(decodeEnvelope(envelope))};
}
export function prepareMigrationFromStorage(storage){
 const raw=storage.getItem('monetiza-os-v4-preview');
 if(raw===null)throw Error('No original workspace');
 return prepareLegacyMigration(raw);
}
export function rollbackEnvelope(text){return serializeWorkspace(decodeEnvelope(text))}
