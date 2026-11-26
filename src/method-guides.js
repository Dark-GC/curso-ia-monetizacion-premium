// Original editorial playbooks. Time is a planning estimate, never a measured result.
export const methodGuides={
  "ads": {
    "tools": [
      "ms-basic",
      "krita",
      "shotcut",
      "audacity"
    ],
    "sample": "Una muestra de 15–25 segundos con un producto real autorizado; sin promesas engañosas.",
    "minutes": 90,
    "how": [
      "Escribe una ficha de producto con nombre, beneficio comprobable y CTA. Pide al asistente tres hooks sin inventar precios.",
      "Selecciona un hook y divide el video en apertura, demostración y CTA. Usa una foto o clip propio; crea textos en Krita o el editor.",
      "Graba narración propia si aporta valor. Monta las tomas en 9:16 y comprueba lectura en pantalla pequeña.",
      "Entrega primero una muestra privada; acuerda alcance, precio y revisiones antes de producir más."
    ],
    "measure": "Respuestas de compradores, minutos de edición y cobro efectivo.",
    "prompt": "Propón tres guiones para un comercio usando únicamente los datos que te proporcionaré. Separa hook, demostración, CTA y lista de permisos pendientes."
  },
  "clips": {
    "tools": [
      "shotcut",
      "kdenlive",
      "audacity"
    ],
    "sample": "Tres clips originales de material autorizado, con inicio y cierre comprensibles.",
    "minutes": 120,
    "how": [
      "Escucha el material completo y marca frases que se entienden fuera del contexto original.",
      "Elige tres segmentos con una idea autónoma; anota timestamps de origen y autorización.",
      "Recorta, encuadra, agrega subtítulos manualmente revisados y comprueba que no cambias el sentido.",
      "Muestra un clip al creador, recoge feedback y acuerda duración, formato y revisiones."
    ],
    "measure": "Tiempo por clip, correcciones solicitadas y aceptación del creador.",
    "prompt": "Analiza la transcripción autorizada que adjuntaré. Sugiere segmentos autónomos, explica el valor de cada uno y conserva literalmente las citas y tiempos."
  },
  "science": {
    "tools": [
      "ms-basic",
      "ms-advanced",
      "shotcut",
      "audacity"
    ],
    "sample": "Microdocumental de 45–60 segundos con dos fuentes fiables y una narración original.",
    "minutes": 150,
    "how": [
      "Elige una pregunta sobre un fenómeno; reúne dos referencias fiables y registra las afirmaciones que realmente respaldan.",
      "Escribe un hook verificable, una explicación y una conclusión. Evita exageraciones y etiqueta reconstrucciones.",
      "Desglosa en escenas y utiliza recursos propios, autorizados o de dominio público comprobado. Revisa continuidad y exactitud científica.",
      "Exporta una pieza, revisa audio/subtítulos y anota retención cuando la plataforma la facilite."
    ],
    "measure": "Retención, correcciones factuales y tiempo real de producción.",
    "prompt": "Con las fuentes que proporcionaré, escribe un microdocumental de 60 segundos; cada afirmación debe remitir a su fuente. Distingue reconstrucciones de imágenes documentales."
  },
  "fiction": {
    "tools": [
      "ms-advanced",
      "krita",
      "shotcut",
      "audacity"
    ],
    "sample": "Una escena narrativa de 30–60 segundos con biblia visual y continuidad.",
    "minutes": 180,
    "how": [
      "Define inicio, conflicto y resolución. Bloquea el guion aprobado y una ficha por personaje.",
      "Crea un storyboard con los mismos rasgos, vestuario, iluminación y localización; conserva referencias autorizadas.",
      "Usa un generador solo si dispones de acceso autorizado y cuota gratuita; alternativa: animatic con imágenes propias y narración.",
      "Monta el audio antes de ajustar los cortes y revisa continuidad plano a plano."
    ],
    "measure": "Escenas coherentes, número de correcciones y retención si se publica.",
    "prompt": "Desglosa mi historia aprobada en escenas sin alterar diálogos ni vestuario. Para cada plano incluye duración orientativa, acción, composición, referencias y control de continuidad."
  },
  "gaming": {
    "tools": [
      "ms-basic",
      "shotcut",
      "audacity"
    ],
    "sample": "Una guía original de 60 segundos o un análisis breve con gameplay propio/autorizado.",
    "minutes": 120,
    "how": [
      "Escoge una pregunta que puedas responder con pruebas del juego y fuentes oficiales.",
      "Graba o solicita capturas autorizadas; no descargues material ajeno sin permiso.",
      "Escribe una conclusión y aporta ejemplos con voz propia. Usa cortes que correspondan al argumento.",
      "Revisa política del editor y licencias, publica si procede y compara clics y retención."
    ],
    "measure": "Retención, comentarios útiles y tiempo de edición.",
    "prompt": "Ayúdame a estructurar una guía gaming original. No inventes especificaciones ni novedades; marca qué debo probar en el juego y qué debo verificar en fuentes oficiales."
  },
  "templates": {
    "tools": [
      "ms-basic",
      "ms-advanced",
      "krita"
    ],
    "sample": "Cinco plantillas para una sola tarea con dos pruebas por plantilla.",
    "minutes": 150,
    "how": [
      "Identifica una tarea repetitiva y pregunta a potenciales usuarios dónde pierden tiempo.",
      "Define campos editables, instrucciones, ejemplos y límites; crea cinco plantillas distintas.",
      "Prueba cada una con dos entradas, conserva resultados y corrige ambigüedades.",
      "Entrega una muestra a usuarios interesados; registra comentarios antes de ampliar."
    ],
    "measure": "Pruebas superadas, feedback y compras reales.",
    "prompt": "Diseña cinco plantillas originales para una tarea concreta. Incluye entradas, salida esperada, límites y dos ejemplos de prueba por plantilla."
  },
  "catalog": {
    "tools": [
      "krita",
      "ms-basic"
    ],
    "sample": "Cinco fichas de productos con fotos reales, texto comprobado y diseño consistente.",
    "minutes": 100,
    "how": [
      "Solicita cinco fotos y datos del cliente. No subas archivos privados a terceros sin autorización.",
      "Crea una cuadrícula y una ficha piloto: imagen, nombre, atributos y precio confirmado si se publica.",
      "Corrige luz y recorte sin alterar el producto; duplica la estructura y revisa ortografía.",
      "Exporta PNG o PDF según el uso, muestra una ficha privada y solicita aprobación."
    ],
    "measure": "Fichas aprobadas, tiempo por ficha y pedido real.",
    "prompt": "Crea un brief de catálogo de cinco productos con campos para atributos verificados, composición, tipografía y control de exactitud. No inventes datos ni alteres el producto."
  },
  "thumbs": {
    "tools": [
      "krita",
      "ms-basic"
    ],
    "sample": "Tres miniaturas originales basadas en la promesa real de un video.",
    "minutes": 60,
    "how": [
      "Resume el video en una frase y elige un foco visual que no distorsione su contenido.",
      "Esboza tres composiciones con una diferencia principal: foco, jerarquía o texto.",
      "Monta variantes con material autorizado y revisa legibilidad al reducirlas de tamaño.",
      "Presenta al creador; si se publican, compara métricas en ventanas equivalentes sin atribuir causalidad automática."
    ],
    "measure": "Variantes aceptadas, revisiones y CTR real si está disponible.",
    "prompt": "Propón tres miniaturas para el video que describiré. Cada una debe comunicar una promesa fiel, tener foco claro y utilizar material autorizado. No prometas CTR."
  },
  "subtitles": {
    "tools": [
      "audacity",
      "shotcut",
      "kdenlive"
    ],
    "sample": "Un SRT revisado de 60 segundos y una versión de video subtitulada.",
    "minutes": 60,
    "how": [
      "Escucha el audio autorizado; transcribe por frases y marca palabras no inteligibles.",
      "Anota inicio y fin de cada bloque; crea SRT numerado con tiempos HH:MM:SS,mmm.",
      "Revisa nombres, dialecto, signos y traducción si aplica. Evita bloques que se solapen.",
      "Carga el SRT en el editor, reproduce el video y entrega solo después de verificar."
    ],
    "measure": "Errores corregidos, minutos por minuto de audio y aceptación.",
    "prompt": "Corrige esta transcripción autorizada sin inventar palabras inaudibles. Conserva los tiempos, señala dudas y entrega SRT solo si los timestamps de entrada son válidos."
  },
  "explain": {
    "tools": [
      "ms-basic",
      "krita",
      "shotcut",
      "audacity"
    ],
    "sample": "Video educativo original con un ejemplo verificable y una pregunta de comprensión.",
    "minutes": 120,
    "how": [
      "Selecciona una pregunta concreta y una fuente primaria o institucional.",
      "Desarrolla un ejemplo sencillo, una explicación y una comprobación; revisa los hechos.",
      "Crea gráficos originales y graba una narración clara; subtitula y revisa accesibilidad.",
      "Publica si cumples condiciones y registra preguntas y retención para mejorar la siguiente explicación."
    ],
    "measure": "Comprensión observada, correcciones y retención registrada.",
    "prompt": "Diseña una explicación de un concepto con fuentes, un ejemplo y una pregunta de comprensión. No inventes datos; marca lo que requiere verificación."
  },
  "audio": {
    "tools": [
      "audacity",
      "ms-basic"
    ],
    "sample": "Narración autorizada de 30–60 segundos con archivo de audio limpio.",
    "minutes": 60,
    "how": [
      "Adapta el guion a frases orales y señala nombres cuya pronunciación debes verificar.",
      "Graba voz propia o con autorización; realiza dos tomas en un lugar silencioso.",
      "Elimina errores y silencios excesivos, ajusta niveles evitando saturación y escucha con auriculares.",
      "Exporta WAV o MP3 según el acuerdo y confirma uso, revisiones y derechos."
    ],
    "measure": "Minutos de grabación/edición, correcciones y aprobación.",
    "prompt": "Adapta mi guion para narración de voz natural de 45 segundos. Mantén hechos y nombres; indica pausas y pronunciaciones dudosas sin imitar a una persona real."
  },
  "workbooks": {
    "tools": [
      "ms-basic",
      "ms-advanced",
      "krita"
    ],
    "sample": "Guía de cinco páginas con una práctica y ejemplos originales.",
    "minutes": 150,
    "how": [
      "Define un único problema y una persona destinataria; verifica las afirmaciones con fuentes fiables.",
      "Redacta introducción, pasos, ejemplo, ejercicio y checklist. No copies cursos de terceros.",
      "Diseña páginas legibles; prueba instrucciones con otra persona y corrige las dudas.",
      "Comparte una muestra gratuita y mide interés antes de crear una versión extensa."
    ],
    "measure": "Ejercicios completados, feedback y ventas efectivas.",
    "prompt": "Estructura un cuaderno práctico original de cinco páginas para resolver el problema descrito. Incluye objetivo, pasos, ejemplo, ejercicio y rúbrica. No inventes testimonios o fuentes."
  }
};
export function sevenDayPlan(id){
 const g=methodGuides[id];if(!g)return [];
 return [
 'Día 1 · Define el público, verifica derechos, herramientas disponibles y costo cero adicional.',
 ...g.how.map((s,i)=>'Día '+(i+2)+' · '+s),
 'Día 6 · Registra el resultado: '+g.measure,
 'Día 7 · Revisa evidencia, cambia una variable y decide continuar, ajustar o detener.'
 ];
}
export function guidePrompt(id){
 const g=methodGuides[id];return g?g.prompt+'\nPresupuesto adicional RD$0. Entregable: '+g.sample+'\nVerifica fuentes, licencias y elegibilidad; distingue hipótesis de evidencia y no inventes ganancias.':'';
}
