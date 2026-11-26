import {test,expect} from '@playwright/test';
async function navigate(page,name){
 const toggle=page.getByRole('button',{name:'Menú de navegación',exact:true});
 if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();
 await page.getByRole('navigation',{name:'Navegación'}).getByRole('button',{name,exact:true}).click();
}

test('method to project and persistence',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Aprende. Crea. Monetiza.'})).toBeVisible();
 await navigate(page,'Explorar');
 await page.getByRole('button',{name:'Estudiar método'}).first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Iniciar proyecto'}).click();
 await expect(page.getByRole('heading',{name:'Mis proyectos'})).toBeVisible();
 await page.getByRole('button',{name:'Ver proyecto',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:/Elige un comercio/}).click();
 await page.reload();await navigate(page,'Proyectos');
 await page.getByRole('button',{name:'Ver proyecto',exact:true}).click();await expect(page.getByRole('dialog').getByRole('button',{name:/✓ Elige un comercio/})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 expect(errors).toEqual([]);
});
test('learning, prompts and financial record',async({page})=>{
 await page.goto('/');await navigate(page,'Academia');
 await page.getByRole('button',{name:'Ver lección',exact:true}).first().click();await page.getByRole('dialog').getByRole('button',{name:'Registrar práctica realizada'}).click();
 await expect(page.getByRole('button',{name:'✓ Práctica registrada'})).toBeVisible();await page.getByRole('button',{name:'Cerrar lección'}).click();
 await navigate(page,'Crear');
 await page.getByPlaceholder('Ej. Curiosidades científicas').fill('Ciencia');
 await page.getByPlaceholder('Ej. Adultos interesados en ciencia').fill('Adultos');
 await page.getByRole('button',{name:'Generar flujo y prompt'}).click();
 await expect(page.getByRole('textbox',{name:'Prompt listo para tu asistente IA'})).toHaveValue(/Tema: Ciencia/);
 await navigate(page,'Resultados');
 await page.getByLabel('Pieza o proyecto').fill('Prueba');
 await page.getByLabel('Ingresos DOP').fill('500');
 await page.getByLabel('Gastos DOP').fill('100');
 await page.getByLabel('Visualizaciones').fill('25');
 await page.getByRole('button',{name:'Registrar resultado'}).click();
 await expect(page.getByText('Prueba',{exact:true})).toBeVisible();
 await expect(page.getByText(/Visualizaciones registradas: 25/)).toBeVisible();
});

test('lab quality checks persist and launch creator workflow',async({page})=>{
 await page.goto('/');
 await navigate(page,'Academia');
 await page.getByRole('button',{name:'Abrir laboratorio: Microanuncio vendible'}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.getByRole('heading',{name:'Control de calidad'})).toBeVisible();
 await dialog.getByRole('button',{name:/Oferta clara y comprobable/}).click();
 await expect(dialog.getByText('1 de 5 criterios registrados')).toBeVisible();
 await page.reload();
 await navigate(page,'Academia');
 await page.getByRole('button',{name:'Abrir laboratorio: Microanuncio vendible'}).click();
 await expect(dialog.getByRole('button',{name:/Oferta clara y comprobable/})).toHaveAttribute('aria-pressed','true');
 await dialog.getByRole('button',{name:'Preparar prompt'}).click();
 await expect(page.getByRole('heading',{name:'Creator Studio'})).toBeVisible();
 await expect(page.getByLabel('Método',{exact:true})).toHaveValue('ads');
});
test('older preview data remains readable with labs',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>localStorage.setItem('monetiza-os-v4-preview',JSON.stringify({done:['prompt'],projects:[],records:[]})));
 await page.reload();
 await expect(page.getByText('1 de 10 prácticas registradas')).toBeVisible();
 await navigate(page,'Academia');
 await page.getByRole('button',{name:'Abrir laboratorio: Microdocumental original'}).click();
 await expect(page.getByRole('dialog').getByText('0 de 5 criterios registrados')).toBeVisible();
 await page.getByRole('button',{name:'Crear proyecto del laboratorio'}).click();
 await expect(page.getByRole('heading',{name:'Microdocumental original'})).toBeVisible();
});

