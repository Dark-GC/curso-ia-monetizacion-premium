// Deterministic proposal drafting and one auditable experiment per opportunity.
export const proposalFields=[['recipient','Destinatario comercial',120],['scope','Entregables y alcance',800],['delivery','Plazo y condiciones de entrega',300],['revisions','Revisiones incluidas',300],['payment','Condiciones de pago',300],['exclusions','Exclusiones y derechos',500]];
export const experimentFields=[['hypothesis','Hipótesis comercial',400],['criterion','Criterio observable',400],['observation','Resultado observado',600],['nextAction','Próxima acción',300]];
export const decisions={pending:'Sin evaluar',continue:'Continuar',adjust:'Ajustar',stop:'Detener'};
export const blankProposal=()=>Object.fromEntries(proposalFields.map(([k])=>[k,'']));
export const blankExperiment=()=>({...Object.fromEntries(experimentFields.map(([k])=>[k,''])),decision:'pending'});
function normalizeFields(x,fields,empty){
 if(x===undefined)return empty();
 if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Ficha inválida');
 return Object.fromEntries(fields.map(([k,,max])=>{const v=x[k];if(typeof v!=='string'||v.length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v))throw Error('Campo inválido');return [k,v.trim()]}));
}
export const normalizeProposal=x=>normalizeFields(x,proposalFields,blankProposal);
export function normalizeExperiment(x){
 if(x===undefined)return blankExperiment();
 const e=normalizeFields(x,experimentFields,blankExperiment);
 if(!Object.hasOwn(decisions,x.decision)||x.decision!=='pending'&&(!e.hypothesis||!e.criterion||!e.observation||!e.nextAction))throw Error('La decisión requiere evidencia y próxima acción');
 return {...e,decision:x.decision};
}
const dop=n=>new Intl.NumberFormat('es-DO',{style:'currency',currency:'DOP'}).format(n/100);
export function proposalText(o,p=o.proposal){
 const v=normalizeProposal(p);
 if(!Number.isSafeInteger(o.quote)||o.quote<=0||o.quote>100000000000||!v.scope||!v.delivery||!v.revisions||!v.payment||!v.exclusions)return '';
 return ['PROPUESTA COMERCIAL · '+o.title,'Destinatario: '+(v.recipient||'Por confirmar'),'Entregables: '+v.scope,'Precio total propuesto: '+dop(o.quote)+' (DOP)','Entrega: '+v.delivery,'Revisiones: '+v.revisions,'Pago: '+v.payment,'Exclusiones y derechos: '+v.exclusions,'Sujeto a aceptación expresa y confirmación de datos. No es factura fiscal ni comprobante de pago.'].join('\n\n');
}
