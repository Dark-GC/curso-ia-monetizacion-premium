// Research is user-directed; scores are planning aids, never proof of income.
export const researchSources=[
 {id:'trends',name:'Google Trends',url:'https://trends.google.com/trends/explore?geo=DO',guide:'Compara términos en República Dominicana y el mercado objetivo. El interés es relativo, no ventas.'},
 {id:'yt-research',name:'YouTube Studio: Research',url:'https://support.google.com/youtube/answer/17232321',guide:'Busca videos recientes de alto rendimiento, compara títulos y formatos y detecta oportunidades sin copiar.'},
 {id:'yt-gaps',name:'YouTube Studio: tendencias y brechas',url:'https://support.google.com/youtubecreatorstudio/answer/11962757',guide:'Detecta preguntas sin respuestas suficientes cuando la función esté disponible en tu cuenta.'},
 {id:'yt-report',name:'YouTube Culture & Trends 2026',url:'https://blog.youtube/culture-and-trends/youtube-culture-trends-modern-mainstream-research/',guide:'Estudia formatos y comunidades como inspiración, no como garantía de viralidad.'},
 {id:'meta',name:'Meta: Creator Fast Track',url:'https://about.fb.com/news/2026/03/creator-fast-track-grow-your-audience-earn-money-on-facebook/',guide:'Comprueba reglas, originalidad, país y requisitos en el panel profesional.'}
];
export function safeEvidenceUrl(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&u.hostname.includes('.')&&value.length<=1000?u.href:null}catch{return null}
}
export function normalizeResearch(value){
 if(value===undefined)return [];
 if(!Array.isArray(value)||value.length>100)throw Error('Investigaciones inválidas');
 const ids=new Set();
 return value.map(x=>{
  if(!x||typeof x.id!=='string'||x.id.length>100||ids.has(x.id)||typeof x.topic!=='string'||!x.topic.trim()||x.topic.length>160||typeof x.notes!=='string'||x.notes.length>2000||typeof x.url!=='string'||!safeEvidenceUrl(x.url)||!['signal','policy','buyer','sale'].includes(x.kind)||!['unknown','zero','paid'].includes(x.cost)||!['unknown','yes','no'].includes(x.eligible)||typeof x.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||!Number.isFinite(Date.parse(x.date))||new Date(x.date).toISOString().slice(0,10)!==x.date||x.date>new Date().toISOString().slice(0,10))throw Error('Evidencia inválida');
  ids.add(x.id);return {id:x.id,topic:x.topic.trim(),notes:x.notes,url:safeEvidenceUrl(x.url),kind:x.kind,cost:x.cost,eligible:x.eligible,date:x.date};
 });
}
export function researchStatus(x){
 if(x.cost==='paid'||x.eligible==='no')return 'No compatible con la ruta RD$0';
 if(x.cost!=='zero'||x.eligible!=='yes')return 'Requisitos por verificar';
 if(x.kind==='sale')return 'Venta registrada por usuario; no auditada';
 if(x.kind==='buyer')return 'Interés comercial registrado; no garantiza venta';
 if(x.kind==='policy')return 'Política registrada; demanda sin validar';
 return 'Señal de interés; demanda sin validar';
}
export function researchPrompt(topic){
 const t=String(topic||'').trim().slice(0,160);if(!t)return '';
 return ['Investiga un método actual de creación y monetización con IA para: '+t+'.','Presupuesto adicional RD$0. País: República Dominicana.','Si tienes acceso web, busca fuentes primarias y ejemplos recientes. Devuelve URLs, fecha de publicación y consulta, evidencia de demanda, costos reales, derechos comerciales, elegibilidad por país y restricciones.','Distingue interés de búsqueda, rendimiento de contenido, políticas, compradores y ventas demostrables. No inventes ingresos ni declares rentable un método sin datos.','Propón tres experimentos originales con entregables, pasos, herramientas gratuitas alternativas y criterios de éxito. Si no puedes verificar un dato, márcalo como desconocido.'].join('\n');
}