test('research creates and persists user evidence without claims of profit',async({page})=>{
 await page.goto('/');
 await navigate(page,'Investigar');
 await page.getByLabel('Tema de investigación').fill('Animación educativa');
 await page.getByRole('button',{name:'Preparar investigación'}).click();
 await expect(page.getByLabel('Prompt de investigación')).toHaveValue(/República Dominicana/);
 await page.getByLabel('URL de evidencia').fill('https://example.com/research');
 await page.getByLabel('Notas de evidencia').fill('Observación de prueba');
 await page.getByLabel('Costo adicional').selectOption('zero');
 await page.getByLabel('Elegibilidad y derechos').selectOption('yes');
 await page.getByRole('button',{name:'Guardar evidencia'}).click();
 await expect(page.getByText('Señal de interés; demanda sin validar')).toBeVisible();
 await page.reload();
 await navigate(page,'Investigar');
 await expect(page.getByRole('heading',{name:'Animación educativa'})).toBeVisible();
 await page.getByRole('button',{name:'Ver evidencia',exact:true}).click();await expect(page.getByRole('dialog').getByText('Observación de prueba',{exact:true})).toBeVisible();await page.getByRole('dialog').getByRole('button',{name:'Eliminar evidencia',exact:true}).click();
 await page.getByRole('button',{name:'Confirmar eliminación'}).click();
 await expect(page.getByRole('heading',{name:'Animación educativa'})).toHaveCount(0);
});

test('prompt master saves versions and director generates exact timeline',async({page})=>{
 await page.goto('/');
 await navigate(page,'Estudio IA');
 await page.getByRole('button',{name:'Guion original',exact:true}).click();
 await page.getByLabel('Objetivo',{exact:true}).fill('Crear un microdocumental');
 await page.getByRole('button',{name:'Guardar versión'}).click();
 await expect(page.getByText('Versión 1',{exact:true})).toBeVisible();
 await page.reload();
 await navigate(page,'Estudio IA');
 await page.getByRole('button',{name:'Ver versión',exact:true}).click();await expect(page.getByRole('dialog').getByLabel('Prompt de la versión')).toHaveValue(/Crear un microdocumental/);await page.getByRole('dialog').getByRole('button',{name:'Editar versión'}).click();
 await expect(page.getByLabel('Objetivo',{exact:true})).toHaveValue('Crear un microdocumental');
 await page.getByRole('button',{name:'Guardar versión'}).click();
 await expect(page.getByText('Versión 2',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'AI Director',exact:true}).click();
 await page.getByLabel('Historia o premisa').fill('Un viaje al bosque');
 await page.getByRole('button',{name:'Preparar storyboard'}).click();
 await expect(page.getByRole('row').filter({hasText:'E10'})).toContainText('60s');
 await expect(page.getByLabel('Instrucciones de dirección')).toHaveValue(/Un viaje al bosque/);
});

test('mentor works without native AI',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(globalThis,'LanguageModel',{value:undefined,configurable:true}));
 await page.goto('/');
 await navigate(page,'Mentor');
 await expect(page.getByText('Este navegador no dispone del motor local.')).toBeVisible();
 await page.getByLabel('Contexto del mentor').fill('Aprender a crear anuncios');
 await expect(page.getByLabel('Prompt del mentor')).toHaveValue(/Aprender a crear anuncios/);
 await expect(page.getByRole('button',{name:'Autorizar descarga y generar'})).toBeDisabled();
});
test('mentor native provider integration via injected test double',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(globalThis,'LanguageModel',{configurable:true,value:{availability:async()=> 'available',create:async()=>({prompt:async()=> 'Resultado simulado para QA',destroy(){}})}}));
 await page.goto('/');
 await navigate(page,'Mentor');
 await page.getByLabel('Contexto del mentor').fill('Guion educativo');
 await page.getByRole('button',{name:'Generar con IA local'}).click();
 await expect(page.getByLabel('Respuesta generativa local')).toHaveValue('Resultado simulado para QA');
});

