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

import {normalizeOpportunities,advanceOpportunity,linkReceivable,opportunityStats,validateOpportunityLinks} from '../src/opportunity-core.js';
const opportunityFixture={id:'opp',title:'Diseño original',method:'ads',stage:'idea',notes:'',quote:100000,cost:20000,minutes:60,project:null,receivable:null};
test('old backups have no opportunities',()=>assert.deepEqual(normalizeOpportunities(undefined),[]));
test('commercial stage requires actual sequential confirmations',()=>{assert.throws(()=>advanceOpportunity(opportunityFixture,'agreed'));let x=advanceOpportunity(opportunityFixture,'sample');x=advanceOpportunity(x,'offered');assert.throws(()=>advanceOpportunity({...x,quote:0},'agreed'));assert.equal(advanceOpportunity(x,'agreed').stage,'agreed')});
test('link creates a receivable once, never cash',()=>{const x={...opportunityFixture,stage:'agreed'};const result=linkReceivable([x],blankCash(),'opp','rec');assert.equal(result.cash.receivables[0].received,0);assert.equal(opportunityStats(result.opportunities,result.cash).collected,0);assert.equal(opportunityStats(result.opportunities,result.cash).pending,100000);assert.throws(()=>linkReceivable(result.opportunities,result.cash,'opp','rec2'))});
test('cash settlement feeds opportunity stats without duplicated income',()=>{const result=linkReceivable([{...opportunityFixture,stage:'agreed'}],blankCash(),'opp','rec');const cash=settleReceivable(result.cash,'rec',30000);assert.equal(opportunityStats(result.opportunities,cash).collected,30000);assert.equal(opportunityStats(result.opportunities,cash).pending,70000)});
test('import rejects broken commercial links',()=>{assert.throws(()=>validateOpportunityLinks([{...opportunityFixture,project:'missing'}],blankCash(),[]));assert.throws(()=>validateOpportunityLinks([{...opportunityFixture,stage:'agreed',receivable:'missing'}],blankCash(),[]))});

import {blankProposal,blankExperiment,normalizeProposal,normalizeExperiment,proposalText} from '../src/proposal-core.js';
const proposalFixture={recipient:'Comercio de prueba',scope:'Un anuncio vertical original',delivery:'Dos días tras aprobar materiales',revisions:'Una revisión',payment:'50% de anticipo',exclusions:'No incluye pauta ni material sin licencia'};
test('legacy opportunity receives empty proposal and experiment',()=>{const x=normalizeOpportunities([opportunityFixture])[0];assert.deepEqual(x.proposal,blankProposal());assert.deepEqual(x.experiment,blankExperiment())});
test('commercial quote uses agreed cents and explicit conditions',()=>{const text=proposalText(opportunityFixture,proposalFixture);assert.match(text,/1,000/);assert.match(text,/Una revisión/);assert.match(text,/No es factura fiscal/);assert.equal(proposalText({...opportunityFixture,quote:0},proposalFixture),'')});
test('incomplete proposal does not export',()=>assert.equal(proposalText(opportunityFixture,{...proposalFixture,payment:''}),''));
test('proposal rejects oversize and control characters',()=>{assert.throws(()=>normalizeProposal({...proposalFixture,scope:'x'.repeat(801)}));assert.throws(()=>normalizeProposal({...proposalFixture,scope:'bad\u0000'}))});
test('experiment decision needs observable evidence',()=>{assert.throws(()=>normalizeExperiment({...blankExperiment(),decision:'continue'}));assert.equal(normalizeExperiment({hypothesis:'Una muestra interesa',criterion:'Respuesta explícita',observation:'Sin respuesta',nextAction:'Cambiar oferta',decision:'adjust'}).decision,'adjust')});

