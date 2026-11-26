// Pure preflight contract, not a security boundary for external execution.
// All external operations denied until a separately reviewed enforcement layer exists.
export const LOCAL_CAPABILITIES=Object.freeze(['workspace.read','workspace.plan','workspace.draft','workspace.export','workspace.validate']);
export const DATA_CLASSES=Object.freeze(['synthetic','public','personal','secret']);
const decision=(allowed,reason)=>Object.freeze({allowed,reason});
export function evaluateCapability(request){
 if(!request||typeof request!=='object'||Array.isArray(request))return decision(false,'INVALID_REQUEST');
 const {capability,dataClass,network,costCentavos,operation}=request;
 if(!LOCAL_CAPABILITIES.includes(capability))return decision(false,'CAPABILITY_NOT_GRANTED');
 if(!DATA_CLASSES.includes(dataClass)||dataClass==='secret')return decision(false,'DATA_NOT_ALLOWED');
 if(network!==false||operation!=='local')return decision(false,'EXTERNAL_NOT_GRANTED');
 if(!Number.isSafeInteger(costCentavos)||costCentavos!==0)return decision(false,'ZERO_BUDGET_REQUIRED');
 return decision(true,'LOCAL_ZERO_COST');
}
