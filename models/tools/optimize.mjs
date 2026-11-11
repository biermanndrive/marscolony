// Red Station One - prepares the GLB models for the browser.
// Reads models/glb/**, writes models/web/** with the same folder layout.
//
// Per model:
//  1. Plain-coloured opaque materials are folded into five shared surface classes
//     (matte paint, satin, dusty metal, metal, steel; each single- or double-sided).
//     The colour moves into the vertex colours, so every model uses the same few
//     materials and the prototype can share one material instance per class.
//  2. Textured, transparent and glowing materials stay as they are (deduplicated).
//     Window glass is renamed to "rso_window" so the scene can light it at night.
//  3. Node tree flattened, meshes with the same material joined, vertices welded.
//  4. Textures limited to 512 px and stored as WebP; geometry quantized and
//     compressed with meshopt (EXT_meshopt_compression, decoder ships with three r128).
//
// Usage (in models/):  npm install   then   node tools/optimize.mjs [filter]
import { NodeIO, Logger, PropertyType } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { dedup, flatten, join, weld, prune, quantize, textureCompress, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', 'glb'), OUT = path.join(HERE, '..', 'web');
const filter = process.argv[2] ? new RegExp(process.argv[2]) : null;
const MAX_TEX = 512;

// surface classes: [name, roughness, metallic]
function classify(r, m) {
  if (m >= .8) return ['steel', .42, .88];
  if (m >= .5) return ['metal', .6, .65];
  if (m >= .25) return ['dustymetal', .85, .35];
  if (r < .6) return ['satin', .45, .05];
  return ['matte', .85, 0];
}

await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });

function bakeClasses(doc) {
  const root = doc.getRoot(), shared = new Map();
  const hasTex = m => !!(m.getBaseColorTexture() || m.getNormalTexture() || m.getEmissiveTexture() || m.getMetallicRoughnessTexture() || m.getOcclusionTexture());
  const glows = m => m.getEmissiveFactor().some(v => v > 0);
  for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial(); if (!mat) continue;
    if (/window_glass/.test(mat.getName()) && glows(mat)) { mat.setName('rso_window'); continue; }
    if (hasTex(mat) || glows(mat) || mat.getAlphaMode() !== 'OPAQUE' || mat.getBaseColorFactor()[3] < 1) continue;
    const [cls, r, m] = classify(mat.getRoughnessFactor(), mat.getMetallicFactor()), ds = mat.getDoubleSided();
    const key = 'rso_' + cls + (ds ? '_ds' : '');
    if (!shared.has(key)) shared.set(key, doc.createMaterial(key).setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(r).setMetallicFactor(m).setDoubleSided(ds));
    const pos = prim.getAttribute('POSITION'), n = pos.getCount(), c = mat.getBaseColorFactor(), arr = new Float32Array(n * 3);
    const old = prim.getAttribute('COLOR_0');
    for (let i = 0; i < n; i++) { const o = old ? old.getElement(i, []) : [1, 1, 1]; arr[i * 3] = c[0] * o[0]; arr[i * 3 + 1] = c[1] * o[1]; arr[i * 3 + 2] = c[2] * o[2]; }
    prim.setAttribute('COLOR_0', doc.createAccessor().setType('VEC3').setArray(arr).setBuffer(pos.getBuffer()));
    // no texture on these surfaces, so the UVs are dead weight
    for (const sem of prim.listSemantics()) if (sem.startsWith('TEXCOORD_')) prim.setAttribute(sem, null);
    if (prim.getAttribute('TANGENT')) prim.setAttribute('TANGENT', null);
    prim.setMaterial(shared.get(key));
  }
}

const files = [];
for (const d of fs.readdirSync(SRC)) for (const f of fs.readdirSync(path.join(SRC, d))) if (f.endsWith('.glb') && (!filter || filter.test(f))) files.push([d, f]);
const report = [];
for (const [d, f] of files) {
  const src = path.join(SRC, d, f), dst = path.join(OUT, d, f);
  const doc = await io.read(src); doc.setLogger(new Logger(Logger.Verbosity.WARN));
  const before = { meshes: doc.getRoot().listMeshes().reduce((a, m) => a + m.listPrimitives().length, 0), mats: doc.getRoot().listMaterials().length };
  bakeClasses(doc);
  await doc.transform(
    // materials and textures first; deduplicating meshes before join would turn scaled
    // copies of one shape into a shared mesh, which join then misplaces
    dedup({ propertyTypes: [PropertyType.MATERIAL, PropertyType.TEXTURE] }), flatten(), join({ keepNamed: false }), weld(), dedup(), prune(),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [MAX_TEX, MAX_TEX], quality: 85 }),
    quantize({ quantizeColor: 8 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' })
  );
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  await io.write(dst, doc);
  const r = doc.getRoot(), after = { meshes: r.listMeshes().reduce((a, m) => a + m.listPrimitives().length, 0), mats: r.listMaterials().length };
  const row = { file: d + '/' + f, kbIn: fs.statSync(src).size >> 10, kbOut: fs.statSync(dst).size >> 10, meshesIn: before.meshes, meshesOut: after.meshes, matsIn: before.mats, matsOut: after.mats };
  report.push(row); console.log(Object.values(row).join('\t'));
}
const tot = report.reduce((a, r) => ({ i: a.i + r.kbIn, o: a.o + r.kbOut }), { i: 0, o: 0 });
console.log(`total ${(tot.i / 1024).toFixed(1)} MB -> ${(tot.o / 1024).toFixed(1)} MB in ${report.length} files`);
if (!filter) fs.writeFileSync(path.join(OUT, 'report.tsv'), 'file\tkb_in\tkb_out\tmeshes_in\tmeshes_out\tmaterials_in\tmaterials_out\n' + report.map(r => Object.values(r).join('\t')).join('\n') + '\n');
