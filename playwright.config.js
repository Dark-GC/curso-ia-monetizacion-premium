import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',workers:1,retries:0,timeout:30000,
 use:{baseURL:'http://127.0.0.1:4173',headless:true},
 projects:[{name:'mobile',use:{viewport:{width:360,height:800}}},{name:'desktop',use:{viewport:{width:1440,height:900}}}],
 webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173',reuseExistingServer:false,timeout:30000}
});