// Accept Vite's relative base and root-relative asset references, never traversal or external URLs.
export function verifyReleaseReferences(html,entries){
 const paths=new Set(entries.map(e=>e.path));
 const refs=[...html.matchAll(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/g)].map(m=>m[2]);
 const asset=/^(?:\.\/|\/)(assets\/[A-Za-z0-9_-]+\.(?:js|css))$/;
 if(!refs.length)throw Error('No static entrypoint references');
 const resolved=refs.map(v=>{const match=asset.exec(v);if(!match||!paths.has(match[1]))throw Error('Invalid static entrypoint reference: '+v);return match[1]});
 if(!resolved.some(p=>p.endsWith('.js'))||!resolved.some(p=>p.endsWith('.css')))throw Error('Missing referenced JS or CSS');
 return resolved;
}