test('observed trends filter and feed guided research',async({page})=>{
 await page.goto('/');
 await navigate(page,'Investigar');
 const report={checkedAt:'2026-01-01T00:00:00Z',feeds:{US:{status:'OK',source:'https://trends.google.com/trending/rss?geo=US',items:[{title:'hollow knight silksong dlc',published:'Fixture QA'}]}}};
 await page.getByLabel('Importar informe de tendencias').setInputFiles({name:'trend-report.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});
 await page.getByRole('button',{name:'Estados Unidos',exact:true}).click();
 await page.getByLabel('Categoría de tendencia').selectOption('Videojuegos');
 await expect(page.getByRole('heading',{name:'hollow knight silksong dlc',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Ver tendencia',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Investigar tendencia',exact:true}).click();
 await expect(page.getByLabel('Tema de investigación')).toHaveValue('hollow knight silksong dlc');
 await expect(page.getByLabel('Prompt de investigación')).toHaveValue(/hollow knight silksong dlc/);
});

test('provider report import persists independently and labels provenance',async({page})=>{
 await page.goto('/');await navigate(page,'Investigar');
 await page.getByRole('button',{name:'Hugging Face',exact:true}).click();
 const report={checkedAt:'2026-01-01T00:00:00Z',feeds:{HF:{status:'OK',source:'https://huggingface.co/blog/feed.xml',items:[{title:'AI video model QA fixture',published:'Fixture'}]}}};
 await page.getByLabel('Importar informe de tendencias').setInputFiles({name:'trend-report.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});
 await expect(page.getByRole('heading',{name:'AI video model QA fixture',exact:true})).toBeVisible();
 await page.reload();await navigate(page,'Investigar');await page.getByRole('button',{name:'Hugging Face',exact:true}).click();
 await expect(page.getByRole('heading',{name:'AI video model QA fixture',exact:true})).toBeVisible();await expect(page.getByText(/Informe importado · procedencia no autenticada/)).toBeVisible();
 await page.getByRole('button',{name:'Volver a captura inicial'}).click();await expect(page.getByRole('heading',{name:'AI video model QA fixture',exact:true})).toHaveCount(0);
});

test('expanded method opens practical seven-day guide and project',async({page})=>{
 await page.goto('/');await navigate(page,'Explorar');
 await page.getByLabel('Buscar método').fill('Catálogos visuales');
 await page.getByRole('button',{name:'Estudiar método',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.getByRole('heading',{name:'Plan de 7 días'})).toBeVisible();
 await expect(dialog.getByText(/Día 7 · Revisa evidencia/)).toBeVisible();
 await expect(dialog.getByLabel('Prompt de la práctica')).toHaveValue(/RD\$0/);
 await dialog.getByRole('button',{name:'Iniciar proyecto',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Catálogos visuales de productos',exact:true})).toBeVisible();
});

test('adaptive route persists goal and opens the recommended lesson',async({page})=>{
 await page.goto('/');await navigate(page,'Mi ruta');
 await page.getByLabel('Objetivo personal').selectOption('channel');
 await page.getByLabel('Tiempo disponible').selectOption('15');
 await expect(page.getByRole('heading',{name:'Practica: Investigar sin inventar',exact:true})).toBeVisible();
 await page.reload();await navigate(page,'Mi ruta');
 await expect(page.getByLabel('Objetivo personal')).toHaveValue('channel');
 await expect(page.getByLabel('Tiempo disponible')).toHaveValue('15');
 await page.getByRole('button',{name:'Ir a la actividad',exact:true}).first().click();
 await expect(page.getByRole('dialog').getByText('Investigar sin inventar',{exact:true})).toBeVisible();
 await page.getByRole('dialog').getByRole('button',{name:'Registrar práctica realizada'}).click();
 await page.getByRole('button',{name:'Cerrar lección'}).click();
 await navigate(page,'Mi ruta');
 await expect(page.getByRole('heading',{name:'Practica: Originalidad y monetización',exact:true})).toBeVisible();
});

test('premium shell fits compact mobile, tablet and desktop and captures evidence',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Aprende. Crea. Monetiza.'})).toBeVisible();
 for(const [width,height] of [[320,740],[768,900],[1440,900]]){
  await page.setViewportSize({width,height});
  if(width<992){await expect(page.getByRole('button',{name:'Menú de navegación'})).toBeVisible();}else{await expect(page.getByRole('navigation',{name:'Navegación'})).toBeVisible();}
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:testInfo.outputPath('home-'+width+'.png'),animations:'disabled',fullPage:true});
 }
 await navigate(page,'Estudio IA');
 await expect(page.getByRole('heading',{name:'Prompt Master & AI Director'})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:testInfo.outputPath('studio-desktop.png'),animations:'disabled',fullPage:true});
 await page.setViewportSize({width:360,height:800});
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:testInfo.outputPath('studio-mobile.png'),animations:'disabled',fullPage:true});
});

test('mobile navigation opens every group, closes on selection and Escape',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:740});await page.goto('/');
 const menu=page.getByRole('button',{name:'Menú de navegación',exact:true});
 const nav=page.getByRole('navigation',{name:'Navegación'});
 await expect(menu).toHaveAttribute('aria-expanded','false');await expect(nav).toBeHidden();
 await menu.click();await expect(nav.getByRole('button')).toHaveCount(10);
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:testInfo.outputPath('mobile-menu-320.png'),animations:'disabled',fullPage:false});
 await page.keyboard.press('Escape');await expect(nav).toBeHidden();await expect(menu).toBeFocused();
 await navigate(page,'Estudio IA');await expect(nav).toBeHidden();
 await expect(page.getByRole('heading',{name:'Prompt Master & AI Director'})).toBeVisible();
});

