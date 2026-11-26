import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyReleaseReferences} from '../scripts/release-references.mjs';
const entries=[{path:'index.html'},{path:'assets/index-a_1.js'},{path:'assets/index-b-2.css'}];
const html=(js,css)=>'<script type="module" src="'+js+'"></script><link rel="stylesheet" href="'+css+'">';
test('Vite relative and root-relative assets resolve to packaged files',()=>{for(const base of ['./','/'])assert.deepEqual(verifyReleaseReferences(html(base+'assets/index-a_1.js',base+'assets/index-b-2.css'),entries),['assets/index-a_1.js','assets/index-b-2.css'])});
test('release gate rejects external, traversal, query, encoded and absent assets',()=>{for(const v of ['https://example.com/assets/index-a_1.js','//example.com/assets/index-a_1.js','../assets/index-a_1.js','./assets/../index-a_1.js','./assets/index-a_1.js?x=1','./assets/%69ndex-a_1.js','./assets/missing.js','data:text/javascript,foo'])assert.throws(()=>verifyReleaseReferences(html(v,'./assets/index-b-2.css'),entries))});
test('release gate requires both referenced CSS and JS',()=>{assert.throws(()=>verifyReleaseReferences('<script src="./assets/index-a_1.js"></script>',entries));assert.throws(()=>verifyReleaseReferences('<link href="./assets/index-b-2.css">',entries));assert.throws(()=>verifyReleaseReferences('<html></html>',entries))});
