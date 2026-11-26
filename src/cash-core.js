// Local cash planning. Amounts are integer centavos; receivables are not cash.
export const blankCash=()=>({opening:null,period:'',essential:[],receivables:[],history:[],archives:[]});
export const essentialKinds=['Alimentación','Vivienda','Transporte','Servicios','Salud','Otros esenciales'];
const max=100000000000;
const amount=n=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const idOk=v=>typeof v==='string'&&v.length>0&&v.length<=100;
const labelOk=v=>typeof v==='string'&&v.trim().length>0&&v.length<=160;
const periodOk=v=>typeof v==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(v);
const sumOk=v=>Number.isSafeInteger(v)&&Math.abs(v)<=100000000000000;
const reasonOk=v=>typeof v==='string'&&v.trim().length>0&&v.length<=240;
export function cents(value){
 if(typeof value!=='string'||!/^\d{1,10}(\.\d{1,2})?$/.test(value.trim()))return null;
 const [whole,decimal='']=value.trim().split('.');const n=Number(whole)*100+Number(decimal.padEnd(2,'0'));return amount(n)?n:null;
}
export function normalizeCash(x){
 if(x===undefined)return blankCash();
 if(!x||typeof x!=='object'||Array.isArray(x)||!(x.opening===null||amount(x.opening))||typeof x.period!=='string'||(x.period!==''&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(x.period))||!Array.isArray(x.essential)||!Array.isArray(x.receivables)||x.essential.length>100||x.receivables.length>200)throw Error('Datos financieros inválidos');
 if(x.opening!==null&&!x.period)throw Error('Período requerido');
 const seen=new Set();
 const checkId=v=>{if(!idOk(v)||seen.has(v))throw Error('ID inválido');seen.add(v);return v};
 const essential=x.essential.map(e=>{if(!e||!essentialKinds.includes(e.kind)||!labelOk(e.title)||!amount(e.amount)||e.amount===0||typeof e.paid!=='boolean')throw Error('Gasto inválido');return {id:checkId(e.id),kind:e.kind,title:e.title.trim(),amount:e.amount,paid:e.paid}});
 const receivables=x.receivables.map(e=>{if(!e||!labelOk(e.title)||!amount(e.total)||e.total===0||!amount(e.received)||e.received>e.total)throw Error('Cobro inválido');const carried=e.carried===undefined?0:e.carried;if(!amount(carried)||carried>e.received)throw Error('Cobro previo inválido');return {id:checkId(e.id),title:e.title.trim(),total:e.total,received:e.received,carried}});
 const h=x.history===undefined?[]:x.history,a=x.archives===undefined?[]:x.archives;
 if(!Array.isArray(h)||h.length>500||!Array.isArray(a)||a.length>24)throw Error('Historial fuera de límites');
 const eventIds=new Set();
 const history=h.map(e=>{if(!e||!idOk(e.id)||eventIds.has(e.id)||!['opening','receipt','expense'].includes(e.kind)||!(e.period===''||periodOk(e.period))||!(e.ref===null||idOk(e.ref))||!(e.before===null||amount(e.before))||!amount(e.after)||!reasonOk(e.reason)||e.before===e.after)throw Error('Corrección inválida');eventIds.add(e.id);return {id:e.id,kind:e.kind,period:e.period,ref:e.ref,before:e.before,after:e.after,reason:e.reason.trim()}});
 let previous='';
 const archives=a.map(e=>{
 if(!e||!periodOk(e.period)||e.period<=previous||!periodOk(x.period)||e.period>=x.period||!amount(e.opening)||!sumOk(e.collected)||e.collected<0||!sumOk(e.spent)||e.spent<0||!amount(e.balance)||e.balance!==e.opening+e.collected-e.spent||!sumOk(e.reserve)||e.reserve<0||!sumOk(e.pending)||e.pending<0||!Array.isArray(e.paid)||e.paid.length>100||!Array.isArray(e.receipts)||e.receipts.length>200)throw Error('Cierre inválido');
 previous=e.period;const paidIds=new Set(),receiptIds=new Set();
 const paid=e.paid.map(p=>{if(!p||!idOk(p.id)||paidIds.has(p.id)||!labelOk(p.title)||!essentialKinds.includes(p.kind)||!amount(p.amount)||p.amount===0)throw Error('Gasto archivado inválido');paidIds.add(p.id);return {id:p.id,title:p.title.trim(),kind:p.kind,amount:p.amount}});
 const receipts=e.receipts.map(p=>{if(!p||!idOk(p.id)||receiptIds.has(p.id)||!amount(p.amount)||p.amount===0||!receivables.some(r=>r.id===p.id))throw Error('Cobro archivado inválido');receiptIds.add(p.id);return {id:p.id,amount:p.amount}});
 if(paid.reduce((n,p)=>n+p.amount,0)!==e.spent||receipts.reduce((n,p)=>n+p.amount,0)!==e.collected)throw Error('Cierre inconsistente');
 return {period:e.period,opening:e.opening,collected:e.collected,spent:e.spent,balance:e.balance,reserve:e.reserve,pending:e.pending,paid,receipts};
 });
 const accumulated=new Map();for(const e of archives)for(const p of e.receipts)accumulated.set(p.id,(accumulated.get(p.id)||0)+p.amount);
 if(receivables.some(r=>r.carried!==(accumulated.get(r.id)||0)))throw Error('Cobros históricos inconsistentes');
 return {opening:x.opening,period:x.period,essential,receivables,history,archives};
}
export function cashSummary(data){
 const d=normalizeCash(data);
 const spent=d.essential.filter(x=>x.paid).reduce((n,x)=>n+x.amount,0);
 const reserve=d.essential.filter(x=>!x.paid).reduce((n,x)=>n+x.amount,0);
 const collected=d.receivables.reduce((n,x)=>n+x.received-x.carried,0);
 const pending=d.receivables.reduce((n,x)=>n+x.total-x.received,0);
 const balance=d.opening===null?null:d.opening+collected-spent;
 return {spent,reserve,collected,pending,balance,free:balance===null?null:balance-reserve,shortfall:balance===null?null:Math.max(0,reserve-balance)};
}
export function settleReceivable(data,id,delta){
 const d=normalizeCash(data);const e=d.receivables.find(x=>x.id===id);
 if(!e||!amount(delta)||delta===0||delta>e.total-e.received)throw Error('Importe superior al saldo pendiente');
 return normalizeCash({...d,receivables:d.receivables.map(x=>x.id===id?{...x,received:x.received+delta}:x)});
}

