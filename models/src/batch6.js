// Red Station One - C01 / C02 colonist, realistic bulky pressure suit (v2)
(function () {
  const { T, DUST, mix, skin, mats, xCyl, yCyl, zCyl, strut, box, ball, torus } = KIT;
  const G = name => { const g = new T.Group(); g.name = name; return g; }, sh = m => { m.castShadow = m.receiveShadow = true; return m; };
  const COL = { orange: 0xc8641f, blue: 0x2f6f9c, green: 0x4f8a5b, yellow: 0xc2a23a };
  const lin = (hex, d) => mix(hex, DUST, d || 0).convertSRGBToLinear();
  const Y = new T.Vector3(0, 1, 0);
  let fabricN = null;

  // lathe-profile limb from a to b. keys: [[t, r], ...], rip: [t0, t1, count, amp] = convolute folds
  function tube(a, b, keys, mat, name, rip, sz, lo) { const A = new T.Vector3(...a), B = new T.Vector3(...b), dir = B.clone().sub(A), len = dir.length(), pts = [], n = lo ? 3 : (rip ? 22 : 10);
    for (let i = 0; i <= n; i++) { const t = i / n; let k = 0; while (k < keys.length - 2 && t > keys[k + 1][0]) k++; const u = Math.min(1, Math.max(0, (t - keys[k][0]) / (keys[k + 1][0] - keys[k][0]))), s = u * u * (3 - 2 * u); let r = keys[k][1] + (keys[k + 1][1] - keys[k][1]) * s;
      if (rip && t >= rip[0] && t <= rip[1]) { const w = (t - rip[0]) / (rip[1] - rip[0]); r += rip[3] * Math.abs(Math.sin(Math.PI * w * rip[2])) * Math.sin(Math.PI * w) + rip[3] * .4 * Math.sin(Math.PI * w); }
      pts.push(new T.Vector2(Math.max(.001, r), t * len)); }
    const m = sh(new T.Mesh(new T.LatheGeometry(pts, lo ? 7 : 16), mat)); m.quaternion.setFromUnitVectors(Y, dir.clone().normalize()); m.position.copy(A); if (sz) m.scale.z = sz; m.name = name || ''; return m; }
  function hose(points, r, mat, name) { const c = new T.CatmullRomCurve3(points.map(p => new T.Vector3(...p))), m = sh(new T.Mesh(new T.TubeGeometry(c, 18, r, 7, false), mat)); m.name = name || 'hose'; return m; }
  function ell(rx, ry, rz, x, y, z, mat, name) { const m = ball(1, x, y, z, mat, { seg: 18, rows: 12, name }); m.scale.set(rx, ry, rz); return m; }

  function colonist(name, accent, pose, tool) { const M = mats(.3), root = G(name);
    if (!fabricN) { fabricN = skin({ W: 512, H: 512, seed: 601, dust: 0, depth: 16 }).normalMap; fabricN.wrapT = T.RepeatWrapping; fabricN.name = 'fabric_normal'; }
    const fab = (n, hex, d) => new T.MeshStandardMaterial({ name: n, color: lin(hex, d), roughness: .92, metalness: 0, normalMap: fabricN, normalScale: new T.Vector2(.9, .9), side: T.DoubleSide });
    const suit = fab('suit_fabric', 0xc2c0ba, .04), suitLow = fab('suit_fabric_dusty', 0xc2c0ba, .32), patch = fab('suit_patch', 0xb2b0a9, .08), glove = fab('glove', 0x55585f, .12), bootM = fab('overshoe', 0xb9b6ae, .5), pack = fab('backpack_cover', 0xbcbab4, .06);
    const a = new T.MeshStandardMaterial({ name: 'accent_' + accent, color: lin(COL[accent], .06), roughness: .8 }), visor = new T.MeshStandardMaterial({ name: 'visor_gold', color: lin(0x6b4a1c), roughness: .06, metalness: 1 }), sole = new T.MeshStandardMaterial({ name: 'sole', color: lin(0x6f6a62, .45), roughness: .95 });
    const blue = new T.MeshStandardMaterial({ name: 'connector_blue', color: lin(0x2a358c), roughness: .35, metalness: .6 }), red = new T.MeshStandardMaterial({ name: 'connector_red', color: lin(0xa5262a), roughness: .35, metalness: .6 }), alu = new T.MeshStandardMaterial({ name: 'aluminium', color: lin(0xa4a6a8), roughness: .4, metalness: .85 }), blk = new T.MeshStandardMaterial({ name: 'black', color: 0x101012, roughness: .6 });
    const hoseM = fab('hose_cover', 0xc6c4be, .05);

    // ---- legs ----
    for (const s of [-1, 1]) { const hip = [s * .115, .95, 0], knee = [s * .135, .53, .025], ank = [s * .14, .13, 0];
      root.add(tube(hip, knee, [[0, .128], [.35, .125], [.75, .112], [1, .108]], suit, 'thigh')); root.add(tube(knee, ank, [[0, .108], [.3, .112], [.75, .1], [1, .1]], suitLow, 'shin', [.72, .98, 3, .007]));
      root.add(ell(.108, .09, .108, knee[0], knee[1], knee[2], suit, 'knee')); const kp = ell(.075, .09, .022, knee[0], knee[1] + .01, knee[2] + .095, patch, 'knee_patch'); root.add(kp);
      const pk = G('thigh_pocket'); pk.add(box(.13, .2, .045, 0, 0, 0, patch, 'pocket')); pk.add(box(.135, .05, .05, 0, .08, 0, patch, 'pocket_flap')); pk.add(box(.136, .012, .052, 0, .05, 0, a, 'pocket_stripe')); pk.position.set(s * .2, .7, .055); pk.rotation.set(-.06, s * .95, s * -.05); root.add(pk);
      root.add(tube([ank[0], .2, 0], [ank[0], .05, 0], [[0, .1], [.4, .112], [1, .115]], bootM, 'boot_shaft')); root.add(ell(.108, .075, .17, ank[0], .085, .055, bootM, 'boot')); const so = yCyl(1, 1, .04, ank[0], 0, .05, sole, { seg: 24, name: 'boot_sole' }); so.scale.set(.112, 1, .178); root.add(so);
      root.add(tube([ank[0], .235, 0], [ank[0], .2, 0], [[0, .104], [.5, .112], [1, .104]], patch, 'boot_cuff')); }
    // ---- torso ----
    root.add(ell(.2, .15, .155, 0, .95, 0, suit, 'pelvis')); root.add(tube([0, .9, 0], [0, 1.6, 0], [[0, .17], [.3, .178], [.68, .21], [.88, .2], [1, .135]], suit, 'torso', null, .8));
    root.add(ell(.275, .1, .165, 0, 1.51, -.005, suit, 'shoulder_yoke')); root.add(box(.11, .15, .02, 0, .95, .152, patch, 'crotch_flap')); const cf = ell(.06, .05, .012, 0, .87, .15, patch, 'crotch_flap_tip'); root.add(cf);
    for (const s of [-1, 1]) root.add(box(.022, .34, .012, s * .115, 1.2, .163, patch, 'restraint_strap'));
    // chest control unit + connectors
    const cu = G('chest_unit'); cu.add(box(.2, .135, .085, 0, 1.41, .2, pack, 'unit')); cu.add(box(.06, .07, .01, 0, 1.415, .245, blk, 'unit_display')); cu.add(box(.21, .02, .09, 0, 1.485, .2, alu, 'unit_top')); for (const k of [-1, 1]) cu.add(box(.02, .1, .03, k * .11, 1.46, .16, patch, 'unit_strap')); root.add(cu);
    const con = [[-.06, 1.27, blue], [.06, 1.27, blue], [-.085, 1.17, blue], [.085, 1.17, blue], [-.07, 1.07, red], [.07, 1.07, red]];
    con.forEach(([x, y, m], i) => { const z = .168 + (y - 1.07) * .05; root.add(zCyl(.034, .045, x, y, z, m, { seg: 18, name: 'suit_connector' })); root.add(zCyl(.04, .012, x, y, z - .015, alu, { seg: 18, name: 'connector_base' })); root.add(zCyl(.02, .02, x, y, z + .03, i % 2 ? m : alu, { seg: 12, name: 'connector_knob' })); });
    root.add(hose([[-.06, 1.27, .2], [-.12, 1.25, .225], [-.21, 1.2, .15], [-.245, 1.17, -.02], [-.2, 1.2, -.17]], .027, hoseM, 'oxygen_hose')); root.add(hose([[-.085, 1.17, .2], [-.14, 1.12, .22], [-.215, 1.08, .13], [-.235, 1.08, -.04], [-.19, 1.12, -.17]], .027, hoseM, 'oxygen_hose'));
    root.add(hose([[.085, 1.17, .2], [.14, 1.13, .225], [.215, 1.08, .14], [.235, 1.07, -.04], [.19, 1.1, -.17]], .025, hoseM, 'water_hose')); root.add(hose([[.07, 1.07, .2], [.12, 1.03, .2], [.17, 1.01, .12]], .02, hoseM, 'hose_stub')); root.add(hose([[.06, 1.47, .2], [.14, 1.56, .15], [.17, 1.62, 0], [.14, 1.62, -.16]], .008, blk, 'comm_cable'));
    // ---- helmet ----
    root.add(tube([0, 1.56, 0], [0, 1.64, 0], [[0, .15], [.5, .158], [1, .15]], patch, 'neck_bellows', [0, 1, 2, .006])); root.add(torus(.152, .016, 0, 1.635, 0, alu, 'y', 'neck_ring'));
    root.add(ell(.172, .182, .178, 0, 1.775, .005, suit, 'helmet_shell')); const v = sh(new T.Mesh(new T.SphereGeometry(1, 20, 12, Math.PI / 2 - 1.12, 2.24, .42, 1.45), visor)); v.scale.set(.176, .186, .184); v.position.set(0, 1.775, .008); v.name = 'visor'; root.add(v);
    const rim = sh(new T.Mesh(new T.SphereGeometry(1, 20, 2, Math.PI / 2 - 1.2, 2.4, .36, .09), patch)); rim.scale.set(.18, .19, .187); rim.position.set(0, 1.775, .008); rim.name = 'visor_shade'; root.add(rim);
    // ---- backpack ----
    const bp = G('backpack'); bp.add(box(.42, .5, .19, 0, 1.36, -.25, pack, 'pack_main')); bp.add(xCyl(.095, .095, .42, 0, 1.61, -.25, pack, { seg: 14, name: 'pack_top_roll' }));
    bp.add(box(.34, .12, .16, 0, 1.72, -.245, pack, 'pack_upper_unit')); bp.add(xCyl(.08, .08, .34, 0, 1.78, -.245, pack, { seg: 14, name: 'pack_upper_roll' })); bp.add(box(.425, .03, .195, 0, 1.2, -.25, a, 'pack_stripe')); bp.add(box(.28, .1, .02, 0, 1.42, -.35, patch, 'pack_panel')); bp.add(box(.1, .04, .03, .1, 1.7, -.33, alu, 'pack_valve'));
    bp.add(strut([-.13, 1.82, -.26], [-.13, 2.02, -.28], .005, alu, 'pack_antenna')); for (const k of [-1, 1]) { bp.add(hose([[k * .16, 1.58, -.16], [k * .19, 1.63, -.04], [k * .17, 1.56, .1], [k * .13, 1.44, .15]], .022, patch, 'shoulder_strap')); bp.add(box(.03, .3, .03, k * .19, 1.15, -.15, patch, 'waist_strap')); } root.add(bp);
    // ---- arms ----
    const arm = (s, sh2, el, wr) => { root.add(ell(.128, .128, .125, ...sh2, suit, 'shoulder')); root.add(tube(sh2, el, [[0, .112], [.5, .1], [1, .094]], suit, 'upper_arm', [.05, .32, 3, .006])); root.add(tube(el, wr, [[0, .094], [.4, .09], [1, .074]], suit, 'forearm', [0, .25, 3, .006])); root.add(ell(.096, .096, .096, ...el, suit, 'elbow'));
      const A = new T.Vector3(...sh2), E = new T.Vector3(...el), W = new T.Vector3(...wr), d1 = E.clone().sub(A).normalize(), d2 = W.clone().sub(E).normalize();
      const band = tube(A.clone().addScaledVector(d1, .16).toArray(), A.clone().addScaledVector(d1, .2).toArray(), [[0, .106], [1, .104]], a, 'arm_band'); root.add(band);
      if (s < 0) { const ap = G('arm_pocket'); ap.add(box(.1, .1, .03, 0, 0, 0, patch)); ap.add(box(.105, .03, .034, 0, .035, 0, patch)); const p = A.clone().addScaledVector(d1, .14); ap.position.set(p.x + s * .09, p.y, p.z + .04); ap.quaternion.setFromUnitVectors(Y, d1); ap.rotateY(s * .6); root.add(ap); }
      const hand = G('glove'); hand.add(yCyl(.076, .076, .035, 0, -.02, 0, alu, { seg: 20, name: 'wrist_ring' })); hand.add(tube([0, .01, 0], [0, .07, 0], [[0, .07], [1, .062]], glove, 'gauntlet')); const palm = ell(.05, .06, .032, 0, .12, 0, glove, 'palm'); hand.add(palm);
      for (let i = 0; i < 4; i++) { const fx = (i - 1.5) * .024; hand.add(tube([fx, .16, 0], [fx * 1.1, .215, .012], [[0, .0135], [1, .012]], glove, 'finger', null, null, true)); hand.add(tube([fx * 1.1, .215, .012], [fx * 1.15, .25, .03], [[0, .012], [.8, .011], [1, .006]], glove, 'finger_tip', null, null, true)); }
      hand.add(tube([-s * .04, .1, .01], [-s * .075, .15, .035], [[0, .017], [1, .014]], glove, 'thumb', null, null, true)); hand.add(tube([-s * .075, .15, .035], [-s * .08, .185, .05], [[0, .014], [.8, .012], [1, .006]], glove, 'thumb_tip', null, null, true));
      hand.position.copy(W); hand.quaternion.setFromUnitVectors(Y, d2); if (pose !== 'T') hand.rotateY(s * 1.2); root.add(hand); return { W, d2 }; };
    if (pose === 'T') { for (const s of [-1, 1]) arm(s, [s * .27, 1.5, 0], [s * .56, 1.5, 0], [s * .83, 1.5, 0]); }
    else { arm(-1, [-.27, 1.5, 0], [-.36, 1.2, -.02], [-.365, .95, .07]); const r = arm(1, [.27, 1.5, 0], [.365, 1.2, -.02], [.37, .95, .07]); const h = r.W.clone().addScaledVector(r.d2, .2);
      if (tool === 'case') { const t = G('tool_case'); t.add(box(.1, .22, .34, h.x, h.y - .2, h.z, a, 'case')); t.add(box(.105, .016, .345, h.x, h.y - .17, h.z, alu, 'case_seam')); for (const k of [-1, 1]) { t.add(box(.11, .045, .028, h.x, h.y - .17, h.z + k * .1, alu, 'case_latch')); t.add(box(.012, .07, .012, h.x, h.y - .055, h.z + k * .06, blk, 'case_handle')); } t.add(box(.018, .018, .14, h.x, h.y - .02, h.z, blk, 'case_handle')); root.add(t); }
      else { const t = G('survey_pole'); t.add(strut([h.x + .02, .02, h.z + .12], [h.x, h.y + .75, h.z - .06], .013, alu, 'pole')); t.add(box(.1, .08, .1, h.x, h.y + .8, h.z - .06, pack, 'sensor_head')); t.add(ball(.02, h.x, h.y + .86, h.z - .06, M.lamp, { seg: 8, rows: 6 })); t.add(yCyl(.03, .008, .05, h.x + .02, 0, h.z + .12, alu, { seg: 8, name: 'pole_tip' })); root.add(t); } }
    return root; }

  const m = {}; for (const c of ['orange', 'blue', 'green', 'yellow']) m['C01_colonist_tpose_' + c] = () => colonist('C01_colonist_tpose_' + c, c, 'T');
  m.C02_colonist_toolcase = () => colonist('C02_colonist_toolcase', 'orange', 'relaxed', 'case'); m.C02_colonist_survey_pole = () => colonist('C02_colonist_survey_pole', 'orange', 'relaxed', 'pole'); window.RSO_MODELS = m;
})();
