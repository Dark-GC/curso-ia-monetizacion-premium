// Static build acceptance: no runtime performance or security certification.
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {gzipSync} from 'node:zlib';
const root='dist';
const packageInfo=JSON.parse(await readFile('package.json','utf8'));
const lock=JSON.parse(await readFile('package-lock.json','utf8'));
if(packageInfo.version!==lock.version||packageInfo.version!==lock.packages[''].version)throw Error('Version mismatch');
const entries=[];
async function scan(dir,prefix=''){
 for(const e of await readdir(dir,{withFileTypes:true})){
  const rel=prefix+e.name;
  if(e.isSymbolicLink())throw Error('Unexpected symlink: '+rel);
  if(e.isDirectory())await scan(join(dir,e.name),rel+'/');
  else if(e.isFile()){
   if(!/^(index\.html|assets\/[A-Za-z0-9_-]+\.(js|css))$/.test(rel))throw Error('Unexpected distribution file: '+rel);
   const bytes=await readFile(join(dir,e.name));
   entries.push({path:rel,bytes:bytes.length,gzipBytes:gzipSync(bytes).length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }else throw Error('Unexpected file type: '+rel);
 }
}
await scan(root);
entries.sort((a,b)=>a.path.localeCompare(b.path));
const html=await readFile(join(root,'index.html'),'utf8');
const references=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
if(!entries.some(e=>e.path.endsWith('.js'))||!entries.some(e=>e.path.endsWith('.css'))||!references.length||references.some(v=>!v.startsWith('/assets/')||!entries.some(e=>e.path===v.slice(1))))throw Error('Invalid static entrypoint references');
const total=entries.reduce((n,e)=>n+e.bytes,0),compressed=entries.reduce((n,e)=>n+e.gzipBytes,0);
if(total>1000000||compressed>250000)throw Error('Static package budget exceeded');
const report={version:packageInfo.version,scope:'static package only; no real inference, mobile device or runtime performance attestation',testedCommit:process.env.GITHUB_SHA||null,bytes:total,gzipBytes:compressed,budgets:{bytes:1000000,gzipBytes:250000},files:entries};
await writeFile('release-manifest.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
