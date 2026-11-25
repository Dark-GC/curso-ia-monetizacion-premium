# IA Monetiza OS — AI Creator Academy

**4.0.0-alpha.1 / IM-001 — PARCIAL, no estable.**
Objetivo: aprender IA creando contenido original y validar rutas de monetización con inversión adicional cero.

## Alcance
- Seis metodologías iniciales, seis lecciones con ejercicios y evaluación, proyectos con checklist, prompts contextuales y biblioteca local, finanzas DOP y respaldo JSON.
- Catálogo editorial con fuentes oficiales consultadas el 25-11-2026. La evidencia de una política no demuestra rentabilidad ni aprobación individual.
- Datos en localStorage, clave nueva; se conserva el código anterior y su clave. No sincronización, ni migración automática, ni IA generativa integrada.
- Sin API keys, servidor, tarjetas ni servicios de pago añadidos.

## Validación
Doce comprobaciones del núcleo puro ejecutadas contra el código recuperado de GitHub en un aislado JavaScript: 12 correctas. Suite equivalente incluida en tests/creator-core.test.js; ejecutar npm test. No se ha ejecutado npm test en Node, npm run build, QA en navegador ni despliegue. El entorno de ejecución disponible no resuelve github.com. No declarar estable hasta validar.
 
## Siguiente fase: IM-002
1. Crear pipeline de investigación con fuentes oficiales, fecha, caducidad, evidencia de demanda y separación entre elegibilidad y rentabilidad.
2. Revisión humana antes de publicar cambios; las fuentes inaccesibles quedan como pendientes, no verificadas.
3. Añadir metodologías basadas en casos con evidencia independiente; registrar país, condiciones, costos y experimentos reproducibles.
4. Generar lockfile y ejecutar npm ci, npm test, npm run build y pruebas de navegador a 320/390/768/1440 px. Validar modales, accesibilidad, persistencia, importación y fallos de almacenamiento.
5. Revisar Vercel (uso permitido por el plan) y desplegar preview antes de fusionar a panda.
6. Implementar PWA y migración a IndexedDB, sin perder datos; conectores IA opcionales sin gastos automáticos.

## Criterios de aceptación
- No afirmaciones de ganancias garantizadas, cuotas ilimitadas o elegibilidad sin fuente.
- Cero gastos automáticos. No datos privados ni claves en repositorio público.
- No modificar producción sin revisión.
- Separar investigación periódica, pruebas de demanda y resultados reales del usuario.
