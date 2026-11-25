// ============ DATA ============
const modules = [
  {
    id: 0,
    level: 0,
    title: "Fundamentos de IA",
    desc: "Domina las herramientas y el arte del prompt.",
    time: "1-2 semanas",
    dedication: "1-2 h/día",
    content: `
      <h4>Objetivo</h4>
      <p>Dejar de usar la IA como un chatbot casual y empezar a generar resultados profesionales.</p>
      <h4>Herramientas</h4>
      <ul>
        <li>ChatGPT / Claude / Gemini (plan free)</li>
        <li>Canva AI + CapCut</li>
      </ul>
      <h4>Qué hacer</h4>
      <ul>
        <li>Aprende la estructura de un buen prompt: Rol + Contexto + Tarea + Formato + Ejemplos</li>
        <li>Crea 5 textos de calidad (artículos, emails, scripts)</li>
        <li>Genera 10 imágenes y 3 clips cortos</li>
        <li>Guarda todo en un portafolio simple (Google Drive o Notion)</li>
      </ul>
      <h4>Resultado</h4>
      <p>Portafolio básico listo para ofrecer servicios.</p>
    `
  },
  {
    id: 1,
    level: 1,
    title: "Freelance con IA",
    desc: "El camino más rápido a los primeros ingresos.",
    time: "1-4 semanas",
    dedication: "10-15 h/semana",
    content: `
      <h4>Por qué funciona</h4>
      <p>Los clientes pagan por resultados. La IA te permite entregar más rápido y con mejor calidad.</p>
      <h4>Servicios que venden</h4>
      <ul>
        <li>Redacción de blogs / product descriptions / emails</li>
        <li>Diseño de posts + thumbnails</li>
        <li>Edición de videos cortos / clips</li>
        <li>Gestión de redes con IA</li>
      </ul>
      <h4>Cómo empezar</h4>
      <ul>
        <li>Crea perfiles en Fiverr y Upwork</li>
        <li>Publica 3 gigs claros con precios de entrada (25-80 $)</li>
        <li>Haz 10-20 propuestas personalizadas al día</li>
        <li>Entrega siempre antes del plazo y pide reseña</li>
      </ul>
      <h4>Ingresos realistas</h4>
      <p>300-1.500 $/mes en los primeros 60 días si eres constante.</p>
    `
  },
  {
    id: 2,
    level: 1,
    title: "Productos Digitales",
    desc: "Crea una vez, vende muchas veces.",
    time: "3-10 semanas",
    dedication: "8-15 h/semana",
    content: `
      <h4>Ideas que funcionan</h4>
      <ul>
        <li>Plantillas Canva (planners, social media kits, CV)</li>
        <li>Ebooks o guías de nicho</li>
        <li>Packs de prompts profesionales</li>
        <li>Printables y worksheets</li>
      </ul>
      <h4>Plataformas</h4>
      <ul>
        <li>Gumroad (mejores márgenes + emails de compradores)</li>
        <li>Etsy (tráfico orgánico, más competencia)</li>
        <li>Payhip (gratis para empezar)</li>
      </ul>
      <h4>Clave del éxito</h4>
      <p>Nicho específico > genérico. "Planner para coaches de nutrición" vende más que "planner genérico".</p>
    `
  },
  {
    id: 3,
    level: 1,
    title: "Contenido Faceless",
    desc: "TikTok, YouTube Shorts e Instagram sin mostrar la cara.",
    time: "4-12 semanas",
    dedication: "10-15 h/semana",
    content: `
      <h4>Flujo de trabajo</h4>
      <ul>
        <li>Script con Claude/ChatGPT</li>
        <li>Voz con ElevenLabs o CapCut</li>
        <li>Visuales con CapCut + stock o IA</li>
        <li>Publicar consistentemente (3-5/semana)</li>
      </ul>
      <h4>Monetización</h4>
      <ul>
        <li>Afiliados de herramientas de IA (rápido)</li>
        <li>Productos digitales propios</li>
        <li>Creator Fund / AdSense (más lento)</li>
      </ul>
      <h4>Consejo</h4>
      <p>Empieza por afiliados + productos. No esperes a monetizar la plataforma.</p>
    `
  },
  {
    id: 4,
    level: 2,
    title: "Retainers & Agencia 1-persona",
    desc: "Ingresos recurrentes mensuales.",
    time: "2-4 meses",
    dedication: "15-25 h/semana",
    content: `
      <h4>Modelo</h4>
      <p>Ofrece paquetes mensuales a negocios locales o online:</p>
      <ul>
        <li>Contenido + redes (8-12 posts/mes)</li>
        <li>Automatizaciones (WhatsApp, emails, leads)</li>
        <li>SEO + blog asistido por IA</li>
      </ul>
      <h4>Precios orientativos</h4>
      <ul>
        <li>500-1.200 $/mes por cliente pequeño</li>
        <li>2-4 clientes = 2.000-5.000 $/mes</li>
      </ul>
      <h4>Cómo conseguirlos</h4>
      <p>LinkedIn outreach + resultados de freelancing previos + referidos.</p>
    `
  },
  {
    id: 5,
    level: 2,
    title: "Contenido + SEO a largo plazo",
    desc: "El activo que más compone.",
    time: "6-12 meses",
    dedication: "10-18 h/semana",
    content: `
      <h4>Combinación ganadora</h4>
      <ul>
        <li>Blog nicho + YouTube faceless</li>
        <li>Afiliados de herramientas de IA</li>
        <li>Productos digitales propios</li>
      </ul>
      <h4>Realidad</h4>
      <p>Más lento que servicios, pero una vez que rankea, genera mientras duermes. El techo es el más alto.</p>
    `
  },
  {
    id: 6,
    level: 3,
    title: "Inversiones más seguras en IA",
    desc: "Capital + paciencia. No promesas de millonario.",
    time: "Largo plazo (5+ años)",
    dedication: "Investigación + disciplina",
    content: `
      <h4>Opciones más sólidas</h4>
      <ul>
        <li><strong>Empresas grandes diversificadas:</strong> Microsoft, Alphabet, Amazon, Broadcom</li>
        <li><strong>REITs de data centers:</strong> Digital Realty (DLR), Equinix (EQIX)</li>
        <li><strong>ETFs</strong> de semiconductores o cloud (más diversificados)</li>
      </ul>
      <h4>Reglas de oro</h4>
      <ul>
        <li>Solo dinero que puedas perder</li>
        <li>Horizonte mínimo 5 años</li>
        <li>Nunca "all-in" en una sola acción</li>
        <li>Esto no es consejo financiero personalizado</li>
      </ul>
    `
  },
  {
    id: 7,
    level: 0,
    title: "Prompt Mastery",
    desc: "El skill que multiplica todo lo demás.",
    time: "Continuo",
    dedication: "Práctica diaria",
    content: `
      <h4>Estructura ganadora</h4>
      <pre style="background:#0a0a0f;padding:16px;border-radius:8px;overflow-x:auto;font-size:0.85rem;">
Rol: Eres un experto en [nicho] con 10 años de experiencia.
Contexto: [situación del cliente / audiencia]
Tarea: [qué exactamente quieres]
Formato: [longitud, estilo, estructura]
Ejemplos: [1-2 ejemplos de lo que te gusta]
Restricciones: [qué evitar]
      </pre>
      <h4>Truco</h4>
      <p>Siempre pide 3 versiones y luego refina la mejor.</p>
    `
  }
];

