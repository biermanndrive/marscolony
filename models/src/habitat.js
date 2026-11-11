// Red Station One - procedural models W01 / W02 (tube habitats), style A
// Units: metres, Y up, origin on the ground under the centre, long axis = X.
(function () {
  const T = THREE;
  const R = 1.5, CY = 2.5; // hull radius, hull centre height (1 m ground clearance)

  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const mix = (a, b, t) => new T.Color(a).lerp(new T.Color(b), t);
  const DUST = 0xa5552f;

  // ---------- textures ----------
  function hullTexture(len, dust, seed) {
    // insulated, ribbed hull skin: sand-coloured blanket segments between ring ribs, weathered
    const W = 1024, H = len > 6 ? 1024 : 512, r = rng(seed);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    const img = g.createImageData(W, H), d = img.data;
    const hgt = new Float32Array(W * H);
    const nRing = Math.round(len / 0.46), nSeam = 8;
    // value noise
    const N = 64, grid = new Float32Array(N * N); for (let i = 0; i < N * N; i++) grid[i] = r();
    const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = grid[(yi & 63) * N + (xi & 63)], b = grid[(yi & 63) * N + ((xi + 1) & 63)], cc = grid[((yi + 1) & 63) * N + (xi & 63)], dd = grid[((yi + 1) & 63) * N + ((xi + 1) & 63)];
      return a + (b - a) * sx + (cc - a) * sy + (a - b - cc + dd) * sx * sy; };
    const fbm = (x, y) => vn(x, y) * .5 + vn(x * 2.1, y * 2.1) * .28 + vn(x * 4.3, y * 4.3) * .14 + vn(x * 8.7, y * 8.7) * .08;
    const segTone = []; for (let j = 0; j < nRing; j++) { segTone.push([]); for (let i = 0; i < nSeam; i++) segTone[j].push(r()); }
    const base = [0.74, 0.65, 0.50], dc = new T.Color(DUST), dark = [0.22, 0.17, 0.13];
    for (let y = 0; y < H; y++) {
      const fy = y / H * nRing, jr = Math.floor(fy), ty = fy - jr;
      const bulge = Math.pow(Math.sin(Math.PI * ty), .55);            // pillow between two ribs
      for (let x = 0; x < W; x++) {
        const fx = x / W * nSeam, is = Math.floor(fx), tx = fx - is;
        const seam = Math.min(tx, 1 - tx) * (W / nSeam);               // px to nearest lengthwise seam
        const seamD = Math.min(1, seam / 5);
        const wr = fbm(x / W * 40, y / H * 40 * (H / W) * 2);           // fabric wrinkles
        const h = bulge * (0.75 + 0.25 * seamD) + (wr - .5) * .1; hgt[y * W + x] = h;
        const hh = -Math.sin(2 * Math.PI * x / W);                     // -1 bottom .. +1 top
        let tone = 0.9 + 0.14 * (segTone[jr % nRing][is] - .5) + 0.1 * (fbm(x / W * 9, y / H * 9) - .5);
        tone *= 0.62 + 0.38 * Math.pow(bulge, .5) * (0.6 + 0.4 * seamD); // grime in the grooves
        tone *= 0.93 + 0.1 * Math.max(0, hh);                          // sun-bleached crown
        let R = base[0] * tone, G = base[1] * tone, B = base[2] * tone;
        // streaks running down from the ribs and stains
        const st = Math.max(0, fbm(x / W * 3, y / H * 90) - .52) * 2.2 * (0.3 + 0.7 * Math.max(0, -hh + .3));
        R += (dark[0] - R) * st * .5; G += (dark[1] - G) * st * .5; B += (dark[2] - B) * st * .5;
        // dust: heavy at the belly, settled on the crown, caught in the grooves
        const low = Math.min(1, Math.max(0, (0.3 - hh) / 1.3)), top = Math.max(0, hh - .75) * 1.6;
        let a = dust * (Math.pow(low, 1.3) * 1.2 + top * .6 + (1 - bulge) * .35) * (0.55 + 0.9 * fbm(x / W * 14, y / H * 14));
        a = Math.min(.9, a);
        R += (dc.r - R) * a; G += (dc.g - G) * a; B += (dc.b - B) * a;
        const k = (y * W + x) * 4; d[k] = R * 255; d[k + 1] = G * 255; d[k + 2] = B * 255; d[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const map = new T.CanvasTexture(c); map.encoding = T.sRGBEncoding; map.wrapS = T.RepeatWrapping; map.anisotropy = 8; map.name = 'hull_basecolor';
    // normal map from the height field
    const c2 = document.createElement('canvas'); c2.width = W; c2.height = H; const g2 = c2.getContext('2d'), im2 = g2.createImageData(W, H), n = im2.data, S = 5.5;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const xl = hgt[y * W + ((x + W - 1) % W)], xr = hgt[y * W + ((x + 1) % W)], yu = hgt[Math.max(0, y - 1) * W + x], yd = hgt[Math.min(H - 1, y + 1) * W + x];
      let nx = (xl - xr) * S, ny = (yd - yu) * S * (W / H) * .5, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      const k = (y * W + x) * 4; n[k] = (nx * .5 + .5) * 255; n[k + 1] = (ny * .5 + .5) * 255; n[k + 2] = (nz * .5 + .5) * 255; n[k + 3] = 255;
    }
    g2.putImageData(im2, 0, 0);
    const normalMap = new T.CanvasTexture(c2); normalMap.wrapS = T.RepeatWrapping; normalMap.anisotropy = 8; normalMap.name = 'hull_normal';
    return { map, normalMap };
  }

  // ---------- helpers ----------
  // cylinder / frustum along X: rA at -X end, rB at +X end
  function xCyl(rA, rB, len, x, mat, o = {}) {
    const geo = new T.CylinderGeometry(rB, rA, len, o.seg || 48, 1, !!o.open, o.ts || 0, o.tl === undefined ? Math.PI * 2 : o.tl);
    geo.rotateZ(-Math.PI / 2);
    const m = new T.Mesh(geo, mat); m.position.set(x, o.y === undefined ? CY : o.y, o.z || 0); m.castShadow = m.receiveShadow = true; if (o.name) m.name = o.name; return m;
  }
  function strut(a, b, rad, mat, name) {
    const A = new T.Vector3(...a), B = new T.Vector3(...b), dir = B.clone().sub(A), len = dir.length();
    const m = new T.Mesh(new T.CylinderGeometry(rad, rad, len, 14), mat);
    m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
    m.castShadow = m.receiveShadow = true; if (name) m.name = name; return m;
  }
  function box(w, h, d, x, y, z, mat, name) { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; if (name) m.name = name; return m; }

  // ---------- builder ----------
  // opts: {id, name, length, legs (4|6), dust 0..1, sidePort bool, windows 1|2, seed}
  function buildHabitat(o) {
    const root = new T.Group(); root.name = o.id + '_' + o.name;
    const dust = o.dust, main = o.length - 1.4, half = main / 2, coneL = 0.55, endX = half + coneL;

    const M = {
      hull: (() => { const t = hullTexture(main, dust, o.seed || 7); return new T.MeshStandardMaterial({ name: 'hull', map: t.map, normalMap: t.normalMap, normalScale: new T.Vector2(1, 1), roughness: .86, metalness: 0 }); })(),
      white: new T.MeshStandardMaterial({ name: 'offwhite', color: mix(0xb9a788, DUST, .08 + dust * .3), roughness: .8, metalness: 0 }),
      metal: new T.MeshStandardMaterial({ name: 'dark_metal', color: mix(0x595854, DUST, .08 + dust * .3), roughness: .62, metalness: .7 }),
      lowMetal: new T.MeshStandardMaterial({ name: 'dark_metal_dusty', color: mix(0x595854, DUST, .3 + dust * .6), roughness: .85, metalness: .35 }),
      steel: new T.MeshStandardMaterial({ name: 'steel', color: mix(0xa9a8a2, DUST, .06 + dust * .35), roughness: .48, metalness: .85 }),
      orange: new T.MeshStandardMaterial({ name: 'accent_orange', color: mix(0xb5612c, DUST, .1 + dust * .3), roughness: .75, metalness: .05 }),
      glass: new T.MeshStandardMaterial({ name: 'window_glass', color: 0x0b0f13, roughness: .12, metalness: .7, emissive: 0xffb469, emissiveIntensity: .12 }),
      cyan: new T.MeshStandardMaterial({ name: 'light_cyan', color: 0x1a2426, emissive: 0xbfe9f0, emissiveIntensity: .9, roughness: .4 }),
      warm: new T.MeshStandardMaterial({ name: 'light_warm', color: 0x332211, emissive: 0xffd9a0, emissiveIntensity: 2.0, roughness: .4 }),
      radiator: new T.MeshStandardMaterial({ name: 'radiator', color: 0x1c1e22, roughness: .45, metalness: .6 })
    };

    // hull + tapered ends
    root.add(xCyl(R, R, main, 0, M.hull, { open: true, seg: 64, name: 'hull' }));
    for (const s of [-1, 1]) {
      root.add(xCyl(s < 0 ? 1.05 : R, s < 0 ? R : 1.05, coneL, s * (half + coneL / 2), M.white, { seg: 64, name: 'endcone' }));
      root.add(xCyl(R + .035, R + .035, .12, s * half, M.metal, { seg: 64, name: 'joint_ring' }));
      root.add(xCyl(R + .012, R + .012, .07, s * (half - .3), M.orange, { seg: 64, open: true, name: 'accent_stripe' }));
      root.add(xCyl(.93, .93, .1, s * (endX - .01), M.metal, { seg: 48, name: 'end_ring' }));
      // hatch
      const hx = s * (endX + .06);
      root.add(xCyl(.6, .6, .14, hx, M.white, { seg: 40, name: 'hatch_door' }));
      const frame = new T.Mesh(new T.TorusGeometry(.64, .075, 12, 48), M.metal); frame.rotation.y = Math.PI / 2; frame.position.set(s * (endX + .05), CY, 0); frame.castShadow = true; frame.name = 'hatch_frame'; root.add(frame);
      const glow = new T.Mesh(new T.TorusGeometry(.8, .03, 8, 64), M.steel); glow.rotation.y = Math.PI / 2; glow.position.set(s * (endX + .025), CY, 0); glow.name = 'hatch_light_ring'; root.add(glow);
      root.add(xCyl(.15, .15, .05, s * (endX + .13), M.glass, { seg: 24, y: CY + .22, name: 'hatch_porthole' }));
      root.add(xCyl(.18, .18, .04, s * (endX + .125), M.metal, { seg: 24, y: CY + .22, name: 'hatch_porthole_frame' }));
      root.add(box(.05, .06, .5, s * (endX + .15), CY - .16, 0, M.steel, 'hatch_handle'));
      root.add(box(.06, .1, .1, s * (endX + .13), CY - .16, .22, M.metal)); root.add(box(.06, .1, .1, s * (endX + .13), CY - .16, -.22, M.metal));
      root.add(box(.05, .16, .12, s * (endX + .1), CY, s * .62, M.orange, 'hatch_hinge'));
    }
    // intermediate ribs
    const nr = o.ribs || Math.max(1, Math.round(main / 2.4) - 1);
    for (let i = 1; i <= nr; i++) root.add(xCyl(R + .03, R + .03, .09, -half + i * main / (nr + 1), M.metal, { seg: 64, name: 'rib' }));

    // window strips: +Z side is theta 0, top is theta -PI/2
    const wLen = o.windows === 2 ? (main - 2.6) / 2 : main - 1.8, wC = o.windows === 2 ? [-(wLen / 2 + .85), wLen / 2 + .85] : [0];
    for (const side of [0, 1]) for (const x of wC) {
      const th = side ? Math.PI + .2 : -.2, tl = .2;
      root.add(xCyl(R + .012, R + .012, wLen + .16, x, M.metal, { open: true, seg: 10, ts: th - tl / 2 - .035, tl: tl + .07, name: 'window_frame' }));
      root.add(xCyl(R + .02, R + .02, wLen, x, M.glass, { open: true, seg: 10, ts: th - tl / 2, tl: tl, name: 'window_strip' }));
      const nm = Math.round(wLen / .75);
      for (let i = 1; i < nm; i++) root.add(xCyl(R + .026, R + .026, .035, x - wLen / 2 + i * wLen / nm, M.metal, { open: true, seg: 6, ts: th - tl / 2, tl: tl, name: 'window_mullion' }));
    }

    // side docking port (+Z, centre)
    if (o.sidePort) {
      const port = new T.Group(); port.name = 'side_docking_port';
      const add = (rA, len, z, mat, n) => { const m = new T.Mesh(new T.CylinderGeometry(rA, rA, len, 40), mat); m.rotation.x = Math.PI / 2; m.position.set(0, CY, z); m.castShadow = true; m.name = n; port.add(m); };
      add(.78, .62, R + .12, M.white, 'port_tunnel'); add(.86, .1, R + .42, M.metal, 'port_flange'); add(.62, .08, R + .46, M.white, 'port_door');
      add(.9, .14, R - .02, M.metal, 'port_collar'); add(.16, .05, R + .49, M.glass, 'port_porthole');
      const pg = new T.Mesh(new T.TorusGeometry(.7, .028, 8, 48), M.steel); pg.position.set(0, CY, R + .475); pg.name = 'port_light_ring'; port.add(pg);
      for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2; port.add(box(.12, .12, .1, Math.cos(a) * .8, CY + Math.sin(a) * .8, R + .44, M.orange, 'port_latch')); }
      root.add(port);
    }

    // legs
    const nPair = o.legs / 2, legX = Array.from({ length: nPair }, (_, i) => -(half - .75) + i * 2 * (half - .75) / (nPair - 1));
    legX.forEach((x, i) => {
      const splay = (i / (nPair - 1) - .5) * .6;
      for (const s of [-1, 1]) {
        const top = [x, CY - R * Math.cos(.87) + .04, s * R * Math.sin(.87)], foot = [x + splay, .12, s * 2.0];
        const lg = new T.Group(); lg.name = 'leg';
        lg.add(box(.42, .3, .26, top[0], top[1] - .02, top[2] + s * .03, M.metal, 'leg_mount'));
        const mid = [0, 1, 2].map(k => top[k] + (foot[k] - top[k]) * .55);
        lg.add(strut(top, mid, .1, M.steel, 'leg_upper')); lg.add(strut(mid, foot, .065, M.steel, 'leg_piston'));
        lg.add(strut([mid[0], mid[1] + .04, mid[2]], [mid[0], mid[1] - .04, mid[2]], .125, M.orange, 'leg_collar'));
        lg.add(strut([x, CY - R * Math.cos(.38), s * R * Math.sin(.38)], [foot[0], .3, foot[2] - s * .12], .04, M.lowMetal, 'leg_brace'));
        const pad = new T.Mesh(new T.CylinderGeometry(.34, .4, .1, 24), M.lowMetal); pad.position.set(foot[0], .05, foot[2]); pad.castShadow = pad.receiveShadow = true; pad.name = 'footpad'; lg.add(pad);
        const ball = new T.Mesh(new T.SphereGeometry(.11, 14, 10), M.lowMetal); ball.position.set(foot[0], .16, foot[2]); lg.add(ball);
        root.add(lg);
      }
    });

    // belly keel with pipes
    const kl = main - 1.9;
    root.add(box(kl, .26, .8, 0, CY - R - .06, 0, M.lowMetal, 'utility_keel'));
    root.add(xCyl(.06, .06, kl + .3, 0, M.steel, { seg: 12, y: CY - R - .02, z: .48, name: 'pipe' }));
    root.add(xCyl(.06, .06, kl + .3, 0, M.orange, { seg: 12, y: CY - R - .02, z: -.48, name: 'pipe' }));
    for (let i = 0; i < Math.round(kl / 1.2); i++) root.add(box(.5, .08, .5, -kl / 2 + .6 + i * 1.2, CY - R - .21, 0, M.metal, 'keel_hatch'));

    // roof spine, radiators, antenna, beacon
    root.add(box(main - 1.2, .09, .46, 0, CY + R + .02, 0, M.metal, 'roof_spine'));
    for (const s of [-1, 1]) { const rail = new T.Group(); rail.name = 'roof_rail'; const L = main - 1.6, n = Math.round(L / 1.1);
      rail.add(strut([-L / 2, CY + R + .32, s * .3], [L / 2, CY + R + .32, s * .3], .018, M.steel));
      for (let i = 0; i <= n; i++) rail.add(strut([-L / 2 + i * L / n, CY + R + .04, s * .3], [-L / 2 + i * L / n, CY + R + .32, s * .3], .016, M.steel)); root.add(rail); }
    const nRad = o.length > 8 ? 2 : 1;
    for (let i = 0; i < nRad; i++) { const rx = nRad === 1 ? -.7 : (i ? 1.9 : -2.6);
      for (const s of [-1, 1]) { const p = box(1.5, .04, .78, rx, CY + R - .05, s * .68, M.radiator, 'radiator_panel'); p.rotation.x = s * .62; root.add(p);
        for (let k = 0; k < 7; k++) { const f = box(.03, .045, .76, rx - .66 + k * .22, CY + R - .048, s * .68, M.steel, 'radiator_fin'); f.rotation.x = s * .62; root.add(f); } } }
    const ax = half - 1.1;
    root.add(box(.5, .22, .4, ax, CY + R + .16, 0, M.white, 'comms_box'));
    root.add(strut([ax, CY + R + .2, 0], [ax, CY + R + 1.25, 0], .028, M.steel, 'antenna_mast'));
    const dish = new T.Mesh(new T.SphereGeometry(.34, 24, 10, 0, Math.PI * 2, 0, 1.05), M.white); dish.material = M.white.clone(); dish.material.side = T.DoubleSide; dish.material.name = 'offwhite_doublesided';
    dish.scale.y = .45; dish.rotation.z = Math.PI - .5; dish.position.set(ax + .12, CY + R + 1.0, 0); dish.castShadow = true; dish.name = 'antenna_dish'; root.add(dish);
    const bx = -(half - .9);
    root.add(strut([bx, CY + R + .05, 0], [bx, CY + R + .5, 0], .022, M.steel, 'beacon_mast'));
    const bl = new T.Mesh(new T.SphereGeometry(.055, 12, 8), M.warm); bl.position.set(bx, CY + R + .53, 0); bl.name = 'beacon_light'; root.add(bl);

    // access ladder at the +X hatch
    const lad = new T.Group(); lad.name = 'access_ladder'; const lx0 = endX + .62, lx1 = endX + .2, ly = CY - .72;
    for (const s of [-1, 1]) { lad.add(strut([lx0, .03, s * .3], [lx1, ly, s * .3], .028, M.steel)); lad.add(strut([lx1, ly, s * .3], [lx1, ly + .95, s * .3], .022, M.orange)); lad.add(strut([lx1, ly, s * .3], [endX - .05, ly - .02, s * .3], .025, M.steel)); }
    for (let i = 1; i <= 6; i++) { const t = i / 7; lad.add(strut([lx0 + (lx1 - lx0) * t, .03 + (ly - .03) * t, -.3], [lx0 + (lx1 - lx0) * t, .03 + (ly - .03) * t, .3], .02, M.steel)); }
    lad.add(box(.36, .035, .72, endX + .08, ly, 0, M.metal, 'ladder_step_plate'));
    root.add(lad);

    // small work lights under the window line
    for (const s of [-1, 1]) for (const x of [-(half - .2), half - .2]) { const l = new T.Mesh(new T.SphereGeometry(.035, 10, 8), M.cyan); l.position.set(x, CY - .55, s * (R * Math.cos(.375) + .06)); l.name = 'marker_light'; root.add(l); }

    return root;
  }

  window.RSO_HAB = buildHabitat;
  window.RSO_MODELS = {
    W01_dust1_clean: () => buildHabitat({ id: 'W01', name: 'tube_habitat_short_dust1', length: 6, legs: 4, dust: .08, windows: 1, seed: 11 }),
    W01_dust2_light: () => buildHabitat({ id: 'W01', name: 'tube_habitat_short_dust2', length: 6, legs: 4, dust: .42, windows: 1, seed: 12 }),
    W01_dust3_heavy: () => buildHabitat({ id: 'W01', name: 'tube_habitat_short_dust3', length: 6, legs: 4, dust: .85, windows: 1, seed: 13 }),
    W02_sideport: () => buildHabitat({ id: 'W02', name: 'tube_habitat_medium_port', length: 10, legs: 6, dust: .42, windows: 2, sidePort: true, seed: 21 }),
    W02_plain: () => buildHabitat({ id: 'W02', name: 'tube_habitat_medium_plain', length: 10, legs: 6, dust: .42, windows: 2, sidePort: false, seed: 22 })
  };
})();
