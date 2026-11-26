import {test,expect} from '@playwright/test';
test('command center creates gated synthetic draft, reloads and exports without touching RC1',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/foundation-e2e/intelligence.html');await expect(page.getByRole('status')).toHaveText('Laboratorio disponible');
 await page.evaluate(()=>localStorage.setItem('monetiza-os-v4-preview','untouched'));
 await page.getByRole('button',{name:'Oportunidades',exact:true}).click();
 await page.getByLabel('Necesidad ficticia').fill('Problema ficticio');await page.getByLabel('Comprador ficticio').fill('Comercio de prueba');await page.getByLabel('Entregable de práctica').fill('Muestra ficticia');
 await page.getByLabel('Minutos estimados').fill('30');await page.getByLabel('Costo adicional RD$').fill('0');
 for(const k of ['Habilidades','Derechos','Elegibilidad'])await page.getByLabel(k,{exact:true}).selectOption('yes');
 await page.getByRole('checkbox',{name:'Krita — diseño e ilustración'}).check();
 await page.getByRole('button',{name:'Guardar ficha'}).click();await expect(page.getByRole('status')).toHaveText('Ficha de práctica guardada');
 await page.getByRole('checkbox',{name:'Confirmo crear un borrador exclusivamente ficticio'}).check();await expect(page.getByRole('button',{name:'Crear borrador'})).toBeDisabled();
 await page.getByRole('button',{name:'Recursos',exact:true}).click();await page.getByRole('button',{name:'Revisar krita',exact:true}).click();
 for(const k of ['Sin gasto adicional','Sin tarjeta requerida','Cuota suficiente','Región compatible','Derechos confirmados','Equipo compatible'])await page.getByLabel(k,{exact:true}).selectOption('yes');
 await page.getByRole('button',{name:'Guardar comprobación'}).click();await expect(page.getByRole('status')).toHaveText('Comprobación de práctica guardada');
 await page.getByRole('button',{name:'Oportunidades',exact:true}).click();await page.getByRole('checkbox',{name:'Confirmo crear un borrador exclusivamente ficticio'}).check();
 await page.getByRole('button',{name:'Crear borrador'}).click();await expect(page.getByRole('status')).toHaveText('Borrador de práctica guardado');
 await page.getByRole('button',{name:'Crear borrador'}).click();await expect(page.getByRole('status')).toHaveText('El borrador ya existe. No se duplicó.');
 await page.reload();await expect(page.getByRole('status')).toHaveText('Laboratorio disponible');await page.getByRole('button',{name:'Reportes',exact:true}).click();await expect(page.getByRole('heading',{name:'Muestra ficticia'})).toHaveCount(1);
 const dl=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar reporte JSON de práctica'}).click();expect((await dl).suggestedFilename()).toBe('monetiza-intelligence-laboratorio.json');
 expect(await page.evaluate(()=>localStorage.getItem('monetiza-os-v4-preview'))).toBe('untouched');expect(errors).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('command center imports source, persists and rejects invalid replacement',async({page})=>{
 await page.goto('/foundation-e2e/intelligence.html');await expect(page.getByRole('status')).toHaveText('Laboratorio disponible');
 const snapshot={checkedAt:new Date().toISOString(),feeds:{DO:{status:'OK',source:'https://trends.google.com/trending/rss?geo=DO',items:[{title:'Señal ficticia',published:'fixture'}]}}};
 await page.getByLabel('Importar captura JSON').setInputFiles({name:'snapshot.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(snapshot))});await expect(page.getByText('Señal ficticia · DO · Disponible')).toBeVisible();
 await page.getByLabel('Importar captura JSON').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{}')});await expect(page.getByRole('status')).toContainText('No se guardó');
 await page.reload();await expect(page.getByText('Señal ficticia · DO · Disponible')).toBeVisible();
});
test('lab DB same-revision conflict rejects one writer',async({page,context})=>{
 await page.goto('/foundation-e2e/intelligence.html');await expect(page.getByRole('status')).toHaveText('Laboratorio disponible');const other=await context.newPage();await other.goto('/foundation-e2e/intelligence.html');await expect(other.getByRole('status')).toHaveText('Laboratorio disponible');
 const save=(p,id)=>p.evaluate(async id=>{const m=await import('/src/intelligence/lab-db.js');const db=await m.openLab();try{return (await m.commitLab(db,0,{type:'check',verification:{id,checkedAt:new Date().toISOString().slice(0,10),origin:'synthetic',checks:{cost:'unknown',card:'unknown',quota:'unknown',region:'unknown',rights:'unknown',hardware:'unknown'}}})).status}catch(e){return e.message}finally{db.close()}},id);
 const a=await Promise.all([save(page,'krita'),save(other,'shotcut')]);expect(a.sort()).toEqual(['Conflicto de revisión: recarga el laboratorio','SAVED']);
});
