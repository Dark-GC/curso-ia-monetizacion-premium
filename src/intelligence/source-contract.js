// Offline ingestion of existing allowlisted RSS snapshots; no fetch, no autonomous research.
import {feedCatalog,normalizeTrendReport} from '../trend-core.js';
export const MAX_SOURCE_BYTES=500000;
export const FRESHNESS_MS=24*60*60*1000;
const fold=s=>s.normalize('NFKC').trim().replace(/\s+/g,' ').toLowerCase();
export function inspectSourceSnapshot(text,now=Date.now()){
 if(!Number.isFinite(now)||typeof text!=='string'||text.length>MAX_SOURCE_BYTES||new TextEncoder().encode(text).length>MAX_SOURCE_BYTES)throw Error('Invalid source snapshot size or clock');
 const raw=JSON.parse(text);
 if(!raw||!raw.feeds||Array.isArray(raw.feeds)||Object.keys(raw.feeds).some(k=>!Object.hasOwn(feedCatalog,k)))throw Error('Unknown source');
 const report=normalizeTrendReport(raw,now);
 const stale=now-Date.parse(report.checkedAt)>=FRESHNESS_MS;
 const sources=[],signals=[];
 for(const [id,meta] of Object.entries(feedCatalog)){
  const f=report.feeds[id];
  const status=!f?'missing':f.status==='UNAVAILABLE'?'unavailable':stale?'stale':f.status==='EMPTY'?'empty':'available';
  const seen=new Set();
  let duplicates=0;
  for(const item of f?.items||[]){
   const key=fold(item.title);
   if(seen.has(key)){duplicates++;continue}
   seen.add(key);
   // Publication string is untrusted source text, not a verified timestamp.
   signals.push({sourceId:id,sourceUrl:meta.page,checkedAt:report.checkedAt,sourceStatus:status,kind:id==='DO'||id==='US'?'search-interest':'provider-publication',title:item.title,publishedRaw:item.published,authenticated:false});
  }
  sources.push({id,name:meta.name,url:meta.url,status,reportedStatus:f?.status||null,checkedAt:f?report.checkedAt:null,count:seen.size,duplicates});
 }
 return {checkedAt:report.checkedAt,stale,sources,signals,origin:'imported-snapshot',authenticated:false};
}
