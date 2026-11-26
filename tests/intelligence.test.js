import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectSourceSnapshot,FRESHNESS_MS} from '../src/intelligence/source-contract.js';
import {evaluateOpportunity,DEFAULT_WEIGHTS} from '../src/intelligence/opportunity-contract.js';
import {feedCatalog} from '../src/trend-core.js';
const now=Date.parse('2026-11-25T20:00:00.000Z');
const item={title:'Minecraft',published:'unverified'};
const snapshot={checkedAt:new Date(now).toISOString(),feeds:{DO:{status:'OK',source:feedCatalog.DO.url,items:[item,{...item,title:' minecraft '}]},US:{status:'OK',source:feedCatalog.US.url,items:[item]},HF:{status:'EMPTY',source:feedCatalog.HF.url,items:[]},GOOGLE:{status:'UNAVAILABLE',source:feedCatalog.GOOGLE.url,items:[]}}};
test('source snapshot preserves distinct sources, dedupes per source, labels coverage',()=>{const a=inspectSourceSnapshot(JSON.stringify(snapshot),now);assert.equal(a.signals.length,2);assert.equal(a.sources.find(x=>x.id==='DO').duplicates,1);assert.equal(a.sources.find(x=>x.id==='HF').status,'empty');assert.equal(a.sources.find(x=>x.id==='OAI').status,'missing');assert.equal(a.sources.find(x=>x.id==='GOOGLE').status,'unavailable');assert.ok(a.signals.every(x=>x.kind==='search-interest'&&!x.authenticated));assert.equal(a.authenticated,false)});
test('stale sources remain labeled and unavailable not reclassified',()=>{const a=inspectSourceSnapshot(JSON.stringify(snapshot),now+FRESHNESS_MS);assert.equal(a.stale,true);assert.equal(a.sources.find(x=>x.id==='DO').status,'stale');assert.equal(a.sources.find(x=>x.id==='GOOGLE').status,'unavailable');assert.ok(a.signals.every(x=>x.sourceStatus==='stale'))});
test('snapshot rejects unknown source, wrong URL, future date, oversize',()=>{for(const x of [{...snapshot,feeds:{...snapshot.feeds,EVIL:{}}},{...snapshot,feeds:{DO:{...snapshot.feeds.DO,source:'https://example.com'}}},{...snapshot,checkedAt:new Date(now+1000).toISOString()}])assert.throws(()=>inspectSourceSnapshot(JSON.stringify(x),now));assert.throws(()=>inspectSourceSnapshot('x'.repeat(500001),now))});
test('provider publication is not search interest or demand',()=>{const a=inspectSourceSnapshot(JSON.stringify({...snapshot,feeds:{HF:{status:'OK',source:feedCatalog.HF.url,items:[item]}}}),now);assert.equal(a.signals[0].kind,'provider-publication')});
const card={id:'case-1',method:'ads',problem:'Necesidad ficticia',buyer:'Comercio ficticio',deliverable:'Muestra original',minutes:30,costCentavos:0,skill:'yes',rights:'yes',eligibility:'yes',evidenceIds:[],origin:'synthetic'};
const evidence=(id,kind,cost='zero',eligible='yes')=>({id,topic:'Prueba ficticia',notes:'Fixture',url:'https://example.org/evidence',kind,cost,eligible,date:'2025-01-01'});
const cases=[
 ['ready',{},[],'ready-to-test',100,'unknown'],
 ['signal',{evidenceIds:['s']},[evidence('s','signal')],'ready-to-test',100,'signal-only'],
 ['buyer',{evidenceIds:['b']},[evidence('b','buyer')],'ready-to-test',100,'buyer-interest-reported'],
 ['sale',{evidenceIds:['v']},[evidence('v','sale')],'ready-to-test',100,'sale-reported'],
 ['cost',{costCentavos:100},[],'blocked',75,'unknown'],
 ['rights',{rights:'no'},[],'blocked',80,'unknown'],
 ['eligibility',{eligibility:'no'},[],'blocked',85,'unknown'],
 ['unknown',{costCentavos:null},[],'review',null,'unknown'],
 ['time',{minutes:90},[],'adjust',80,'unknown'],
 ['conflict',{evidenceIds:['c']},[evidence('c','policy','paid')],'review',null,'unknown']
];
for(const [id,patch,rows,status,score,demand] of cases)test('synthetic opportunity '+id,()=>{const a=evaluateOpportunity({...card,id,...patch},rows,{minutes:60});assert.equal(a.status,status);assert.equal(a.score,score);assert.equal(a.demand,demand);assert.equal(a.commerciallyVerified,false);assert.equal(a.profitForecast,null);assert.equal(a.origin,'synthetic')});
test('opportunity rejects missing evidence, invalid weight and unknown cost encoding',()=>{assert.throws(()=>evaluateOpportunity({...card,evidenceIds:['missing']},[],{minutes:60}));assert.throws(()=>evaluateOpportunity(card,[],{minutes:60,weights:{...DEFAULT_WEIGHTS,cost:0}}));assert.throws(()=>evaluateOpportunity({...card,costCentavos:-1},[],{minutes:60}));assert.throws(()=>evaluateOpportunity({...card,profit:999},[],{minutes:60}))});
