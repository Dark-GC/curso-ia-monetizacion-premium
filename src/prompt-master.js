// Deterministic authoring tools: no model inference or external network calls.
export const promptFields=[['role','Rol',240],['objective','Objetivo',1200],['context','Contexto y audiencia',2400],['format','Formato de salida',1200],['constraints','Restricciones y derechos',1800],['criteria','Criterios de calidad',1800],['example','Ejemplo opcional',2000]];
export const presets={
 script:{name:'Guion original',role:'Guionista y editor audiovisual',format:'Tres hooks, guion por bloques, CTA y notas de edición.',constraints:'No inventar hechos, ingresos o fuentes. Usar material propio o autorizado.',criteria:'Originalidad, precisión, claridad y duración coherente.'},
 image:{name:'Imagen cinematográfica',role:'Director de fotografía y arte',format:'Prompt visual en inglés y explicación en español; composición, luz, cámara y estilo.',constraints:'Respetar referencias autorizadas; no copiar marcas ni personas sin permiso.',criteria:'Coherencia de identidad, composición, legibilidad y continuidad.'},
 animation:{name:'Animación de imagen a video',role:'Director de animación',format:'Movimiento, cámara, acción, audio y restricciones por escena.',constraints:'Conservar personaje, vestuario y referencias; no inventar diálogos aprobados.',criteria:'Continuidad temporal, movimiento natural y coherencia narrativa.'},
 review:{name:'Auditor de resultados',role:'Editor crítico y verificador',format:'Tabla de fallos, evidencia, gravedad y correcciones priorizadas.',constraints:'Distinguir observaciones de hipótesis. No afirmar haber visto archivos no suministrados.',criteria:'Correcciones accionables, respeto del original y verificación.'}
};
export function normalizeFields(x={}){
 if(!x||typeof x!=='object'||Array.isArray(x))throw Error('Campos inválidos');
 return Object.fromEntries(promptFields.map(([k,,max])=>{const v=x[k]??'';if(typeof v!=='string'||v.length>max)throw Error('Campo inválido: '+k);return [k,v]}));
}
export function inspectPrompt(x){
 const f=normalizeFields(x);const required=promptFields.filter(([k])=>k!=='example');const missing=required.filter(([k])=>!f[k].trim()).map(([,label])=>label);
 return {complete:required.length-missing.length,total:required.length,missing,percent:Math.round((required.length-missing.length)/required.length*100)};
}
export function compilePrompt(x){
 const f=normalizeFields(x);if(!f.objective.trim())return '';
 return promptFields.filter(([k])=>f[k].trim()).map(([k,label])=>label.toUpperCase()+'\n'+f[k].trim()).join('\n\n')+'\n\nVERIFICACIÓN\nSi falta información, indica las suposiciones. Separa hechos de hipótesis y señala cómo comprobar la salida. No inventes fuentes, permisos o resultados.';
}
export function normalizePromptLibrary(value){
 if(value===undefined)return [];
 if(!Array.isArray(value)||value.length>100)throw Error('Biblioteca inválida');
 const ids=new Set();
 return value.map(p=>{if(!p||typeof p.id!=='string'||!p.id||p.id.length>100||ids.has(p.id)||typeof p.title!=='string'||!p.title.trim()||p.title.length>120||typeof p.revision!=='number'||!Number.isInteger(p.revision)||p.revision<1||p.revision>10000)throw Error('Versión inválida');ids.add(p.id);const fields=normalizeFields(p.fields);if(!fields.objective.trim())throw Error('Objetivo vacío');return {id:p.id,title:p.title.trim(),revision:p.revision,fields};});
}
export function directorPlan({story,duration,scenes,ratio,bible}){
 if(typeof story!=='string'||!story.trim()||story.length>4000||typeof bible!=='string'||bible.length>2400||!Number.isInteger(duration)||duration<15||duration>180||!Number.isInteger(scenes)||scenes<3||scenes>20||duration<scenes*2||!['9:16','16:9','1:1'].includes(ratio))return null;
 const base=Math.floor(duration/scenes),extra=duration%scenes;let start=0;
 const shots=Array.from({length:scenes},(_,i)=>{const seconds=base+(i<extra?1:0),shot={id:'E'+String(i+1).padStart(2,'0'),start,end:start+seconds,seconds};start+=seconds;return shot;});
 const prompt=['Actúa como director audiovisual. Desarrolla un storyboard original, no generes archivos.','Historia aprobada o premisa: '+story.trim(),'Biblia visual: '+(bible.trim()||'Pendiente: propón referencias consistentes y solicita aprobación antes de producir.'),'Formato '+ratio+'; duración objetivo '+duration+' segundos. Ajusta la narración y diálogos al ritmo real; los tiempos son una distribución inicial.',...shots.map(s=>s.id+' | '+s.start+'–'+s.end+' s | define acción, plano, composición, iluminación, prompt de imagen, prompt de movimiento, audio y continuidad.'),'Mantén la historia y el vestuario aprobados. Distingue propuesta de hechos. Utiliza referencias y audio propios o autorizados, revisa derechos y divulgación de IA. No inventes métricas ni prometas monetización.'].join('\n');
 return {shots,prompt};
}
