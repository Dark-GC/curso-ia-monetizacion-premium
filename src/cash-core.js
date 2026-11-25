// Local cash planning. Amounts are integer centavos; receivables are not cash.
export const blankCash=()=>({opening:null,period:'',essential:[],receivables:[]});
export const essentialKinds=['Alimentación','Vivienda','Transporte','Servicios','Salud','Otros esenciales'];
const max=100000000000;
const amount=n=>Number.isSafeInteger(n)&&n>=0&&n<=max;
const idOk=v=>typeof v==='string'&&v.length>0&&v.length<=100;
const labelOk=v=>typeof v==='string'&&v.trim().length>0&&v.length<=160;
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
 const receivables=x.receivables.map(e=>{if(!e||!labelOk(e.title)||!amount(e.total)||e.total===0||!amount(e.received)||e.received>e.total)throw Error('Cobro inválido');return {id:checkId(e.id),title:e.title.trim(),total:e.total,received:e.received}});
 return {opening:x.opening,period:x.period,essential,receivables};
}
export function cashSummary(data){
 const d=normalizeCash(data);
 const spent=d.essential.filter(x=>x.paid).reduce((n,x)=>n+x.amount,0);
 const reserve=d.essential.filter(x=>!x.paid).reduce((n,x)=>n+x.amount,0);
 const collected=d.receivables.reduce((n,x)=>n+x.received,0);
 const pending=d.receivables.reduce((n,x)=>n+x.total-x.received,0);
 const balance=d.opening===null?null:d.opening+collected-spent;
 return {spent,reserve,collected,pending,balance,free:balance===null?null:balance-reserve,shortfall:balance===null?null:Math.max(0,reserve-balance)};
}
export function settleReceivable(data,id,delta){
 const d=normalizeCash(data);const e=d.receivables.find(x=>x.id===id);
 if(!e||!amount(delta)||delta===0||delta>e.total-e.received)throw Error('Importe superior al saldo pendiente');
 return normalizeCash({...d,receivables:d.receivables.map(x=>x.id===id?{...x,received:x.received+delta}:x)});
}
