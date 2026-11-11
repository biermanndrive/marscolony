// Red Station One - batch 2: W04 W05 E01 E03 E08 E09 E11 E12 E14 E16
(function () {
  const { T, DUST, rng, mix, skinMat, mats, xCyl, yCyl, zCyl, strut, box, boxT, ball, torus } = KIT;
  const D = .42, CY = 2.5; // dust level, habitat axis height
  const G = name => { const g = new T.Group(); g.name = name; return g; };
  const TAN = [0.74, 0.65, 0.50], GREY = [0.36, 0.36, 0.35], PALE = [0.78, 0.74, 0.66], PANEL = [0.66, 0.6, 0.5];

  // round docking port pointing +X from radius r0, rotated by angle a around Y
  function port(M, r0, a, y) { const g = G('docking_port');
    g.add(xCyl(.95, .95, .62, r0 + .28, y, 0, M.tan, { name: 'port_tunnel' })); g.add(xCyl(1.06, 1.06, .1, r0 + .6, y, 0, M.metal, { name: 'port_flange' }));
    g.add(xCyl(.62, .62, .08, r0 + .66, y, 0, M.white, { name: 'port_door' })); g.add(torus(.68, .035, r0 + .66, y, 0, M.steel, 'x', 'port_seal'));
    g.add(xCyl(.15, .15, .05, r0 + .7, y, 0, M.glass, { seg: 20, name: 'port_porthole' })); g.add(torus(.3, .025, r0 + .72, y, 0, M.steel, 'x', 'port_handwheel')); g.add(box(.03, .05, .6, r0 + .715, y, 0, M.steel)); g.add(box(.03, .6, .05, r0 + .715, y, 0, M.steel));
    for (let i = 0; i < 4; i++) { const b = Math.PI / 4 + i * Math.PI / 2; g.add(box(.1, .12, .12, r0 + .62, y + Math.sin(b) * .98, Math.cos(b) * .98, M.orange, 'port_latch')); }
    g.rotation.y = a; return g; }

  function W04(nPorts) { const M = mats(D), root = G('W04_habitat_node_' + nPorts + 'ports');
    const hull = skinMat('hull', { seed: 41, dust: D, base: TAN, nV: 4, h: 'up' });
    root.add(yCyl(1.4, 1.4, 2.2, 0, 1.4, 0, hull, { open: true, seg: 56, name: 'hull' }));
    root.add(ball(1.4, 0, 3.6, 0, M.tan, { pl: Math.PI / 2, sy: .38, name: 'top_dome' })); const bd = ball(1.4, 0, 1.4, 0, M.lowMetal, { pl: Math.PI / 2, sy: .3, name: 'bottom_dome' }); bd.rotation.x = Math.PI; root.add(bd);
    for (const y of [1.36, 3.56]) root.add(yCyl(1.45, 1.45, .1, 0, y, 0, M.metal, { seg: 56, name: 'ring' }));
    root.add(yCyl(1.415, 1.415, .06, 0, 3.36, 0, M.orange, { seg: 56, open: true, name: 'accent_stripe' }));
    root.add(yCyl(.52, .52, .3, 0, 4.02, 0, M.metal, { name: 'top_hatch_collar' })); root.add(yCyl(.45, .45, .08, 0, 4.3, 0, M.white, { name: 'top_hatch_lid' })); root.add(box(.4, .05, .05, 0, 4.42, 0, M.steel, 'top_hatch_handle'));
    for (let i = 0; i < 4; i++) { if (i < nPorts) root.add(port(M, 1.3, i * Math.PI / 2, CY));
      else { const p = G('service_panel'); p.add(box(.12, 1.5, 1.5, 1.42, CY, 0, M.metal)); for (let k = 0; k < 6; k++) p.add(box(.06, 1.3, .04, 1.5, CY, -.55 + k * .22, M.radiator, 'radiator_fin')); p.rotation.y = i * Math.PI / 2; root.add(p); } }
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), lg = G('leg');
      lg.add(box(.3, .26, .3, c * 1.3, 1.3, s * 1.3, M.metal, 'leg_mount')); lg.add(strut([c * 1.3, 1.25, s * 1.3], [c * 1.75, .68, s * 1.75], .09, M.steel, 'leg_upper')); lg.add(strut([c * 1.75, .68, s * 1.75], [c * 2.15, .1, s * 2.15], .06, M.steel, 'leg_piston'));
      lg.add(strut([c * .6, 1.05, s * .6], [c * 2.1, .22, s * 2.1], .035, M.lowMetal, 'leg_brace')); lg.add(yCyl(.36, .3, .09, c * 2.15, 0, s * 2.15, M.lowMetal, { seg: 20, name: 'footpad' })); root.add(lg); }
    root.add(yCyl(.4, .4, .3, 0, .78, 0, M.lowMetal, { name: 'utility_pod' })); const l = ball(.04, .9, 3.95, .5, M.lamp, { seg: 10, rows: 8 }); root.add(l);
    return root; }

  function W05() { const M = mats(D), root = G('W05_tunnel_segment_straight');
    const hull = skinMat('hull', { seed: 51, dust: D, base: TAN, nV: 9, h: 'xcyl' });
    root.add(xCyl(.8, .8, 3.7, 0, CY, 0, hull, { open: true, seg: 48, name: 'tube' }));
    for (const s of [-1, 1]) { root.add(xCyl(.92, .92, .15, s * 1.925, CY, 0, M.metal, { name: 'docking_flange' })); root.add(xCyl(.7, .7, .2, s * 1.93, CY, 0, new T.MeshStandardMaterial({ name: 'opening_dark', color: 0x0c0c0d, roughness: 1 }), { name: 'opening' })); root.add(torus(.7, .03, s * 2.0, CY, 0, M.steel, 'x', 'seal'));
      for (let i = 0; i < 4; i++) { const b = Math.PI / 4 + i * Math.PI / 2; root.add(box(.14, .1, .1, s * 1.93, CY + Math.sin(b) * .9, Math.cos(b) * .9, M.orange, 'latch')); }
      const x = s * 1.15; root.add(xCyl(.83, .83, .12, x, CY, 0, M.metal, { name: 'support_ring' }));
      for (const k of [-1, 1]) { root.add(strut([x, CY - .6, k * .58], [x, .08, k * 1.05], .045, M.steel, 'leg')); root.add(yCyl(.24, .2, .07, x, 0, k * 1.05, M.lowMetal, { seg: 16, name: 'footpad' })); }
      root.add(strut([x, .75, -.9], [x, .75, .9], .03, M.lowMetal, 'cross_brace')); }
    root.add(strut([-1.15, .9, .87], [1.15, 1.9, .65], .025, M.lowMetal, 'diagonal')); root.add(strut([-1.15, .9, -.87], [1.15, 1.9, -.65], .025, M.lowMetal, 'diagonal'));
    root.add(xCyl(.05, .05, 3.6, 0, CY + .84, .12, M.steel, { seg: 10, name: 'cable_duct' })); root.add(xCyl(.035, .035, 3.6, 0, CY + .84, -.1, M.orange, { seg: 10, name: 'cable_duct' }));
    return root; }

  function solarTex(len, wid, dust, seed) { const W = 2048, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), r = rng(seed);
    g.fillStyle = '#23272c'; g.fillRect(0, 0, W, H); const nx = Math.round(len / .5), ny = 4, cw = W / nx, ch = H / ny;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const b = 60 + r() * 30; g.fillStyle = `rgb(${14 + r() * 8},${26 + r() * 10},${b})`; g.fillRect(i * cw + 2, j * ch + 2, cw - 4, ch - 4);
      g.fillStyle = 'rgba(190,200,215,.35)'; for (let k = 1; k < 4; k++) g.fillRect(i * cw + 2, j * ch + k * ch / 4, cw - 4, 1); g.fillRect(i * cw + cw / 2, j * ch + 2, 1, ch - 4); }
    const dc = new T.Color(DUST); for (let k = 0; k < 2600; k++) { g.fillStyle = `rgba(${dc.r * 255 | 0},${dc.g * 255 | 0},${dc.b * 255 | 0},${.03 + r() * .09 * dust * 2})`; const z = 4 + r() * r() * 70; g.beginPath(); g.ellipse(r() * W, r() * H, z, z * .5, r() * 3, 0, 7); g.fill(); }
    g.fillStyle = `rgba(${dc.r * 255 | 0},${dc.g * 255 | 0},${dc.b * 255 | 0},${.12 + dust * .25})`; g.fillRect(0, 0, W, 10); g.fillRect(0, H - 10, W, 10);
    const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 8; t.name = 'solar_basecolor'; return t; }

  function E01(L) { L = L || 20; const M = mats(D), root = G('E01_solar_blanket_' + L + 'm'), Wd = 2;
    const geo = new T.PlaneGeometry(L, Wd, 80, 6); geo.rotateX(-Math.PI / 2); const p = geo.attributes.position, r = rng(5);
    for (let i = 0; i < p.count; i++) p.setY(i, .035 + .018 * Math.sin(p.getX(i) * 1.7 + p.getZ(i) * 2.1) + .012 * Math.sin(p.getX(i) * 4.3) + r() * .004); geo.computeVertexNormals();
    const m = new T.Mesh(geo, new T.MeshStandardMaterial({ name: 'solar_cells', map: solarTex(L, Wd, D, 3), roughness: .62, metalness: 0, side: T.DoubleSide })); m.receiveShadow = true; m.castShadow = true; m.name = 'solar_blanket'; root.add(m);
    for (const s of [-1, 1]) root.add(box(L, .03, .05, 0, .03, s * (Wd / 2 + .01), M.black, 'edge_hem'));
    for (let i = 0; i <= L / 2; i++) for (const s of [-1, 1]) { root.add(yCyl(.03, .02, .1, -L / 2 + i * 2, 0, s * (Wd / 2 + .1), M.steel, { seg: 8, name: 'ground_peg' })); }
    const x0 = -L / 2 - .3; root.add(zCyl(.24, 2.3, x0, .3, 0, M.tan, { name: 'roller_drum' })); for (const s of [-1, 1]) { root.add(zCyl(.3, .06, x0, .3, s * 1.17, M.metal, { name: 'roller_cap' })); root.add(box(.5, .34, .08, x0, .17, s * 1.24, M.lowMetal, 'roller_stand')); }
    root.add(zCyl(.25, .1, x0, .3, .5, M.orange, { name: 'roller_band' })); root.add(box(.4, .3, .35, x0 - .1, .15, -1.55, M.metal, 'connector_box')); root.add(zCyl(.06, .12, x0 - .1, .2, -1.78, M.steel, { seg: 12, name: 'cable_connector' }));
    const pts = [[x0 - .1, .06, -1.84], [x0 - .5, .04, -2.3], [x0 - 1.3, .04, -2.5], [x0 - 2.2, .04, -2.3]]; for (let i = 0; i < pts.length - 1; i++) root.add(strut(pts[i], pts[i + 1], .03, M.black, 'cable'));
    return root; }

  function E03() { const M = mats(D), root = G('E03_battery_bank'), L = 6, Hh = 2.3, Wd = 2.3, y0 = .28;
    const side = skinMat('container_wall', { seed: 31, dust: D, base: GREY, nU: 22, p: 1, h: 'up', depth: 3 }, { roughness: .7, metalness: .35 });
    root.add(boxT(L, Hh, Wd, 0, y0 + Hh / 2, 0, side, M.metal, 'container'));
    for (const s of [-1, 1]) { root.add(box(L + .2, .22, .22, 0, .11, s * .85, M.lowMetal, 'skid')); root.add(box(L + .04, .1, Wd + .04, 0, y0 + (s > 0 ? Hh - .05 : .05), 0, M.metal, 'frame_rail')); }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) root.add(box(.14, Hh, .14, sx * (L / 2 - .05), y0 + Hh / 2, sz * (Wd / 2 - .05), M.metal, 'corner_post'));
    for (const s of [-1, 1]) { root.add(box(L - .3, .1, .02, 0, y0 + Hh - .38, s * (Wd / 2 + .03), M.orange, 'accent_stripe')); root.add(box(L - .3, .05, .02, 0, y0 + Hh - .54, s * (Wd / 2 + .03), M.orange, 'accent_stripe')); }
    for (let i = 0; i < 26; i++) root.add(box(.035, .26, Wd - .5, -L / 2 + .5 + i * .2, y0 + Hh + .13, 0, M.radiator, 'radiator_fin')); root.add(box(5.2, .05, Wd - .4, 0, y0 + Hh + .03, 0, M.metal, 'radiator_base'));
    const ex = L / 2 + .02; root.add(box(.06, 1.2, 1.5, ex, y0 + 1.2, 0, M.metal, 'connector_panel'));
    for (let i = 0; i < 4; i++) { root.add(xCyl(.09, .09, .16, ex + .09, y0 + .85, -.54 + i * .36, M.steel, { seg: 14, name: 'cable_port' })); root.add(xCyl(.06, .06, .05, ex + .18, y0 + .85, -.54 + i * .36, i % 2 ? M.orange : M.black, { seg: 12, name: 'port_cap' })); }
    root.add(box(.03, .3, .5, ex + .04, y0 + 1.5, 0, M.glass, 'status_display')); for (let i = 0; i < 3; i++) root.add(ball(.03, ex + .06, y0 + 1.75, -.15 + i * .15, M.lamp, { seg: 8, rows: 6 }));
    const bx = -L / 2 - .02; for (const s of [-1, 1]) { root.add(box(.05, Hh - .3, Wd / 2 - .12, bx, y0 + Hh / 2, s * (Wd / 4 - .02), M.metal, 'door')); root.add(strut([bx - .04, y0 + .2, s * .25], [bx - .04, y0 + Hh - .2, s * .25], .02, M.steel, 'lock_rod')); }
    return root; }

  function E08(content, col) { const M = mats(D), root = G('E08_sphere_tank_' + (content || 'methane')), R = 1.5, cy = 2.25; if (col) M.orange = new T.MeshStandardMaterial({ name: 'content_band', color: mix(col, DUST, .06 + D * .2).convertSRGBToLinear(), roughness: .75, metalness: .05 });
    const skinM = skinMat('tank_skin', { seed: 81, dust: D, base: PALE, nV: 6, nU: 12, p: .06, h: 'sphere', depth: 2.5 }, { roughness: .6, metalness: .15 });
    root.add(ball(R, 0, cy, 0, skinM, { seg: 56, rows: 32, name: 'tank' }));
    root.add(yCyl(R + .012, R + .012, .26, 0, cy - .13, 0, M.orange, { seg: 56, open: true, name: 'equator_band' })); root.add(torus(R + .01, .03, 0, cy - .3, 0, M.metal, 'y', 'leg_ring'));
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2, c = Math.cos(a), s = Math.sin(a), ry = cy - .3, rr = Math.sqrt(R * R - .09);
      root.add(box(.2, .3, .2, c * (rr + .04), ry, s * (rr + .04), M.metal, 'leg_bracket')); root.add(strut([c * (rr + .06), ry, s * (rr + .06)], [c * 1.75, .08, s * 1.75], .06, M.steel, 'leg')); root.add(yCyl(.3, .25, .08, c * 1.75, 0, s * 1.75, M.lowMetal, { seg: 16, name: 'footpad' }));
      const a2 = a + Math.PI / 2; root.add(strut([c * 1.66, .6, s * 1.66], [Math.cos(a2) * 1.66, .6, Math.sin(a2) * 1.66], .03, M.lowMetal, 'leg_tie')); }
    root.add(yCyl(.16, .16, .32, 0, cy - R - .26, 0, M.steel, { seg: 16, name: 'bottom_outlet' })); root.add(torus(.17, .03, .0, cy - R - .32, 0, M.orange, 'y', 'valve_wheel')); root.add(ball(.13, 0, cy - R - .32, 0, M.metal, { seg: 12, rows: 8, name: 'valve_body' }));
    root.add(strut([0, cy - R - .3, 0], [0, .28, 0], .07, M.steel, 'outlet_pipe')); root.add(strut([0, .28, 0], [2.1, .28, 0], .07, M.steel, 'outlet_pipe')); root.add(xCyl(.12, .12, .06, 2.1, .28, 0, M.metal, { seg: 16, name: 'outlet_flange' })); root.add(ball(.09, 0, .28, 0, M.steel, { seg: 10, rows: 8 }));
    root.add(yCyl(.22, .22, .12, 0, cy + R - .03, 0, M.metal, { seg: 20, name: 'top_manhole' })); root.add(yCyl(.05, .05, .35, .12, cy + R + .05, 0, M.steel, { seg: 10, name: 'relief_valve' })); root.add(ball(.035, -.12, cy + R + .12, 0, M.lamp, { seg: 8, rows: 6 }));
    root.add(box(.05, .28, .22, R + .02, cy + .35, 0, M.metal, 'gauge_box')); root.add(xCyl(.08, .08, .03, R + .06, cy + .38, 0, M.white, { seg: 16, name: 'gauge' }));
    return root; }

  function E09(len) { len = len || 8; const M = mats(D), root = G('E09_horizontal_tank_' + len + 'm'), R = 1.25, cy = 1.9, cylL = len - 1.8;
    const hull = skinMat('tank_insulation', { seed: 91, dust: D, base: PALE, nV: Math.round(cylL * 2.1), h: 'xcyl' });
    root.add(xCyl(R, R, cylL, 0, cy, 0, hull, { open: true, seg: 56, name: 'tank' }));
    for (const s of [-1, 1]) { const e = ball(R, s * cylL / 2, cy, 0, M.white, { seg: 48, rows: 24, sx: .72, name: 'end_dome' }); root.add(e); root.add(xCyl(R + .03, R + .03, .1, s * cylL / 2, cy, 0, M.metal, { seg: 56, name: 'end_ring' }));
      const x = s * (cylL / 2 - .9); root.add(xCyl(R + .025, R + .025, .16, x, cy, 0, M.steel, { seg: 56, open: true, name: 'strap' }));
      const cr = G('cradle'); cr.add(box(.5, .1, 2.6, x, .05, 0, M.lowMetal, 'base_plate')); cr.add(box(.3, .75, 2.2, x, .45, 0, M.metal, 'saddle'));
      for (const k of [-1, 1]) { cr.add(box(.3, .7, .3, x, 1.0, k * 1.05, M.metal, 'saddle_horn')); cr.add(strut([x, .1, k * 1.25], [x, 1.35, k * 1.02], .04, M.lowMetal, 'brace')); } root.add(cr); }
    root.add(xCyl(R + .014, R + .014, .07, 0, cy, 0, M.orange, { seg: 56, open: true, name: 'accent_stripe' }));
    const ex = cylL / 2 + R * .72; root.add(xCyl(.2, .2, .3, ex + .08, cy, 0, M.steel, { seg: 18, name: 'main_nozzle' })); root.add(xCyl(.27, .27, .06, ex + .25, cy, 0, M.metal, { seg: 18, name: 'flange' }));
    root.add(strut([ex + .3, cy, 0], [ex + .3, .4, 0], .08, M.steel, 'drop_pipe')); root.add(ball(.16, ex + .3, 1.15, 0, M.metal, { seg: 12, rows: 8, name: 'valve_body' })); root.add(torus(.2, .025, ex + .5, 1.15, 0, M.orange, 'x', 'valve_wheel')); root.add(strut([ex + .3, 1.15, 0], [ex + .5, 1.15, 0], .025, M.steel));
    root.add(strut([ex + .3, .4, 0], [ex + .3, .4, 1.5], .08, M.steel, 'manifold')); root.add(zCyl(.13, .06, ex + .3, .4, 1.5, M.metal, { seg: 16, name: 'manifold_flange' })); root.add(ball(.1, ex + .3, .4, 0, M.steel, { seg: 10, rows: 8 })); root.add(box(.25, .4, .25, ex + .3, .2, .7, M.lowMetal, 'pipe_support'));
    root.add(strut([ex - .1, cy + .6, .35], [ex + .45, cy + .6, .35], .04, M.steel, 'vent_line')); root.add(strut([ex + .45, cy + .6, .35], [ex + .45, cy + 1.7, .35], .04, M.steel, 'vent_stack'));
    root.add(yCyl(.26, .26, .14, -cylL * .16, cy + R - .04, 0, M.metal, { seg: 20, name: 'manhole' })); if (cylL > 5) root.add(box(1.6, .04, .5, 1, cy + R + .12, 0, M.metal, 'top_walkway')); if (cylL > 5) for (const k of [-1, 1]) for (const x of [.3, 1.7]) root.add(strut([x, cy + R - .1, k * .2], [x, cy + R + .1, k * .2], .02, M.steel));
    return root; }

  function E11(stage) { stage = stage || 1; const M = mats(D), root = G('E11_ice_drill_rig_stage' + stage), Hd = 8, b = 1.3, t = .32, y0 = .25;
    root.add(box(3.4, .14, 3.4, 0, y0 - .07, 0, M.lowMetal, 'deck')); for (const sx of [-1, 1]) for (const sz of [-1, 1]) { root.add(yCyl(.22, .18, .2, sx * 1.55, 0, sz * 1.55, M.lowMetal, { seg: 14, name: 'deck_foot' })); }
    const corner = (i, f) => { const a = Math.PI / 4 + i * Math.PI / 2, r = (b + (t - b) * f) * Math.SQRT2; return [Math.cos(a) * r, y0 + Hd * f, Math.sin(a) * r]; };
    const der = G('derrick'), n = 5;
    for (let i = 0; i < 4; i++) { der.add(strut(corner(i, 0), corner(i, 1), .055, M.steel, 'derrick_leg'));
      for (let k = 0; k <= n; k++) { const f = k / n; der.add(strut(corner(i, f), corner((i + 1) % 4, f), .03, M.steel, 'girt')); if (k < n) { const f2 = (k + 1) / n; der.add(strut(corner(i, f), corner((i + 1) % 4, f2), .022, M.metal, 'brace')); der.add(strut(corner((i + 1) % 4, f), corner(i, f2), .022, M.metal, 'brace')); } } }
    der.add(box(.9, .22, .9, 0, y0 + Hd + .11, 0, M.metal, 'crown_block')); der.add(zCyl(.22, .12, 0, y0 + Hd + .36, 0, M.orange, { seg: 18, name: 'sheave' })); der.add(strut([0, y0 + Hd + .3, 0], [0, y0 + Hd + 1.1, 0], .02, M.steel, 'mast')); der.add(ball(.05, 0, y0 + Hd + 1.13, 0, M.lamp, { seg: 8, rows: 6 })); root.add(der);
    root.add(yCyl(.07, .07, 6.3, 0, y0 + .2, 0, M.steel, { seg: 14, name: 'drill_string' })); root.add(box(.5, .6, .5, 0, y0 + 5.6, 0, M.orange, 'top_drive')); root.add(strut([0, y0 + 5.9, 0], [0, y0 + Hd, 0], .015, M.black, 'hoist_cable'));
    root.add(yCyl(.55, .5, .5, 0, y0, 0, M.metal, { seg: 28, name: 'borehole_collar' })); root.add(yCyl(.57, .57, .08, 0, y0 + .2, 0, M.orange, { seg: 28, open: true, name: 'heater_band' })); root.add(yCyl(.3, .3, .2, 0, y0 + .5, 0, M.black, { seg: 20, name: 'wellhead_seal' }));
    const ins = skinMat('pipe_insulation', { W: 512, H: 256, seed: 111, dust: D, base: TAN, nV: 12, h: 'xcyl' });
    root.add(strut([.5, y0 + .3, 0], [1.2, .45, 0], .11, M.tan, 'pipe_riser')); root.add(xCyl(.16, .16, 5.6, 4.0, .45, 0, ins, { open: true, seg: 20, name: 'insulated_pipe' })); root.add(xCyl(.2, .2, .08, 6.8, .45, 0, M.metal, { seg: 18, name: 'pipe_flange' }));
    for (const x of [2.2, 4.0, 5.8]) { root.add(box(.14, .3, .5, x, .15, 0, M.lowMetal, 'pipe_support')); }
    const cb = G('control_box'), wall = skinMat('cabin_wall', { W: 512, H: 256, seed: 112, dust: D, base: PANEL, nU: 3, nV: 2, p: .06, h: 'up', depth: 2 });
    cb.add(boxT(1.7, 1.9, 1.5, -.2, .2 + .95, -2.7, wall, M.tan, 'cabin')); cb.add(box(1.75, .1, 1.55, -.2, .15, -2.7, M.lowMetal, 'cabin_skid')); cb.add(box(.9, .5, .04, -.2, 1.45, -1.94, M.glass, 'window')); cb.add(box(1.0, .6, .03, -.2, 1.45, -1.955, M.metal, 'window_frame'));
    cb.add(box(.04, 1.4, .65, .66, .95, -2.7, M.metal, 'door')); cb.add(box(1.2, .06, 1.0, -.2, 2.13, -2.7, M.radiator, 'roof_radiator')); cb.add(strut([-.8, 2.1, -3.2], [-.8, 3.0, -3.2], .018, M.steel, 'antenna')); root.add(cb);
    root.add(strut([-.2, .4, -1.95], [0, y0 + .3, -.5], .03, M.black, 'control_cable'));
    const rack = G('drill_rod_rack'); for (const x of [-3.9, -1.7]) { rack.add(box(.1, .5, 1.3, x + 1.3, .25, 2.6, M.lowMetal, 'rack_post')); }
    let k = 0; for (let row = 0; row < 3; row++) for (let i = 0; i < 5 - row; i++) { rack.add(xCyl(.06, .06, 3.0, -1.5, .56 + row * .115, 2.1 + i * .13 + row * .065, k++ % 4 === 0 ? M.lowMetal : M.steel, { seg: 10, name: 'drill_rod' })); }
    root.add(rack);
    if (stage > 1) { const up = G('stage2_upgrade'), scr = skinMat('wind_screen', { W: 512, H: 256, seed: 113, dust: D, base: PANEL, nU: 3, nV: 2, p: .06, h: 'up', depth: 2 });
      for (const [x, z, w, d] of [[0, -1.42, 2.9, .06], [-1.42, 0, .06, 2.9], [0, 1.42, 2.9, .06]]) up.add(boxT(w, 2.4, d, x, y0 + 1.2, z, scr, M.tan, 'wind_screen'));
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) up.add(box(.1, 2.5, .1, sx * 1.42, y0 + 1.25, sz * 1.42, M.metal, 'screen_post')); up.add(box(2.95, .06, .1, 0, y0 + 2.42, -1.42, M.orange, 'screen_stripe'));
      up.add(xCyl(.16, .16, 5.6, 4.0, .45, .5, ins, { open: true, seg: 20, name: 'insulated_pipe_2' })); up.add(xCyl(.2, .2, .08, 6.8, .45, .5, M.metal, { seg: 18, name: 'pipe_flange' })); up.add(strut([.5, y0 + .3, .2], [1.2, .45, .5], .11, M.tan, 'pipe_riser'));
      const tk = skinMat('melt_tank_skin', { W: 512, H: 256, seed: 114, dust: D, base: PALE, nV: 3, p: .06, h: 'up', depth: 2 }, { roughness: .6, metalness: .15 });
      up.add(yCyl(.95, .95, 2.6, 2.8, .3, -2.6, tk, { seg: 32, open: true, name: 'melt_water_tank' })); up.add(ball(.95, 2.8, 2.9, -2.6, M.white, { pl: Math.PI / 2, sy: .4, name: 'tank_head' })); up.add(yCyl(1.02, 1.02, .3, 2.8, 0, -2.6, M.lowMetal, { seg: 24, name: 'tank_skirt' })); up.add(yCyl(.96, .96, .1, 2.8, 2.5, -2.6, M.orange, { seg: 32, open: true, name: 'tank_band' }));
      up.add(strut([2.8, .5, -1.65], [1.4, .5, -.6], .07, M.steel, 'tank_feed')); up.add(strut([1.4, .5, -.6], [.5, y0 + .3, -.2], .07, M.steel, 'tank_feed'));
      up.add(strut([-1.42, y0, 1.42], [-1.42, 5.2, 1.42], .04, M.steel, 'floodlight_mast')); const fl = box(.5, .25, .12, -1.3, 5.25, 1.3, M.metal, 'floodlight'); fl.rotation.set(.5, -.8, 0); up.add(fl); up.add(ball(.06, -1.22, 5.2, 1.22, M.lamp, { seg: 8, rows: 6 }));
      up.add(box(1.4, 1.1, 1.0, -2.6, .75, .2, M.metal, 'heater_unit')); up.add(box(1.5, .2, 1.1, -2.6, .1, .2, M.lowMetal, 'heater_skid')); for (let k = 0; k < 6; k++) up.add(box(.03, .8, .9, -3.33, .75, .2 - 0 * k, M.radiator)); up.add(strut([-1.9, .6, .2], [-.5, y0 + .25, .1], .06, M.orange, 'heater_line'));
      root.add(up); }
    return root; }

  function E12(big) { const M = mats(D), root = G('E12_fuel_plant_' + (big ? 'large' : 'small')), L = big ? 20 : 12, x0 = big ? -4 : 0, Hh = big ? 4.0 : 3.4, Wd = big ? 5.0 : 4.2, bz = big ? -1.6 : -1.2;
    const wall = skinMat('plant_wall', { seed: 121, dust: D, base: PANEL, nU: big ? 17 : 10, nV: 2, p: .06, h: 'up', depth: 2.2 });
    root.add(boxT(L, Hh, Wd, 0, .2 + Hh / 2, bz, wall, M.tan, 'process_hall')); root.add(box(L + .3, .2, Wd + .3, 0, .1, bz, M.lowMetal, 'foundation'));
    root.add(box(L + .06, .09, .03, 0, .2 + Hh - .5, bz + Wd / 2 + .02, M.orange, 'accent_stripe')); root.add(box(L + .1, .12, Wd + .1, 0, .2 + Hh + .02, bz, M.metal, 'roof_edge'));
    root.add(box(.05, 2.2, 1.6, L / 2 + .03, 1.3, bz, M.metal, 'service_door')); root.add(box(2.4, .5, .04, -3.8 + x0, 2.5, bz + Wd / 2 + .03, M.glass, 'window_strip')); root.add(box(2.5, .6, .03, -3.8 + x0, 2.5, bz + Wd / 2 + .015, M.metal, 'window_frame'));
    for (const x of (big ? [-7.2, -3.8, -.4, 3] : [-3.2, .2])) { const p = box(2.6, .05, 1.5, x, .2 + Hh + .4, bz - .4, M.radiator, 'roof_radiator'); p.rotation.x = -.35; root.add(p); for (const k of [-1, 1]) root.add(strut([x + k * 1.1, .2 + Hh, bz - .4], [x + k * 1.1, .2 + Hh + .4, bz - .4], .03, M.steel)); }
    root.add(yCyl(.28, .28, 1.6, 4.2 - x0, .2 + Hh, bz - .6, M.steel, { seg: 18, name: 'vent_stack' })); root.add(yCyl(.34, .34, .1, 4.2 - x0, .2 + Hh + 1.6, bz - .6, M.metal, { seg: 18, name: 'vent_cap' }));
    const colSkin = skinMat('column_skin', { W: 512, H: 512, seed: 122, dust: D, base: PALE, nV: 7, h: 'up' }, { roughness: .65, metalness: .2 }), cz = 1.85;
    (big ? [-7.6, -5.6, -3.6, -1.6, .4] : [-3.6, -1.6, .4]).forEach((x, i) => { const c = G('reactor_column'), h = big ? 7.6 : 6.6;
      c.add(yCyl(.75, .75, .25, x, 0, cz, M.lowMetal, { seg: 24, name: 'column_base' })); c.add(yCyl(.55, .55, h, x, .25, cz, colSkin, { seg: 32, open: true, name: 'column' })); c.add(ball(.55, x, .25 + h, cz, M.white, { pl: Math.PI / 2, sy: .6, name: 'column_head' }));
      for (const y of [2.2, 4.4]) c.add(yCyl(.6, .6, .1, x, y, cz, M.metal, { seg: 32, name: 'column_flange' })); c.add(yCyl(.565, .565, .08, x, h - .7, cz, M.orange, { seg: 32, open: true, name: 'accent_stripe' }));
      c.add(yCyl(.95, .95, .05, x, 4.0, cz, M.metal, { seg: 24, name: 'service_platform' })); c.add(torus(.95, .02, x, 4.9, cz, M.steel, 'y', 'platform_rail')); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c.add(strut([x + Math.cos(a) * .95, 4.05, cz + Math.sin(a) * .95], [x + Math.cos(a) * .95, 4.9, cz + Math.sin(a) * .95], .016, M.steel)); }
      c.add(strut([x, h - .4 + .5 * (i % 2), cz - .5], [x, h - .4 + .5 * (i % 2), bz + 1.2], .07, M.steel, 'overhead_pipe')); c.add(strut([x, h - .4 + .5 * (i % 2), bz + 1.2], [x, .2 + Hh, bz + 1.2], .07, M.steel, 'overhead_pipe'));
      c.add(strut([x + .5, .7, cz], [x + 1.5, .7, cz], .06, i % 2 ? M.orange : M.steel, 'link_pipe')); for (let k = 0; k < 9; k++) c.add(strut([x - .1, .4 + k * .42, cz + .62], [x + .1, .4 + k * .42, cz + .62], .014, M.steel, 'ladder_rung')); for (const s of [-.1, .1]) c.add(strut([x + s, .3, cz + .62], [x + s, 4.0, cz + .62], .016, M.steel, 'ladder_rail'));
      root.add(c); });
    (big ? [2.4, 3.9, 5.4, 6.9] : [2.4, 3.9]).forEach(x => { const c = G('compressor'); c.add(box(1.2, .14, 1.3, x, .07, cz + .2, M.lowMetal, 'skid')); c.add(box(1.0, .8, 1.0, x, .54, cz + .2, M.metal, 'housing')); c.add(zCyl(.34, 1.2, x, 1.2, cz + .2, M.steel, { seg: 20, name: 'cylinder' })); c.add(zCyl(.37, .08, x, 1.2, cz + .84, M.orange, { seg: 20, name: 'end_cap' }));
      for (let k = 0; k < 5; k++) c.add(box(.9, .03, .03, x, .3 + k * .12, cz + .71, M.black, 'louver')); c.add(strut([x, 1.5, cz + .2], [x, 2.1, cz + .2], .05, M.steel)); c.add(strut([x, 2.1, cz + .2], [x, 2.1, bz + Wd / 2], .05, M.steel, 'pipe')); root.add(c); });
    const tk = skinMat('small_tank_skin', { W: 512, H: 256, seed: 123, dust: D, base: PALE, nV: 3, p: .06, h: 'up', depth: 2 }, { roughness: .6, metalness: .15 });
    (big ? [[8.3, 1.5], [8.3, 2.75], [9.35, 2.1], [9.35, 3.35], [10.4, 2.7]] : [[5.3, 1.5], [5.3, 2.75], [6.35, 2.1]]).forEach(([x, z], i) => { root.add(yCyl(.52, .52, 2.3, x, .35, z, tk, { seg: 28, open: true, name: 'storage_tank' })); root.add(ball(.52, x, 2.65, z, M.white, { pl: Math.PI / 2, sy: .5, name: 'tank_head' })); root.add(yCyl(.58, .58, .35, x, 0, z, M.lowMetal, { seg: 20, name: 'tank_skirt' })); root.add(yCyl(.53, .53, .07, x, 2.3, z, i === 0 ? M.orange : M.steel, { seg: 28, open: true, name: 'tank_band' })); root.add(yCyl(.04, .04, .3, x, 2.9, z, M.steel, { seg: 8, name: 'relief_valve' })); });
    const mA = big ? -8.4 : -4.4, mB = big ? 9.4 : 6.4; root.add(strut([mA, .45, cz + .95], [mB, .45, cz + .95], .08, M.steel, 'ground_manifold')); root.add(strut([mA, .65, cz + 1.15], [mB - 1.1, .65, cz + 1.15], .06, M.orange, 'ground_manifold')); for (let x = mA + .4; x <= mB - .4; x += 2) root.add(box(.14, .7, .5, x, .35, cz + 1.05, M.lowMetal, 'pipe_rack'));
    root.add(xCyl(.13, .13, .06, mA - .02, .45, cz + .95, M.metal, { seg: 16, name: 'manifold_flange' }));
    return root; }

  function E14() { const M = mats(D), root = G('E14_pipeline_straight_10m'), L = 10, y = .72;
    const ins = skinMat('pipe_insulation', { W: 1024, H: 128, seed: 141, dust: D, base: TAN, nV: 20, h: 'xcyl' });
    for (const z of [-.24, .24]) { root.add(xCyl(.15, .15, L - .12, 0, y, z, ins, { open: true, seg: 24, name: 'pipe' })); for (const s of [-1, 1]) { root.add(xCyl(.21, .21, .06, s * (L / 2 - .03), y, z, M.metal, { seg: 20, name: 'end_flange' })); root.add(xCyl(.11, .11, .065, s * (L / 2 - .03), y, z, M.black, { seg: 16, name: 'bore' })); }
      root.add(xCyl(.19, .19, .14, 0, y, z, M.steel, { seg: 20, name: 'mid_coupling' })); }
    root.add(xCyl(.158, .158, .08, -2.5, y, .24, M.orange, { open: true, seg: 24, name: 'marker_band' })); root.add(xCyl(.158, .158, .08, 2.5, y, .24, M.orange, { open: true, seg: 24, name: 'marker_band' }));
    for (const x of [-3.75, -1.25, 1.25, 3.75]) { const f = G('a_frame'); for (const k of [-1, 1]) { f.add(strut([x, y - .12, k * .12], [x, .05, k * .62], .035, M.steel, 'leg')); f.add(yCyl(.14, .12, .05, x, 0, k * .62, M.lowMetal, { seg: 12, name: 'footpad' })); }
      f.add(box(.12, .06, .86, x, y - .19, 0, M.metal, 'saddle_beam')); f.add(strut([x, .3, -.47], [x, .3, .47], .02, M.lowMetal, 'tie')); for (const z of [-.24, .24]) f.add(xCyl(.165, .165, .1, x, y, z, M.metal, { open: true, seg: 20, name: 'clamp' })); root.add(f); }
    return root; }

  function E16() { const M = mats(D), root = G('E16_life_support_module'), L = 5, Hh = 2.1, Wd = 2.0, y0 = .3;
    const wall = skinMat('module_wall', { seed: 161, dust: D, base: PANEL, nU: 4, nV: 2, p: .06, h: 'up', depth: 2.2 });
    root.add(boxT(L, Hh, Wd, 0, y0 + Hh / 2, 0, wall, M.tan, 'housing')); for (const s of [-1, 1]) root.add(box(L + .3, .2, .2, 0, .1, s * .75, M.lowMetal, 'skid')); for (const x of [-2, 0, 2]) root.add(box(.15, .12, Wd, x, .24, 0, M.lowMetal, 'cross_member'));
    root.add(box(L + .04, .07, .02, 0, y0 + Hh - .3, Wd / 2 + .02, M.orange, 'accent_stripe'));
    const v = G('air_intake'); v.add(box(1.7, 1.2, .08, -1.35, y0 + 1.05, Wd / 2 + .03, M.metal, 'vent_frame')); for (let k = 0; k < 9; k++) { const s = box(1.5, .09, .05, -1.35, y0 + .55 + k * .125, Wd / 2 + .08, M.black, 'louver'); s.rotation.x = .5; v.add(s); } root.add(v);
    const v2 = v.clone(); v2.position.x = 2.1; v2.scale.x = .6; root.add(v2);
    for (let i = 0; i < 4; i++) { const x = -1.9 + i * .55; root.add(yCyl(.21, .21, .95, x, y0 + Hh, -.45, i === 3 ? M.orange : M.white, { seg: 20, name: 'filter_cartridge' })); root.add(yCyl(.23, .23, .08, x, y0 + Hh + .95, -.45, M.metal, { seg: 20, name: 'cartridge_cap' })); root.add(yCyl(.24, .24, .06, x, y0 + Hh, -.45, M.metal, { seg: 20, name: 'cartridge_seat' })); }
    root.add(strut([-2.1, y0 + Hh + .5, -.45], [-.1, y0 + Hh + .5, -.45], .03, M.steel, 'cartridge_manifold'));
    const p = box(1.8, .05, 1.2, 1.3, y0 + Hh + .32, .1, M.radiator, 'roof_radiator'); p.rotation.z = .12; root.add(p); for (let k = 0; k < 8; k++) { const f = box(.03, .06, 1.15, .55 + k * .22, y0 + Hh + .26 + k * .026, .1, M.steel, 'radiator_fin'); root.add(f); }
    const tk = skinMat('small_tank_skin', { W: 512, H: 256, seed: 162, dust: D, base: PALE, nV: 3, p: .06, h: 'xcyl', depth: 2 }, { roughness: .6, metalness: .15 });
    for (const [yy, m] of [[y0 + .55, M.orange], [y0 + 1.4, M.steel]]) { root.add(zCyl(.36, 1.3, L / 2 + .45, yy, 0, tk, { seg: 28, open: true, name: 'gas_tank' })); for (const s of [-1, 1]) { const e = ball(.36, L / 2 + .45, yy, s * .65, M.white, { seg: 24, rows: 14, name: 'tank_end' }); e.scale.z = .6; root.add(e); } root.add(zCyl(.37, .07, L / 2 + .45, yy, 0, m, { seg: 28, open: true, name: 'tank_band' })); root.add(box(.45, .08, .12, L / 2 + .22, yy - .38, .35, M.metal, 'tank_bracket')); root.add(box(.45, .08, .12, L / 2 + .22, yy - .38, -.35, M.metal, 'tank_bracket')); }
    root.add(box(.08, 1.9, 1.5, L / 2 + .04, y0 + 1.0, 0, M.metal, 'tank_backplate'));
    const hose = skinMat('hose', { W: 256, H: 256, seed: 163, dust: D, base: [0.3, 0.3, 0.3], nV: 14, p: 1, h: 'xcyl', depth: 4 }, { roughness: .8 });
    const hz = -Wd / 2; root.add(zCyl(.3, .12, -1.2, y0 + 1.1, hz - .06, M.metal, { seg: 24, name: 'connector_collar' })); const hs = zCyl(.24, .9, -1.2, y0 + 1.1, hz - .55, hose, { seg: 24, open: true, name: 'habitat_connector_hose' }); root.add(hs); root.add(zCyl(.32, .08, -1.2, y0 + 1.1, hz - 1.02, M.metal, { seg: 24, name: 'connector_flange' })); root.add(zCyl(.2, .09, -1.2, y0 + 1.1, hz - 1.03, M.black, { seg: 20, name: 'connector_bore' }));
    root.add(box(.9, .6, .05, 1.2, y0 + 1.2, hz - .03, M.metal, 'control_panel')); root.add(box(.5, .25, .03, 1.2, y0 + 1.3, hz - .06, M.glass, 'display')); for (let i = 0; i < 3; i++) root.add(ball(.03, .95 + i * .12, y0 + 1.05, hz - .07, M.lamp, { seg: 8, rows: 6 }));
    return root; }

  // ---- variants ----
  function W05bend() { const M = mats(D), root = G('W05_tunnel_segment_bend90'), hull = skinMat('hull', { seed: 52, dust: D, base: TAN, nV: 4, h: 'xcyl' }), dark = new T.MeshStandardMaterial({ name: 'opening_dark', color: 0x0c0c0d, roughness: 1 });
    const arm = rot => { const g = G('arm'); g.add(xCyl(.8, .8, 1.5, 1.1, CY, 0, hull, { open: true, seg: 48, name: 'tube' })); g.add(xCyl(.92, .92, .15, 1.925, CY, 0, M.metal, { name: 'docking_flange' })); g.add(xCyl(.7, .7, .2, 1.93, CY, 0, dark, { name: 'opening' })); g.add(torus(.7, .03, 2.0, CY, 0, M.steel, 'x', 'seal'));
      for (let i = 0; i < 4; i++) { const b = Math.PI / 4 + i * Math.PI / 2; g.add(box(.14, .1, .1, 1.93, CY + Math.sin(b) * .9, Math.cos(b) * .9, M.orange, 'latch')); }
      g.add(xCyl(.83, .83, .12, 1.35, CY, 0, M.metal, { name: 'support_ring' })); g.add(xCyl(.86, .86, .1, .42, CY, 0, M.metal, { name: 'elbow_ring' }));
      for (const k of [-1, 1]) { g.add(strut([1.35, CY - .6, k * .58], [1.35, .08, k * 1.05], .045, M.steel, 'leg')); g.add(yCyl(.24, .2, .07, 1.35, 0, k * 1.05, M.lowMetal, { seg: 16, name: 'footpad' })); } g.add(strut([1.35, .75, -.9], [1.35, .75, .9], .03, M.lowMetal, 'cross_brace')); g.rotation.y = rot; return g; };
    root.add(arm(Math.PI)); root.add(arm(-Math.PI / 2)); root.add(ball(.9, 0, CY, 0, M.tan, { seg: 40, rows: 24, name: 'elbow_joint' })); root.add(yCyl(.3, .3, .1, 0, CY + .86, 0, M.metal, { seg: 16, name: 'elbow_cap' }));
    root.add(strut([0, CY - .85, 0], [0, .08, 0], .06, M.steel, 'elbow_post')); root.add(yCyl(.3, .26, .07, 0, 0, 0, M.lowMetal, { seg: 16, name: 'footpad' })); return root; }

  function E14bend() { const M = mats(D), root = G('E14_pipeline_bend90'), y = .72, Rb = 3;
    const ins = skinMat('pipe_insulation', { W: 512, H: 128, seed: 142, dust: D, base: TAN, nU: 9, h: 'tube' });
    for (const k of [-1, 1]) { const R = Rb + k * .24, t = new T.Mesh(new T.TorusGeometry(R, .15, 20, 40, Math.PI / 2), ins); t.geometry.rotateX(Math.PI / 2); t.position.y = y; t.castShadow = t.receiveShadow = true; t.name = 'pipe'; root.add(t);
      root.add(zCyl(.21, .06, R, y, .03, M.metal, { seg: 20, name: 'end_flange' })); root.add(zCyl(.11, .065, R, y, .03, M.black, { seg: 16, name: 'bore' })); root.add(xCyl(.21, .21, .06, .03, y, R, M.metal, { seg: 20, name: 'end_flange' })); root.add(xCyl(.11, .11, .065, .03, y, R, M.black, { seg: 16, name: 'bore' })); }
    for (const a of [15, 45, 75]) { const f = G('a_frame'); for (const k of [-1, 1]) { f.add(strut([Rb + k * .12, y - .12, 0], [Rb + k * .62, .05, 0], .035, M.steel, 'leg')); f.add(yCyl(.14, .12, .05, Rb + k * .62, 0, 0, M.lowMetal, { seg: 12, name: 'footpad' })); f.add(zCyl(.165, .1, Rb + k * .24, y, 0, M.metal, { open: true, seg: 20, name: 'clamp' })); }
      f.add(box(.86, .06, .12, Rb, y - .19, 0, M.metal, 'saddle_beam')); f.add(strut([Rb - .47, .3, 0], [Rb + .47, .3, 0], .02, M.lowMetal, 'tie')); f.rotation.y = -a * Math.PI / 180; root.add(f); }
    const mb = G('marker'); mb.add(zCyl(.158, .08, Rb + .24, y, 0, M.orange, { open: true, seg: 24, name: 'marker_band' })); mb.rotation.y = -Math.PI / 6; root.add(mb); return root; }

  window.RSO_B = { W04, W05, W05bend, E01, E03, E08, E09, E11, E12, E14, E14bend, E16 };
  window.RSO_MODELS = { W04_node_4ports: () => W04(4), W04_node_3ports: () => W04(3), W05_tunnel_straight: W05, E01_solar_blanket_20m: E01, E03_battery_bank: E03, E08_sphere_tank: E08, E09_horizontal_tank_8m: E09, E11_ice_drill_rig: E11, E12_fuel_plant_small: E12, E14_pipeline_straight_10m: E14, E16_life_support_module: E16 };
})();
