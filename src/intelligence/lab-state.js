// Synthetic-only command center. No live workspace, network, provider or financial effects.
import {emptyWorkspace,normalizeWorkspace} from '../workspace-backup.js';
import {normalizeOpportunityCard,evaluateOpportunity} from './opportunity-contract.js';
import {normalizeResourceCheck,evaluateResource,resourceCatalog} from './resource-contract.js';
import {inspectSourceSnapshot} from './source-contract.js';
import {planCommercialLink} from './commercial-link.js';
const ID=/^[A-Za-z0-9_-]{1,80}$/;
const exact=(v,keys)=>v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===keys.length&&keys.every(k=>Object.hasOwn(v,k));
const LIMIT=2000000;
export function emptyIntelligenceLab(){return {version:1,revision:0,snapshot:null,cards:[],checks:[],workspace:normalizeWorkspace(emptyWorkspace()),links:[]}}
function normalizeCardEntry(x){
 if(!exact(x,['card','resourceIds'])||!Array.isArray(x.resourceIds)||x.resourceIds.length<1||x.resourceIds.length>8||new Set(x.resourceIds).size!==x.resourceIds.length||x.resourceIds.some(id=>!resourceCatalog.some(r=>r.id===id)))throw Error('Selecciona recursos válidos');
 const card=normalizeOpportunityCard(x.card);if(card.origin!=='synthetic'||card.evidenceIds.length)throw Error('Laboratorio solo sintético; evidencia comercial real no admitida');
 return {card,resourceIds:[...x.resourceIds]};
}
export function validateLab(state,now=Date.now()){
 if(!exact(state,['version','revision','snapshot','cards','checks','workspace','links'])||state.version!==1||!Number.isSafeInteger(state.revision)||state.revision<0||state.revision>=Number.MAX_SAFE_INTEGER||!Array.isArray(state.cards)||state.cards.length>100||!Array.isArray(state.checks)||state.checks.length>8||!Array.isArray(state.links)||state.links.length>100)throw Error('Estado del laboratorio inválido');
 if(state.snapshot!==null)inspectSourceSnapshot(state.snapshot,now);
 const cards=state.cards.map(normalizeCardEntry),checks=state.checks.map(x=>normalizeResourceCheck(x,now));
 if(new Set(cards.map(x=>x.card.id)).size!==cards.length||new Set(checks.map(x=>x.id)).size!==checks.length||checks.some(x=>x.origin!=='synthetic'))throw Error('Identidades o comprobaciones inválidas');
 const workspace=normalizeWorkspace(state.workspace);
 if(workspace.records.length||workspace.cash.receivables.length||workspace.research.length||workspace.projects.length!==state.links.length||workspace.opportunities.length!==state.links.length)throw Error('Estado comercial no permitido en laboratorio');
 const seen=new Set();
 const links=state.links.map(x=>{
  if(!exact(x,['cardId','projectId','opportunityId','resourceIds','savedAt'])||typeof x.cardId!=='string'||!ID.test(x.cardId)||seen.has(x.cardId)||typeof x.savedAt!=='string'||!Number.isFinite(Date.parse(x.savedAt))||Date.parse(x.savedAt)>now)throw Error('Enlace inválido');
  const entry=cards.find(c=>c.card.id===x.cardId),p=workspace.projects.find(p=>p.id===x.projectId),o=workspace.opportunities.find(o=>o.id===x.opportunityId);
  if(!entry||x.projectId!=='intel-project-'+x.cardId||x.opportunityId!=='intel-opportunity-'+x.cardId||!p||!o||p.method!==entry.card.method||o.project!==p.id||o.stage!=='idea'||o.quote!==0||o.receivable!==null||o.cost!==0||JSON.stringify(x.resourceIds)!==JSON.stringify(entry.resourceIds))throw Error('Enlace comercial incoherente');
  seen.add(x.cardId);return {...x,resourceIds:[...x.resourceIds]};
 });
 const result={version:1,revision:state.revision,snapshot:state.snapshot,cards,checks,workspace,links};
 if(new TextEncoder().encode(JSON.stringify(result)).length>LIMIT)throw Error('Límite del laboratorio excedido');
 return result;
}
export function reviewLabCard(state,id,minutes,now=Date.now()){
 const entry=state.cards.find(x=>x.card.id===id);if(!entry)throw Error('Ficha inexistente');
 const review=evaluateOpportunity(entry.card,state.workspace.research,{minutes});
 const resources=entry.resourceIds.map(id=>evaluateResource(id,state.checks.find(x=>x.id===id)||null,now));
 return {review,resources,ready:review.status==='ready-to-test'&&resources.every(x=>x.status==='ready-to-test')};
}
export function applyLab(state,command,now=Date.now()){
 const current=validateLab(state,now),next={...current,revision:current.revision+1};
 if(command?.type==='snapshot'&&exact(command,['type','text'])){inspectSourceSnapshot(command.text,now);next.snapshot=command.text}
 else if(command?.type==='card'&&exact(command,['type','entry'])){
  const entry=normalizeCardEntry(command.entry);
  if(current.cards.some(x=>x.card.id===entry.card.id))throw Error('Ficha duplicada');
  next.cards=[...current.cards,entry];
 }else if(command?.type==='check'&&exact(command,['type','verification'])){
  const check=normalizeResourceCheck(command.verification,now);if(check.origin!=='synthetic')throw Error('Solo comprobaciones de práctica');
  next.checks=[...current.checks.filter(x=>x.id!==check.id),check];
 }else if(command?.type==='draft'&&exact(command,['type','id','minutes','confirmed'])){
  if(command.confirmed!==true)throw Error('Confirma el borrador de práctica');
  const entry=current.cards.find(x=>x.card.id===command.id);
  const assessment=reviewLabCard(current,command.id,command.minutes,now);
  if(!assessment.ready)throw Error('Oportunidad o recursos pendientes de revisión');
  if(current.links.some(x=>x.cardId===command.id))return {status:'EXISTS',state:current};
  const plan=planCommercialLink(current.workspace,entry.card,{minutes:command.minutes,confirmed:true,laboratory:true});
  if(plan.status!=='PREVIEW')throw Error('Conflicto de borrador');
  next.workspace=plan.workspace;
  next.links=[...current.links,{cardId:entry.card.id,projectId:plan.link.project.id,opportunityId:plan.link.opportunity.id,resourceIds:[...entry.resourceIds],savedAt:new Date(now).toISOString()}];
 }else throw Error('Acción no admitida');
 return {status:'SAVED',state:validateLab(next,now)};
}
export function exportLab(state,now=Date.now()){
 const data=validateLab(state,now);
 return JSON.stringify({format:'monetiza-intelligence-lab-v1',scope:'synthetic-only; not a real workspace backup',exportedAt:new Date(now).toISOString(),data},null,2);
}
