// Pure preview. No persistence, transmission, agreement, receipt or actual sale.
import {normalizeWorkspace} from '../workspace-backup.js';
import {blankExperiment,blankProposal} from '../proposal-core.js';
import {normalizeOpportunityCard,evaluateOpportunity} from './opportunity-contract.js';
import {entityRef} from '../foundation/entity-refs.js';
export function planCommercialLink(workspace,card,options){
 const c=normalizeOpportunityCard(card),data=normalizeWorkspace(workspace);
 const review=evaluateOpportunity(c,data.research,{minutes:options?.minutes,weights:options?.weights});
 if(options?.confirmed!==true)throw Error('Explicit local draft confirmation required');
 if(review.status!=='ready-to-test')throw Error('Opportunity requires review before drafting');
 if(c.origin==='synthetic'&&options?.laboratory!==true)throw Error('Synthetic opportunity requires isolated laboratory');
 const title=c.deliverable.slice(0,160);
 const pid='intel-project-'+c.id,oid='intel-opportunity-'+c.id,marker='Intelligence source: '+c.id;
 const project={id:pid,method:c.method,title,done:[]};
 const opportunity={id:oid,method:c.method,title,stage:'idea',notes:marker,quote:0,cost:0,minutes:c.minutes,project:pid,receivable:null,proposal:blankProposal(),experiment:{...blankExperiment(),hypothesis:c.problem,criterion:'Registrar respuesta voluntaria de un comprador potencial sin asumir venta.',nextAction:'Preparar una muestra original y revisar derechos antes de presentarla.'}};
 const p=data.projects.find(x=>x.id===pid),o=data.opportunities.find(x=>x.id===oid);
 const link={cardId:c.id,sourceOrigin:c.origin,method:entityRef('method',c.method),project:entityRef('project',pid),opportunity:entityRef('opportunity',oid),evidence:c.evidenceIds.map(id=>entityRef('evidence',id)),kind:'draft-only'};
 if(p||o){
  if(!p||!o||p.method!==c.method||o.method!==c.method||o.project!==pid||o.notes!==marker)throw Error('Existing draft identity conflict');
  return {status:'EXISTS',workspace:data,link,review};
 }
 const next=normalizeWorkspace({...data,projects:[...data.projects,project],opportunities:[...data.opportunities,opportunity]});
 return {status:'PREVIEW',workspace:next,link,review};
}
