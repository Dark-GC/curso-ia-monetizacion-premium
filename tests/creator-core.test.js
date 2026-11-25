import {test} from 'node:test';
import assert from 'node:assert/strict';
import {methods,lessons,sources,buildPrompt,totals,validRecord} from '../src/creator-core.js';
test('six unique methods',()=>{assert.equal(methods.length,6);assert.equal(new Set(methods.map(m=>m.id)).size,6)});
test('six unique lessons',()=>{assert.equal(lessons.length,6);assert.equal(new Set(lessons.map(l=>l.id)).size,6)});
test('references resolve',()=>assert.ok(methods.every(m=>m.refs.every(k=>sources[k]))));
test('blank topic rejected',()=>assert.equal(buildPrompt(methods[0],' ','x','9:16'),''));
test('prompt includes verification',()=>assert.ok(buildPrompt(methods[0],'tema','aud','9:16').includes('No inventes fuentes')));
test('totals',()=>assert.deepEqual(totals([{income:200,cost:30,views:40}]),{income:200,cost:30,views:40}));
test('negative record rejected',()=>assert.equal(validRecord({id:'a',title:'x',income:-1,cost:0,views:0}),false));
test('valid record accepted',()=>assert.equal(validRecord({id:'a',title:'x',income:1,cost:0,views:0}),true));

import {labs,resources,assessLab,normalizeLabProgress,labMethods} from '../src/learning-resources.js';
test('lab resource references resolve',()=>assert.ok(labs.every(l=>l.resourceIds.every(id=>resources.some(r=>r.id===id)))));
test('lab method references resolve',()=>assert.ok(labs.every(l=>methods.some(m=>m.id===labMethods[l.id]))));
test('lab completion cannot be inflated by duplicates',()=>assert.deepEqual(assessLab(labs[0],[0,0,1,9]),{done:2,total:5,percent:40}));
test('old data supports empty lab state',()=>assert.deepEqual(normalizeLabProgress(undefined),{}));
test('lab backup rejects invalid check indexes',()=>assert.throws(()=>normalizeLabProgress({offer:[-1,100]})));
test('lab backup deduplicates valid checks',()=>assert.deepEqual(normalizeLabProgress({offer:[0,0,1]}),{offer:[0,1]}));

import {researchSources,safeEvidenceUrl,normalizeResearch,researchStatus,researchPrompt} from '../src/research-core.js';
const evidenceFixture={id:'test',topic:'Animación',notes:'Muestra',url:'https://example.com/source',kind:'signal',cost:'zero',eligible:'yes',date:'2026-01-01'};
test('research sources resolve to HTTPS',()=>assert.ok(researchSources.every(s=>safeEvidenceUrl(s.url))));
test('unsafe protocols and credentials rejected',()=>{for(const u of ['javascript:alert(1)','data:text/html,hi','http://example.com','https://user:pass@example.com'])assert.equal(safeEvidenceUrl(u),null)});
test('missing research is compatible with older backups',()=>assert.deepEqual(normalizeResearch(undefined),[]));
test('invalid evidence rejected',()=>{assert.throws(()=>normalizeResearch([{...evidenceFixture,url:'javascript:alert(1)'}]));assert.throws(()=>normalizeResearch([{...evidenceFixture,date:'2026-02-30'}]));assert.throws(()=>normalizeResearch([evidenceFixture,evidenceFixture]))});
test('paid and ineligible evidence is not zero-cost',()=>assert.match(researchStatus({...evidenceFixture,cost:'paid'}),/No compatible/));
test('interest is not proven demand',()=>assert.match(researchStatus(evidenceFixture),/demanda sin validar/));
test('research prompt demands sources and distinguishes sales',()=>assert.match(researchPrompt('Animación'),/No inventes ingresos/));
