# IM-V1-08 · Release candidate V1.0 RC1

## Decisión
Candidato, no versión estable. No merge, etiqueta estable ni publicación de producción sin aprobación explícita. Alcance congelado en las funciones ya implementadas. El cambio de versión es una etiqueta de producto y no altera la clave de datos local ni migra V3.

## Base comprobada
Commit 5e9d69c79b6cb2c89abafa2d3588607578bc765f. [QA #51](https://github.com/Dark-GC/curso-ia-monetizacion-premium/actions/runs/45726880708): 93 JS + 58 Chromium, npm audit 0, build 322 ms. [Discovery #25](https://github.com/Dark-GC/curso-ia-monetizacion-premium/actions/runs/45726880702): 5 Python. Total 156. Editorial #36 FAIL por fuentes inaccesibles; no se oculta.

[Paquete de base](https://github.com/Dark-GC/curso-ia-monetizacion-premium/actions/runs/45726880708/artifacts/15075740246): ZIP 195470 bytes, SHA-256 6ac5a2a8aaf0db8efc0e3cf0a8a027e3e20a296956c0a5c294d0e74f71d7f84c. Archivos JS 509584, CSS 258502, HTML 618 bytes; no equivalen a latencia medida. [Capturas](https://github.com/Dark-GC/curso-ia-monetizacion-premium/actions/runs/45726880708/artifacts/15074514398): SHA-256 0c0abfa34ccaf8b8d55eb93150774daed544a9e6ab8f976309e86b1bb8d09421. Descargados, CRC y SHA-256 comprobados; revisión de ocho capturas (320/768, monitor completo, diagnóstico simulado y guía manual). En móvil el contenido largo requiere scroll. No es aprobación estética del usuario.

## Gates RC1
| Gate | Estado al crear RC1 |
|---|---|
| Base funcional (IM-V1-01 a 07) | PASS en el alcance definido; ver Notion |
| QA del commit RC1 | PENDIENTE |
| Integridad del paquete RC1 | PENDIENTE: manifiesto CI y SHA del ZIP |
| Tamaño estático | Límite definido 1 MB bruto, 250 KB suma gzip; medir en CI |
| Seguridad | npm audit anterior 0; no auditoría independiente ni autenticación; datos locales sin cifrar |
| Accesibilidad | Navegación por teclado y overflow probados; sin certificación WCAG |
| Navegadores | Chromium 320/360/768/1440 probados; Safari/iOS real pendiente |
| IA local | Opcional, mocks PASS; inferencia real NOT RUN |
| Fuentes | TikTok/Google AI inaccesibles; avisos visibles, no asumir elegibilidad |
| Aceptación usuario y piloto autorizado | PENDIENTE |
| Alojamiento | Vercel rate-limit; sin producción autorizada |
| GO/NO-GO | NO-GO para producción estable; candidato de prueba condicionado a QA |

El manifiesto lista hashes y tamaños de los archivos de distribución y comprueba referencias locales del HTML. No certifica seguridad de todo JavaScript ni velocidad en dispositivos. No añade dependencias. La guía local usa un servidor loopback, no alojamiento público.

## Relevo
Validar ejecución del commit RC1, verificar manifiesto y ZIP, inspeccionar capturas y resolver cualquier regresión. Después presentar una única decisión de lanzamiento con limitaciones explícitas y aceptación del usuario. Evitar ampliar alcance sin necesidad. No pagar, no crear infraestructura pública ni etiquetar STABLE por adelantado.
