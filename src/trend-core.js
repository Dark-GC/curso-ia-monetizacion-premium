// Only observed search interest and explicit keyword matches. No profitability score.
const rules=[
 ['Videojuegos',/\b(gaming|videojuegos?|gameplay|playstation|xbox|nintendo|hollow knight|silksong|minecraft|steam|dlc)\b/i,'Guía o análisis original; comprueba el anuncio y usa capturas autorizadas.'],
 ['IA y tecnología',/\b(chatgpt|gemini|claude|openai|inteligencia artificial|artificial intelligence|ai|ia|software)\b/i,'Tutorial o demostración original; verifica el acceso gratuito y las capacidades.'],
 ['Deportes',/\b(futbol|football|basketball|baloncesto|champions league|liga de campeones|nfl|psg|barcelona|atletico madrid|villarreal|club brugge)\b/i,'Explicación o análisis propio; no reutilices transmisiones sin permiso.'],
 ['Entretenimiento',/\b(concierto|concert|pelicula|movie|serie|film|music|musica)\b/i,'Reseña o explicación original; comprueba derechos de imagen y audio.'],
 ['Viajes',/\b(arajet|travel|viajes?|flight|vuelos?)\b/i,'Guía informativa con datos de fuentes oficiales y fecha de revisión.']
];
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function classifyTrend(title){
 if(typeof title!=='string'||!title.trim())return {category:'Sin clasificar',idea:'Investiga el significado antes de crear contenido.'};
 const found=rules.find(([,rule])=>rule.test(fold(title)));
 return found?{category:found[0],idea:found[2]}:{category:'Sin clasificar',idea:'Investiga el significado y las fuentes antes de elegir un formato.'};
}
export function trendRows(snapshot,region='DO',category='Todos',query=''){
 const feed=snapshot?.feeds?.[region];if(feed?.status!=='OK'||!Array.isArray(feed.items))return [];
 const seen=new Set();return feed.items.slice(0,30).filter(x=>x&&typeof x.title==='string'&&x.title.trim()&&x.title.length<=180&&typeof x.published==='string'&&x.published.length<=100).map(x=>({...x,...classifyTrend(x.title)})).filter(x=>{const key=fold(x.title);if(seen.has(key))return false;seen.add(key);return (category==='Todos'||x.category===category)&&key.includes(fold(query));});
}
export function snapshotAge(checkedAt,now=Date.now()){
 const ms=Date.parse(checkedAt);if(!Number.isFinite(ms)||ms>now)return {label:'Fecha no válida',stale:true};
 const hours=Math.floor((now-ms)/3600000);return {label:hours<1?'Hace menos de una hora':hours+' h desde la captura',stale:hours>=24};
}
