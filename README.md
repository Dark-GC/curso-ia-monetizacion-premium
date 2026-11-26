# IA Monetiza OS — V1.0 RC1

Candidato a lanzamiento. Espacio personal de formación, investigación, producción y control financiero para creadores. React, Vite y Bootstrap; no necesita un servidor de aplicaciones ni credenciales de IA para sus funciones básicas.

## Alcance
- Diez módulos: Inicio, Mi ruta, Explorar, Investigar, Academia, Crear, Estudio IA, Mentor, Proyectos y Resultados.
- Doce métodos, 36 unidades de práctica, diez lecciones fundamentales, tres laboratorios; progreso autodeclarado.
- Investigación con capturas RSS fechadas, monitor editorial, fuentes oficiales y evidencias manuales; no predice ingresos.
- Biblioteca de prompts, storyboard y guía de producción. No genera imágenes ni video dentro de la aplicación.
- Mentor con IA local opcional en navegadores compatibles, prompts para asistente externo y guía manual explícitamente no generativa.
- Proyectos, cotizaciones, experimentos, resultados y planificación financiera local; no procesa pagos ni sustituye contabilidad fiscal.
- Modo oscuro/claro, respaldo JSON y recuperación de datos. No almacena contraseñas ni ofrece autenticación o sincronización.

## Ejecutar desde código fuente
Requiere Node.js 22.12+ (rama 22) o 24.x, npm y conexión para instalar dependencias.

```sh
npm ci --ignore-scripts --no-fund --no-audit
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Abre http://127.0.0.1:4173. No abras index.html directamente desde file://. La aplicación conserva su clave de almacenamiento histórica V4 y es compatible con respaldos previos admitidos. Utiliza siempre el mismo origen (esquema, host y puerto); los datos de otro origen no se trasladan automáticamente.

## Probar un paquete estático aprobado
Descarga el artefacto monetiza-preview-dist del run autorizado, extrae el ZIP y sirve la carpeta que contiene index.html. Alternativa con Python 3 instalado: desde dicha carpeta ejecuta `python -m http.server 4173 --bind 127.0.0.1` (en Windows también `py -3 -m http.server 4173 --bind 127.0.0.1`). No expongas el servidor local a Internet. No requiere npm para utilizar el paquete compilado.

## Validación y distribución
Consulta [la ficha de lanzamiento](docs/release-candidate-v1.md). RC1 no es una declaración de producción estable. Las pruebas de navegador se realizan en Chromium, no certifican Safari ni una inferencia real de IA. El respaldo principal no incluye preferencias ni informes importados de radar/editorial. Los datos son locales, sin cifrado; no introduzcas secretos ni datos sensibles. Haz respaldos antes de cambiar de origen o restaurar.

No se autoriza despliegue de producción, planes pagos, ni cambio del repositorio base mediante esta ficha. Los límites gratuitos y términos del alojamiento deben comprobarse antes de publicar.
