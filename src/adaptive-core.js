import {methods,lessons,totals} from './creator-core.js';
import {methodGuides} from './method-guides.js';
// Rule-based personal guidance, not an AI earnings model.
export const goals={
 income:{label:'Buscar clientes y vender servicios',order:['ads','catalog','thumbs','clips','subtitles','audio'],lessons:['prompt','sales','rights','pricing','editing','audioqa','compare','metrics','research','visual']},
 channel:{label:'Crear y crecer un canal',order:['science','fiction','gaming','explain'],lessons:['research','rights','prompt','visual','editing','metrics','audioqa','compare','sales','pricing']},
 products:{label:'Crear productos digitales',order:['templates','workbooks'],lessons:['prompt','research','rights','compare','pricing','sales','visual','metrics','editing','audioqa']},
 skills:{label:'Dominar la IA con prácticas',order:['explain','ads','templates','science','fiction'],lessons:['prompt','research','compare','visual','rights','editing','audioqa','metrics','sales','pricing']}
};
export const defaultRoute=()=>({goal:'income',minutes:30,preferred:''});
export function normalizeRoute(x){
 if(x===undefined)return defaultRoute();
 if(!x||typeof x!=='object'||Array.isArray(x)||!Object.hasOwn(goals,x.goal)||![15,30,60,120].includes(x.minutes)||typeof x.preferred!=='string'||(x.preferred&&!methods.some(m=>m.id===x.preferred)))throw Error('Ruta inválida');
 return {goal:x.goal,minutes:x.minutes,preferred:x.preferred};
}
export function routePlan(data,prefs){
 const p=normalizeRoute(prefs),g=goals[p.goal],done=new Set(data.done||[]),projects=data.projects||[],records=data.records||[],research=data.research||[];
 const pendingLesson=g.lessons.map(id=>lessons.find(l=>l.id===id)).find(l=>l&&!done.has(l.id));
 const relevant=projects.filter(x=>g.order.includes(x.method)||x.method===p.preferred);
 const active=relevant.find(x=>{const m=methods.find(m=>m.id===x.method);return m&&m.steps.some((_,i)=>!(x.done||[]).includes(i))});
 const selected=methods.find(m=>m.id===(p.preferred||active?.method||g.order[0]));
 const guide=methodGuides[selected.id],result=totals(records);
 const completed=relevant.filter(x=>{const m=methods.find(m=>m.id===x.method);return m&&m.steps.every((_,i)=>(x.done||[]).includes(i))});
 const tasks=[];
 if(pendingLesson)tasks.push({id:'learn',panel:'Academia',lesson:pendingLesson.id,title:'Practica: '+pendingLesson.title,reason:'Es una habilidad pendiente para tu objetivo.',action:pendingLesson.exercise,minutes:Math.min(15,p.minutes)});
 if(active){const m=methods.find(m=>m.id===active.method),index=m.steps.findIndex((_,i)=>!(active.done||[]).includes(i));tasks.push({id:'produce',panel:'Proyectos',project:active.id,title:'Continúa: '+active.title,reason:'Existe un proyecto relacionado con pasos pendientes.',action:m.steps[index],minutes:p.minutes});}
 else tasks.push({id:'produce',panel:'Explorar',method:selected.id,title:'Prepara una muestra: '+selected.title,reason:'No hay un proyecto activo relacionado con este objetivo.',action:guide.how[0],minutes:p.minutes});
 if(completed.length&&!records.length)tasks.push({id:'measure',panel:'Resultados',title:'Registra el resultado de tu prueba',reason:'Hay proyectos con pasos marcados, pero no resultados registrados. No implica una venta.',action:'Registra únicamente ingresos, gastos o visualizaciones reales; cero es válido cuando corresponda.',minutes:Math.min(p.minutes,15)});
 else if(!research.some(x=>x.cost==='zero'&&x.eligible==='yes'))tasks.push({id:'verify',panel:'Investigar',title:'Comprueba costo, derechos y elegibilidad',reason:'Todavía no hay un hallazgo declarado compatible con RD$0 y elegibilidad.',action:'Consulta las condiciones oficiales y registra una fuente fechada; no confundas interés con ventas.',minutes:Math.min(p.minutes,15)});
 else tasks.push({id:'measure',panel:'Resultados',title:'Mide el experimento',reason:'Hay hallazgos compatibles declarados, pero necesitan contraste con resultados reales.',action:'Registra resultados de la prueba y anota qué falta verificar.',minutes:Math.min(p.minutes,15)});
 // Show one actionable recommendation for a time budget; alternatives are optional, never add their times.
 const primary=(p.goal==='income'&&active)?tasks.find(t=>t.id==='produce'):(pendingLesson?tasks.find(t=>t.id==='learn'):tasks.find(t=>t.id==='produce'));
 return {goal:g.label,primary,alternatives:tasks.filter(t=>t!==primary),selected:selected.id,completedLessons:lessons.filter(l=>done.has(l.id)).length,totalLessons:lessons.length,activeProjects:relevant.length-completed.length,recordCount:records.length,recordedNet:Math.round((result.income-result.cost)*100)/100};
}
