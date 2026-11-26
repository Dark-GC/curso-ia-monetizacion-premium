// Optional on-device browser provider. No remote service, API key or automatic download.
const languageOptions={expectedInputs:[{type:'text',languages:['es']}],expectedOutputs:[{type:'text',languages:['es']}]};
export async function localAvailability(provider=globalThis.LanguageModel){
 if(!provider||typeof provider.availability!=='function'||typeof provider.create!=='function')return 'unsupported';
 try{const s=await provider.availability(languageOptions);return ['available','downloadable','downloading','unavailable'].includes(s)?s:'unavailable'}catch{return 'unavailable'}
}
export async function generateLocal(text,{provider=globalThis.LanguageModel,signal,onProgress=()=>{}}={}){
 if(typeof text!=='string'||!text.trim()||text.length>8000)throw Error('Escribe entre 1 y 8000 caracteres.');
 if(!provider||typeof provider.create!=='function')throw Error('IA local no disponible.');
 if(signal?.aborted)throw Error('Cancelado');
 let session;
 try{
  session=await provider.create({...languageOptions,signal,monitor(m){m.addEventListener('downloadprogress',e=>{if(Number.isFinite(e.loaded))onProgress(Math.min(1,Math.max(0,e.loaded)))})}});
  if(signal?.aborted)throw Error('Cancelado');
  const result=await session.prompt(text,{signal});
  if(signal?.aborted)throw Error('Cancelado');
  if(typeof result!=='string'||!result.trim())throw Error('Sin respuesta del modelo');
  return result.slice(0,20000);
 }finally{session?.destroy?.()}
}
export const mentorTasks={
 learning:'Actúa como mentor de IA. Diseña una práctica de 30 minutos con objetivo, pasos, entregable y criterios de evaluación.',
 creation:'Actúa como productor de contenido original. Propón tres ideas, un guion y un flujo de producción con alternativas sin gasto adicional.',
 review:'Actúa como editor crítico. Evalúa el material aportado, distingue observaciones de hipótesis y ofrece correcciones priorizadas.',
 income:'Actúa como mentor de monetización ética. Diseña un experimento comercial pequeño con pasos, entregable, costo cero adicional y criterios de éxito.'
};
export function mentorPrompt(task,context){
 if(!Object.hasOwn(mentorTasks,task)||typeof context!=='string'||!context.trim()||context.length>5000)return '';
 return mentorTasks[task]+'\nContexto: '+context.trim()+'\nResponde en español. Presupuesto RD$0. No inventes fuentes, ingresos, tendencias, permisos ni elegibilidad. No tienes acceso web: indica qué investigar y qué necesita comprobación. No prometas resultados.';
}

export const diagnosticPrompt='Responde en español con una única palabra: LISTO. No añadas otra información.';
export async function testLocalInference({provider=globalThis.LanguageModel,signal,clock=()=>performance.now()}={}){
 const availability=await localAvailability(provider);
 if(availability!=='available')return {status:'NOT_READY',availability};
 const start=clock();
 const answer=await generateLocal(diagnosticPrompt,{provider,signal});
 return {status:answer.trim().toUpperCase()==='LISTO'?'MATCH':'RESPONSE_REVIEW',elapsedMs:Math.max(0,Math.round(clock()-start)),answer:answer.slice(0,200)};
}
const manualPlans={
 learning:['Define una habilidad y una actividad que puedas completar con herramientas disponibles.','Dedica 10 minutos a estudiar un ejemplo y 15 a producir una muestra propia.','Usa los últimos 5 minutos para anotar errores y la siguiente práctica.'],
 creation:['Escribe el objetivo, audiencia, duración y recursos autorizados.','Prepara tres enfoques y selecciona uno; redacta guion y lista de planos.','Produce una muestra con material propio y revisa continuidad, texto, audio y derechos.'],
 review:['Copia los requisitos originales en una lista.','Compara cada requisito con tu resultado y registra evidencia concreta de los fallos.','Prioriza las correcciones; vuelve a probar y documenta lo que queda pendiente.'],
 income:['Identifica un cliente potencial y una necesidad concreta sin recopilar datos sensibles.','Prepara una muestra pequeña, estima tiempo y costos en el centro financiero.','Presenta una propuesta personalizada si tienes permiso; registra interés, acuerdo y cobro por separado.']
};
export function manualMentorPlan(task,context){
 if(!mentorPrompt(task,context))return '';
 return ['GUÍA MANUAL · PLANTILLA, NO GENERADA POR IA','Tu contexto: '+context.trim(),...manualPlans[task].map((s,i)=>(i+1)+'. '+s),'Entregable: una muestra o ficha de revisión con evidencia y próximos pasos.','RD$0 de gastos adicionales: utiliza recursos disponibles; comprueba derechos, condiciones y resultados reales.'].join('\n');
}