test('vertical cards keep details in modals and finance simulations stay separate',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Explorar');
 await expect(page.locator('.entity-card')).toHaveCount(12);
 await expect(page.getByText('Plan de 7 días',{exact:true})).toHaveCount(0);
 await page.screenshot({path:testInfo.outputPath('catalog.png'),animations:'disabled',fullPage:true});
 await page.getByRole('button',{name:'Estudiar método'}).first().click();
 await expect(page.getByRole('dialog').getByRole('heading',{name:'Plan de 7 días'})).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toBeHidden();
 await navigate(page,'Resultados');await page.getByRole('button',{name:'Planificar una oferta'}).click();
 for(const [label,value] of [['Precio de venta DOP','1000'],['Costo directo DOP','200'],['Horas estimadas','2'],['Valor de tu hora DOP','300'],['Meta de efectivo neto DOP','2400']])await page.getByLabel(label,{exact:true}).fill(value);
 await expect(page.getByText('La oferta cubre los costos',{exact:false})).toBeVisible();
 await expect(page.getByText('3',{exact:true})).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('finance-planner.png'),animations:'disabled',fullPage:true});
 await page.getByRole('button',{name:'Resultados reales',exact:true}).click();await expect(page.getByText('Visualizaciones registradas: 0')).toBeVisible();
});

test('cash reserve and partial collection persist without mixing actual project results',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Resultados');await page.getByRole('button',{name:'Efectivo y cobros'}).click();
 await page.getByRole('button',{name:'Configurar saldo inicial'}).click();
 let d=page.getByRole('dialog');await d.getByLabel('Mes de referencia').fill('2026-11');await d.getByLabel('Importe DOP').fill('1000');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Añadir gasto esencial'}).click();await d.getByLabel('Concepto').fill('Comida semanal');await d.getByLabel('Importe DOP').fill('700');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Añadir cuenta por cobrar'}).click();await d.getByLabel('Concepto').fill('Diseño acordado');await d.getByLabel('Importe DOP').fill('2000');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Ver cobro',exact:true}).click();await d.getByRole('button',{name:'Registrar cobro recibido'}).click();await d.getByLabel('Importe DOP').fill('500');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await expect(page.getByText('Por cobrar · no disponible',{exact:true}).locator('..').getByText(/1,500/)).toBeVisible();
 await expect(page.getByText('Disponible después de reservar esenciales',{exact:true}).locator('..').getByText(/800/)).toBeVisible();
 await page.reload();await navigate(page,'Resultados');await page.getByRole('button',{name:'Efectivo y cobros'}).click();await expect(page.getByRole('heading',{name:'Diseño acordado'})).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('cash-center.png'),animations:'disabled',fullPage:true});
 await page.getByRole('button',{name:'Resultados reales',exact:true}).click();await expect(page.getByText('Visualizaciones registradas: 0')).toBeVisible();
});