const plan30 = [
  {
    week: "Semana 1 · Fundamentos",
    days: [
      "Día 1-2: Crear cuentas en ChatGPT, Claude, Gemini, Canva y CapCut",
      "Día 3-4: Practicar 20 prompts de calidad (texto + imagen)",
      "Día 5-6: Crear 5 piezas de portafolio (artículos o diseños)",
      "Día 7: Organizar portafolio y definir tu nicho principal"
    ]
  },
  {
    week: "Semana 2 · Primeros servicios",
    days: [
      "Día 8-9: Abrir perfiles en Fiverr y Upwork + fotos profesionales",
      "Día 10-11: Crear 3 gigs claros con precios de entrada",
      "Día 12-13: Enviar 15-20 propuestas personalizadas",
      "Día 14: Revisar y mejorar según feedback o silencio"
    ]
  },
  {
    week: "Semana 3 · Producto digital",
    days: [
      "Día 15-17: Elegir 1 producto simple (plantilla o guía corta)",
      "Día 18-19: Crear el producto con IA + tu criterio",
      "Día 20-21: Subir a Gumroad o Payhip + página de venta simple"
    ]
  },
  {
    week: "Semana 4 · Contenido + consolidar",
    days: [
      "Día 22-24: Publicar 8-12 piezas de contenido (TikTok/IG/LinkedIn)",
      "Día 25-27: Seguir haciendo outreach + mejorar gigs",
      "Día 28-30: Analizar qué funcionó, ajustar y planificar mes 2"
    ]
  }
];

