import asyncio, base64, os, json
from playwright.async_api import async_playwright
S = os.path.dirname(os.path.abspath(__file__))
T = os.environ.get("THREE_DIR", os.path.join(S, "..", "node_modules", "three"))
rd = lambda p: open(p, encoding="utf-8").read()
libs = [rd(os.path.join(T, "build/three.min.js")), rd(os.path.join(T, "examples/js/exporters/GLTFExporter.js")),
        rd(os.path.join(T, "examples/js/loaders/GLTFLoader.js")), rd(os.path.join(S, "habitat.js"))]
PAGE = "<!doctype html><html><head><meta charset=utf-8><style>body{margin:0;background:#000}</style></head><body><canvas id=c></canvas>" + \
    "".join("<script>" + l.replace("</script>", "<\\/script>") + "</script>" for l in libs) + """
<script>
const T=THREE, cv=document.getElementById('c');
const rn=new T.WebGLRenderer({canvas:cv,antialias:true,preserveDrawingBuffer:true});
rn.setPixelRatio(2); rn.setSize(1200,760); rn.outputEncoding=T.sRGBEncoding; rn.toneMapping=T.ACESFilmicToneMapping; rn.toneMappingExposure=.85;
rn.shadowMap.enabled=true; rn.shadowMap.type=T.PCFSoftShadowMap;
const sc=new T.Scene(); sc.background=new T.Color(0xcfa57c); sc.fog=new T.Fog(0xcfa57c,60,220);
sc.add(new T.HemisphereLight(0xf4d2ae,0x7a4a30,.1));
const sun=new T.DirectionalLight(0xffe8cc,2.0); sun.position.set(16,11,9); sun.castShadow=true; sun.shadow.mapSize.set(4096,4096);
Object.assign(sun.shadow.camera,{left:-14,right:14,top:14,bottom:-14,near:1,far:60}); sun.shadow.bias=-.0004; sun.shadow.normalBias=.03; sc.add(sun);
const fill=new T.DirectionalLight(0xffc9a0,.2); fill.position.set(-10,5,-12); sc.add(fill);
const gc=document.createElement('canvas'); gc.width=gc.height=1024; {const g=gc.getContext('2d'); g.fillStyle='#8f5233'; g.fillRect(0,0,1024,1024); let s=5; const r=()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
 for(let i=0;i<9000;i++){const v=r(); g.fillStyle=v<.5?`rgba(60,30,18,${.05+r()*.12})`:`rgba(210,140,95,${.04+r()*.1})`; const z=1+r()*r()*26; g.beginPath(); g.ellipse(r()*1024,r()*1024,z,z*(.4+r()*.6),r()*3,0,7); g.fill();}}
const gt=new T.CanvasTexture(gc); gt.wrapS=gt.wrapT=T.RepeatWrapping; gt.repeat.set(40,40); gt.encoding=T.sRGBEncoding; gt.anisotropy=8;
const gr=new T.Mesh(new T.PlaneGeometry(600,600),new T.MeshStandardMaterial({map:gt,roughness:1})); gr.rotation.x=-Math.PI/2; gr.receiveShadow=true; sc.add(gr);
{let s=9; const r=()=>((s=(s*1664525+1013904223)>>>0)/4294967296); const rm=new T.MeshStandardMaterial({color:0x6b3d27,roughness:1,flatShading:true});
 for(let i=0;i<220;i++){const a=r()*6.28,d=4.5+r()*r()*60,z=.06+r()*r()*.45; const m=new T.Mesh(new T.DodecahedronGeometry(z,0),rm); m.position.set(Math.cos(a)*d,z*.3,Math.sin(a)*d*.8); m.scale.set(1,.6,.8+r()*.5); m.rotation.set(r()*3,r()*3,r()*3); m.castShadow=m.receiveShadow=true; sc.add(m);}}
{const e=document.createElement('canvas'); e.width=512; e.height=256; const g=e.getContext('2d'); const gd=g.createLinearGradient(0,0,0,256); gd.addColorStop(0,'#5c4632'); gd.addColorStop(.45,'#75604a'); gd.addColorStop(.52,'#3f2617'); gd.addColorStop(1,'#2a1810'); g.fillStyle=gd; g.fillRect(0,0,512,256);
 const sg=g.createRadialGradient(330,60,0,330,60,70); sg.addColorStop(0,'rgba(255,235,205,.9)'); sg.addColorStop(1,'rgba(255,245,225,0)'); g.fillStyle=sg; g.fillRect(0,0,512,256);
 const et=new T.CanvasTexture(e); et.mapping=T.EquirectangularReflectionMapping; et.encoding=T.sRGBEncoding; sc.environment=new T.PMREMGenerator(rn).fromEquirectangular(et).texture;}
const cam=new T.PerspectiveCamera(32,1200/760,.1,500);
let cur=null;
window.exportGLB=(key)=>new Promise(res=>{const obj=RSO_MODELS[key](); new T.GLTFExporter().parse(obj,buf=>{
  const u=new Uint8Array(buf); let s=''; for(let i=0;i<u.length;i+=32768) s+=String.fromCharCode.apply(null,u.subarray(i,i+32768)); res(btoa(s));},{binary:true});});
window.loadGLB=(b64)=>new Promise((res,rej)=>{const bin=atob(b64),u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  new T.GLTFLoader().parse(u.buffer,'',g=>{ if(cur)sc.remove(cur); cur=g.scene; let tris=0,meshes=0;
    cur.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;meshes++;tris+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;}});
    sc.add(cur); const b=new T.Box3().setFromObject(cur); res({tris,meshes,min:b.min.toArray(),max:b.max.toArray()});},rej);});
window.view=(p,t)=>{cam.position.set(...p); cam.lookAt(...t); rn.render(sc,cam);};
</script></body></html>"""

VIEWS = {"hero": ([10.5, 5.2, 11.5], [0, 2.1, 0]), "side": ([0, 2.6, 19], [0, 2.3, 0]), "end": ([15, 3.2, 3.5], [0, 2.3, 0]), "back": ([-11, 6.5, -11], [0, 2.1, 0])}
VIEWS_L = {"hero": ([13.5, 6.2, 14.5], [0, 2.0, 0]), "side": ([0, 2.6, 25], [0, 2.3, 0]), "end": ([19, 3.4, 4.5], [0, 2.3, 0]), "back": ([-14, 7.5, -14], [0, 2.0, 0])}

async def main():
    out = os.path.join(S, "..", "build", "out"); os.makedirs(out, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"])
        pg = await b.new_page(viewport={"width": 1200, "height": 760})
        pg.on("console", lambda m: print("console", m.type, m.text) if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: print("pageerror", e))
        await pg.set_content(PAGE)
        keys = await pg.evaluate("Object.keys(RSO_MODELS)")
        for k in keys:
            b64 = await pg.evaluate("k=>exportGLB(k)", k)
            data = base64.b64decode(b64)
            open(os.path.join(out, k + ".glb"), "wb").write(data)
            info = await pg.evaluate("b=>loadGLB(b)", b64)
            print(k, len(data) // 1024, "KB", json.dumps(info))
            for vn, (pos, tgt) in (VIEWS_L if k.startswith("W02") else VIEWS).items():
                await pg.evaluate("([p,t])=>view(p,t)", [pos, tgt])
                await pg.wait_for_timeout(150)
                await pg.locator("#c").screenshot(path=os.path.join(out, f"{k}_{vn}.png"))
        await b.close()
asyncio.run(main())