test('commercial opportunity links one project and one receivable without fictitious income',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Resultados');await page.getByRole('button',{name:'Oportunidades',exact:true}).click();await page.getByRole('button',{name:'Nueva oportunidad'}).click();
 const d=page.getByRole('dialog');await d.getByLabel('Nombre de la oportunidad').fill('Anuncio comercio QA');await d.getByLabel('Precio propuesto DOP').fill('1500');await d.getByRole('button',{name:'Guardar oportunidad'}).click();
 await page.getByRole('button',{name:'Ver oportunidad'}).click();await d.getByRole('button',{name:'Crear proyecto vinculado'}).click();await expect(page.getByRole('heading',{name:'Mis proyectos'})).toBeVisible();await page.getByRole('button',{name:'Cerrar proyecto'}).click();
 await navigate(page,'Resultados');await page.getByRole('button',{name:'Oportunidades',exact:true}).click();await page.getByRole('button',{name:'Ver oportunidad'}).click();await d.getByRole('button',{name:'Confirmar muestra preparada'}).click();await d.getByRole('button',{name:'Confirmar oferta presentada'}).click();await d.getByRole('button',{name:'Confirmar acuerdo real'}).click();await d.getByRole('button',{name:'Crear cuenta por cobrar'}).click();await expect(d.getByRole('button',{name:'Gestionar cobro en Efectivo'})).toBeVisible();await d.getByRole('button',{name:'Gestionar cobro en Efectivo'}).click();
 await page.getByRole('button',{name:'Ver cobro'}).click();await d.getByRole('button',{name:'Registrar cobro recibido'}).click();await d.getByLabel('Importe DOP').fill('500');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Oportunidades',exact:true}).click();await expect(page.getByText('Cobrado de acuerdos enlazados',{exact:true}).locator('..').getByText(/500/)).toBeVisible();await expect(page.getByText('Por cobrar · no es efectivo',{exact:true}).locator('..').getByText(/1,000/)).toBeVisible();
 await page.reload();await navigate(page,'Resultados');await page.getByRole('button',{name:'Oportunidades',exact:true}).click();await expect(page.getByRole('heading',{name:'Anuncio comercio QA'})).toBeVisible();await page.screenshot({path:testInfo.outputPath('commercial-engine.png'),animations:'disabled',fullPage:true});
 await page.getByRole('button',{name:'Resultados reales',exact:true}).click();await expect(page.getByText('Visualizaciones registradas: 0')).toBeVisible();
});

test('commercial proposal and experiment persist without sending or creating cash',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Resultados');await page.getByRole('button',{name:'Oportunidades',exact:true}).click();await page.getByRole('button',{name:'Nueva oportunidad'}).click();
 const d=page.getByRole('dialog');await d.getByLabel('Nombre de la oportunidad').fill('Propuesta QA');await d.getByLabel('Precio propuesto DOP').fill('1000');await d.getByRole('button',{name:'Guardar oportunidad'}).click();
 await page.getByRole('button',{name:'Ver oportunidad'}).click();await d.getByRole('button',{name:'Abrir ficha comercial'}).click();
 for(const [label,value] of [['Destinatario comercial','Comercio QA'],['Entregables y alcance','Anuncio vertical original'],['Plazo y condiciones de entrega','Dos días'],['Revisiones incluidas','Una revisión'],['Condiciones de pago','50% de anticipo'],['Exclusiones y derechos','No incluye pauta']])await d.getByLabel(label,{exact:true}).fill(value);
 await expect(d.getByLabel('Propuesta comercial lista')).toHaveValue(/1,000/);await expect(d.getByRole('button',{name:'Descargar propuesta TXT'})).toBeDisabled();
 await d.getByRole('button',{name:'Validación comercial'}).click();for(const [label,value] of [['Hipótesis comercial','La muestra interesa'],['Criterio observable','Respuesta explícita'],['Resultado observado','Sin respuesta'],['Próxima acción','Ajustar propuesta']])await d.getByLabel(label).fill(value);
 await d.getByLabel('Decisión del experimento').selectOption('adjust');await d.getByRole('button',{name:'Guardar ficha comercial'}).click();
 await page.reload();await navigate(page,'Resultados');await page.getByRole('button',{name:'Oportunidades',exact:true}).click();await page.getByRole('button',{name:'Ver oportunidad'}).click();await d.getByRole('button',{name:'Abrir ficha comercial'}).click();
 await expect(d.getByLabel('Propuesta comercial lista')).toHaveValue(/50% de anticipo/);const download=page.waitForEvent('download');await d.getByRole('button',{name:'Descargar propuesta TXT'}).click();expect((await download).suggestedFilename()).toBe('propuesta-comercial.txt');
 await page.screenshot({path:testInfo.outputPath('proposal.png'),animations:'disabled',fullPage:true});await d.getByRole('button',{name:'Validación comercial'}).click();await expect(d.getByLabel('Decisión del experimento')).toHaveValue('adjust');await d.getByRole('button',{name:'Cerrar',exact:true}).click();await expect(page.getByText('Cobrado de acuerdos enlazados',{exact:true}).locator('..').getByText(/0\.00/)).toBeVisible();
});