// ============ STATE ============
let completed = JSON.parse(localStorage.getItem('iaCourseCompleted') || '[]');
let planDone = JSON.parse(localStorage.getItem('iaCoursePlan') || '[]');

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  renderModules();
  renderChecklist();
  renderPlan();
  updateProgress();
  animateStats();
  setupNav();
  setupHelper();
  setupReset();
});

// ============ RENDER ============
function renderModules() {
  const grid = document.getElementById('modulesGrid');
  grid.innerHTML = modules.map(m => `
    <div class="module-card ${completed.includes(m.id) ? 'completed' : ''}" data-id="${m.id}" onclick="openModule(${m.id})">
      <div class="module-num">Módulo ${m.id + 1} · Nivel ${m.level}</div>
      <h4>${m.title}</h4>
      <p>${m.desc}</p>
    </div>
  `).join('');
}

function openModule(id) {
  const m = modules.find(x => x.id === id);
  if (!m) return;
  const body = document.getElementById('detailBody');
  body.innerHTML = `
    <div class="detail-header">
      <h3>${m.title}</h3>
      <div class="detail-meta">
        <span>⏱ ${m.time}</span>
        <span>📅 ${m.dedication}</span>
        <span>Nivel ${m.level}</span>
      </div>
    </div>
    <div class="detail-body">${m.content}</div>
    <button class="btn btn-primary mark-complete" onclick="toggleComplete(${m.id})">
      ${completed.includes(m.id) ? '✓ Completado (quitar)' : 'Marcar como completado'}
    </button>
  `;
  document.getElementById('moduleDetail').classList.add('active');
}

document.getElementById('closeDetail').addEventListener('click', () => {
  document.getElementById('moduleDetail').classList.remove('active');
});

document.getElementById('moduleDetail').addEventListener('click', (e) => {
  if (e.target.id === 'moduleDetail') {
    document.getElementById('moduleDetail').classList.remove('active');
  }
});

function toggleComplete(id) {
  if (completed.includes(id)) {
    completed = completed.filter(x => x !== id);
  } else {
    completed.push(id);
  }
  localStorage.setItem('iaCourseCompleted', JSON.stringify(completed));
  renderModules();
  renderChecklist();
  updateProgress();
  openModule(id); // refresh button
}

function renderChecklist() {
  const list = document.getElementById('checklist');
  list.innerHTML = modules.map(m => `
    <div class="check-item ${completed.includes(m.id) ? 'done' : ''}" onclick="toggleComplete(${m.id})">
      <input type="checkbox" ${completed.includes(m.id) ? 'checked' : ''} onclick="event.stopPropagation(); toggleComplete(${m.id})">
      <span>${m.title}</span>
    </div>
  `).join('');
}

