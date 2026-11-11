// Red Station One - batch 4: I01 I03 R01 R03 Z01 P01 P02 P03 P04 P06 (with variants)
(function () {
  const { T, DUST, rng, mix, skinMat, mats, xCyl, yCyl, zCyl, strut, box, boxT, ball, torus } = KIT;
  const D = .42, CY = 2.5, G = name => { const g = new T.Group(); g.name = name; return g; };
  const TAN = [0.74, 0.65, 0.50], PALE = [0.78, 0.74, 0.66], PANEL = [0.66, 0.6, 0.5], GREY = [0.36, 0.36, 0.35];
  const sh = m => { m.castShadow = m.receiveShadow = true; return m; };
  function roundDoor(M, x, y, r, name) { const g = G(name || 'round_door'); g.add(xCyl(r + .16, r + .16, .12, x, y, 0, M.metal, { name: 'door_frame' })); g.add(xCyl(r, r, .1, x + .05, y, 0, M.white, { name: 'door' })); g.add(torus(r + .05, .03, x + .09, y, 0, M.steel, 'x', 'seal'));
    g.add(xCyl(.14, .14, .05, x + .1, y + r * .35, 0, M.glass, { seg: 20, name: 'porthole' })); g.add(torus(r * .42, .022, x + .12, y - r * .2, 0, M.steel, 'x', 'handwheel')); return g; }

  // ---------- I01 rover garage ----------
  function I01(nDoors) { const M = mats(D), root = G('I01_rover_garage_' + nDoors + 'door'), L = 10, Wd = 8, Hh = 3.5, y0 = .3, fz = Wd / 2;
    const wall = skinMat('garage_wall', { seed: 201, dust: D, base: PANEL, nU: 8, nV: 2, p: .06, h: 'up', depth: 2.2 });
    root.add(box(L + .5, y0, Wd + .5, 0, y0 / 2, 0, M.lowMetal, 'foundation_slab')); root.add(boxT(L, Hh, Wd, 0, y0 + Hh / 2, 0, wall, M.tan, 'hall'));
    const roof = zCyl(L / 2, Wd + .3, 0, y0 + Hh, 0, M.tan, { seg: 48, name: 'arched_roof' }); roof.scale.y = .26; root.add(roof);
    for (const z of [-fz - .1, 0, fz + .1]) { const rb = zCyl(L / 2 + .04, .14, 0, y0 + Hh, z, M.metal, { seg: 48, open: true, name: 'roof_rib' }); rb.scale.y = .27; root.add(rb); }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) root.add(box(.22, Hh, .22, sx * (L / 2 - .02), y0 + Hh / 2, sz * (fz - .02), M.metal, 'corner_post'));
    root.add(box(L + .06, .09, .03, 0, y0 + Hh - .22, fz + .03, M.orange, 'accent_stripe'));
    const slat = skinMat('rollup_door', { W: 512, H: 512, seed: 202, dust: D, base: GREY, nV: 11, p: .25, h: 'up', depth: 4 }, { roughness: .6, metalness: .5 });
    const dw = nDoors === 1 ? 4.6 : 2.5, dh = 3.0, xs = nDoors === 1 ? [0] : [-3.1, 0, 3.1];
    xs.forEach(x => { const d = G('rollup_door'); d.add(boxT(dw, dh, .08, x, y0 + dh / 2, fz + .03, slat, M.metal, 'door_slats')); d.add(box(dw + .3, .22, .2, x, y0 + dh + .11, fz + .06, M.metal, 'door_header')); for (const s of [-1, 1]) d.add(box(.16, dh, .16, x + s * (dw / 2 + .08), y0 + dh / 2, fz + .05, M.metal, 'door_jamb'));
      d.add(box(dw - .2, .1, .04, x, y0 + .12, fz + .08, M.orange, 'door_bottom_bar')); const l = box(.5, .08, .14, x, y0 + dh + .32, fz + .12, M.lamp, 'door_light'); d.add(l);
      const rp = box(dw + .4, .1, 2.6, x, y0 / 2 - .01, fz + 1.5, M.lowMetal, 'ramp'); rp.rotation.x = Math.atan2(y0, 2.6); d.add(rp); for (let k = 0; k < 8; k++) { const r = box(dw + .3, .03, .06, x, y0 - .03 - k * y0 / 8.6, fz + .45 + k * .3, M.metal, 'ramp_rib'); d.add(r); } root.add(d); });
    const al = G('side_airlock'); al.add(box(.5, 2.4, 1.5, L / 2 + .25, y0 + 1.2, -1.5, M.tan, 'airlock_box')); al.add(box(.06, 2.0, 1.0, L / 2 + .52, y0 + 1.05, -1.5, M.white, 'airlock_door')); al.add(xCyl(.16, .16, .05, L / 2 + .55, y0 + 1.55, -1.5, M.glass, { seg: 18, name: 'door_window' })); al.add(box(.06, 2.2, .08, L / 2 + .52, y0 + 1.15, -.95, M.orange)); al.add(box(.7, .12, 1.3, L / 2 + .85, y0 - .06, -1.5, M.lowMetal, 'step')); al.add(ball(.04, L / 2 + .53, y0 + 2.25, -1.5, M.lamp, { seg: 8, rows: 6 })); root.add(al);
    root.add(box(1.4, .7, 1.1, -2.6, y0 + Hh + 1.45, -1.4, M.metal, 'roof_vent_unit')); root.add(yCyl(.35, .35, .1, -2.6, y0 + Hh + 1.8, -1.4, M.black, { seg: 20, name: 'roof_fan' })); root.add(strut([3, y0 + Hh + 1.0, -2], [3, y0 + Hh + 2.6, -2], .025, M.steel, 'antenna'));
    for (const x of [-3.5, 0, 3.5]) root.add(box(.7, .5, .04, x, y0 + 2.4, -fz - .03, M.glass, 'rear_window'));
    return root; }

  // ---------- I03 inflatable storage tent ----------
  function I03(L) { L = L || 12; const dd = .7, M = mats(dd), root = G('I03_storage_tent_' + L + 'm'), R = 3;
    const mem = skinMat('membrane', { seed: 211, dust: dd, base: [0.8, 0.78, 0.72], nV: L, p: .5, h: 'xcyl', depth: 6 }, { roughness: .78, side: T.DoubleSide });
    root.add(xCyl(R, R, L, 0, .12, 0, mem, { open: true, seg: 48, ts: Math.PI, tl: Math.PI, name: 'membrane' }));
    const endMat = new T.MeshStandardMaterial({ name: 'membrane_end', color: mix(0xcfc9ba, DUST, .25), roughness: .8, side: T.DoubleSide });
    for (const s of [-1, 1]) { const e = sh(new T.Mesh(new T.SphereGeometry(R, 40, 12, 0, Math.PI, 0, Math.PI / 2), endMat)); e.rotation.y = s * Math.PI / 2; e.scale.set(1, 1, .22); e.position.set(s * L / 2, .12, 0); e.name = 'end_bulge'; root.add(e);
      const arch = sh(new T.Mesh(new T.TorusGeometry(R + .02, .07, 8, 32, Math.PI), M.metal)); arch.rotation.y = Math.PI / 2; arch.position.set(s * L / 2, .12, 0); arch.name = 'end_arch'; root.add(arch); }
    for (let i = 0; i <= Math.round(L / 3); i++) { const x = -L / 2 + 1.5 + i * 3; if (x > L / 2 - 1) break; const st = sh(new T.Mesh(new T.TorusGeometry(R + .04, .035, 6, 32, Math.PI), M.orange)); st.rotation.y = Math.PI / 2; st.position.set(x, .12, 0); st.name = 'anchor_strap'; root.add(st);
      for (const k of [-1, 1]) { root.add(strut([x, .15, k * (R + .04)], [x, .02, k * (R + .5)], .02, M.orange, 'strap_tail')); root.add(yCyl(.05, .03, .22, x, 0, k * (R + .5), M.steel, { seg: 8, name: 'ground_peg' })); } }
    for (const k of [-1, 1]) root.add(box(L, .14, .25, 0, .07, k * R, M.lowMetal, 'ground_beam'));
    const dx = L / 2 + R * .22; root.add(box(.08, 2.3, 1.9, dx - .02, 1.27, 0, M.metal, 'door_frame')); root.add(box(.06, 2.1, 1.6, dx + .03, 1.2, 0, new T.MeshStandardMaterial({ name: 'door_fabric', color: mix(0x8f8a7c, DUST, .25), roughness: .9 }), 'zip_door')); root.add(box(.03, 2.0, .04, dx + .07, 1.2, 0, M.steel, 'zipper')); root.add(box(.03, .04, 1.5, dx + .07, 2.2, 0, M.steel, 'zipper_top')); root.add(box(.6, .1, 1.9, dx + .3, .05, 0, M.lowMetal, 'door_mat'));
    root.add(box(.9, .8, .7, -L / 2 - 1.3, .5, 1.2, M.metal, 'inflation_blower')); root.add(box(1.0, .1, .8, -L / 2 - 1.3, .05, 1.2, M.lowMetal)); root.add(strut([-L / 2 - .85, .5, 1.2], [-L / 2 - .2, .6, .9], .11, M.black, 'air_hose')); root.add(yCyl(.2, .2, .06, -L / 2 - 1.3, .9, 1.2, M.black, { seg: 16, name: 'blower_fan' }));
    return root; }

  // ---------- R01 landing pad ----------
  function padTex(seed) { const S = 1024, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d'), r = rng(seed), h = S / 2, px = S / 30.6;
    g.fillStyle = '#7d5a45'; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 9000; i++) { g.fillStyle = r() < .5 ? `rgba(50,32,24,${.03 + r() * .08})` : `rgba(190,140,105,${.03 + r() * .07})`; const z = 2 + r() * r() * 30; g.beginPath(); g.ellipse(r() * S, r() * S, z, z * (.5 + r() * .5), r() * 3, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(40,26,20,.5)'; g.lineWidth = 2.5; for (let k = 1; k <= 7; k++) { g.beginPath(); g.arc(h, h, k * 2.1 * px, 0, 7); g.stroke(); const n = k * 6; for (let i = 0; i < n; i++) { const a = i / n * 6.2832 + k * .13; g.beginPath(); g.moveTo(h + Math.cos(a) * (k - 1) * 2.1 * px, h + Math.sin(a) * (k - 1) * 2.1 * px); g.lineTo(h + Math.cos(a) * k * 2.1 * px, h + Math.sin(a) * k * 2.1 * px); g.stroke(); } }
    g.strokeStyle = 'rgba(232,226,212,.82)'; g.lineWidth = .55 * px; g.beginPath(); g.arc(h, h, 11 * px, 0, 7); g.stroke(); g.lineWidth = .3 * px; g.setLineDash([1.2 * px, 1.2 * px]); g.beginPath(); g.arc(h, h, 14.2 * px, 0, 7); g.stroke(); g.setLineDash([]);
    g.lineWidth = .45 * px; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; g.beginPath(); g.moveTo(h + Math.cos(a) * 3.5 * px, h + Math.sin(a) * 3.5 * px); g.lineTo(h + Math.cos(a) * 6.5 * px, h + Math.sin(a) * 6.5 * px); g.stroke(); }
    const sc = g.createRadialGradient(h, h, 0, h, h, 10.5 * px); sc.addColorStop(0, 'rgba(12,10,9,.93)'); sc.addColorStop(.45, 'rgba(22,17,14,.72)'); sc.addColorStop(1, 'rgba(30,22,18,0)'); g.fillStyle = sc; g.fillRect(0, 0, S, S);
    for (let i = 0; i < 90; i++) { const a = r() * 6.2832, l = (5 + r() * 8) * px; const gr = g.createLinearGradient(h, h, h + Math.cos(a) * l, h + Math.sin(a) * l); gr.addColorStop(0, 'rgba(10,8,7,.35)'); gr.addColorStop(1, 'rgba(10,8,7,0)'); g.strokeStyle = gr; g.lineWidth = (.15 + r() * .5) * px; g.beginPath(); g.moveTo(h, h); g.lineTo(h + Math.cos(a) * l, h + Math.sin(a) * l); g.stroke(); }
    const ed = g.createRadialGradient(h, h, 11.5 * px, h, h, 15.3 * px); ed.addColorStop(0, 'rgba(165,85,47,0)'); ed.addColorStop(1, 'rgba(165,85,47,.6)'); g.fillStyle = ed; g.fillRect(0, 0, S, S);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; t.name = 'pad_basecolor'; return t; }
  function R01() { const M = mats(D), root = G('R01_landing_pad_simple'), R = 15;
    const top = new T.MeshStandardMaterial({ name: 'pad_surface', map: padTex(301), roughness: .92 }), side = new T.MeshStandardMaterial({ name: 'pad_edge', color: mix(0x6b4a39, DUST, .4), roughness: 1 });
    const p = new T.Mesh(new T.CylinderGeometry(R, R + .5, .28, 96), [side, top, side]); p.position.y = .14; p.receiveShadow = true; p.castShadow = true; p.name = 'pad'; root.add(p);
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2, x = Math.cos(a) * (R + 1), z = Math.sin(a) * (R + 1), l = G('landing_light'); l.add(yCyl(.22, .18, .08, x, 0, z, M.lowMetal, { seg: 14 })); l.add(yCyl(.05, .05, .7, x, .08, z, M.steel, { seg: 10 })); l.add(box(.26, .16, .26, x, .86, z, M.metal)); l.add(ball(.09, x, .98, z, M.lamp, { seg: 12, rows: 8, name: 'lamp' })); root.add(l); }
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.2832 + .26; root.add(yCyl(.07, .07, .06, Math.cos(a) * 14.2, .28, Math.sin(a) * 14.2, i % 3 ? M.metal : M.lamp, { seg: 10, name: 'edge_marker' })); }
    return root; }

  // ---------- R03 landed Starship ----------
  function shipTex(kind, seed, clean) { const W = 2048, H = 2048, r = rng(seed), c = document.createElement('canvas'), c2 = document.createElement('canvas'); c.width = c2.width = W; c.height = c2.height = H; const g = c.getContext('2d'), g2 = c2.getContext('2d');
    const y2v = y => H - (y - 2.2) / 47.8 * H, mPerU = W / 28.3; // px per metre around the barrel
    g.fillStyle = '#9b9c9f'; g.fillRect(0, 0, W, H); g2.fillStyle = 'rgb(0,95,235)'; g2.fillRect(0, 0, W, H);
    for (let i = 0; i < 5000; i++) { g.fillStyle = r() < .5 ? `rgba(60,62,66,${.03 + r() * .06})` : `rgba(215,218,222,${.03 + r() * .06})`; g.fillRect(r() * W, r() * H, 2 + r() * 5, 30 + r() * 260); }
    for (let y = 2.2; y < 50; y += 1.83) { g.fillStyle = 'rgba(52,54,58,.5)'; g.fillRect(0, y2v(y), W, 2.5); g.fillStyle = 'rgba(225,228,232,.28)'; g.fillRect(0, y2v(y) + 3, W, 5); g.fillStyle = `rgba(${70 + r() * 30},${72 + r() * 30},${80 + r() * 40},${.05 + r() * .09})`; g.fillRect(0, y2v(y + 1.83), W, 1.83 / 47.8 * H); }
    // heat shield: u .25 .. .75
    const x0 = W * .25, x1 = W * .75; g.fillStyle = '#0c0c0e'; g.fillRect(x0, 0, x1 - x0, H); g2.fillStyle = 'rgb(0,215,20)'; g2.fillRect(x0, 0, x1 - x0, H);
    const tw = 12, th = 14; for (let j = 0; j < H / th; j++) for (let i = 0; i < (x1 - x0) / tw; i++) { const v = 10 + r() * 14; g.fillStyle = `rgb(${v},${v},${v + 2})`; g.fillRect(x0 + i * tw + (j % 2 ? tw / 2 : 0) + 1, j * th + 1, tw - 2, th - 2); if (r() < .004) { g.fillStyle = 'rgba(190,190,185,.8)'; g.fillRect(x0 + i * tw + 1, j * th + 1, tw - 2, th - 2); } }
    for (const xe of [x0, x1]) { for (let y = 0; y < H; y += th) { const o = (r() - .5) * 14; g.fillStyle = '#0d0d0f'; g.fillRect(xe - 7 + o, y, 14, th); g2.fillStyle = 'rgb(0,215,20)'; g2.fillRect(xe - 7 + o, y, 14, th); } }
    const lee = (u0, u1, yA, yB, fn) => { for (const off of [0, W]) fn(off + u0 * mPerU, y2v(yB), (u1 - u0) * mPerU, y2v(yA) - y2v(yB)); };
    if (kind === 'crew') { for (const [yA, n] of [[38.6, 4], [36.4, 5], [34.2, 5]]) for (let i = 0; i < n; i++) { const u = (i - (n - 1) / 2) * 1.5; lee(u - .45, u + .45, yA, yA + 1.25, (x, y, w, h) => { g.fillStyle = '#3a3c40'; g.fillRect(x - 5, y - 5, w + 10, h + 10); g.fillStyle = '#0a0d12'; g.fillRect(x, y, w, h); g2.fillStyle = 'rgb(0,30,160)'; g2.fillRect(x, y, w, h); }); }
      lee(-.9, .9, 8, 10.6, (x, y, w, h) => { g.strokeStyle = 'rgba(40,42,46,.85)'; g.lineWidth = 4; g.strokeRect(x, y, w, h); }); }
    if (kind === 'cargo') { lee(-3.2, 3.2, 26, 37.5, (x, y, w, h) => { g.strokeStyle = 'rgba(38,40,44,.9)'; g.lineWidth = 6; g.strokeRect(x, y, w, h); g.fillStyle = 'rgba(120,122,128,.25)'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(38,40,44,.9)'; for (let k = 0; k < 5; k++) g.fillRect(x - 10, y + h * (k + .5) / 5 - 14, 20, 28); });
      lee(-1.2, 1.2, 6, 9.5, (x, y, w, h) => { g.strokeStyle = 'rgba(40,42,46,.85)'; g.lineWidth = 4; g.strokeRect(x, y, w, h); }); }
    if (kind === 'tanker') { for (const y of [14, 15.2]) { g.fillStyle = 'rgba(45,47,52,.8)'; g.fillRect(0, y2v(y + .5), x0 - 8, .5 / 47.8 * H); g.fillRect(x1 + 8, y2v(y + .5), W - x1, .5 / 47.8 * H); }
      lee(-.5, .5, 10, 30, (x, y, w, h) => { g.fillStyle = 'rgba(70,72,78,.75)'; g.fillRect(x + w * .25, y, w * .5, h); }); lee(-.8, .8, 9, 10.2, (x, y, w, h) => { g.fillStyle = '#2c2e33'; g.fillRect(x, y, w, h); }); }
    if (!clean) {
    // frost-free scorch + dust at the base
    const sg = g.createLinearGradient(0, H, 0, H - H * .12); sg.addColorStop(0, 'rgba(60,35,22,.78)'); sg.addColorStop(.5, 'rgba(120,70,42,.3)'); sg.addColorStop(1, 'rgba(120,70,42,0)'); g.fillStyle = sg; g.fillRect(0, H - H * .12, W, H * .12);
    const sr = g2.createLinearGradient(0, H, 0, H - H * .08); sr.addColorStop(0, 'rgba(0,225,30,.85)'); sr.addColorStop(1, 'rgba(0,225,30,0)'); g2.fillStyle = sr; g2.fillRect(0, H - H * .08, W, H * .08);
    }
    const map = new T.CanvasTexture(c); map.encoding = T.sRGBEncoding; map.wrapS = T.RepeatWrapping; map.anisotropy = 8; map.name = 'ship_basecolor'; const orm = new T.CanvasTexture(c2); orm.wrapS = T.RepeatWrapping; orm.anisotropy = 8; orm.name = 'ship_roughness_metalness'; return { map, orm }; }
  function R03(kind) { const M = mats(D), root = G('R03_starship_landed_' + kind), tx = shipTex(kind, 310 + kind.length);
    const hull = new T.MeshStandardMaterial({ name: 'ship_hull', map: tx.map, roughnessMap: tx.orm, metalnessMap: tx.orm, roughness: 1, metalness: 1, side: T.DoubleSide });
    const steel = new T.MeshStandardMaterial({ name: 'ship_steel', color: 0x8e8f93, roughness: .38, metalness: .92 }), tile = new T.MeshStandardMaterial({ name: 'heat_tiles', color: 0x0d0d0f, roughness: .85, metalness: .05 }), dark = new T.MeshStandardMaterial({ name: 'engine_dark', color: mix(0x232326, DUST, .2), roughness: .6, metalness: .7 });
    const pts = []; for (let i = 0; i <= 60; i++) { const y = 2.2 + i * 47.8 / 60, t = Math.max(0, (y - 33) / 17); pts.push(new T.Vector2(i === 60 ? .02 : 4.5 * Math.pow(1 - t * t, .78), y)); }
    const body = sh(new T.Mesh(new T.LatheGeometry(pts, 72), hull)); body.name = 'hull'; root.add(body);
    root.add(yCyl(4.5, 4.5, 1.4, 0, .85, 0, dark, { seg: 72, open: true, name: 'engine_skirt' })); root.add(yCyl(4.4, 4.4, .1, 0, 2.1, 0, dark, { seg: 48, name: 'thrust_plate' }));
    for (let i = 0; i < 3; i++) { const a = i * 2.094, b = a + 1.047; root.add(yCyl(.62, .32, 1.1, Math.cos(a) * 1.0, .75, Math.sin(a) * 1.0, dark, { seg: 20, open: true, name: 'sea_level_engine' })); root.add(yCyl(1.15, .4, 1.5, Math.cos(b) * 2.9, .55, Math.sin(b) * 2.9, dark, { seg: 24, open: true, name: 'vacuum_engine' })); }
    for (let i = 0; i < 6; i++) { const a = i * 1.0472 + .52, c = Math.cos(a), s = Math.sin(a), l = G('landing_leg'); l.add(strut([c * 4.45, 2.6, s * 4.45], [c * 5.3, .25, s * 5.3], .16, steel, 'leg')); l.add(strut([c * 4.45, 1.0, s * 4.45], [c * 5.25, .35, s * 5.25], .09, steel, 'leg_brace')); l.add(yCyl(.55, .45, .2, c * 5.3, 0, s * 5.3, M.lowMetal, { seg: 18, name: 'footpad' })); root.add(l); }
    const flap = (ptsF, name, sx) => { const shp = new T.Shape(); ptsF.forEach(([x, y], i) => i ? shp.lineTo(x, y) : shp.moveTo(x, y)); shp.closePath(); const g = G(name);
      const a = sh(new T.Mesh(new T.ExtrudeGeometry(shp, { depth: .32, bevelEnabled: false }), steel)); a.position.z = -.06; const b = sh(new T.Mesh(new T.ExtrudeGeometry(shp, { depth: .1, bevelEnabled: false }), tile)); b.position.z = -.16; g.add(a); g.add(b); g.scale.x = sx; return g; };
    for (const sx of [-1, 1]) { root.add(flap([[4.25, 35], [7.1, 35.4], [6.3, 40.6], [3.55, 42.2]], 'forward_flap', sx)); root.add(flap([[4.4, 3.2], [8.3, 3.2], [8.3, 9.2], [4.4, 15.5]], 'aft_flap', sx)); root.add(yCyl(.35, .35, 12.5, sx * 4.5, 3.1, 0, steel, { seg: 16, name: 'aft_hinge_fairing' })); }
    if (kind !== 'tanker') { const lift = G('cargo_lift'); lift.add(box(2.2, .12, 1.6, 0, .3, 5.6, M.metal, 'lift_platform')); for (const k of [-1, 1]) lift.add(strut([k * 1.0, .3, 4.9], [k * 1.0, 9.6, 4.62], .05, M.steel, 'lift_rail')); lift.add(box(2.3, .3, .5, 0, 9.6, 4.75, M.metal, 'lift_winch')); root.add(lift); }
    else { root.add(strut([0, 9.6, 4.55], [0, 9.6, 5.2], .16, steel, 'fill_port')); root.add(zCyl(.24, .08, 0, 9.6, 5.2, M.orange, { seg: 18, name: 'fill_flange' })); }
    return root; }

  // ---------- Z01 command hub ----------
  function Z01() { const M = mats(D), root = G('Z01_command_hub'), R = 4.33, y0 = .5, Hh = 4, rot = Math.PI / 8;
    const wall = skinMat('hub_wall', { seed: 401, dust: D, base: TAN, nU: 8, nV: 3, p: .08, h: 'up', depth: 2.4 });
    const oct = (rB, rT, h, y, mat, name, open) => { const m = yCyl(rB, rT, h, 0, y, 0, mat, { seg: 8, open, name }); m.rotation.y = rot; return m; };
    root.add(oct(R + .25, R + .2, y0, 0, M.lowMetal, 'foundation')); root.add(oct(R, R, Hh, y0, wall, 'hub_body', true));
    root.add(oct(R + .05, R + .05, .9, y0 + 2.1, M.glass, 'window_band', true)); for (const y of [2.02, 3.0]) root.add(oct(R + .09, R + .09, .1, y0 + y, M.metal, 'window_rail'));
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + rot; root.add(box(.2, Hh, .2, Math.sin(a) * (R + .02), y0 + Hh / 2, Math.cos(a) * (R + .02), M.metal, 'corner_post'));
      for (const k of [-1, 1]) { const b = i * Math.PI / 4 + k * .13; const mr = R * Math.cos(Math.PI / 8) / Math.cos(k * .13 * 1) + .06; root.add(box(.06, .9, .06, Math.sin(b) * mr, y0 + 2.55, Math.cos(b) * mr, M.metal, 'mullion')); } }
    root.add(oct(R + .12, R + .12, .14, y0 + Hh, M.metal, 'roof_edge')); root.add(oct(R, 2.6, .7, y0 + Hh + .14, M.tan, 'roof')); root.add(oct(2.6, 2.4, .25, y0 + Hh + .84, M.metal, 'roof_deck')); root.add(oct(R + .03, R + .03, .08, y0 + 3.55, M.orange, 'accent_stripe', true));
    const ry = y0 + Hh + 1.09; root.add(yCyl(.3, .22, .5, 0, ry, 0, M.metal, { seg: 16, name: 'mast_base' })); root.add(strut([0, ry + .5, 0], [0, ry + 5.2, 0], .05, M.steel, 'antenna_mast')); root.add(strut([0, ry + 5.2, 0], [0, ry + 6.0, 0], .035, M.orange, 'mast_tip')); root.add(ball(.07, 0, ry + 6.05, 0, M.lamp, { seg: 10, rows: 8 }));
    for (const [h, l] of [[2.2, .8], [3.4, .55]]) { root.add(strut([-l, ry + h, 0], [l, ry + h, 0], .02, M.steel, 'crossbar')); root.add(strut([0, ry + h, -l], [0, ry + h, l], .02, M.steel, 'crossbar')); }
    const dm = new T.MeshStandardMaterial({ name: 'dish_white', color: mix(0xcfc8b8, DUST, .15), roughness: .7, side: T.DoubleSide }); const dish = ball(.9, 1.5, ry + .95, -.6, dm, { seg: 28, rows: 10, pl: 1.0, name: 'roof_dish' }); dish.scale.y = .42; dish.rotation.set(Math.PI - .6, .6, 0); root.add(dish); root.add(strut([1.5, ry, -.6], [1.5, ry + .85, -.6], .05, M.steel, 'dish_post'));
    root.add(box(1.2, .5, .9, -1.3, ry + .25, .9, M.metal, 'roof_unit')); const rd = box(1.6, .05, 1.0, -.9, ry + .35, -1.3, M.radiator, 'roof_radiator'); rd.rotation.x = -.4; root.add(rd);
    const wingWall = skinMat('wing_wall', { W: 512, H: 256, seed: 402, dust: D, base: TAN, nU: 3, nV: 2, p: .06, h: 'up', depth: 2.2 });
    for (let i = 0; i < 4; i++) { const w = G('wing_module'), x0 = 4.0, wl = 3.2; w.add(box(wl, .5, 3.0, x0 + wl / 2, .25, 0, M.lowMetal, 'wing_foundation')); w.add(boxT(wl, 2.9, 2.8, x0 + wl / 2, .5 + 1.45, 0, wingWall, M.tan, 'wing_body')); w.add(box(wl + .05, .1, 2.9, x0 + wl / 2, 3.45, 0, M.metal, 'wing_roof_edge'));
      w.add(roundDoor(M, x0 + wl + .03, 2.05, .62, 'wing_hatch')); for (const k of [-1, 1]) { w.add(box(1.1, .45, .04, x0 + 1.7, 2.35, k * 1.42, M.glass, 'wing_window')); w.add(box(1.2, .55, .03, x0 + 1.7, 2.35, k * 1.405, M.metal, 'wing_window_frame')); }
      w.add(box(.9, .1, 1.4, x0 + wl + .5, .45, 0, M.metal, 'wing_step')); w.add(box(.9, .1, 1.2, x0 + wl + 1.0, .2, 0, M.metal, 'wing_step')); if (i % 2) { const p = box(1.6, .05, 1.2, x0 + 1.6, 3.75, 0, M.radiator, 'wing_radiator'); p.rotation.z = .25; w.add(p); } else w.add(box(.9, .4, .9, x0 + 1.6, 3.7, 0, M.metal, 'wing_vent'));
      w.rotation.y = i * Math.PI / 2; root.add(w); }
    return root; }

  // ---------- P parts ----------
  function P01() { const M = mats(D), root = G('P01_whip_antenna'); root.add(yCyl(.26, .24, .05, 0, 0, 0, M.lowMetal, { seg: 20, name: 'base_plate' })); root.add(yCyl(.07, .05, .18, 0, .05, 0, M.metal, { seg: 14, name: 'mount' }));
    for (let i = 0; i < 5; i++) root.add(torus(.045, .012, 0, .25 + i * .03, 0, M.steel, 'y', 'spring')); root.add(yCyl(.014, .006, 1.6, 0, .38, 0, M.steel, { seg: 8, name: 'whip_rod' })); root.add(ball(.03, 0, 2.0, 0, M.lamp, { seg: 10, rows: 8, name: 'blink_light' }));
    for (let i = 0; i < 3; i++) { const a = i * 2.094; root.add(yCyl(.02, .02, .03, Math.cos(a) * .19, .05, Math.sin(a) * .19, M.steel, { seg: 6, name: 'bolt' })); } return root; }
  function P02() { const M = mats(D), root = G('P02_satellite_dish_small'); root.add(box(.6, .05, .6, 0, .025, 0, M.lowMetal, 'base_plate')); root.add(yCyl(.06, .05, .55, 0, .05, 0, M.steel, { seg: 12, name: 'post' })); root.add(yCyl(.09, .09, .1, 0, .6, 0, M.metal, { seg: 14, name: 'swivel' }));
    for (const k of [-1, 1]) root.add(box(.04, .3, .1, k * .14, .82, 0, M.metal, 'yoke')); root.add(strut([-.16, .9, 0], [.16, .9, 0], .025, M.steel, 'pivot'));
    const hd = G('dish_head'), dm = new T.MeshStandardMaterial({ name: 'dish_white', color: mix(0xcfc8b8, DUST, .15), roughness: .7, side: T.DoubleSide }); const d = ball(.82, 0, .78, 0, dm, { seg: 32, rows: 12, pl: .82, name: 'dish' }); d.rotation.x = Math.PI; d.position.y = .78; hd.add(d); hd.add(torus(.6, .012, 0, .22, 0, M.metal, 'y', 'dish_rim'));
    for (let i = 0; i < 3; i++) { const a = i * 2.094; hd.add(strut([Math.cos(a) * .58, .22, Math.sin(a) * .58], [0, .62, 0], .01, M.steel, 'feed_strut')); } hd.add(yCyl(.05, .035, .1, 0, .58, 0, M.metal, { seg: 12, name: 'feed_horn' })); hd.add(box(.16, .1, .12, 0, -.08, 0, M.metal, 'actuator'));
    hd.position.y = .9; hd.rotation.x = .7; root.add(hd); return root; }
  function P03() { const M = mats(D), root = G('P03_radiator_panel'), W3 = 3, H3 = 1.5; root.add(box(W3 + .2, .08, .5, 0, .04, 0, M.lowMetal, 'mount_rail'));
    const pn = G('panel'); pn.add(box(W3, .06, .06, 0, H3, 0, M.steel, 'frame')); pn.add(box(W3, .06, .06, 0, 0, 0, M.steel, 'frame')); for (const k of [-1, 0, 1]) pn.add(box(.06, H3, .06, k * (W3 / 2 - .03), H3 / 2, 0, M.steel, 'frame'));
    pn.add(box(W3 - .1, H3 - .1, .012, 0, H3 / 2, 0, M.radiator, 'back_sheet')); for (let i = 0; i < 44; i++) pn.add(box(.012, H3 - .12, .07, -W3 / 2 + .1 + i * (W3 - .2) / 43, H3 / 2, .03, M.radiator, 'fin'));
    pn.add(strut([-W3 / 2 + .05, .1, -.05], [W3 / 2 - .05, .1, -.05], .025, M.orange, 'coolant_line')); pn.add(strut([-W3 / 2 + .05, H3 - .1, -.05], [W3 / 2 - .05, H3 - .1, -.05], .025, M.steel, 'coolant_line')); pn.position.set(0, .16, .12); pn.rotation.x = -.42; root.add(pn);
    for (const k of [-1, 1]) { root.add(box(.1, .2, .16, k * 1.1, .14, .12, M.metal, 'hinge')); root.add(strut([k * 1.1, .08, -.2], [k * 1.1, .95, -.22], .025, M.steel, 'prop_strut')); } root.add(box(.25, .2, .2, W3 / 2 + .05, .14, .1, M.metal, 'coolant_coupling')); return root; }
  function P04() { const M = mats(D), root = G('P04_air_handling_unit'), wall = skinMat('unit_wall', { W: 256, H: 256, seed: 441, dust: D, base: PANEL, nU: 2, nV: 1, p: .06, h: 'up', depth: 2 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) root.add(box(.12, .12, .12, sx * .62, .06, sz * .4, M.lowMetal, 'foot')); root.add(boxT(1.5, .9, 1.0, 0, .57, 0, wall, M.tan, 'housing')); root.add(box(1.54, .05, 1.04, 0, 1.03, 0, M.metal, 'top_rim'));
    for (const x of [-.37, .37]) { root.add(yCyl(.32, .32, .1, x, 1.03, 0, M.metal, { seg: 24, open: true, name: 'fan_shroud' })); root.add(yCyl(.3, .3, .02, x, 1.04, 0, M.black, { seg: 24, name: 'fan_well' })); for (let i = 0; i < 5; i++) { const b = box(.26, .012, .09, x + Math.cos(i * 1.2566) * .14, 1.08, Math.sin(i * 1.2566) * .14, M.steel, 'fan_blade'); b.rotation.y = -i * 1.2566; b.rotation.z = .25; root.add(b); }
      root.add(yCyl(.06, .06, .06, x, 1.06, 0, M.metal, { seg: 12, name: 'fan_hub' })); for (const r of [.16, .3]) root.add(torus(r, .008, x, 1.14, 0, M.steel, 'y', 'fan_guard')); for (let i = 0; i < 4; i++) root.add(strut([x - Math.cos(i * .785) * .3, 1.14, -Math.sin(i * .785) * .3], [x + Math.cos(i * .785) * .3, 1.14, Math.sin(i * .785) * .3], .006, M.steel, 'fan_guard')); }
    for (const k of [-1, 1]) { root.add(box(1.1, .5, .03, 0, .6, k * .51, M.metal, 'grille_frame')); for (let i = 0; i < 7; i++) { const s = box(1.0, .045, .03, 0, .42 + i * .06, k * .525, M.black, 'louver'); s.rotation.x = k * .5; root.add(s); } }
    root.add(box(.03, .3, .4, .765, .6, 0, M.metal, 'service_panel')); root.add(xCyl(.12, .12, .25, -.87, .5, 0, M.steel, { seg: 16, name: 'duct_stub' })); root.add(box(1.52, .05, .02, 0, .93, .51, M.orange, 'accent_stripe')); return root; }
  function P06() { const M = mats(D), root = G('P06_airlock_module'), L = 3, Hh = 2.5, Wd = 2.3, y0 = .35, wall = skinMat('airlock_wall', { W: 512, H: 256, seed: 461, dust: D, base: TAN, nU: 3, nV: 2, p: .06, h: 'up', depth: 2.2 });
    for (const k of [-1, 1]) root.add(box(L + .2, y0, .25, 0, y0 / 2, k * .8, M.lowMetal, 'skid')); root.add(boxT(L, Hh, Wd, 0, y0 + Hh / 2, 0, wall, M.tan, 'chamber'));
    for (const sx of [-1, 1]) { root.add(box(.14, Hh + .1, Wd + .1, sx * (L / 2 - .04), y0 + Hh / 2, 0, M.metal, 'end_frame')); } root.add(box(L + .06, .1, Wd + .06, 0, y0 + Hh + .02, 0, M.metal, 'roof_edge'));
    root.add(roundDoor(M, L / 2 + .03, y0 + 1.2, .8, 'outer_door')); root.add(box(.05, .16, .3, L / 2 + .1, y0 + 1.2, .98, M.orange, 'hinge')); root.add(box(.05, .3, .22, L / 2 + .06, y0 + 1.3, -1.0, M.metal, 'control_pad')); root.add(ball(.03, L / 2 + .1, y0 + 1.4, -1.0, M.lamp, { seg: 8, rows: 6 })); const lt = box(.1, .08, .6, L / 2 + .08, y0 + 2.3, 0, M.lamp, 'door_light'); root.add(lt);
    root.add(box(.7, .08, 1.5, L / 2 + .45, y0 + .1, 0, M.metal, 'step')); root.add(box(.5, .08, 1.5, L / 2 + .95, .12, 0, M.metal, 'step_low')); for (const k of [-1, 1]) { root.add(strut([L / 2 + .15, y0 + .15, k * .78], [L / 2 + .15, y0 + 1.2, k * .78], .02, M.steel, 'handrail')); root.add(strut([L / 2 + .15, y0 + 1.2, k * .78], [L / 2 + 1.15, 1.0, k * .78], .02, M.steel, 'handrail')); root.add(strut([L / 2 + 1.15, 1.0, k * .78], [L / 2 + 1.15, .12, k * .78], .02, M.steel, 'handrail')); }
    for (const k of [-1, 1]) { root.add(box(.6, .45, .04, .2, y0 + 1.6, k * (Wd / 2 + .02), M.glass, 'window')); root.add(box(.7, .55, .03, .2, y0 + 1.6, k * (Wd / 2 + .005), M.metal, 'window_frame')); root.add(box(L - .3, .07, .02, 0, y0 + Hh - .3, k * (Wd / 2 + .02), M.orange, 'accent_stripe')); }
    root.add(xCyl(.95, .95, .1, -L / 2 - .05, y0 + 1.2, 0, M.metal, { name: 'inner_flange' })); root.add(xCyl(.7, .7, .12, -L / 2 - .05, y0 + 1.2, 0, new T.MeshStandardMaterial({ name: 'opening_dark', color: 0x0c0c0d, roughness: 1 }), { name: 'inner_opening' }));
    root.add(box(.8, .3, .6, -.6, y0 + Hh + .2, .3, M.metal, 'pump_unit')); root.add(xCyl(.16, .16, .7, .5, y0 + Hh + .2, -.5, M.orange, { seg: 16, name: 'air_bottle' })); root.add(xCyl(.16, .16, .7, .5, y0 + Hh + .2, -.1, M.white, { seg: 16, name: 'air_bottle' })); return root; }

  window.RSO_SHIP = { shipTex };
  window.RSO_MODELS = { I01_rover_garage_1door: () => I01(1), I01_rover_garage_3door: () => I01(3), I03_storage_tent_12m: () => I03(12), I03_storage_tent_8m: () => I03(8), R01_landing_pad_simple: R01,
    R03_starship_landed_crew: () => R03('crew'), R03_starship_landed_cargo: () => R03('cargo'), R03_starship_landed_tanker: () => R03('tanker'), Z01_command_hub: Z01, P01_whip_antenna: P01, P02_satellite_dish_small: P02, P03_radiator_panel: P03, P04_air_handling_unit: P04, P06_airlock_module: P06 };
})();
