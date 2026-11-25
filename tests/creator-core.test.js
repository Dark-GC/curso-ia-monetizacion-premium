import {test} from 'node:test';
import assert from 'node:assert/strict';
import {methods,lessons,sources,buildPrompt,totals,validRecord} from '../src/creator-core.js';
test('twelve unique methods',()=>{assert.equal(methods.length,12);assert.equal(new Set(methods.map(m=>m.id)).size,12)});
test('ten unique lessons',()=>{assert.equal(lessons.length,10);assert.equal(new Set(lessons.map(l=>l.id)).size,10)});
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

import {normalizeFields,inspectPrompt,compilePrompt,normalizePromptLibrary,directorPlan} from '../src/prompt-master.js';
test('prompt structure checks six required fields',()=>{assert.equal(inspectPrompt({objective:'Crear guion'}).percent,17);assert.equal(inspectPrompt({role:'Editor',objective:'Guion',context:'Adultos',format:'Tabla',constraints:'Original',criteria:'Claro'}).percent,100)});
test('prompt with no objective does not generate',()=>assert.equal(compilePrompt({role:'Editor'}),''));
test('prompt adds verification and preserves instructions',()=>assert.match(compilePrompt({objective:'Crear guion',constraints:'Sin copiar'}),/No inventes fuentes/));
test('prompt library supports old backups and validates revisions',()=>{assert.deepEqual(normalizePromptLibrary(undefined),[]);assert.throws(()=>normalizePromptLibrary([{id:'1',title:'X',revision:0,fields:{objective:'X'}}]));assert.throws(()=>normalizeFields({role:'x'.repeat(241)}))});
test('director timeline exact and contiguous',()=>{const p=directorPlan({story:'Historia',bible:'Vestuario',duration:61,scenes:12,ratio:'9:16'});assert.equal(p.shots.length,12);assert.equal(p.shots.at(-1).end,61);assert.ok(p.shots.every((s,i)=>s.start===(i?p.shots[i-1].end:0)));assert.match(p.prompt,/Mantén la historia y el vestuario aprobados/)});
test('director rejects impossible scenes and bad ratio',()=>{const x={story:'Historia',bible:'',duration:15,scenes:20,ratio:'9:16'};assert.equal(directorPlan(x),null);assert.equal(directorPlan({...x,scenes:3,ratio:'foo'}),null)});

import {localAvailability,generateLocal,mentorPrompt} from '../src/mentor-core.js';
test('unsupported browser has no local provider',async()=>assert.equal(await localAvailability(null),'unsupported'));
test('compatibility check does not create a model session',async()=>{let calls=0;const provider={availability:async()=> 'downloadable',create:async()=>{calls++}};assert.equal(await localAvailability(provider),'downloadable');assert.equal(calls,0)});
test('mentor uses provider output and destroys session',async()=>{let destroyed=0;const provider={create:async()=>({prompt:async()=> 'Respuesta de prueba',destroy(){destroyed++}})};assert.equal(await generateLocal('Hola',{provider}),'Respuesta de prueba');assert.equal(destroyed,1)});
test('mentor destroys session when inference fails',async()=>{let destroyed=0;const provider={create:async()=>({prompt:async()=>{throw Error('Falló')},destroy(){destroyed++}})};await assert.rejects(generateLocal('Hola',{provider}));assert.equal(destroyed,1)});
test('mentor rejects missing task or context',()=>{assert.equal(mentorPrompt('bad','Tema'),'');assert.equal(mentorPrompt('learning',' '),'');assert.match(mentorPrompt('income','Animación'),/No inventes fuentes/)});

import {classifyTrend,trendRows,snapshotAge} from '../src/trend-core.js';
test('gaming trend classification is based on keywords',()=>assert.equal(classifyTrend('hollow knight silksong dlc').category,'Videojuegos'));
test('unrecognized trend stays unclassified',()=>assert.equal(classifyTrend('tema desconocido').category,'Sin clasificar'));
test('trend filters by region, category and query',()=>{const snap={feeds:{US:{status:'OK',items:[{title:'hollow knight',published:'date'},{title:'PSG',published:'date'},{title:'Hollow Knight',published:'date'}]}}};assert.equal(trendRows(snap,'US','Videojuegos','hollow').length,1);assert.deepEqual(trendRows(snap,'DO'),[])});
test('snapshot marks old data stale and rejects invalid dates',()=>{assert.equal(snapshotAge('2026-01-01T00:00:00Z',Date.parse('2026-01-02T00:00:00Z')).stale,true);assert.equal(snapshotAge('invalid').stale,true)});

import {normalizeTrendReport,feedCatalog} from '../src/trend-core.js';
const providerReport={checkedAt:'2026-01-01T00:00:00Z',feeds:{HF:{status:'OK',source:feedCatalog.HF.url,items:[{title:'Image model',published:'Example'}]}}};
test('provider report accepts known source and bounded plain text',()=>assert.equal(normalizeTrendReport(providerReport).feeds.HF.items[0].title,'Image model'));
test('provider report rejects spoofed known source',()=>assert.throws(()=>normalizeTrendReport({...providerReport,feeds:{HF:{...providerReport.feeds.HF,source:'https://example.com'}}})));
test('provider report rejects future date and oversized items',()=>{assert.throws(()=>normalizeTrendReport({...providerReport,checkedAt:'2999-01-01'}));assert.throws(()=>normalizeTrendReport({...providerReport,feeds:{HF:{...providerReport.feeds.HF,items:Array(31).fill(providerReport.feeds.HF.items[0])}}}))});