function updateProgress() {
  const pct = Math.round((completed.length / modules.length) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = `${pct}% completado (${completed.length}/${modules.length} módulos)`;
}

function renderPlan() {
  const container = document.getElementById('planTimeline');
  let dayIndex = 0;
  container.innerHTML = plan30.map((w, wi) => `
    <div class="plan-week">
      <h4>${w.week}</h4>
      <div class="plan-days">
        ${w.days.map((d, di) => {
          const idx = dayIndex++;
          return `
            <div class="plan-day ${planDone.includes(idx) ? 'done' : ''}">
              <input type="checkbox" ${planDone.includes(idx) ? 'checked' : ''} 
                onchange="togglePlanDay(${idx})">
              <label>${d}</label>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function togglePlanDay(idx) {
  if (planDone.includes(idx)) {
    planDone = planDone.filter(x => x !== idx);
  } else {
    planDone.push(idx);
  }
  localStorage.setItem('iaCoursePlan', JSON.stringify(planDone));
  renderPlan();
}

// ============ HELPER ============
function setupHelper() {
  document.getElementById('generatePrompt').addEventListener('click', generatePrompt);
  document.getElementById('copyPrompt').addEventListener('click', () => {
    const text = document.getElementById('promptOutput').textContent;
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('copyPrompt');
      btn.textContent = '¡Copiado!';
      setTimeout(() => btn.textContent = 'Copiar prompt', 2000);
    });
  });
}

function generatePrompt() {
  const type = document.getElementById('promptType').value;
  const niche = document.getElementById('nicheInput').value.trim() || 'tu nicho';
  let prompt = '';

  const templates = {
    freelance: `Actúa como un copywriter senior especializado en ${niche} con 12 años de experiencia.

Necesito que generes un texto profesional de [especifica: artículo de 800 palabras / email de ventas / descripción de producto / secuencia de 5 posts].

Contexto del cliente/audiencia: [describe brevemente].
Objetivo del texto: [informar / convertir / educar / engañar].
Tono: profesional pero cercano, claro y orientado a resultados.
Estructura: usa subtítulos, bullets y una llamada a la acción clara al final.
Evita: jerga innecesaria, promesas exageradas y contenido genérico.

Primero dame 3 enfoques posibles (solo títulos + 1 frase). Luego desarrolla el que yo elija.`,

    digital: `Eres un experto en productos digitales y marketing de info-productos en el nicho de ${niche}.

Ayúdame a crear un producto digital vendible:

1. Propón 5 ideas de productos digitales de ticket bajo-medio ($9-$47) que resuelvan un problema concreto y doloroso de personas interesadas en ${niche}.
2. Para la mejor idea, escribe:
   - Título atractivo
   - Descripción de venta (200-300 palabras)
   - Lista de beneficios (bullet points)
   - Tabla de contenidos o lo que incluye
   - Posibles objeciones y cómo superarlas
3. Sugiere el precio y el formato ideal (PDF, Canva template, video corto, etc.).

Sé específico y orientado a la venta.`,

    faceless: `Eres un guionista experto en contenido faceless de alto engagement para TikTok, YouTube Shorts e Instagram Reels sobre ${niche}.

Crea un guion de 45-60 segundos con esta estructura:

HOOK (0-3s): Frase impactante o pregunta que detenga el scroll.
PROBLEMA (3-15s): Describe el dolor de forma cercana.
SOLUCIÓN (15-40s): Explica el método o tip principal de forma clara y accionable.
CTA (40-60s): Invita a seguir, comentar o hacer algo concreto.

Incluye:
- Indicaciones de visuales (qué mostrar en pantalla)
- Texto en pantalla sugerido
- Tono conversacional y energético

Genera 3 variaciones del hook para que pueda testear.`,

    social: `Eres un community manager y copywriter especializado en ${niche}.

Crea un pack de 7 posts para redes (Instagram / LinkedIn / TikTok) listos para publicar:

Para cada post incluye:
- Texto completo (con emojis moderados)
- Hashtags relevantes (5-8)
- Idea de visual o imagen
- Mejor horario sugerido (genérico)

Mezcla tipos: educativo, valor, storytelling, prueba social, CTA suave, pregunta, tip rápido.

Objetivo: construir autoridad y generar engagement en el nicho de ${niche}.`,

    promptpack: `Eres un experto en ingeniería de prompts y productos digitales.

Crea un "Prompt Pack" profesional listo para vender sobre ${niche}.

Incluye:
1. Título del pack
2. Descripción de venta corta
3. 8-12 prompts de alta calidad, cada uno con:
   - Nombre del prompt
   - Para qué sirve
   - El prompt completo listo para copiar-pegar
4. Bonus: 2 prompts avanzados de "nivel pro"

Los prompts deben ser específicos, estructurados y generar resultados de calidad profesional. Evita lo genérico.`
  };

  prompt = templates[type] || templates.freelance;
  document.getElementById('promptOutput').textContent = prompt;
  document.getElementById('copyPrompt').style.display = 'inline-flex';
}

// ============ UTILS ============
function goToModule(level) {
  document.getElementById('modulos').scrollIntoView({ behavior: 'smooth' });
}

function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 30);
  });
}

function setupNav() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });
}

function setupReset() {
  document.getElementById('resetProgress').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres reiniciar todo el progreso?')) {
      completed = [];
      planDone = [];
      localStorage.removeItem('iaCourseCompleted');
      localStorage.removeItem('iaCoursePlan');
      renderModules();
      renderChecklist();
      renderPlan();
      updateProgress();
    }
  });
}