"""Bounded public RSS collection. No credentials, executable content, or third-party packages."""
import json
import re
import sys
from datetime import datetime, timezone
from urllib.request import Request, build_opener, HTTPRedirectHandler
from xml.etree import ElementTree as ET
from pathlib import Path

MAX_BYTES = 1_500_000
FEEDS = {
    "DO": "https://trends.google.com/trending/rss?geo=DO",
    "US": "https://trends.google.com/trending/rss?geo=US",
    "HF": "https://huggingface.co/blog/feed.xml",
    "OAI": "https://openai.com/news/rss.xml",
    "GOOGLE": "https://blog.google/technology/ai/rss/"
}

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def parse_feed(data):
    if len(data)>MAX_BYTES:
        raise ValueError("Oversized XML")
    text=data.decode('utf-8-sig',errors='strict')
    if '\x00' in text or re.search(r'<!\s*(DOCTYPE|ENTITY)',text,re.I):
        raise ValueError("Unsafe or oversized XML")
    root=ET.fromstring(text)
    if root.tag!="rss":
        raise ValueError("Unexpected feed")
    out=[]
    for item in root.findall("./channel/item")[:30]:
        title=" ".join((item.findtext("title") or "").split())[:180]
        date=" ".join((item.findtext("pubDate") or "").split())[:100]
        if title:
            out.append({"title":title,"published":date})
    return out

def collect():
    opener=build_opener(NoRedirect())
    result={"checkedAt":datetime.now(timezone.utc).isoformat(),"notice":"Tendencias generales y publicaciones de proveedores; no prueban demanda comercial, acceso gratuito ni rentabilidad.","feeds":{}}
    for geo,url in FEEDS.items():
        try:
            with opener.open(Request(url,headers={"User-Agent":"MonetizaOS-Research/1.0","Accept":"application/rss+xml,application/xml,text/xml"}),timeout=15) as response:
                data=response.read(MAX_BYTES+1)
            items=parse_feed(data)
            result["feeds"][geo]={"status":"OK" if items else "EMPTY","source":url,"items":items}
        except Exception as e:
            result["feeds"][geo]={"status":"UNAVAILABLE","source":url,"items":[],"error":type(e).__name__}
    return result

if __name__=="__main__":
    result=collect()
    Path(sys.argv[1] if len(sys.argv)>1 else "trend-report.json").write_text(json.dumps(result,ensure_ascii=True,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(result,ensure_ascii=True,indent=2))
    sys.exit(0 if all(result["feeds"][k]["status"]=="OK" for k in ("DO","US")) and any(result["feeds"][k]["status"]=="OK" for k in ("HF","OAI","GOOGLE")) else 1)
