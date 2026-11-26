import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyWorkspace,normalizeWorkspace} from '../src/workspace-backup.js';
import {initialIsolatedRecord,validateIsolatedRecord,exportIsolatedRecovery} from '../src/foundation/isolated-store.js';
const raw=JSON.stringify({done:[],projects:[],records:[],future:{keep:true}});
test('isolated record preserves exact original and flags normalization',()=>{const a=initialIsolatedRecord(raw);assert.equal(a.normalizationChanged,true);assert.equal(a.record.originalRaw,raw);const rec=exportIsolatedRecovery(a.record);assert.equal(rec.originalRaw,raw);assert.deepEqual(JSON.parse(rec.normalizedCurrent),normalizeWorkspace(JSON.parse(raw)));assert.equal(JSON.parse(rec.isolatedRecord).revision,1)});
test('isolated record rejects unexpected fields, malformed revisions and ledger',()=>{const {record}=initialIsolatedRecord(JSON.stringify(normalizeWorkspace(emptyWorkspace())));for(const p of [{extra:1},{revision:0},{version:2},{originalRaw:'bad'},{audit:[{}]},{measurements:[{}]}])assert.throws(()=>validateIsolatedRecord({...record,...p}))});
test('combined cap rejects oversized input before storage',()=>{assert.throws(()=>initialIsolatedRecord('x'.repeat(10000001)))});
