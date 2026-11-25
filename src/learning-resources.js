// Original editorial workflows; external resources are linked, not vendored.
export const resources=[
 {id:'ms-basic',name:'Microsoft: fundamentos de prompts',url:'https://github.com/microsoft/generative-ai-for-beginners/blob/main/04-prompt-engineering-fundamentals/README.md',kind:'Aprendizaje',cost:'Material MIT; servicios de los ejercicios pueden requerir cuenta o pago',checked:'2026-11-25'},
 {id:'ms-advanced',name:'Microsoft: prompts avanzados',url:'https://github.com/microsoft/generative-ai-for-beginners/blob/main/05-advanced-prompts/README.md',kind:'Aprendizaje',cost:'Material MIT; adapta ejercicios a herramientas disponibles',checked:'2026-11-25'},
 {id:'shotcut',name:'Shotcut',url:'https://shotcut.org/',kind:'Edición',cost:'Software libre; edición local; comprueba requisitos de hardware',checked:'2026-11-25'},
 {id:'blender',name:'Blender',url:'https://www.blender.org/about/license/',kind:'3D',cost:'Software libre con uso comercial permitido; opcional por consumo de recursos',checked:'2026-11-25'},
 {id:'yt',name:'YouTube: programa ampliado y elegibilidad',url:'https://support.google.com/youtube/answer/13429240',kind:'Monetización',cost:'Consulta gratuita; la admisión y los ingresos no están garantizados',checked:'2026-11-25'}
];
export const labs=[
 {id:'offer',title:'Microanuncio vendible',goal:'Crear una muestra original y comprobar interés comercial sin comprar publicidad.',resourceIds:['ms-basic','shotcut'],deliverable:'Un video vertical de 15–25 s, un brief y un registro de contactos voluntarios.',steps:[
 'Selecciona un comercio que puedas contactar de forma legítima. Identifica un producto y un beneficio comprobable.',
 'Pide tres propuestas de guion: problema, demostración y oferta. Elimina afirmaciones no verificables.',
 'Produce una muestra con recursos propios o autorizados. Si no tienes generación gratuita, utiliza imágenes propias, tipografía y narración propia.',
 'Revisa texto, audio, derechos y legibilidad. Presenta la muestra de forma personalizada a un posible cliente; no publiques su marca sin permiso.',
 'Registra respuesta, tiempo invertido y precio acordado, si existe. Cambia una variable antes de repetir.'
 ],checks:['Oferta clara y comprobable','Recursos autorizados','Audio y texto legibles','Tiempo de producción registrado','Respuesta comercial registrada']},
 {id:'short',title:'Microdocumental original',goal:'Practicar investigación, guion, storyboard y edición mientras construyes un catálogo propio.',resourceIds:['ms-basic','ms-advanced','shotcut','yt'],deliverable:'Video vertical original, fuentes, guion y dos hooks para probar.',steps:[
 'Elige una pregunta científica y contrasta las afirmaciones con fuentes primarias o instituciones fiables.',
 'Genera dos hooks y un guion que responda la pregunta. Etiqueta incertidumbres.',
 'Divide la narración en escenas; indica duración, composición, referencia y activos autorizados.',
 'Edita con narración propia o autorizada, subtítulos revisados y música con derechos. Identifica reconstrucciones sintéticas cuando corresponda.',
 'Publica según las reglas de la plataforma y registra retención, tiempo de producción y comentarios.'
 ],checks:['Fuentes comprobadas','Guion original','Continuidad visual','Licencias revisadas','Métricas reales registradas']},
 {id:'pack',title:'Plantilla creativa reutilizable',goal:'Convertir una tarea repetitiva en un recurso útil y comprobar interés antes de ampliar.',resourceIds:['ms-basic','ms-advanced'],deliverable:'Cinco plantillas originales, ejemplos y guía de uso.',steps:[
 'Selecciona una tarea de creación concreta; entrevista o consulta a posibles usuarios.',
 'Diseña cinco plantillas con campos, restricciones, criterios de calidad y formato de salida.',
 'Prueba cada plantilla con dos casos y corrige instrucciones ambiguas.',
 'Documenta ejemplos, condiciones de uso y limitaciones. No incluyas contenido de terceros sin permiso.',
 'Entrega una muestra y registra interés, comentarios y ventas reales antes de crear un producto mayor.'
 ],checks:['Problema concreto','Diez pruebas de salida','Instrucciones claras','Derechos comprobados','Feedback registrado']}
];
export function assessLab(lab,completed){
 if(!lab||!Array.isArray(lab.checks)||!lab.checks.length||!Array.isArray(completed))return {done:0,total:0,percent:0};
 const done=lab.checks.filter((_,i)=>completed.includes(i)).length;
 return {done,total:lab.checks.length,percent:Math.round(done/lab.checks.length*100)};
}
