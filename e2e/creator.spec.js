import {test,expect} from '@playwright/test';
test('method to project and persistence',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:'Aprende. Crea. Monetiza.'})).toBeVisible();
 await page.getByRole('button',{name:'Explorar',exact:true}).click();
 await page.getByRole('button',{name:'Estudiar método'}).first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Iniciar proyecto'}).click();
 await expect(page.getByRole('heading',{name:'Mis proyectos'})).toBeVisible();
 await page.getByRole('button',{name:/Elige un comercio/}).click();
 await page.reload();await page.getByRole('button',{name:'Proyectos',exact:true}).click();
 await expect(page.getByRole('button',{name:/✓ Elige un comercio/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 expect(errors).toEqual([]);
});
test('learning, prompts and financial record',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Academia',exact:true}).click();
 await page.getByRole('button',{name:'Registrar práctica realizada'}).first().click();
 await expect(page.getByRole('button',{name:'✓ Práctica registrada'})).toBeVisible();
 await page.getByRole('button',{name:'Crear',exact:true}).click();
 await page.getByPlaceholder('Ej. Curiosidades científicas').fill('Ciencia');
 await page.getByPlaceholder('Ej. Adultos interesados en ciencia').fill('Adultos');
 await page.getByRole('button',{name:'Generar flujo y prompt'}).click();
 await expect(page.getByRole('textbox',{name:'Prompt listo para tu asistente IA'})).toHaveValue(/Tema: Ciencia/);
 await page.getByRole('button',{name:'Resultados',exact:true}).click();
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
 await page.getByRole('button',{name:'Academia',exact:true}).click();
 await page.getByRole('button',{name:'Abrir laboratorio: Microanuncio vendible'}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.getByRole('heading',{name:'Control de calidad'})).toBeVisible();
 await dialog.getByRole('button',{name:/Oferta clara y comprobable/}).click();
 await expect(dialog.getByText('1 de 5 criterios registrados')).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Academia',exact:true}).click();
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
 await page.getByRole('button',{name:'Academia',exact:true}).click();
 await page.getByRole('button',{name:'Abrir laboratorio: Microdocumental original'}).click();
 await expect(page.getByRole('dialog').getByText('0 de 5 criterios registrados')).toBeVisible();
 await page.getByRole('button',{name:'Crear proyecto del laboratorio'}).click();
 await expect(page.getByRole('heading',{name:'Microdocumental original'})).toBeVisible();
});

test('research creates and persists user evidence without claims of profit',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Investigar',exact:true}).click();
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
 await page.getByRole('button',{name:'Investigar',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Animación educativa'})).toBeVisible();
 await page.getByRole('button',{name:'Eliminar evidencia',exact:true}).click();
 await page.getByRole('button',{name:'Confirmar eliminación'}).click();
 await expect(page.getByRole('heading',{name:'Animación educativa'})).toHaveCount(0);
});

test('prompt master saves versions and director generates exact timeline',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Estudio IA',exact:true}).click();
 await page.getByRole('button',{name:'Guion original',exact:true}).click();
 await page.getByLabel('Objetivo',{exact:true}).fill('Crear un microdocumental');
 await page.getByRole('button',{name:'Guardar versión'}).click();
 await expect(page.getByText('Versión 1',{exact:true})).toBeVisible();
 await page.reload();
 await page.getByRole('button',{name:'Estudio IA',exact:true}).click();
 await page.getByRole('button',{name:'Editar versión'}).click();
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
 await page.getByRole('button',{name:'Mentor',exact:true}).click();
 await expect(page.getByText('Este navegador no dispone del motor local.')).toBeVisible();
 await page.getByLabel('Contexto del mentor').fill('Aprender a crear anuncios');
 await expect(page.getByLabel('Prompt del mentor')).toHaveValue(/Aprender a crear anuncios/);
 await expect(page.getByRole('button',{name:'Autorizar descarga y generar'})).toBeDisabled();
});
test('mentor native provider integration via injected test double',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(globalThis,'LanguageModel',{configurable:true,value:{availability:async()=> 'available',create:async()=>({prompt:async()=> 'Resultado simulado para QA',destroy(){}})}}));
 await page.goto('/');
 await page.getByRole('button',{name:'Mentor',exact:true}).click();
 await page.getByLabel('Contexto del mentor').fill('Guion educativo');
 await page.getByRole('button',{name:'Generar con IA local'}).click();
 await expect(page.getByLabel('Respuesta generativa local')).toHaveValue('Resultado simulado para QA');
});

test('observed trends filter and feed guided research',async({page})=>{
 await page.goto('/');
 await page.getByRole('button',{name:'Investigar',exact:true}).click();
 await page.getByRole('button',{name:'Estados Unidos',exact:true}).click();
 await page.getByLabel('Categoría de tendencia').selectOption('Videojuegos');
 await expect(page.getByRole('heading',{name:'hollow knight silksong dlc',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Investigar tendencia',exact:true}).click();
 await expect(page.getByLabel('Tema de investigación')).toHaveValue('hollow knight silksong dlc');
 await expect(page.getByLabel('Prompt de investigación')).toHaveValue(/hollow knight silksong dlc/);
});

test('provider report import persists independently and labels provenance',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Investigar',exact:true}).click();
 await page.getByRole('button',{name:'Hugging Face',exact:true}).click();
 const report={checkedAt:'2026-01-01T00:00:00Z',feeds:{HF:{status:'OK',source:'https://huggingface.co/blog/feed.xml',items:[{title:'AI video model QA fixture',published:'Fixture'}]}}};
 await page.getByLabel('Importar informe de tendencias').setInputFiles({name:'trend-report.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});
 await expect(page.getByRole('heading',{name:'AI video model QA fixture',exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Investigar',exact:true}).click();await page.getByRole('button',{name:'Hugging Face',exact:true}).click();
 await expect(page.getByRole('heading',{name:'AI video model QA fixture',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Volver a captura inicial'}).click();await expect(page.getByRole('heading',{name:'AI video model QA fixture',exact:true})).toHaveCount(0);
});

test('expanded method opens practical seven-day guide and project',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Explorar',exact:true}).click();
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
 await page.goto('/');await page.getByRole('button',{name:'Mi ruta',exact:true}).click();
 await page.getByLabel('Objetivo personal').selectOption('channel');
 await page.getByLabel('Tiempo disponible').selectOption('15');
 await expect(page.getByRole('heading',{name:'Practica: Investigar sin inventar',exact:true})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Mi ruta',exact:true}).click();
 await expect(page.getByLabel('Objetivo personal')).toHaveValue('channel');
 await expect(page.getByLabel('Tiempo disponible')).toHaveValue('15');
 await page.getByRole('button',{name:'Ir a la actividad',exact:true}).first().click();
 await expect(page.getByText('Práctica recomendada',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Registrar práctica realizada'}).first().click();
 await page.getByRole('button',{name:'Mi ruta',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Practica: Originalidad y monetización',exact:true})).toBeVisible();
});