test('cash correction and period close keep history and prevent double counting',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Resultados');await page.getByRole('button',{name:'Efectivo y cobros'}).click();
 const d=page.getByRole('dialog');await page.getByRole('button',{name:'Configurar saldo inicial'}).click();await d.getByLabel('Mes de referencia').fill('2026-11');await d.getByLabel('Importe DOP').fill('1000');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Añadir cuenta por cobrar'}).click();await d.getByLabel('Concepto').fill('Servicio QA');await d.getByLabel('Importe DOP').fill('2000');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Ver cobro',exact:true}).click();await d.getByRole('button',{name:'Registrar cobro recibido'}).click();await d.getByLabel('Importe DOP').fill('500');await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await page.getByRole('button',{name:'Ver cobro',exact:true}).click();await d.getByRole('button',{name:'Corregir importe recibido'}).click();await d.getByLabel('Importe DOP').fill('400');await d.getByLabel('Motivo de la corrección').fill('Importe registrado mal');await d.getByLabel('Confirmo esta operación').check();await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await expect(page.getByText('Efectivo calculado',{exact:true}).locator('..').getByText(/1,400/)).toBeVisible();
 await page.getByRole('button',{name:'Cerrar período y continuar'}).click();await d.getByLabel('Confirmo esta operación').check();await d.getByRole('button',{name:'Guardar',exact:true}).click();
 await expect(page.getByText('Efectivo calculado',{exact:true}).locator('..').getByText(/1,400/)).toBeVisible();
 await page.reload();await navigate(page,'Resultados');await page.getByRole('button',{name:'Efectivo y cobros'}).click();await page.getByRole('button',{name:'Ver cierre'}).click();await expect(d.getByText('Cobrado en el ciclo',{exact:true}).locator('..').getByText(/400/)).toBeVisible();await page.screenshot({path:testInfo.outputPath('closed-period.png'),animations:'disabled',fullPage:true});await d.getByRole('button',{name:'Cerrar',exact:true}).click();
 await page.getByRole('button',{name:'Historial de correcciones (1)'}).click();await expect(d.getByText('Importe registrado mal',{exact:true})).toBeVisible();
});

test('all workspace modules fit the viewport and produce visual evidence',async({page},testInfo)=>{
 test.setTimeout(90000);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 for(const [i,name] of ['Inicio','Mi ruta','Explorar','Investigar','Academia','Crear','Estudio IA','Mentor','Proyectos','Resultados'].entries()){
  if(name!=='Inicio')await navigate(page,name);
  await expect(page.locator('.os-breadcrumb span')).toHaveText(name);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:testInfo.outputPath('module-'+i+'.png'),animations:'disabled',fullPage:false});
 }
 await navigate(page,'Academia');await page.getByRole('button',{name:'Ver recurso',exact:true}).first().click();
 await expect(page.getByRole('dialog').getByRole('link',{name:/Consultar fuente/})).toBeVisible();
 await expect(page.getByRole('dialog').getByRole('link',{name:/Consultar fuente/})).toHaveAttribute('href','https://krita.org/en/about/license/');
 await page.screenshot({path:testInfo.outputPath('resource-modal.png'),animations:'disabled'});
});