function correction(d,kind,ref,before,after,reason,id){
 if(!reasonOk(reason)||!idOk(id)||before===after)throw Error('Motivo obligatorio y cambio real');
 return [...d.history,{id,kind,period:d.period,ref,before,after,reason:reason.trim()}];
}
export function configureOpening(data,opening,period,reason='',id=''){
 const d=normalizeCash(data);
 if(!amount(opening)||!periodOk(period)||d.period&&d.period!==period)throw Error('Usa cierre de período para cambiar de mes');
 if(d.opening===null)return normalizeCash({...d,opening,period});
 if(d.opening===opening)return d;
 return normalizeCash({...d,opening,history:correction(d,'opening',null,d.opening,opening,reason,id)});
}
export function correctReceipt(data,id,received,reason,eventId){
 const d=normalizeCash(data),r=d.receivables.find(x=>x.id===id);
 if(!r||!amount(received)||received<r.carried||received>r.total)throw Error('No se pueden modificar cobros cerrados ni exceder el acuerdo');
 return normalizeCash({...d,receivables:d.receivables.map(x=>x.id===id?{...x,received}:x),history:correction(d,'receipt',id,r.received,received,reason,eventId)});
}
export function markExpense(data,id,paid,reason='',eventId=''){
 const d=normalizeCash(data),e=d.essential.find(x=>x.id===id);
 if(!e||typeof paid!=='boolean'||e.paid===paid)throw Error('Estado inválido');
 return normalizeCash({...d,essential:d.essential.map(x=>x.id===id?{...x,paid}:x),history:paid?d.history:correction(d,'expense',id,e.amount,0,reason,eventId)});
}
export function nextPeriod(period){
 if(!periodOk(period))return '';
 let [y,m]=period.split('-').map(Number);if(m===12){y++;m=1}else m++;
 return y>9999?'':String(y).padStart(4,'0')+'-'+String(m).padStart(2,'0');
}
export function closePeriod(data,next){
 const d=normalizeCash(data),s=cashSummary(d);
 if(!d.period||next!==nextPeriod(d.period)||!periodOk(next)||s.balance===null||!amount(s.balance)||d.archives.length>=24)throw Error('Cierre no disponible: verifica saldo, período y límites');
 const archived={period:d.period,opening:d.opening,collected:s.collected,spent:s.spent,balance:s.balance,reserve:s.reserve,pending:s.pending,paid:d.essential.filter(e=>e.paid).map(({paid,...e})=>e),receipts:d.receivables.filter(r=>r.received>r.carried).map(r=>({id:r.id,amount:r.received-r.carried}))};
 return normalizeCash({...d,period:next,opening:s.balance,essential:d.essential.filter(e=>!e.paid),receivables:d.receivables.map(r=>({...r,carried:r.received})),archives:[...d.archives,archived]});
}
