// Red Station One - shared model kit (style A, realistic). Metres, Y up, origin on the ground.
(function () {
  const T = THREE, DUST = 0xa5552f;
  const rng = seed => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const mix = (a, b, t) => new T.Color(a).lerp(new T.Color(b), t);

  // weathered skin texture + normal map.
  // o: {W,H,seed,dust,base:[r,g,b],nU,nV,p (rib profile power),h:'xcyl'|'up'|'sphere',depth}
  function skin(o) {
    const W = o.W || 1024, H = o.H || 512, r = rng(o.seed || 1), dust = o.dust, p = o.p === undefined ? .55 : o.p;
    const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'), img = g.createImageData(W, H), d = img.data, hgt = new Float32Array(W * H);
    const N = 64, grid = new Float32Array(N * N); for (let i = 0; i < N * N; i++) grid[i] = r();
    const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = grid[(yi & 63) * N + (xi & 63)], b = grid[(yi & 63) * N + ((xi + 1) & 63)], cc = grid[((yi + 1) & 63) * N + (xi & 63)], dd = grid[((yi + 1) & 63) * N + ((xi + 1) & 63)];
      return a + (b - a) * sx + (cc - a) * sy + (a - b - cc + dd) * sx * sy; };
    const fbm = (x, y) => vn(x, y) * .5 + vn(x * 2.1, y * 2.1) * .28 + vn(x * 4.3, y * 4.3) * .14 + vn(x * 8.7, y * 8.7) * .08;
    const nU = o.nU || 0, nV = o.nV || 0, tone0 = []; for (let i = 0; i < 4096; i++) tone0.push(r());
    const base = o.base || [0.74, 0.65, 0.50], dc = new T.Color(DUST), dark = [0.2, 0.16, 0.12], asp = W / H;
    for (let y = 0; y < H; y++) { const v = 1 - y / H;
      for (let x = 0; x < W; x++) { const u = x / W;
        const fu = u * nU, fv = v * nV, bu = nU ? Math.pow(Math.abs(Math.sin(Math.PI * fu)), p) : 1, bv = nV ? Math.pow(Math.abs(Math.sin(Math.PI * fv)), p) : 1;
        const bulge = bu * bv, wr = fbm(u * 40, v * 40 / asp);
        hgt[y * W + x] = bulge + (wr - .5) * .08;
        const hh = o.h === 'xcyl' ? -Math.sin(2 * Math.PI * u) : o.h === 'sphere' ? -Math.cos(Math.PI * v) : o.h === 'tube' ? -Math.sin(2 * Math.PI * v) : 2 * v - 1;
        let tone = 0.9 + 0.13 * (tone0[(Math.floor(fu) * 31 + Math.floor(fv) * 17) & 4095] - .5) + 0.1 * (fbm(u * 9, v * 9 / asp) - .5);
        tone *= 0.62 + 0.38 * Math.pow(bulge, .5); tone *= 0.93 + 0.1 * Math.max(0, hh);
        let R = base[0] * tone, G = base[1] * tone, B = base[2] * tone;
        const st = Math.max(0, (o.h === 'xcyl' ? fbm(u * 3, v * 90) : fbm(u * 90, v * 3)) - .52) * 2.2 * (0.3 + 0.7 * Math.max(0, -hh + .3));
        R += (dark[0] - R) * st * .5; G += (dark[1] - G) * st * .5; B += (dark[2] - B) * st * .5;
        const low = Math.min(1, Math.max(0, (0.3 - hh) / 1.3)), top = o.h === 'up' ? 0 : Math.max(0, hh - .75) * 1.6;
        let a = dust * (Math.pow(low, 1.3) * 1.2 + top * .6 + (1 - bulge) * .35) * (0.55 + 0.9 * fbm(u * 14, v * 14 / asp)); a = Math.min(.9, a);
        R += (dc.r - R) * a; G += (dc.g - G) * a; B += (dc.b - B) * a;
        const k = (y * W + x) * 4; d[k] = R * 255; d[k + 1] = G * 255; d[k + 2] = B * 255; d[k + 3] = 255; } }
    g.putImageData(img, 0, 0);
    const map = new T.CanvasTexture(c); map.encoding = T.sRGBEncoding; map.wrapS = T.RepeatWrapping; map.anisotropy = 8; map.name = 'basecolor';
    const c2 = document.createElement('canvas'); c2.width = W; c2.height = H; const g2 = c2.getContext('2d'), im2 = g2.createImageData(W, H), n = im2.data, S = o.depth || 5;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const xl = hgt[y * W + ((x + W - 1) % W)], xr = hgt[y * W + ((x + 1) % W)], yu = hgt[Math.max(0, y - 1) * W + x], yd = hgt[Math.min(H - 1, y + 1) * W + x];
      let nx = (xl - xr) * S, ny = (yd - yu) * S, nz = 1; const l = Math.hypot(nx, ny, nz);
      const k = (y * W + x) * 4; n[k] = (nx / l * .5 + .5) * 255; n[k + 1] = (ny / l * .5 + .5) * 255; n[k + 2] = (nz / l * .5 + .5) * 255; n[k + 3] = 255; }
    g2.putImageData(im2, 0, 0);
    const normalMap = new T.CanvasTexture(c2); normalMap.wrapS = T.RepeatWrapping; normalMap.anisotropy = 8; normalMap.name = 'normal';
    return { map, normalMap };
  }
  function skinMat(name, o, extra) { const t = skin(o); return new T.MeshStandardMaterial(Object.assign({ name, map: t.map, normalMap: t.normalMap, roughness: .86, metalness: 0 }, extra || {})); }

  function mats(dust) {
    return {
      tan: new T.MeshStandardMaterial({ name: 'tan_paint', color: mix(0xb9a788, DUST, .08 + dust * .3), roughness: .8, metalness: 0 }),
      white: new T.MeshStandardMaterial({ name: 'offwhite_paint', color: mix(0xcfc8b8, DUST, .08 + dust * .3), roughness: .7, metalness: 0 }),
      metal: new T.MeshStandardMaterial({ name: 'dark_metal', color: mix(0x595854, DUST, .08 + dust * .3), roughness: .62, metalness: .7 }),
      lowMetal: new T.MeshStandardMaterial({ name: 'dark_metal_dusty', color: mix(0x595854, DUST, .3 + dust * .6), roughness: .85, metalness: .35 }),
      steel: new T.MeshStandardMaterial({ name: 'steel', color: mix(0xa9a8a2, DUST, .06 + dust * .35), roughness: .48, metalness: .85 }),
      orange: new T.MeshStandardMaterial({ name: 'accent_orange', color: mix(0xb5612c, DUST, .1 + dust * .3), roughness: .75, metalness: .05 }),
      glass: new T.MeshStandardMaterial({ name: 'window_glass', color: 0x0b0f13, roughness: .12, metalness: .7, emissive: 0xffb469, emissiveIntensity: .12 }),
      black: new T.MeshStandardMaterial({ name: 'black_rubber', color: mix(0x1b1b1c, DUST, dust * .35), roughness: .9, metalness: .1 }),
      radiator: new T.MeshStandardMaterial({ name: 'radiator', color: 0x1c1e22, roughness: .45, metalness: .6 }),
      lamp: new T.MeshStandardMaterial({ name: 'status_light', color: 0x1a2426, emissive: 0xbfe9f0, emissiveIntensity: .9, roughness: .4 })
    };
  }
  const sh = m => { m.castShadow = m.receiveShadow = true; return m; };
  // cylinders: X axis (rA at -X, rB at +X), Y axis (rB bottom, rT top; y = base), Z axis
  function xCyl(rA, rB, len, x, y, z, mat, o = {}) { const geo = new T.CylinderGeometry(rB, rA, len, o.seg || 40, 1, !!o.open, o.ts || 0, o.tl === undefined ? Math.PI * 2 : o.tl); geo.rotateZ(-Math.PI / 2); const m = sh(new T.Mesh(geo, mat)); m.position.set(x, y, z); m.name = o.name || ''; return m; }
  function yCyl(rB, rT, h, x, y, z, mat, o = {}) { const m = sh(new T.Mesh(new T.CylinderGeometry(rT, rB, h, o.seg || 40, 1, !!o.open), mat)); m.position.set(x, y + h / 2, z); m.name = o.name || ''; return m; }
  function zCyl(r, len, x, y, z, mat, o = {}) { const geo = new T.CylinderGeometry(r, r, len, o.seg || 32, 1, !!o.open); geo.rotateX(Math.PI / 2); const m = sh(new T.Mesh(geo, mat)); m.position.set(x, y, z); m.name = o.name || ''; return m; }
  function strut(a, b, rad, mat, name) { const A = new T.Vector3(...a), B = new T.Vector3(...b), dir = B.clone().sub(A), len = dir.length(); const m = sh(new T.Mesh(new T.CylinderGeometry(rad, rad, len, 12), mat)); m.position.copy(A).add(B).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize()); m.name = name || ''; return m; }
  function box(w, h, d, x, y, z, mat, name) { const m = sh(new T.Mesh(new T.BoxGeometry(w, h, d), mat)); m.position.set(x, y, z); m.name = name || ''; return m; }
  // box with textured sides and plain top/bottom
  function boxT(w, h, d, x, y, z, side, cap, name) { const m = sh(new T.Mesh(new T.BoxGeometry(w, h, d), [side, side, cap, cap, side, side])); m.position.set(x, y, z); m.name = name || ''; return m; }
  function ball(r, x, y, z, mat, o = {}) { const m = sh(new T.Mesh(new T.SphereGeometry(r, o.seg || 40, o.rows || 24, 0, Math.PI * 2, o.ps || 0, o.pl === undefined ? Math.PI : o.pl), mat)); m.position.set(x, y, z); if (o.sy) m.scale.y = o.sy; if (o.sx) m.scale.x = o.sx; m.name = o.name || ''; return m; }
  function torus(R, t, x, y, z, mat, axis, name) { const m = sh(new T.Mesh(new T.TorusGeometry(R, t, 10, 48), mat)); if (axis === 'x') m.rotation.y = Math.PI / 2; if (axis === 'y') m.rotation.x = Math.PI / 2; m.position.set(x, y, z); m.name = name || ''; return m; }
  function pad(x, z, mat, r) { r = r || .3; const g = new T.Group(); g.add(yCyl(r + .05, r, .08, x, 0, z, mat, { seg: 20, name: 'footpad' })); return g; }

  window.KIT = { T, DUST, rng, mix, skin, skinMat, mats, xCyl, yCyl, zCyl, strut, box, boxT, ball, torus, pad };
})();