test('light theme persists and reaches portal dialogs without changing project data',async({page},testInfo)=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'Activar tema claro',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-bs-theme','light');
 await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.body).color)).toBe('rgb(23, 35, 59)');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:testInfo.outputPath('light-home.png'),animations:'disabled',fullPage:false});
 await navigate(page,'Explorar');await page.getByRole('button',{name:'Estudiar método',exact:true}).first().click();
 const d=page.getByRole('dialog');await expect(d).toBeVisible();
 await expect.poll(()=>d.locator('.modal-content').evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(255, 255, 255)');
 await page.screenshot({path:testInfo.outputPath('light-method-modal.png'),animations:'disabled'});
 await d.getByRole('button',{name:'Iniciar proyecto',exact:true}).click();await expect(page.getByRole('heading',{name:'Mis proyectos'})).toBeVisible();await expect(page.locator('.entity-card')).toHaveCount(1);await page.reload();await expect(page.locator('html')).toHaveAttribute('data-bs-theme','light');await navigate(page,'Proyectos');await expect(page.locator('.entity-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Activar tema oscuro',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-bs-theme','dark');
});

test('academy track evidence persists and requires actual note and checklist',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Academia');await page.getByRole('button',{name:'Abrir itinerario: Primer servicio creativo',exact:true}).click();
 const d=page.getByRole('dialog');await d.getByRole('button',{name:/Diagnosticar antes de diseñar/}).click();
 for(const label of ['Beneficio verificable','Público y entregable concretos','Permisos y datos pendientes identificados'])await d.getByLabel(label,{exact:true}).check();
 await d.getByRole('button',{name:'Guardar evidencia',exact:true}).click();await expect(d.getByRole('button',{name:/^○ Diagnosticar/})).toBeVisible();
 await d.getByRole('button',{name:/Diagnosticar antes de diseñar/}).click();await d.getByLabel('Evidencia de práctica',{exact:true}).fill('Brief ficticio QA: beneficio y permisos revisados.');
 await d.getByRole('button',{name:'Guardar evidencia',exact:true}).click();await expect(d.getByRole('button',{name:/^✓ Diagnosticar/})).toBeVisible();
 await d.getByRole('button',{name:'Cerrar itinerario'}).click();await page.reload();await navigate(page,'Academia');await page.getByRole('button',{name:'Abrir itinerario: Primer servicio creativo',exact:true}).click();await d.getByRole('button',{name:/^✓ Diagnosticar/}).click();await expect(d.getByLabel('Evidencia de práctica',{exact:true})).toHaveValue('Brief ficticio QA: beneficio y permisos revisados.');
 await page.screenshot({path:testInfo.outputPath('academy-practice.png'),animations:'disabled'});await d.getByRole('button',{name:'Volver al itinerario'}).click();await d.getByRole('button',{name:'Estudiar método relacionado'}).click();await expect(page.getByRole('dialog').getByRole('button',{name:'Iniciar proyecto',exact:true})).toBeVisible();
});

test('expanded academy finds a production track and preserves its saved evidence',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Academia');const area=page.getByRole('region',{name:'Itinerarios prácticos'});await expect(area.locator('.entity-card')).toHaveCount(12);
 await area.getByLabel('Buscar itinerario').fill('subtítulos precisos');await expect(area.locator('.entity-card')).toHaveCount(1);
 await area.getByRole('button',{name:'Abrir itinerario: Subtítulos precisos y accesibilidad',exact:true}).click();
 const d=page.getByRole('dialog');await d.getByRole('button',{name:/Segmentar y crear un SRT/}).click();
 await d.getByLabel('Evidencia de práctica').fill('Fixture QA: sincronización y formato comprobados.');
 for(const name of ['Formato y secuencia válidos','Sin solapamientos','Sincronía comprobada'])await d.getByLabel(name,{exact:true}).check();
 await d.getByRole('button',{name:'Guardar evidencia'}).click();await expect(d.getByRole('button',{name:/^✓ Segmentar/})).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('academy-expanded.png'),animations:'disabled'});await d.getByRole('button',{name:'Cerrar itinerario'}).click();await page.reload();await navigate(page,'Academia');
 await area.getByLabel('Buscar itinerario').fill('subtítulos precisos');await expect(area.getByText('1 de 3 unidades con evidencia')).toBeVisible();await area.getByLabel('Buscar itinerario').fill('zz-no-match');await expect(area.getByText('No hay itinerarios que coincidan con la búsqueda.')).toBeVisible();
});