import {methodGuides,sevenDayPlan,guidePrompt} from '../src/method-guides.js';
test('every method has a complete practical guide',()=>assert.ok(methods.every(m=>{const g=methodGuides[m.id];return g&&g.how.length===4&&g.sample&&g.measure&&g.minutes>0})));
test('all guide tools resolve to known learning resources',()=>assert.ok(Object.values(methodGuides).every(g=>g.tools.every(id=>resources.some(r=>r.id===id)))));
test('weekly guide contains seven ordered actions',()=>{for(const m of methods){const p=sevenDayPlan(m.id);assert.equal(p.length,7);assert.ok(p.every((s,i)=>s.startsWith('Día '+(i+1))))}});
test('practice prompt includes zero-budget and evidence requirements',()=>{assert.match(guidePrompt('catalog'),/RD\$0/);assert.match(guidePrompt('catalog'),/no inventes ganancias/);assert.equal(guidePrompt('unknown'),'')});

import {defaultRoute,normalizeRoute,routePlan} from '../src/adaptive-core.js';
const routeFixture={done:[],projects:[],records:[],research:[]};
test('old backups receive default route',()=>assert.deepEqual(normalizeRoute(undefined),defaultRoute()));
test('route rejects unknown goals and invalid time',()=>{assert.throws(()=>normalizeRoute({goal:'unknown',minutes:30,preferred:''}));assert.throws(()=>normalizeRoute({goal:'income',minutes:0,preferred:''}))});
test('route excludes completed lessons and adapts to goal',()=>{const p=routePlan({...routeFixture,done:['research']},{goal:'channel',minutes:15,preferred:''});assert.equal(p.primary.lesson,'rights');assert.equal(p.selected,'science')});
test('income route prioritizes incomplete active project',()=>{const p=routePlan({...routeFixture,projects:[{id:'p',method:'ads',title:'Demo',done:[0]}]},defaultRoute());assert.equal(p.primary.project,'p');assert.equal(p.primary.action,methods.find(m=>m.id==='ads').steps[1]);assert.equal(p.primary.minutes,30)});
test('completed project without results recommends measuring not claiming a sale',()=>{const p=routePlan({...routeFixture,projects:[{id:'p',method:'ads',title:'Demo',done:[0,1,2,3,4]}]},defaultRoute());assert.ok(p.alternatives.some(t=>t.panel==='Resultados'));assert.equal(p.recordedNet,0)});
test('route allows preferred method without exceeding practice time',()=>{const p=routePlan(routeFixture,{goal:'skills',minutes:15,preferred:'audio'});assert.equal(p.selected,'audio');assert.ok([p.primary,...p.alternatives].every(t=>t.minutes<=15))});

import {planOffer} from '../src/finance-core.js';
test('offer separates cash, labor and hypothetical sales target',()=>assert.deepEqual(planOffer({price:1000,cost:200,hours:2,hourly:300,target:2400}),{cash:800,labor:600,net:200,minimum:800,effective:400,needed:3,neededHours:6}));
test('offer never predicts sales for nonpositive cash',()=>assert.equal(planOffer({price:100,cost:200,hours:1,hourly:0,target:500}).needed,null));
test('offer rejects invalid hours and negative amounts',()=>{assert.equal(planOffer({price:100,cost:0,hours:0,hourly:0,target:100}),null);assert.equal(planOffer({price:-1,cost:0,hours:1,hourly:0,target:100}),null)});

import {blankCash,cents,normalizeCash,cashSummary,settleReceivable} from '../src/cash-core.js';
test('cash cents preserve decimals and reject invalid money',()=>{assert.equal(cents('12.30'),1230);assert.equal(cents('0.01'),1);assert.equal(cents('-1'),null);assert.equal(cents('2.001'),null)});
test('old backups receive blank cash state',()=>assert.deepEqual(normalizeCash(undefined),blankCash()));
const cashFixture={opening:100000,period:'2026-11',essential:[{id:'e1',title:'Comida',kind:'Alimentación',amount:70000,paid:false},{id:'e2',title:'Transporte',kind:'Transporte',amount:10000,paid:true}],receivables:[{id:'r1',title:'Diseño',total:200000,received:20000}]};
test('pending receivable is excluded from available cash',()=>assert.deepEqual(cashSummary(cashFixture),{spent:10000,reserve:70000,collected:20000,pending:180000,balance:110000,free:40000,shortfall:0}));
test('partial payment updates cash and remaining receivable',()=>{const d=settleReceivable(cashFixture,'r1',30000);assert.equal(cashSummary(d).balance,140000);assert.equal(cashSummary(d).pending,150000);assert.throws(()=>settleReceivable(d,'r1',150001))});
test('unknown opening balance is never reported as zero',()=>assert.equal(cashSummary({...cashFixture,opening:null}).balance,null));
test('reserve deficit and duplicate ids are handled',()=>{assert.equal(cashSummary({...cashFixture,opening:0}).shortfall,60000);assert.throws(()=>normalizeCash({...cashFixture,receivables:[{...cashFixture.receivables[0],id:'e1'}]}))});
