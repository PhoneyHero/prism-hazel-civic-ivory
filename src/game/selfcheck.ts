import type { Actor, Match, Species, StageId } from "./types";
import { LOAM_VERSION, createMatch } from "./engine";
import { PATH_BLOOM_CAP, PATH_BLOOM_CHANCE, nutrientBand } from "./soil";
import { SPECIES_ORDER } from "./units";

export function runEcologySelfCheck(): string[] {
  const errors: string[] = [];

  function entranceX(match: Match) {
    for (let i = 0; i < match.tiles.length; i++) {
      if (match.tiles[i].kind === "entrance") return i % match.cols;
    }
    return 1;
  }

  function floorHolds(match: Match) {
    for (const t of match.tiles) {
      if ((t.kind === "dug" || t.kind === "entrance") && (t.nutrient > 0 || t.mana > 0 || t.nSub > 0 || t.mSub > 0)) return true;
    }
    return false;
  }

  function wallScore(match: Match) {
    let s = 0;
    for (const t of match.tiles) {
      if (t.kind !== "soil") continue;
      s += t.nutrient * 3 + t.nSub + t.mana * 3 + t.mSub;
    }
    return s;
  }

  const m = createMatch("hollow", 42);
  const hud0 = m.hud();
  if (hud0.maxDig !== 140) errors.push(`hollow dig ${hud0.maxDig}`);
  if (hud0.waveTotal !== 3) errors.push(`hollow waves ${hud0.waveTotal}`);
  if (hud0.clock !== 260) errors.push(`hollow clock ${hud0.clock}`);
  if (m.cols !== 24 || m.rows !== 18) errors.push(`hollow grid ${m.cols}x${m.rows}`);
  if (!hud0.version.startsWith(LOAM_VERSION)) errors.push(`version ${hud0.version}`);
  if (floorHolds(m)) errors.push("fresh hollow stores soil on a floor");
  let wallN = 0;
  for (const t of m.tiles) if (t.kind === "soil" && t.nutrient > 0) wallN++;
  if (wallN < 1) errors.push("no nutrient walls");

  const ex = entranceX(m);
  m.setTool("dig");
  m.tap(ex, 3);
  if (m.born.moss < 1) errors.push("guaranteed N1 did not birth a loamite");
  const baby = m.actors.find((a) => a.alive && a.species === "moss");
  if (baby && (baby.sleep > 0 || baby.rest !== 0)) errors.push("newborn loamite was asleep");
  const dug = m.tiles[3 * m.cols + ex];
  if (dug.kind !== "dug" || dug.nutrient !== 0 || dug.mana !== 0) errors.push("dug floor kept a store");

  for (const a of m.actors) {
    if (a.kind !== "monster") continue;
    a.age = 999;
    a.vitality = 999;
    a.satiety = 8;
    a.hungerCd = 999;
    a.hunger = 999;
    a.hp = 90;
    a.maxHp = 90;
  }

  let hero: Actor | undefined;
  for (let i = 0; i < 80 * 30 && m.hud().phase === "play"; i++) {
    m.tick(1 / 30);
    hero = m.actors.find((a) => a.alive && a.kind === "hero");
    if (hero) break;
  }
  if (!m.actors.some((a) => a.alive && a.kind === "overlord")) errors.push("auto throne missing");
  if (!hero) errors.push("hero never spawned");
  else if (hero.staminaMax !== 90) errors.push(`wave 1 stamina ${hero.staminaMax}`);
  else if (hero.heroClass === "swordsman" && (hero.maxHp !== Math.round(76 * 0.82) + 50 || hero.atk !== Math.round(9 * 0.82) + 10)) {
    errors.push(`wave 1 swordsman ${hero.maxHp}/${hero.atk}`);
  }
  const lord = m.actors.find((a) => a.alive && a.kind === "overlord");
  if (hero && lord && m.hud().phase === "play") {
    if (m.hud().lordLeft !== 0) errors.push(`hunt move still open ${m.hud().lordLeft}`);
    const x0 = lord.x;
    const y0 = lord.y;
    m.setTool("lord");
    m.tap(ex, 2);
    if (lord.x !== x0 || lord.y !== y0) errors.push("warden moved during the hunt");
    for (const a of m.actors) {
      if (a.kind === "monster") {
        a.x = 0;
        a.y = 0;
        a.fx = 0;
        a.fy = 0;
      }
    }
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [dx, dy] of dirs) {
      const nx = lord.x + dx;
      const ny = lord.y + dy;
      const t = m.tiles[ny * m.cols + nx];
      if (!t || (t.kind !== "dug" && t.kind !== "entrance")) continue;
      if (m.actors.some((a) => a.alive && a.x === nx && a.y === ny && a.kind !== "hero")) continue;
      hero.x = nx;
      hero.y = ny;
      hero.fx = nx;
      hero.fy = ny;
      hero.carrying = false;
      break;
    }
    for (let i = 0; i < 20 && m.hud().lordState !== "carried" && m.hud().phase === "play"; i++) m.tick(1 / 30);
    if (m.hud().lordState !== "carried") errors.push(`grab failed ${m.hud().lordState}`);
    if (!m.focus || m.focus.until < m.time) errors.push("warden seize did not snap focus");
  }

  for (const a of m.actors) if (a.kind === "hero") a.alive = false;
  const beforeStipend = m.hud().digPower;
  m.tick(1 / 30);
  if (m.hud().phase === "play") {
    if (m.hud().digPower < beforeStipend + 25) errors.push(`stipend ${m.hud().digPower} vs ${beforeStipend}`);
    if (!m.hud().eco) errors.push("eco wait did not start");
    if (m.hud().upgradeOpen || m.hud().petition) errors.push("shop opened itself");
    const heard = `${m.hud().banner ?? ""} ${m.hud().event ?? ""}`;
    if (!heard.toLowerCase().includes("held")) errors.push(`held banner missing ${heard}`);
    if (m.hud().petition) errors.push("aye bar opened before the breath");
    for (let i = 0; i < 110 && !m.hud().petition; i++) m.tick(1 / 30);
    const seated = m.actors.find((a) => a.alive && a.kind === "overlord");
    if (!seated) errors.push("no warden to petition");
    else if (!m.hud().petition) errors.push("aye bar did not open after 3s");
    else if (!m.focus || m.focus.until < m.time) errors.push("wave 1 did not snap to the warden");
    else {
      m.answerPetition(false);
      if (m.hud().petition || m.hud().upgradeOpen) errors.push("petition nay did not close");
      m.tap(seated.x, seated.y);
      if (!m.hud().petition) errors.push("warden tap did not reopen");
      m.answerPetition(true);
      if (!m.hud().upgradeOpen) errors.push("petition aye did not open the shop");
      const said = `${m.hud().event ?? ""} ${m.hud().banner ?? ""}`;
      if (!said.toLowerCase().includes("born after")) errors.push(`first aye line missing ${said}`);
    }
    if (m.hud().lordLeft !== 1) errors.push(`eco move ${m.hud().lordLeft}`);
    const unit = m.actors.find((a) => a.alive && a.species === "moss");
    if (!unit) errors.push("no living loamite for the upgrade check");
    else {
      const hp = unit.hp;
      const max = unit.maxHp;
      const atk = unit.atk;
      m.buyUpgrade("moss");
      if (unit.hp !== hp || unit.maxHp !== max || unit.atk !== atk) errors.push("upgrade buffed a living loamite");
      const offer = m.hud().upgrades.find((u) => u.id === "moss");
      if (!offer || offer.tier !== 1) errors.push(`loamite tier ${offer?.tier}`);
    }
  }

  const tax = createMatch("hollow", 4);
  tax.setTool("dig");
  tax.tap(entranceX(tax), 3);
  const body = tax.actors.find((a) => a.alive && a.species === "moss");
  if (!body) errors.push("tax match had no loamite");
  else {
    body.carryN = 4;
    for (const t of tax.tiles) {
      if (t.kind === "soil") {
        t.nutrient = 0;
        t.nSub = 0;
        t.mana = 0;
        t.mSub = 0;
      }
    }
    tax.setTool("smash");
    tax.tap(body.x, body.y);
    let any = false;
    for (const t of tax.tiles) {
      if (t.kind !== "soil") {
        if (t.nutrient || t.mana) errors.push("smash wrote soil onto a floor");
      } else if (t.nutrient > 0) any = true;
    }
    if (!any) errors.push("death tax vanished");
    let poured = 0;
    for (const t of tax.tiles) if (t.kind === "soil") poured += t.nutrient;
    if (poured !== 2) errors.push(`death tax poured ${poured}`);
  }

  const wilt = createMatch("hollow", 5);
  wilt.setTool("dig");
  wilt.tap(entranceX(wilt), 3);
  const host = wilt.actors.find((a) => a.alive && a.species === "moss");
  if (!host) errors.push("wilt match had no loamite");
  else {
    host.carryN = 0;
    host.vitality = 0.01;
    wilt.tick(1 / 30);
    if (host.brood !== "bud" || host.alive !== true) errors.push("tired loamite did not root");
    if (wilt.blooms.length) errors.push("a bud is not a floor flower");
    for (const t of wilt.tiles) {
      if (t.kind === "soil") {
        t.nutrient = 0;
        t.nSub = 0;
        t.mana = 0;
        t.mSub = 0;
      }
    }
    const beforeBorn = wilt.born.moss;
    host.carryN = 12;
    host.brood = "bloom";
    host.hatch = 0.01;
    host.alive = true;
    wilt.tick(1 / 30);
    if (wilt.born.moss <= beforeBorn) errors.push("bloom did not hatch");
    const smashed = wilt.actors.find((a) => a.alive && a.species === "moss");
    if (!smashed) errors.push("no loamite left to smash");
    else {
      smashed.brood = "bloom";
      smashed.carryN = 11;
      smashed.speed = 0;
      for (const t of wilt.tiles) {
        if (t.kind === "soil") {
          t.nutrient = 0;
          t.nSub = 0;
        }
      }
      const bornAt = wilt.born.moss;
      wilt.setTool("smash");
      wilt.tap(smashed.x, smashed.y);
      if (wilt.born.moss < bornAt + 1) errors.push("smash did not hatch");
      let peaked = 0;
      for (const t of wilt.tiles) if (t.kind === "soil" && t.nutrient > peaked) peaked = t.nutrient;
      if (peaked !== 0) errors.push(`smash of a bloom dumped ${peaked}`);
    }
  }

  const bones = createMatch("hollow", 6);
  bones.setTool("dig");
  bones.tap(entranceX(bones), 3);
  for (const a of bones.actors) {
    if (a.kind === "monster") {
      a.age = 999;
      a.vitality = 999;
      a.satiety = 8;
      a.hungerCd = 999;
    a.hunger = 999;
      a.hp = 40;
      a.maxHp = 40;
    }
  }
  let victim: Actor | undefined;
  for (let i = 0; i < 80 * 30 && bones.hud().phase === "play"; i++) {
    bones.tick(1 / 30);
    victim = bones.actors.find((a) => a.alive && a.kind === "hero");
    if (victim) break;
  }
  const guard = bones.actors.find((a) => a.alive && a.kind === "monster");
  if (!victim || !guard) errors.push("remains setup missed a hero");
  else {
    const hx = entranceX(bones);
    for (const [x, y] of [
      [hx, 2],
      [hx, 3],
      [hx, 4],
      [hx + 1, 4],
    ] as const) {
      const t = bones.tiles[y * bones.cols + x];
      if (!t || t.kind === "bedrock") continue;
      t.kind = "dug";
      t.nutrient = 0;
      t.mana = 0;
      t.nSub = 0;
      t.mSub = 0;
    }
    const seated = bones.actors.find((a) => a.alive && a.kind === "overlord");
    if (seated) {
      seated.x = hx;
      seated.y = 2;
    }
    victim.x = hx;
    victim.y = 4;
    victim.fx = hx;
    victim.fy = 4;
    victim.carrying = false;
    victim.hp = 3;
    victim.moveCd = 50;
    guard.x = hx;
    guard.y = 3;
    guard.atk = 80;
    guard.swingCd = 0;
    for (const t of bones.tiles) {
      if (t.kind === "soil") {
        t.nutrient = 0;
        t.nSub = 0;
        t.mana = 0;
        t.mSub = 0;
      }
    }
    for (let i = 0; i < 90 && bones.corpses.length < 1 && bones.hud().phase === "play"; i++) bones.tick(1 / 30);
    if (bones.corpses.length < 1) errors.push("hero death left no remains");
    else if (wallScore(bones) < 20 || bones.corpses[0].n !== 0) {
      errors.push(`swordsman tithe walls ${wallScore(bones)} pile ${bones.corpses[0].n}`);
    } else {
      const pile = bones.corpses[0];
      for (let i = 0; i < 30 * 30; i++) bones.tick(1 / 30);
      if (!bones.corpses.some((c) => c.x === pile.x && c.y === pile.y)) errors.push("remains despawned");
      const score = wallScore(bones);
      bones.setTool("dig");
      bones.tap(pile.x, pile.y);
      if (bones.born.skeleton < 1) errors.push("pick did not raise a rattle");
      if (wallScore(bones) > score) errors.push("raising a rattle splashed the walls");
      const ratt = bones.actors.find((a) => a.alive && a.species === "skeleton");
      if (!ratt) errors.push("rattle missing");
      else {
        ratt.hatch = 0.02;
        const raised = bones.born.skeleton;
        bones.tap(pile.x, pile.y);
        if (bones.born.skeleton !== raised) errors.push("second tap raised another rattle");
        bones.tick(1 / 30);
        if (bones.corpses.length) errors.push("spent rattle left remains");
        bones.tap(pile.x, pile.y);
        if (bones.born.skeleton !== raised) errors.push("dead rattle rose again");
      }
    }
  }

  const closed = createMatch("hollow", 11);
  closed.setTool("dig");
  closed.tap(entranceX(closed), 3);
  for (let i = 0; i < 30 * 30; i++) closed.tick(1 / 30);
  if (closed.digs !== 1) errors.push("closed hollow dug on its own");
  if (closed.born.lizard > 0 || closed.born.drake > 0) errors.push("closed hollow birthed a late chain");

  const shaft = createMatch("hollow", 2);
  shaft.setTool("dig");
  const shaftX = entranceX(shaft);
  for (let y = 3; y <= 9; y++) shaft.tap(shaftX, y);
  if (shaft.born.moss < 1) errors.push(`shaft chain ${JSON.stringify(shaft.born)}`);
  if (shaft.born.crawler > 0 && shaft.born.moss < 1) errors.push("gnawling before a loamite");
  let n1a = 0;
  let res = 0;
  let trace = 0;
  let interior = 0;
  for (let y = 1; y < shaft.rows - 1; y++) {
    for (let x = 1; x < shaft.cols - 1; x++) {
      const t = shaft.tiles[y * shaft.cols + x];
      if (t.kind !== "soil") continue;
      interior++;
      if (nutrientBand(t.nutrient) === 0 && t.mana === 0 && t.nutrient >= 1 && t.nutrient <= 6) trace++;
      else if (t.nutrient > 0 || t.mana > 0) {
        res++;
        if (nutrientBand(t.nutrient) === 1 && t.nSub === 0) n1a++;
      }
    }
  }
  if (trace < interior * 0.3) errors.push(`trace dirt ${trace}/${interior}`);
  if (n1a < 8) errors.push(`n1a clusters ${n1a}`);
  if (res < 20) errors.push(`resource walls ${res}`);

  const ten = createMatch("hollow", 42);
  ten.setTool("dig");
  let n1Digs = 0;
  for (let i = 0; i < 24 && ten.born.moss < 10; i++) {
    const opts = ten.listDiggable().filter((o) => nutrientBand(o.n) === 1);
    if (!opts.length) break;
    ten.tap(opts[0].x, opts[0].y);
    n1Digs += 1;
  }
  if (ten.born.moss < 10) errors.push(`N1 births ${ten.born.moss} after ${n1Digs} digs`);

  const held = createMatch("mossworks", 3);
  held.setTool("dig");
  for (let i = 0; i < 8 && held.born.moss < 6; i++) {
    const opts = held.listDiggable().filter((o) => nutrientBand(o.n) >= 1);
    if (!opts.length) break;
    held.tap(opts[0].x, opts[0].y);
  }
  for (let i = 0; i < 20 * 30; i++) held.tick(1 / 30);
  const liveMoss = held.actors.filter((a) => a.alive && a.species === "moss").length;
  if (held.born.moss < 6 || liveMoss < 6) errors.push(`mossworks starved in prep born ${held.born.moss} live ${liveMoss}`);

  for (const id of ["hollow", "mossworks", "gate", "witchwell", "bone", "deep", "chamber"] as StageId[]) {
    const map = createMatch(id, 4);
    let walls = 0;
    let banded = 0;
    let n1 = 0;
    let mana = 0;
    let trace = 0;
    let interior = 0;
    for (const t of map.tiles) {
      if (t.kind === "dug" || t.kind === "entrance") {
        if (t.nutrient || t.mana) errors.push(`${id} floor holds soil`);
        continue;
      }
      if (t.kind !== "soil") continue;
      interior++;
      if (nutrientBand(t.nutrient) === 0 && t.mana === 0 && t.nutrient >= 1 && t.nutrient <= 6) trace++;
      else if (t.nutrient > 0 || t.mana > 0) {
        walls++;
        if (nutrientBand(t.nutrient) >= 1 && t.mana === 0) {
          banded++;
          if (nutrientBand(t.nutrient) === 1) n1++;
        }
        if (t.mana > 0 && nutrientBand(t.nutrient) === 0) mana++;
      }
    }
    if (walls < 12) errors.push(`${id} too few resource walls ${walls}`);
    if (trace < interior * 0.25) errors.push(`${id} trace dirt ${trace}/${interior}`);
    const n1Share = n1 / Math.max(1, banded);
    if (id === "hollow" || id === "mossworks" || id === "bone" || id === "deep") {
      if (n1Share < 0.45) errors.push(`${id} n1 share ${n1Share.toFixed(2)}`);
    }
    if ((id === "witchwell" || id === "chamber") && mana < 4) errors.push(`${id} mana pockets ${mana}`);
    if (floorHolds(map)) errors.push(`${id} floor holds soil`);
  }

  const gate = createMatch("gate", 3);
  if (gate.hud().maxDig !== 180) errors.push(`gate dig power ${gate.hud().maxDig}`);
  if (gate.hud().waveTotal !== 5) errors.push(`gate waves ${gate.hud().waveTotal}`);
  if (gate.cols !== 24 || gate.rows !== 18) errors.push(`gate grid ${gate.cols}x${gate.rows}`);

  const gateEco = createMatch("gate", 9);
  gateEco.setTool("dig");
  for (let n = 0; n < 24 && gateEco.born.moss + gateEco.born.crawler + gateEco.born.lizard < 1; n++) {
    const opts = gateEco.listDiggable();
    if (!opts.length) break;
    opts.sort((a, b) => b.n - a.n || b.y - a.y);
    gateEco.tap(opts[0].x, opts[0].y);
  }
  for (const a of gateEco.actors) {
    if (a.kind === "monster") {
      a.satiety = 8;
      a.hungerCd = 999;
    a.hunger = 999;
      a.age = 999;
      a.vitality = 999;
      a.hp = 80;
      a.maxHp = 80;
    }
  }
  let armed = false;
  for (let i = 0; i < 140 * 30 && gateEco.hud().phase === "play"; i++) {
    gateEco.tick(1 / 30);
    const heroes = gateEco.actors.filter((a) => a.alive && a.kind === "hero");
    if (heroes.length) {
      for (const h of heroes) h.alive = false;
      armed = true;
      break;
    }
  }
  if (!armed) errors.push(`eco test never saw a hero (${gateEco.hud().phase})`);
  if (armed && gateEco.hud().phase !== "play") errors.push(`eco test lost before the wait (${gateEco.hud().phase})`);
  const dig0 = gateEco.hud().digPower;
  gateEco.tick(1 / 30);
  if (armed && gateEco.hud().phase === "play" && gateEco.hud().digPower < dig0 + 25) {
    errors.push(`stipend ${gateEco.hud().digPower} vs ${dig0}`);
  }
  if (armed && gateEco.hud().phase === "play" && !gateEco.hud().eco) errors.push("eco wait did not start");
  for (let i = 0; i < 45 * 30 && gateEco.hud().phase === "play"; i++) gateEco.tick(1 / 30);
  if (armed && (gateEco.actors.some((a) => a.alive && a.kind === "hero") || gateEco.hud().waveNum > 1)) {
    errors.push(`wave 2 early num ${gateEco.hud().waveNum}`);
  }
  for (let i = 0; i < 12 * 30 && gateEco.hud().phase === "play"; i++) gateEco.tick(1 / 30);
  if (armed && gateEco.hud().phase === "play" && gateEco.hud().waveNum < 2) errors.push("wave 2 late");

  const chamber = createMatch("chamber", 3);
  if (!chamber.hud().endless || chamber.hud().maxDig !== 300) errors.push(`chamber setup ${chamber.hud().maxDig}`);
  if (chamber.cols !== 28 || chamber.rows !== 20) errors.push(`chamber grid ${chamber.cols}x${chamber.rows}`);
  if (floorHolds(chamber)) errors.push("chamber floor holds soil");
  chamber.summon();
  if (chamber.hud().raidActive || chamber.hud().summoning) errors.push("chamber summoned with an empty throne");
  chamber.setTool("lord");
  let seated = false;
  for (let y = 2; y < chamber.rows - 1 && !seated; y++) {
    for (let x = 1; x < chamber.cols - 1; x++) {
      const t = chamber.tiles[y * chamber.cols + x];
      if (t.kind !== "dug") continue;
      chamber.tap(x, y);
      if (chamber.hud().lordState === "seated") {
        seated = true;
        break;
      }
    }
  }
  if (!seated) errors.push("chamber throne");

  const deep = createMatch("deep", 1);
  if (deep.hud().maxDig !== 220) errors.push(`deep dig ${deep.hud().maxDig}`);
  if (deep.hud().waveTotal !== 7) errors.push(`deep waves ${deep.hud().waveTotal}`);
  const bone = createMatch("bone", 1);
  if (bone.hud().waveTotal !== 6 || bone.hud().maxDig !== 200) errors.push("bone setup");
  const witch = createMatch("witchwell", 1);
  if (witch.hud().waveTotal !== 6 || witch.hud().maxDig !== 180) errors.push("witchwell setup");
  const mossworks = createMatch("mossworks", 1);
  if (mossworks.hud().waveTotal !== 5 || mossworks.hud().maxDig !== 160) errors.push("mossworks setup");

  const mageRun = createMatch("witchwell", 2);
  mageRun.setTool("dig");
  mageRun.tap(entranceX(mageRun), 3);
  for (const a of mageRun.actors) {
    if (a.kind === "monster") {
      a.age = 999;
      a.vitality = 999;
      a.satiety = 8;
      a.hungerCd = 999;
    a.hunger = 999;
      a.hp = 80;
      a.maxHp = 80;
    }
  }
  let mage: Actor | undefined;
  for (let i = 0; i < 70 * 30 && mageRun.hud().phase === "play"; i++) {
    mageRun.tick(1 / 30);
    mage = mageRun.actors.find((a) => a.alive && a.kind === "hero");
    if (mage) break;
  }
  if (!mage) errors.push("witchwell mage never arrived");
  else {
    const px = entranceX(mageRun);
    for (const [x, y] of [
      [px, 2],
      [px, 3],
      [px, 4],
      [px + 1, 4],
    ]) {
      const t = mageRun.tiles[y * mageRun.cols + x];
      if (!t || t.kind === "bedrock") continue;
      t.kind = "dug";
      t.nutrient = 0;
      t.mana = 0;
      t.nSub = 0;
      t.mSub = 0;
    }
    const seated = mageRun.actors.find((a) => a.alive && a.kind === "overlord");
    if (seated) {
      seated.x = px;
      seated.y = 2;
    }
    mage.x = px;
    mage.y = 4;
    mage.fx = px;
    mage.fy = 4;
    mage.carrying = false;
    const pileX = px + 1;
    const gy = 4;
    const gx = px;
    mageRun.corpses.push({
      x: pileX,
      y: gy,
      life: 1e9,
      n: 0,
      m: 0,
      manaAtDeath: 0,
      cls: null,
      spirits: 0,
      red: false,
    });
    for (const t of mageRun.tiles) {
      if (t.kind === "soil") {
        t.nutrient = 0;
        t.nSub = 0;
        t.mana = 0;
        t.mSub = 0;
      }
    }
    const guard = mageRun.actors.find((a) => a.alive && a.kind === "monster");
    if (guard) {
      const step = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].find(([dx, dy]) => {
        const x = gx + dx;
        const y = gy + dy;
        const t = mageRun.tiles[y * mageRun.cols + x];
        if (!t || (t.kind !== "dug" && t.kind !== "entrance")) return false;
        return !mageRun.corpses.some((c) => c.x === x && c.y === y);
      });
      if (step) {
        guard.x = gx + step[0];
        guard.y = gy + step[1];
        guard.atk = 90;
        guard.swingCd = 0;
      }
    }
    mage.hp = 2;
    mage.moveCd = 5;
    for (let i = 0; i < 60 && mageRun.hud().phase === "play" && mage.alive; i++) mageRun.tick(1 / 30);
    const fresh = mageRun.corpses.find((c) => c.x === gx && c.y === gy);
    if (!fresh || fresh.m !== 0 || (fresh.manaAtDeath ?? 0) < 6) errors.push(`mage remains m ${fresh?.m ?? "none"} mag ${fresh?.manaAtDeath}`);
    let manaPts = 0;
    for (const t of mageRun.tiles) if (t.kind === "soil") manaPts += t.mana;
    if (manaPts < 10) errors.push("mage death did not feed a wall");
    const beside = mageRun.corpses.find((c) => c.x === pileX && c.y === gy);
    if (beside && beside.m !== 0) errors.push("adjacent remains drank the mage");
    if (fresh) {
      mageRun.setTool("dig");
      mageRun.tap(fresh.x, fresh.y);
      const ratt = mageRun.actors.find((a) => a.alive && a.species === "skeleton");
      if (!ratt || ratt.rattle !== 1) errors.push(`mage rattle ${ratt?.rattle}`);
    }
  }

  const loop = createMatch("hollow", 16);
  loop.setTool("dig");
  loop.tap(entranceX(loop), 3);
  for (const a of loop.actors) {
    if (a.kind === "monster") {
      a.age = 999;
      a.vitality = 999;
      a.satiety = 2;
      a.hungerCd = 999;
    a.hunger = 999;
      a.hp = 40;
      a.maxHp = 40;
      a.feedCd = 0;
    }
  }
  let walker: Actor | undefined;
  for (let i = 0; i < 80 * 30 && loop.hud().phase === "play"; i++) {
    loop.tick(1 / 30);
    walker = loop.actors.find((a) => a.alive && a.kind === "hero");
    if (walker) break;
  }
  if (!walker) errors.push("loop hero missing");
  else {
    for (const t of loop.tiles) {
      if (t.kind === "dug") {
        t.kind = "soil";
        t.nutrient = 0;
        t.nSub = 0;
        t.mana = 0;
        t.mSub = 0;
      }
    }
    const x0 = 4;
    const y0 = 8;
    for (const [x, y] of [
      [x0, y0],
      [x0 + 1, y0],
      [x0 + 1, y0 + 1],
      [x0, y0 + 1],
    ]) {
      const t = loop.tiles[y * loop.cols + x];
      t.kind = "dug";
      t.nutrient = 0;
      t.nSub = 0;
      t.mana = 0;
      t.mSub = 0;
    }
    const wall = loop.tiles[(y0 - 1) * loop.cols + x0];
    wall.kind = "soil";
    wall.nutrient = 1;
    wall.nSub = 0;
    wall.mana = 0;
    wall.mSub = 0;
    walker.heroClass = "mage";
    walker.mag = 8;
    walker.x = x0;
    walker.y = y0;
    walker.fx = x0;
    walker.fy = y0;
    walker.pathTx = x0;
    walker.pathTy = y0 - 1;
    walker.windup = 0.01;
    walker.moveCd = 5;
    walker.dir = 0;
    loop.tick(0.05);
    if (wall.mana <= 0 || wall.nutrient > 0) errors.push(`mage bolt n${wall.nutrient} m${wall.mana}`);
    const lord = loop.actors.find((a) => a.alive && a.kind === "overlord");
    if (!lord) errors.push("loop warden missing");
    else {
      for (let y = 1; y < loop.rows - 1; y++) {
        for (let x = 1; x < loop.cols - 1; x++) {
          const onLine = x === lord.x || y === lord.y || (x >= x0 && x <= lord.x && y === y0) || (y >= Math.min(y0, lord.y) && y <= Math.max(y0, lord.y) && x === lord.x);
          if (!onLine && !(x === x0 && y === y0)) continue;
          const t = loop.tiles[y * loop.cols + x];
          if (t.kind === "bedrock") continue;
          t.kind = "dug";
          t.nutrient = 0;
          t.mana = 0;
          t.nSub = 0;
          t.mSub = 0;
        }
      }
      const tLord = loop.tiles[lord.y * loop.cols + lord.x];
      tLord.kind = "dug";
      tLord.nutrient = 0;
      tLord.mana = 0;
      walker.x = x0;
      walker.y = y0;
      walker.fx = x0;
      walker.fy = y0;
      walker.windup = 0;
      walker.swingCd = 0;
      walker.moveCd = 0;
      walker.carrying = false;
      walker.stamina = 160;
      walker.staminaMax = 160;
      walker.heroClass = "swordsman";
      for (const a of loop.actors) {
        if (a.kind === "monster") {
          a.x = 0;
          a.y = 0;
        }
      }
      const seen = new Set<string>();
      for (let i = 0; i < 8; i++) {
        loop.tick(0.45);
        seen.add(`${walker.x},${walker.y}`);
      }
      const leftPocket = [...seen].some((key) => {
        const [sx, sy] = key.split(",").map(Number);
        return sx < x0 || sx > x0 + 1 || sy < y0 || sy > y0 + 1;
      });
      if (!leftPocket) errors.push(`hero stayed in a left-hand pocket ${[...seen].join(" ")}`);
      const pocket = loop.tiles[y0 * loop.cols + x0];
      pocket.kind = "dug";
      const only = loop.tiles[y0 * loop.cols + (x0 + 1)];
      only.kind = "dug";
      for (let d = 0; d < 4; d++) {
        const nx = x0 + [0, 1, 0, -1][d];
        const ny = y0 + [-1, 0, 1, 0][d];
        if (nx === x0 + 1 && ny === y0) continue;
        const t = loop.tiles[ny * loop.cols + nx];
        if (!t || t.kind === "bedrock") continue;
        t.kind = "soil";
        t.nutrient = 0;
        t.mana = 0;
      }
      walker.x = x0;
      walker.y = y0;
      walker.alive = true;
      walker.moveCd = 0;
      const friend = { ...walker, id: walker.id + 500, x: x0 + 1, y: y0, carrying: false, alive: true };
      const far = { ...walker, id: walker.id + 501, x: 2, y: 2, carrying: false, alive: true };
      loop.actors.push(friend, far);
      loop.tick(0.05);
      const mine = loop.probeIntel(walker.id);
      const shared = loop.probeIntel(friend.id);
      const radio = loop.probeIntel(far.id);
      if (!mine || mine.dead < 1) errors.push(`dead-end flag missing ${mine?.dead}`);
      else if (!shared || shared.dead < mine.dead) errors.push(`adjacent hero missed the flag ${shared?.dead} vs ${mine.dead}`);
      else if (radio && radio.dead > 0) errors.push(`far hero heard the flag ${radio.dead}`);
    }
  }

  if (chamber.hud().clock !== null) errors.push("chamber clock");

  if (PATH_BLOOM_CHANCE !== 0.005 || PATH_BLOOM_CAP !== 6) errors.push("path bloom rate");

  const wipe = createMatch("hollow", 18);
  wipe.setTool("dig");
  const wx = entranceX(wipe);
  for (let y = 3; y <= 10; y++) wipe.tap(wx, y);
  for (const a of wipe.actors) {
    if (a.kind === "monster") {
      a.age = 999;
      a.vitality = 999;
      a.hp = 80;
      a.maxHp = 80;
      a.satiety = 8;
      a.hungerCd = 999;
    a.hunger = 999;
    }
  }
  let carrier: Actor | undefined;
  for (let i = 0; i < 80 * 30 && wipe.hud().phase === "play"; i++) {
    wipe.tick(1 / 30);
    carrier = wipe.actors.find((a) => a.alive && a.kind === "hero");
    if (carrier) break;
  }
  if (!carrier) errors.push("empty census hero missing");
  else {
    for (const a of wipe.actors) if (a.kind === "monster") a.alive = false;
    carrier.moveCd = 99;
    carrier.stamina = 90;
    for (let i = 0; i < 45; i++) wipe.tick(1 / 30);
    if (wipe.hud().phase !== "play") errors.push(`empty census ended play (${wipe.hud().phase})`);
    const lord = wipe.actors.find((a) => a.alive && a.kind === "overlord");
    if (!lord) errors.push("empty census warden missing");
    else {
      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (const [dx, dy] of dirs) {
        const nx = lord.x + dx;
        const ny = lord.y + dy;
        const t = wipe.tiles[ny * wipe.cols + nx];
        if (!t || (t.kind !== "dug" && t.kind !== "entrance")) continue;
        carrier.x = nx;
        carrier.y = ny;
        carrier.fx = nx;
        carrier.fy = ny;
        carrier.moveCd = 0;
        carrier.carrying = false;
        break;
      }
      for (let i = 0; i < 12 && wipe.hud().lordState !== "carried" && wipe.hud().phase === "play"; i++) wipe.tick(1 / 30);
      if (wipe.hud().lordState !== "carried") errors.push("empty census grab failed");
      carrier.x = entranceX(wipe);
      carrier.y = 1;
      carrier.fx = carrier.x;
      carrier.fy = carrier.y;
      wipe.tick(1 / 30);
      if (wipe.hud().phase !== "lose") errors.push(`stair carry stayed ${wipe.hud().phase}`);
    }
  }

  const clk = createMatch("hollow", 19);
  clk.setTool("dig");
  const cx = entranceX(clk);
  for (let y = 3; y <= 10; y++) clk.tap(cx, y);
  for (let i = 0; i < 280 && clk.hud().phase === "play"; i++) {
    for (const a of clk.actors) {
      if (a.kind === "hero") {
        a.moveCd = 999;
        a.stamina = 400;
      }
    }
    clk.tick(1);
  }
  if (clk.hud().phase !== "win" || !String(clk.hud().result?.reason ?? "").toLowerCase().includes("clock")) {
    errors.push(`clock win ${clk.hud().phase} ${clk.hud().result?.reason ?? ""}`);
  }

  const red = createMatch("hollow", 4);
  red.setTool("dig");
  const rx = entranceX(red);
  const manaWall = red.tiles[3 * red.cols + rx];
  manaWall.kind = "soil";
  manaWall.nutrient = 0;
  manaWall.nSub = 0;
  manaWall.mana = 14;
  manaWall.mSub = 0;
  manaWall.hardness = 1;
  red.tap(rx, 3);
  let wisp = red.actors.find((a) => a.alive && a.species === "spirit");
  if (!wisp) errors.push("no wisp for the red pile");
  else {
    red.corpses.push({
      x: wisp.x,
      y: wisp.y,
      life: 1e9,
      n: 0,
      m: 0,
      manaAtDeath: 1,
      cls: "swordsman",
      spirits: 4,
      red: false,
    });
    red.tick(1 / 30);
    const pile = red.corpses.find((c) => c.x === wisp!.x && c.y === wisp!.y);
    if (!pile || !pile.red || pile.spirits < 5) errors.push(`red pile ${pile?.spirits} ${pile?.red}`);
    if (wisp.alive) errors.push("wisp was not consumed");
    let before = 0;
    for (const t of red.tiles) if (t.kind === "soil") before += t.nutrient + t.mana;
    red.setTool("dig");
    red.tap(wisp.x, wisp.y);
    const ratt = red.actors.find((a) => a.alive && a.species === "skeleton" && a.rattle === 3);
    if (!ratt) errors.push("red remains did not raise a red rattle");
    else {
      red.setTool("smash");
      red.tap(ratt.x, ratt.y);
      let after = 0;
      for (const t of red.tiles) if (t.kind === "soil") after += t.nutrient + t.mana;
      if (after !== before) errors.push(`rattle death fed the walls ${before}->${after}`);
    }
  }

  const hunt = createMatch("hollow", 21);
  hunt.setTool("dig");
  const hx = entranceX(hunt);
  const paintN = (x: number, y: number, n: number) => {
    const t = hunt.tiles[y * hunt.cols + x];
    t.kind = "soil";
    t.nutrient = n;
    t.nSub = 0;
    t.mana = 0;
    t.mSub = 0;
    t.hardness = 1;
  };
  paintN(hx, 3, 12);
  paintN(hx + 1, 3, 12);
  paintN(hx - 1, 3, 12);
  paintN(hx, 4, 34);
  paintN(hx, 5, 60);
  hunt.tap(hx, 3);
  hunt.tap(hx + 1, 3);
  hunt.tap(hx - 1, 3);
  hunt.tap(hx, 4);
  hunt.tap(hx, 5);
  const liz = hunt.actors.find((a) => a.alive && a.species === "lizard");
  if (!liz) errors.push("hungry scalekin test had no scalekin");
  else {
    const mosses = hunt.actors.filter((a) => a.alive && a.species === "moss");
    for (const extra of mosses.slice(3)) extra.alive = false;
    for (const a of hunt.actors) {
      if (a.alive && a.kind === "monster" && a !== liz && a.species !== "moss") a.alive = false;
    }
    hunt.tick(1 / 30);
    const bed = hunt.actors.filter((a) => a.alive && a.species === "moss");
    if (bed.length < 3) errors.push(`thin moss bed ${bed.length}`);
    else {
      const snack = bed[0];
      liz.hp = liz.maxHp;
      liz.satiety = 8;
      liz.rest = 0;
      liz.sleep = 0;
      liz.feedCd = 0;
      liz.moveCd = 0;
      liz.x = snack.x;
      liz.y = snack.y;
      snack.moveCd = 99;
      hunt.tick(0.2);
      if (!snack.alive) errors.push("full scalekin ate the third loamite");
      const hungry = hunt.actors.find((a) => a.alive && a.species === "moss");
      if (!hungry) errors.push("no loamite left for the hungry scalekin");
      else {
        hungry.moveCd = 99;
        liz.hp = liz.maxHp;
        liz.satiety = 1;
        liz.feedCd = 0;
        liz.moveCd = 0;
        liz.sleep = 0;
        liz.x = hungry.x;
        liz.y = hungry.y;
        hunt.tick(0.2);
        if (hungry.alive) errors.push("hungry scalekin skipped a loamite");
      }
    }
  }

  const waveHero = m.actors.find((a) => a.kind === "hero");
  if (waveHero && waveHero.staminaMax !== 0 && waveHero.staminaMax !== 90) errors.push(`wave 1 stamina late ${waveHero.staminaMax}`);

  function seal(match: Match, open: [number, number][]) {
    for (const t of match.tiles) {
      if (t.kind === "bedrock") continue;
      t.kind = "soil";
      t.nutrient = 0;
      t.mana = 0;
      t.nSub = 0;
      t.mSub = 0;
      t.hardness = 1;
    }
    for (const [x, y] of open) {
      const t = match.tiles[y * match.cols + x];
      if (!t) continue;
      t.kind = "dug";
      t.nutrient = 0;
      t.mana = 0;
      t.nSub = 0;
      t.mSub = 0;
    }
  }

  const nav = createMatch("hollow", 31);
  seal(nav, [
    [5, 8],
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
  ]);
  const deadHero = nav.plantHero("swordsman", 5, 8);
  const trail: string[] = [];
  for (let i = 0; i < 5; i++) {
    nav.tick(0.2);
    trail.push(`${deadHero.x},${deadHero.y}`);
  }
  if (deadHero.x === 5 && deadHero.y === 8) errors.push(`dead-end hero stayed ${trail.join(" ")}`);
  if (trail.filter((p, i) => i > 0 && p === "5,8").length > 0) errors.push(`dead-end shuffle ${trail.join(" ")}`);

  const pair = createMatch("hollow", 32);
  seal(pair, [
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
    [8, 8],
    [6, 9],
    [6, 10],
  ]);
  const lead = pair.plantHero("swordsman", 6, 10);
  const mate = pair.plantHero("archer", 6, 9);
  pair.tick(1 / 30);
  lead.x = 8;
  lead.y = 8;
  lead.fx = 8;
  lead.fy = 8;
  lead.path = null;
  lead.job = "";
  mate.x = 6;
  mate.y = 9;
  mate.fx = 6;
  mate.fy = 9;
  mate.path = null;
  mate.job = "";
  let recleared = false;
  for (let i = 0; i < 16; i++) {
    pair.tick(0.25);
    if (mate.x === 6 && mate.y === 10) recleared = true;
  }
  if (recleared) errors.push("adjacent hero re-cleared the same spur");

  const truck = createMatch("hollow", 33);
  seal(truck, [
    [3, 8],
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
  ]);
  const hauler = truck.plant("moss", 6, 8);
  hauler.vitality = 999;
  hauler.carryN = 0;
  hauler.brood = "walk";
  hauler.speed = 1.65;
  const rich = truck.tiles[7 * truck.cols + 3];
  rich.kind = "soil";
  rich.nutrient = 40;
  rich.mana = 0;
  let suckedAt = -1;
  for (let i = 0; i < 40; i++) {
    truck.tick(0.25);
    if (hauler.carryN >= 5 && suckedAt < 0) suckedAt = hauler.x;
    if (hauler.carryN < 5 && suckedAt >= 0) break;
  }
  let dumped = 0;
  for (const t of truck.tiles) if (t.kind === "soil" && t !== rich) dumped += t.nutrient;
  if (suckedAt < 0 || suckedAt > 4) errors.push(`loamite rich walk ${suckedAt} carry ${hauler.carryN}`);
  if (dumped < 5) errors.push(`loamite dump ${dumped}`);

  const gnaw = createMatch("hollow", 34);
  seal(gnaw, [
    [4, 8],
    [5, 8],
  ]);
  const meal = gnaw.plant("moss", 4, 8);
  meal.moveCd = 99;
  meal.brood = "walk";
  const grub = gnaw.plant("crawler", 4, 8);
  grub.vitality = 3;
  grub.carryN = 54;
  grub.feedCd = 0;
  grub.moveCd = 0;
  gnaw.tick(0.2);
  if (grub.form !== "pupa" || grub.speed !== 0) errors.push(`cocoon ${grub.form} ${grub.speed}`);
  const cocoonX = grub.x;
  const cocoonY = grub.y;
  grub.hatch = 0.02;
  gnaw.tick(0.05);
  if (grub.x !== cocoonX || grub.y !== cocoonY) errors.push("cocoon walked");
  if (grub.form !== "fly") errors.push(`fly form ${grub.form}`);

  const nest = createMatch("hollow", 35);
  seal(nest, [
    [4, 8],
    [5, 8],
    [4, 9],
    [5, 9],
    [4, 10],
    [5, 10],
    [6, 8],
    [7, 8],
    [8, 8],
  ]);
  const scaler = nest.plant("lizard", 8, 8);
  scaler.satiety = 8;
  scaler.hp = scaler.maxHp;
  scaler.vitality = 3;
  scaler.hungerCd = 999;
  scaler.age = 999;
  let nested = false;
  for (let i = 0; i < 24 && !nested; i++) {
    nest.tick(0.25);
    if (scaler.x >= 4 && scaler.x <= 5 && scaler.y >= 8 && scaler.y <= 10) nested = true;
  }
  if (!nested) errors.push(`scalekin nest ${scaler.x},${scaler.y}`);

  const hall = createMatch("hollow", 36);
  seal(hall, [
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
  ]);
  const wyrm = hall.plant("drake", 4, 10);
  wyrm.satiety = 8;
  wyrm.swingCd = 0;
  wyrm.vitality = 0;
  wyrm.hungerCd = 999;
  const foe = hall.plantHero("swordsman", 9, 10);
  foe.moveCd = 50;
  foe.hp = 90;
  foe.maxHp = 90;
  const hp0 = foe.hp;
  hall.tick(0.4);
  if (foe.hp >= hp0) errors.push(`wyrm breath missed hp ${foe.hp}`);
  if (wyrm.y !== 10) errors.push(`wyrm left hall y ${wyrm.y}`);

  const hex = createMatch("hollow", 37);
  const hexRow: [number, number][] = [];
  for (let x = 3; x <= 12; x++) hexRow.push([x, 8]);
  seal(hex, hexRow);
  const wife = hex.plant("witch", 3, 8);
  wife.satiety = 8;
  wife.hungerCd = 999;
  wife.age = 999;
  for (let i = 0; i < 16; i++) hex.tick(0.3);
  if (hex.webs.length < 1) errors.push("hexwife left no web");
  const blocked = hex.plantHero("swordsman", 12, 8);
  hex.tiles[8 * hex.cols + 8].kind = "soil";
  hex.tiles[8 * hex.cols + 8].nutrient = 0;
  wife.x = 3;
  wife.y = 8;
  wife.moveCd = 99;
  wife.swingCd = 0;
  blocked.x = 12;
  blocked.y = 8;
  blocked.moveCd = 99;
  blocked.hp = 50;
  blocked.maxHp = 50;
  hex.tick(0.4);
  if (blocked.hp < 50) errors.push("hex shot through a wall");
  hex.tiles[8 * hex.cols + 8].kind = "dug";
  wife.x = 3;
  wife.y = 8;
  wife.swingCd = 0;
  blocked.x = 6;
  blocked.y = 8;
  blocked.hp = 50;
  hex.tick(0.4);
  if (blocked.hp >= 50) errors.push("hex missed a clear lane");

  const box = createMatch("hollow", 38);
  seal(box, [[6, 8]]);
  box.plantHero("knight", 6, 8);
  const power = box.hud().digPower;
  for (let i = 0; i < 9; i++) box.tick(1);
  let opened = 0;
  for (const [dx, dy] of [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ] as const) {
    const t = box.tiles[(8 + dy) * box.cols + (6 + dx)];
    if (t && (t.kind === "dug" || t.kind === "entrance")) opened += 1;
  }
  if (opened < 1) errors.push("frustrated hero did not break a wall");
  if (box.hud().digPower !== power) errors.push(`frustration spent dig power ${box.hud().digPower}`);

  const dirt = createMatch("hollow", 39);
  const dirtX = entranceX(dirt);
  const dirtWall = dirt.tiles[2 * dirt.cols + (dirtX + 1)];
  dirtWall.kind = "soil";
  dirtWall.nutrient = 4;
  dirtWall.mana = 0;
  dirtWall.nSub = 0;
  dirtWall.mSub = 0;
  dirtWall.hardness = 1;
  const born0 = dirt.born.moss;
  let beforeN = 0;
  for (const [ox, oy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const) {
    const t = dirt.tiles[(2 + oy) * dirt.cols + (dirtX + 1 + ox)];
    if (t && t.kind === "soil") beforeN += t.nutrient;
  }
  dirt.setTool("dig");
  dirt.tap(dirtX + 1, 2);
  let afterN = 0;
  for (const [ox, oy] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const) {
    const t = dirt.tiles[(2 + oy) * dirt.cols + (dirtX + 1 + ox)];
    if (t && t.kind === "soil") afterN += t.nutrient;
  }
  if (dirt.born.moss !== born0) errors.push("a 4-nutrient wall birthed");
  if (afterN !== beforeN + 4) errors.push(`dirt split ${beforeN}->${afterN}`);

  function ortho(match: Match, x: number, y: number, fluid: "n" | "m") {
    let s = 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const t = match.tiles[(y + dy) * match.cols + (x + dx)];
      if (t && t.kind === "soil") s += fluid === "n" ? t.nutrient : t.mana;
    }
    return s;
  }

  const low = createMatch("hollow", 81);
  const lowX = entranceX(low) + 1;
  const lowWall = low.tiles[2 * low.cols + lowX];
  lowWall.kind = "soil";
  lowWall.hardness = 1;
  lowWall.nutrient = 6;
  lowWall.mana = 0;
  const lowBorn = SPECIES_ORDER.reduce((n, id) => n + low.born[id], 0);
  const lowBefore = ortho(low, lowX, 2, "n");
  low.setTool("dig");
  low.tap(lowX, 2);
  const lowAfterBorn = SPECIES_ORDER.reduce((n, id) => n + low.born[id], 0);
  if (lowAfterBorn !== lowBorn) errors.push("dig N=6 birthed");
  if (ortho(low, lowX, 2, "n") !== lowBefore + 6) errors.push("dig N=6 did not splash");

  const mid = createMatch("hollow", 82);
  const midX = entranceX(mid) + 1;
  const midWall = mid.tiles[2 * mid.cols + midX];
  const midN = ortho(mid, midX, 2, "n");
  midWall.kind = "soil";
  midWall.hardness = 1;
  midWall.nutrient = 27;
  midWall.mana = 0;
  mid.setTool("dig");
  mid.tap(midX, 2);
  const loam = mid.actors.find((a) => a.alive && a.species === "moss" && a.x === midX && a.y === 2);
  if (!loam || loam.carryN !== 27) errors.push(`dig N=27 belly ${loam?.carryN}`);
  if (ortho(mid, midX, 2, "n") !== midN) errors.push("dig N=27 splashed the winning nutrient");
  if (mid.actors.filter((a) => a.alive && a.kind === "monster").length !== 1) errors.push("dig N=27 birthed more than one");

  const coc = createMatch("hollow", 83);
  seal(coc, [[6, 8]]);
  const cocWall = coc.tiles[8 * coc.cols + 5];
  cocWall.kind = "soil";
  cocWall.hardness = 1;
  cocWall.nutrient = 54;
  cocWall.mana = 0;
  coc.setTool("dig");
  coc.tap(5, 8);
  const corner = coc.actors.find((a) => a.alive && a.species === "crawler");
  if (!corner || corner.carryN !== 54 || corner.form === "fly") errors.push(`dig N=54 ${corner?.species} ${corner?.form} ${corner?.carryN}`);
  else {
    coc.tick(0.2);
    if (corner.form !== "pupa") errors.push(`N=54 cocoon ${corner.form}`);
  }

  const mix = createMatch("hollow", 84);
  const mixX = entranceX(mix) + 1;
  const mixWall = mix.tiles[2 * mix.cols + mixX];
  const mixN = ortho(mix, mixX, 2, "n");
  const mixM = ortho(mix, mixX, 2, "m");
  mixWall.kind = "soil";
  mixWall.hardness = 1;
  mixWall.nutrient = 20;
  mixWall.mana = 18;
  mix.setTool("dig");
  mix.tap(mixX, 2);
  const mixed = mix.actors.find((a) => a.alive && a.x === mixX && a.y === 2);
  if (!mixed || mixed.species !== "moss" || mixed.carryN !== 20 || mixed.carryM !== 0) {
    errors.push(`dig N20 M18 ${mixed?.species} n${mixed?.carryN} m${mixed?.carryM}`);
  }
  if (ortho(mix, mixX, 2, "n") !== mixN) errors.push("winning nutrient splashed");
  if (ortho(mix, mixX, 2, "m") !== mixM + 18) errors.push(`losing mana splash ${ortho(mix, mixX, 2, "m") - mixM}`);
  if (mix.born.spirit || mix.born.witch || mix.born.drake) errors.push("dig birthed a second line");

  const bite = createMatch("hollow", 85);
  seal(bite, [
    [6, 8],
    [7, 8],
  ]);
  const gnawling = bite.plant("crawler", 6, 8);
  gnawling.carryN = 40;
  gnawling.carryM = 0;
  for (const t of bite.tiles) {
    if (t.kind !== "soil") continue;
    t.nutrient = 0;
    t.mana = 0;
    t.nSub = 0;
    t.mSub = 0;
  }
  bite.setTool("smash");
  bite.tap(6, 8);
  let gnawPoured = 0;
  for (const t of bite.tiles) if (t.kind === "soil") gnawPoured += t.nutrient + t.mana;
  if (gnawPoured !== 20) errors.push(`gnawling death tax ${gnawPoured}`);

  const spell = createMatch("hollow", 86);
  seal(spell, [
    [8, 8],
    [7, 8],
    [9, 8],
    [8, 9],
  ]);
  const caster = spell.plantHero("swordsman", 8, 8);
  caster.stamina = 80;
  caster.staminaMax = 80;
  caster.windup = 0.01;
  caster.moveCd = 50;
  caster.dir = 0;
  caster.pathTx = 8;
  caster.pathTy = 7;
  const stop = spell.tiles[7 * spell.cols + 8];
  const side = spell.tiles[8 * spell.cols + 6];
  const far = spell.tiles[5 * spell.cols + 8];
  for (const t of [stop, side, far]) {
    t.kind = "soil";
    t.nutrient = 0;
    t.mana = 0;
    t.nSub = 0;
    t.mSub = 0;
    t.hardness = 1;
  }
  far.nutrient = 4;
  spell.tick(0.05);
  if (side.nutrient <= 0) errors.push(`diamond man2 nutrient ${side.nutrient}`);
  if (far.nutrient !== 4 || far.mana !== 0) errors.push(`diamond man3 changed n${far.nutrient} m${far.mana}`);

  const five = createMatch("hollow", 87);
  seal(five, [
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
    [6, 9],
  ]);
  five.corpses.push({
    x: 6,
    y: 8,
    life: 1e9,
    n: 0,
    m: 0,
    manaAtDeath: 0,
    cls: "swordsman",
    spirits: 0,
    red: false,
  });
  for (let i = 0; i < 5; i++) {
    const wisp = five.plant("spirit", 6, 8);
    wisp.moveCd = 99;
    five.tick(0.05);
  }
  const redPile = five.corpses.find((c) => c.x === 6 && c.y === 8);
  if (!redPile || !redPile.red || redPile.spirits < 5) errors.push(`red pile ${redPile?.spirits} ${redPile?.red}`);
  else {
    for (const t of five.tiles) {
      if (t.kind !== "soil") continue;
      t.nutrient = 0;
      t.mana = 0;
    }
    five.setTool("dig");
    five.tap(6, 8);
    const bonesUp = five.actors.find((a) => a.alive && a.species === "skeleton");
    if (!bonesUp || bonesUp.rattle !== 3) errors.push(`red rattle ${bonesUp?.rattle}`);
    else {
      bonesUp.hatch = 0.02;
      let fed = 0;
      for (const t of five.tiles) if (t.kind === "soil") fed += t.nutrient + t.mana;
      five.tick(0.05);
      let fedAfter = 0;
      for (const t of five.tiles) if (t.kind === "soil") fedAfter += t.nutrient + t.mana;
      if (fedAfter !== fed) errors.push(`rattle death fed ${fedAfter - fed}`);
    }
  }

  const cap = createMatch("hollow", 88);
  seal(cap, [
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
    [6, 9],
  ]);
  cap.setTool("dig");
  for (const [x, y] of [
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
  ] as const) {
    cap.corpses.push({ x, y, life: 1e9, n: 0, m: 0, manaAtDeath: 0, cls: "swordsman", spirits: 0, red: false });
    cap.tap(x, y);
  }
  const walking = cap.actors.filter((a) => a.alive && a.species === "skeleton").length;
  if (walking !== 4) errors.push(`rattle cap raised ${walking}`);
  cap.corpses.push({ x: 6, y: 9, life: 1e9, n: 0, m: 0, manaAtDeath: 0, cls: "swordsman", spirits: 0, red: false });
  cap.tap(6, 9);
  const still = cap.actors.filter((a) => a.alive && a.species === "skeleton").length;
  const waiting = cap.corpses.some((c) => c.x === 6 && c.y === 9);
  if (still !== 4 || !waiting) errors.push(`fifth tap did not wait live ${still} pile ${waiting}`);

  const rune = createMatch("hollow", 89);
  const ring: [number, number][] = [];
  for (let y = 3; y <= 6; y++) for (let x = 3; x <= 6; x++) ring.push([x, y]);
  seal(rune, ring);
  for (const [x, y] of [
    [4, 4],
    [5, 4],
    [4, 5],
    [5, 5],
  ] as const) {
    const t = rune.tiles[y * rune.cols + x];
    t.kind = "soil";
    t.nutrient = 0;
    t.mana = 40;
    t.nSub = 0;
    t.mSub = 2;
    t.hardness = 1;
  }
  rune.tick(0.6);
  if (rune.runes.length !== 1) errors.push(`rune scan ${rune.runes.length}`);
  rune.setTool("dig");
  rune.tap(4, 4);
  const demons = rune.actors.filter((a) => a.alive && a.species === "bud");
  const extras = rune.actors.filter((a) => a.alive && a.kind === "monster" && a.species !== "bud");
  if (rune.born.bud !== 1 || demons.length !== 1 || extras.length) errors.push(`rune birth bud ${rune.born.bud} live ${demons.length} extra ${extras.length}`);
  if (demons[0] && demons[0].name !== "Demon") errors.push(`demon name ${demons[0]?.name}`);
  let runeMana = 0;
  for (const [x, y] of [
    [4, 4],
    [5, 4],
    [4, 5],
    [5, 5],
  ] as const) {
    const t = rune.tiles[y * rune.cols + x];
    if (t.kind !== "dug" || t.mana !== 0 || t.nutrient !== 0) errors.push(`rune tile ${x},${y} ${t.kind} m${t.mana}`);
  }
  for (const t of rune.tiles) if (t.kind === "soil") runeMana += t.mana;
  if (runeMana !== 0) errors.push(`rune splashed mana ${runeMana}`);
  if (rune.runes.length !== 0) errors.push("rune face remained");

  function digBirth(n: number, sp: Species, seed: number) {
    const match = createMatch("hollow", seed);
    const x = entranceX(match) + 1;
    const wall = match.tiles[2 * match.cols + x];
    wall.kind = "soil";
    wall.hardness = 1;
    wall.nutrient = n;
    wall.mana = 0;
    match.setTool("dig");
    match.tap(x, 2);
    const kid = match.actors.find((a) => a.alive && a.species === sp && a.carryN === n);
    if (!kid) errors.push(`N=${n} birthed ${match.actors.find((a) => a.alive && a.kind === "monster")?.species ?? "none"}`);
  }
  digBirth(12, "moss", 90);
  digBirth(40, "crawler", 901);
  digBirth(60, "lizard", 902);

  const starve = createMatch("hollow", 91);
  seal(starve, [
    [6, 8],
    [7, 8],
  ]);
  const hungry = starve.plant("moss", 6, 8);
  hungry.hunger = 100;
  hungry.moveCd = 99;
  hungry.brood = "bud";
  hungry.speed = 0;
  starve.tick(1);
  const drop = 100 - hungry.hunger;
  if (drop < 1.15 || drop > 1.35) errors.push(`hunger drop ${drop}`);

  const brawl = createMatch("hollow", 92);
  seal(brawl, [
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
  ]);
  const knight = brawl.plantHero("knight", 7, 8);
  if (knight.maxHp !== 190 || knight.atk !== 24) errors.push(`knight base ${knight.maxHp}/${knight.atk}`);
  knight.swingCd = 99;
  knight.moveCd = 99;
  const s1 = brawl.plant("lizard", 6, 8);
  const s2 = brawl.plant("lizard", 8, 8);
  s1.swingCd = 0;
  s2.swingCd = 0;
  s1.moveCd = 99;
  s2.moveCd = 99;
  for (let i = 0; i < 6; i++) brawl.tick(0.4);
  if (!knight.alive || knight.hp <= 0) errors.push(`knight died to two scalekin ${knight.hp}`);
  else if (knight.hp >= knight.maxHp) errors.push("scalekin never scratched the knight");
  s1.alive = false;
  s2.alive = false;
  knight.moveCd = 0;
  knight.swingCd = 99;
  knight.path = null;
  knight.job = "";
  const stepX = knight.x;
  brawl.tick(0.5);
  if (!knight.alive || knight.speed <= 0 || knight.x === stepX) errors.push(`knight did not walk ${knight.x},${knight.hp}`);

  const den = createMatch("hollow", 93);
  seal(den, [
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
    [8, 8],
    [9, 8],
    [10, 8],
    [10, 9],
    [10, 10],
    [10, 11],
    [9, 11],
    [8, 11],
  ]);
  const roommate = den.plant("moss", 10, 11);
  roommate.brood = "bud";
  roommate.speed = 0;
  roommate.moveCd = 99;
  const horn = den.plant("bud", 4, 8);
  horn.moveCd = 0;
  let joined = false;
  for (let i = 0; i < 48; i++) {
    den.tick(0.25);
    if (Math.abs(horn.x - roommate.x) + Math.abs(horn.y - roommate.y) <= 2) {
      joined = true;
      break;
    }
  }
  if (horn.x === 4 && horn.y === 8) errors.push("demon idled on the spawn");
  if (!joined) errors.push(`demon room ${horn.x},${horn.y}`);

  const aura = createMatch("hollow", 94);
  seal(aura, [
    [6, 8],
    [7, 8],
  ]);
  const guarded = aura.plant("witch", 7, 8);
  guarded.brood = null;
  guarded.speed = 0;
  guarded.moveCd = 99;
  const officer = aura.plant("bud", 6, 8);
  officer.moveCd = 99;
  const def0 = guarded.def;
  const mdef0 = Math.floor(def0 / 2);
  aura.tick(0.5);
  if (guarded.def <= def0) errors.push(`aura def ${def0}->${guarded.def}`);
  if (Math.floor(guarded.def / 2) <= mdef0) errors.push(`aura mdef ${mdef0}->${Math.floor(guarded.def / 2)}`);
  const wifeHp = aura.plant("witch", 7, 8);
  if (officer.maxHp <= wifeHp.maxHp) errors.push(`demon hp ${officer.maxHp} vs hexwife ${wifeHp.maxHp}`);
  if (officer.def < 4) errors.push(`demon def ${officer.def}`);

  const hallCurse = createMatch("hollow", 95);
  seal(hallCurse, [
    [4, 8],
    [5, 8],
    [6, 8],
    [7, 8],
    [8, 8],
  ]);
  const curser = hallCurse.plant("bud", 4, 8);
  curser.moveCd = 99;
  curser.swingCd = 0;
  const marked = hallCurse.plantHero("archer", 7, 8);
  marked.moveCd = 99;
  marked.swingCd = 99;
  marked.vitality = 0;
  hallCurse.tick(0.4);
  if (marked.vitality < 1) errors.push(`curse slow ${marked.vitality}`);
  marked.x = 8;
  marked.fx = 8;
  marked.vitality = 0;
  curser.swingCd = 0;
  hallCurse.tick(0.4);
  if (marked.vitality > 0) errors.push("curse reached four tiles");

  const feud = createMatch("hollow", 96);
  seal(feud, [
    [6, 8],
    [7, 8],
  ]);
  const left = feud.plant("bud", 6, 8);
  const right = feud.plant("bud", 7, 8);
  left.swingCd = 0;
  right.swingCd = 0;
  left.moveCd = 99;
  right.moveCd = 99;
  const feudHp = left.hp + right.hp;
  feud.tick(0.4);
  if (left.hp + right.hp >= feudHp) errors.push("two demons did not fight");

  const touch = createMatch("hollow", 97);
  seal(touch, [
    [4, 8],
    [5, 8],
    [4, 9],
    [5, 9],
    [4, 10],
    [5, 10],
    [6, 11],
    [7, 11],
    [6, 12],
    [7, 12],
    [6, 13],
    [7, 13],
  ]);
  const denA = touch.plant("lizard", 4, 8);
  const denB = touch.plant("lizard", 6, 11);
  denA.satiety = 8;
  denB.satiety = 8;
  denA.hp = denA.maxHp;
  denB.hp = denB.maxHp;
  denA.carryN = 40;
  denB.carryN = 40;
  denA.moveCd = 0;
  denB.moveCd = 0;
  touch.tick(0.3);
  if (touch.nests.length !== 1) errors.push(`corner dens ${touch.nests.length}`);

  const gap = createMatch("hollow", 98);
  seal(gap, [
    [4, 8],
    [5, 8],
    [4, 9],
    [5, 9],
    [4, 10],
    [5, 10],
    [7, 8],
    [8, 8],
    [7, 9],
    [8, 9],
    [7, 10],
    [8, 10],
  ]);
  const gapA = gap.plant("lizard", 4, 8);
  const gapB = gap.plant("lizard", 7, 8);
  gapA.satiety = 8;
  gapB.satiety = 8;
  gapA.hp = gapA.maxHp;
  gapB.hp = gapB.maxHp;
  gapA.carryN = 40;
  gapB.carryN = 40;
  gap.tick(0.3);
  if (gap.nests.length !== 2) errors.push(`spaced dens ${gap.nests.length}`);

  const lastWave = createMatch("hollow", 99);
  const lastX = entranceX(lastWave);
  lastWave.setTool("dig");
  for (let y = 3; y <= 12; y++) lastWave.tap(lastX, y);
  for (const a of lastWave.actors) {
    if (a.kind !== "monster") continue;
    a.hunger = 999;
    a.hungerCd = 999;
    a.age = 999;
    a.vitality = 999;
    a.hp = 90;
    a.maxHp = 90;
  }
  lastWave.tick(46);
  for (const a of lastWave.actors) if (a.kind === "hero") a.alive = false;
  lastWave.tick(51);
  lastWave.tick(1);
  const veteran = lastWave.actors.find((a) => a.alive && a.kind === "hero" && a.heroClass === "swordsman");
  const wantHp = Math.round((76 + (42 * 2 - 76) * 0.5) * 1.05) + 50;
  const wantAtk = Math.round((9 + (6 * 1.7 - 9) * 0.5) * 1.05) + 10;
  if (!veteran) errors.push("wave 2 swordsman missing");
  else if (veteran.maxHp !== wantHp || veteran.atk !== wantAtk) errors.push(`wave 2 ${veteran.maxHp}/${veteran.atk} vs ${wantHp}/${wantAtk}`);

  return errors;
}