test('editorial monitor exposes blocked source and keeps imported report provenance',async({page},testInfo)=>{
 await page.goto('/');await navigate(page,'Investigar');const area=page.getByRole('region',{name:'Monitor editorial'});await expect(area.getByText('Fuente inaccesible',{exact:true}).locator('..').getByText('1',{exact:true})).toBeVisible();
 await area.getByRole('button',{name:'Ver detalle editorial'}).click();await area.locator('.entity-card').filter({hasText:'TikTok: Creator Rewards'}).getByRole('button',{name:'Ver estado de fuente'}).click();
 const d=page.getByRole('dialog');await expect(d.getByText(/URL fuera de lista/)).toBeVisible();await expect(d.getByText(/Pendiente de confirmación · independiente de la huella HTML/)).toBeVisible();await expect(d.getByText(/No se confirmó elegibilidad actual/)).toBeVisible();await expect(d.getByRole('link',{name:/Consultar fuente oficial/})).toHaveAttribute('href',/support\.tiktok\.com/);await d.getByRole('button',{name:'Cerrar',exact:true}).click();
 const report={"checkedAt":"2026-11-25T23:53:27.002Z","notice":"Huella HTML: cambios pueden ser cosméticos. No valida hechos, políticas ni rentabilidad. Revisión humana requerida.","sources":{"youtubeRD":{"sha256":"28032e63aa886180706778628771dc092e79695f93215c1a2be32a3f7e5e6daf","url":"https://support.google.com/youtube/answer/13429240","bytes":1641970,"status":"REVIEW_REQUIRED"},"metaUpdate":{"sha256":"6c08ee9a4d453e6db43b916c8763e768ec0eb422be6abb1e5c5df16e36e7d9df","url":"https://about.fb.com/news/2026/03/creator-fast-track-grow-your-audience-earn-money-on-facebook/","bytes":549888,"status":"UNCHANGED"},"youtube":{"sha256":"c1792a440d64181916884a993638c77fbe259b45880c751fe27119e804440572","url":"https://support.google.com/youtube/answer/1311392","bytes":1657666,"status":"REVIEW_REQUIRED"},"meta":{"sha256":"debcb996fd9834e8553a61b8adac46eb6a2e835ae885d63dff85c8af1d45520c","url":"https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/","bytes":598461,"status":"UNCHANGED"},"tiktok":{"status":"UNAVAILABLE","error":"URL fuera de lista: www.tiktok.com"},"microsoft":{"sha256":"f82852628fe72229490e02477e249f339164664915a437ff8fd8a0018ad743f2","url":"https://github.com/microsoft/generative-ai-for-beginners","bytes":476460,"status":"REVIEW_REQUIRED"},"license":{"sha256":"5d0d9c4f865651ccb6935595181f8cc7c8009778c66cbb65870108c8b87015ad","url":"https://github.com/microsoft/generative-ai-for-beginners/blob/main/LICENSE","bytes":180993,"status":"REVIEW_REQUIRED"}}};
 await area.getByLabel('Importar informe editorial').setInputFiles({name:'editorial.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});await expect(area.getByText(/Informe editorial importado · procedencia no autenticada/)).toBeVisible();
 await page.reload();await navigate(page,'Investigar');await expect(area.getByText(/Informe editorial importado · procedencia no autenticada/)).toBeVisible();await area.getByRole('button',{name:'Ver detalle editorial'}).click();await page.screenshot({path:testInfo.outputPath('editorial-monitor.png'),animations:'disabled'});await area.getByRole('button',{name:'Restaurar captura editorial'}).click();await expect(area.getByText(/Captura editorial incluida/)).toBeVisible();
});

test('mentor manual fallback works without provider and clears stale guidance',async({page},testInfo)=>{
 await page.addInitScript(()=>Object.defineProperty(globalThis,'LanguageModel',{value:undefined,configurable:true}));await page.goto('/');await navigate(page,'Mentor');
 await expect(page.getByRole('button',{name:'Probar inferencia local'})).toBeDisabled();await page.getByLabel('Contexto del mentor').fill('Muestra de catálogo');await page.getByRole('button',{name:'Preparar guía manual'}).click();await expect(page.getByLabel('Guía manual del mentor')).toHaveValue(/NO GENERADA POR IA/);
 await page.screenshot({path:testInfo.outputPath('mentor-manual.png'),animations:'disabled'});await page.getByLabel('Contexto del mentor').fill('Otro contexto');await expect(page.getByLabel('Guía manual del mentor')).toHaveCount(0);
});
test('mentor inference diagnostic uses only test prompt with simulated provider',async({page},testInfo)=>{
 await page.addInitScript(()=>Object.defineProperty(globalThis,'LanguageModel',{configurable:true,value:{availability:async()=> 'available',create:async()=>({prompt:async input=>input.includes('LISTO')?'LISTO':'NO',destroy(){}})}}));await page.goto('/');await navigate(page,'Mentor');await page.getByLabel('Contexto del mentor').fill('Contexto no enviado en prueba');
 await page.getByRole('button',{name:'Probar inferencia local'}).click();await expect(page.getByText('Respuesta esperada recibida',{exact:true})).toBeVisible();await expect(page.getByLabel('Respuesta generativa local')).toHaveCount(0);await page.screenshot({path:testInfo.outputPath('mentor-diagnostic-mock.png'),animations:'disabled'});
});