import {configureOpening,correctReceipt,markExpense,nextPeriod,closePeriod} from '../src/cash-core.js';
test('opening correction requires reason and cannot silently change period',()=>{assert.throws(()=>configureOpening(cashFixture,120000,'2026-11'));assert.throws(()=>configureOpening(cashFixture,100000,'2026-12','Cambio','h1'));const d=configureOpening(cashFixture,120000,'2026-11','Saldo inicial mal registrado','h1');assert.equal(d.history[0].before,100000);assert.equal(cashSummary(d).balance,130000)});
test('receipt correction adjusts cash but preserves agreed price and audit reason',()=>{const d=correctReceipt(cashFixture,'r1',10000,'Duplicado','h1');assert.equal(d.receivables[0].total,200000);assert.equal(cashSummary(d).balance,100000);assert.equal(d.history[0].before,20000);assert.throws(()=>correctReceipt(d,'r1',200001,'Error','h2'))});
test('paid expense reversal requires reason and preserves reserve',()=>{assert.throws(()=>markExpense(cashFixture,'e2',false));const d=markExpense(cashFixture,'e2',false,'Registro erróneo','h1');assert.equal(cashSummary(d).spent,0);assert.equal(cashSummary(d).reserve,80000);assert.equal(d.history.length,1)});
test('period close carries cash and pending debt without counting receipts twice',()=>{const d=closePeriod(cashFixture,'2026-12');assert.equal(d.opening,110000);assert.equal(d.archives[0].collected,20000);assert.equal(d.archives[0].paid[0].id,'e2');assert.equal(cashSummary(d).balance,110000);assert.equal(cashSummary(d).collected,0);assert.equal(cashSummary(d).reserve,70000);assert.equal(cashSummary(d).pending,180000);assert.equal(d.receivables[0].carried,20000);assert.equal(cashSummary(settleReceivable(d,'r1',10000)).balance,120000)});
test('closed receipts cannot be reversed and malformed archive cannot import',()=>{const d=closePeriod(cashFixture,'2026-12');assert.throws(()=>correctReceipt(d,'r1',19999,'Error','h1'));assert.throws(()=>normalizeCash({...d,archives:[{...d.archives[0],collected:0}]}));assert.throws(()=>normalizeCash({...d,receivables:[{...d.receivables[0],carried:0}]}))});
test('period closing enforces chronological month and nonnegative reconciled balance',()=>{assert.equal(nextPeriod('2026-12'),'2027-01');assert.throws(()=>closePeriod(cashFixture,'2027-01'));assert.throws(()=>closePeriod({...cashFixture,opening:0,receivables:[]},'2026-12'));assert.throws(()=>closePeriod({...cashFixture,opening:null},'2026-12'))});

import {academyTracks,normalizeTrackWork,unitComplete,trackProgress,saveTrackUnit} from '../src/academy-tracks.js';
test('academy curriculum covers all twelve methods with thirty-six original units',()=>{assert.equal(academyTracks.length,12);assert.equal(academyTracks.flatMap(t=>t.units).length,36);assert.deepEqual([...new Set(academyTracks.map(t=>t.method))].sort(),methods.map(m=>m.id).sort());assert.equal(new Set(academyTracks.map(t=>t.id)).size,12);assert.ok(academyTracks.every(t=>methods.some(m=>m.id===t.method)&&t.resources.every(id=>resources.some(r=>r.id===id))&&t.units.reduce((n,u)=>n+u.minutes,0)===t.minutes&&new Set(t.units.map(u=>u.id)).size===t.units.length))});
test('legacy backups have empty track evidence',()=>assert.deepEqual(normalizeTrackWork(undefined),{}));
test('track evidence does not count a checklist without notes',()=>{const t=academyTracks[0],u=t.units[0];assert.equal(unitComplete(u,{note:' ',checked:[0,1,2]}),false);assert.equal(unitComplete(u,{note:'Práctica',checked:[0,0,1]}),false)});
test('valid evidence persists and deduplicates criteria',()=>{const t=academyTracks[0],u=t.units[0];const w=saveTrackUnit({},t.id,u.id,{note:' Brief revisado ',checked:[0,1,2]});assert.deepEqual(trackProgress(t,w[t.id]),{done:1,total:3,percent:33});assert.equal(w[t.id][u.id].note,'Brief revisado')});
test('track backups reject unknown paths, oversized notes and invalid check indices',()=>{assert.throws(()=>normalizeTrackWork({unknown:{}}));assert.throws(()=>normalizeTrackWork({service:{invalid:{note:'a',checked:[]}}}));assert.throws(()=>saveTrackUnit({},'service','brief',{note:'a'.repeat(1201),checked:[]}));assert.throws(()=>saveTrackUnit({},'service','brief',{note:'a',checked:[3]}))});

test('expanded academy units have actionable content and three distinct criteria',()=>{for(const t of academyTracks)for(const u of t.units){assert.ok(u.minutes>0);for(const k of ['title','lesson','example','task','deliverable'])assert.ok(typeof u[k]==='string'&&u[k].trim().length>0);assert.equal(u.checks.length,3);assert.equal(new Set(u.checks).size,3)}});
test('expanded curriculum preserves prior track progress while recording a new track',()=>{const old=saveTrackUnit({},'service','brief',{note:'Brief previo',checked:[0,1,2]});const expanded=saveTrackUnit(old,'subtitles','timing',{note:'SRT revisado',checked:[0,1,2]});assert.deepEqual(expanded.service,old.service);assert.equal(trackProgress(academyTracks.find(t=>t.id==='subtitles'),expanded.subtitles).done,1);assert.deepEqual(normalizeTrackWork(expanded),expanded)});
