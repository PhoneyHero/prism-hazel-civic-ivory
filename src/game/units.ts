import type { Actor, Bloom, Corpse, Form, Pressure, Sim, Species, Tile, Variant } from "./types";
import { syncFluid } from "./soil";
import { DX, DY } from "./grid";

export const SPECIES_NAME: Record<Species, string> = {
  moss: "Loamite",
  crawler: "Gnawling",
  lizard: "Scalekin",
  bud: "Demon",
  drake: "Wyrm",
  spirit: "Wisp",
  witch: "Hexwife",
  vampire: "Nightkiss",
  succubus: "Veilmother",
  nimbus: "Stormbride",
  skeleton: "Rattle",
};


export const SPECIES_ORDER: Species[] = [
  "moss",
  "crawler",
  "lizard",
  "bud",
  "drake",
  "spirit",
  "witch",
  "vampire",
  "succubus",
  "nimbus",
  "skeleton",
];


export const NUTRIENT_CHAIN: Species[] = ["moss", "crawler", "lizard", "bud", "drake"];


export const CAP: Record<Species, number> = {
  moss: 18,
  crawler: 12,
  lizard: 8,
  bud: 4,
  drake: 4,
  spirit: 14,
  witch: 6,
  vampire: 4,
  succubus: 4,
  nimbus: 3,
  skeleton: 10,
};


const BASE: Record<Species, { hp: number; atk: number; def: number; mag: number; combat: number; speed: number }> = {
  moss: { hp: 10, atk: 2, def: 0, mag: 0, combat: 1, speed: 1.65 },
  crawler: { hp: 16, atk: 4, def: 0, mag: 0, combat: 3, speed: 2.25 },
  lizard: { hp: 28, atk: 6, def: 1, mag: 0, combat: 8, speed: 1.85 },
  bud: { hp: 45, atk: 3, def: 4, mag: 0, combat: 4, speed: 1.15 },
  drake: { hp: 50, atk: 11, def: 2, mag: 0, combat: 18, speed: 1.35 },
  spirit: { hp: 8, atk: 1, def: 0, mag: 0, combat: 1, speed: 1.75 },
  witch: { hp: 36, atk: 5, def: 1, mag: 7, combat: 12, speed: 1.25 },
  vampire: { hp: 40, atk: 6, def: 1, mag: 8, combat: 14, speed: 1.35 },
  succubus: { hp: 22, atk: 4, def: 0, mag: 5, combat: 8, speed: 1.9 },
  nimbus: { hp: 28, atk: 4, def: 0, mag: 8, combat: 12, speed: 1.4 },
  skeleton: { hp: 34, atk: 6, def: 1, mag: 0, combat: 6, speed: 0.9 },
};


const CORE_BLURB: Record<string, { title: string; blurb: string }> = {
  moss: {
    title: "Loamite",
    blurb: "Digging a 10–29 nutrient wall puts the whole number in one Loamite belly. It still hauls about 5 between walls. Hunger drains quickly. Old age opens a Bloom. Vitality still roots a Bud first.",
  },
  crawler: {
    title: "Gnawling",
    blurb: "A 30–54 wall is one Gnawling, belly equal to that wall. At 45 it walks into a dead end and cocoons. The fly keeps that belly and spends 15, once it holds 60, to lay a Gnawling egg of 30.",
  },
  pupa: {
    title: "Pupa",
    blurb: "A still cocoon. It cannot move. When the timer ends, a fly climbs out. Scalekin and heroes both find the wait convenient.",
  },
  lizard: {
    title: "Scalekin",
    blurb: "A 55+ nutrient wall is one Scalekin. It claims a dug 2×3 for 10 nutrient, then spends 20 more, once it holds 75, to lay one egg on the nest tile. If that nest already has an egg, it waits. A new nest cannot touch another, not even by a corner. Sleep costs 5 and only comes after a fight or a meal. Hunger is faster than a Loamite's.",
  },
  egg: {
    title: "Egg",
    blurb: "Hatches into whoever laid it. An egg still counts — the chain is not extinct while one remains.",
  },
  bud: {
    title: "Horned One",
    blurb: "Not a wall birth. An isolated 2×2 of mana walls, each 30 or more, fuses into a rune. The pick spends that dig and one Demon steps out. It leaves the rune and holds a dug room, preferring one that already has allies. Allies in that room gain a thicker hide. A curse slows a hero down an open hall. Two in one hall fight. It does not eat.",
  },
  spirit: {
    title: "Wisp",
    blurb: "A 10–29 mana wall is one Wisp, belly equal to that wall. Eaten whole. Five on a pile of Remains turn it red. Hunger drains like a Loamite.",
  },
  witch: {
    title: "Hexwife",
    blurb: "A 30–54 mana wall is one Hexwife. Under three of the line, 45 mana spends 15 to split a child of 30. At three or more, 42 spends 12 on a web. Eight webs is the cap. A hero who breaks one returns 6 mana to the walls.",
  },
  vampire: {
    title: "Nightkiss",
    blurb: "Mana 3. A harder Hexwife. Hungers for Wisps, Gnawlings, and Hexwives.",
  },
  succubus: {
    title: "Veilmother",
    blurb: "High mana before the hex line matures. Fragile, and she breeds fast.",
  },
  nimbus: {
    title: "Stormbride",
    blurb: "Mana peak, once a Hexwife has lived. Paints mana and hexes down an open lane.",
  },
  skeleton: {
    title: "Rattle",
    blurb: "Pick raises one Rattle and does not splash. Red after five Wisps, caster if the dead hero was a mage or priest, plated for a knight, bone for a sword or a thief. Four may walk. When that Rattle dies, the pile is gone.",
  },
  corpse: {
    title: "Remains",
    blurb: "Bones, not soil. They never bleed nutrient. A Wisp that touches the pile is consumed. Five Wisps turn it red. The pick raises one Rattle. That pile does not rise again.",
  },
  wiltbloom: {
    title: "Bud and Bloom",
    blurb: "Old age, or hunger with a belly, leaves a Wiltbloom on the floor. A Wisp's old age leaves a mana-cap. Units may walk the cell. Left alone for 6s, belly 11 or more hatches four Loamites of 10, a thinner flower hatches three, a path flower hatches two, and a mana-cap hatches two Wisps. Smash or a stomp hatches two. Nothing from a flower is poured into the walls.",
  },
  drake: {
    title: "Wyrm",
    blurb: "A 55+ mana wall is one Wyrm. At 90 it spends 25 to lay an egg of 55. Wyrms do not bite Wyrms. Each takes a different horizontal hall and only competes for food. Breath is still that hall. Sleep costs 5.",
  },
};


export function variantBlurb(id: string): { title: string; blurb: string } {
  const known = CORE_BLURB[id];
  if (known) return known;
  const [sp, v] = id.split(":");
  const name = SPECIES_NAME[sp as Species] ?? sp;
  if (v === "giant") {
    return { title: `Giant ${name}`, blurb: "Starve-heavy births. More health and a slower hunger. Living bodies stay as they are." };
  }
  if (v === "deformed") {
    return { title: `Abnormal ${name}`, blurb: "Eaten-heavy births. The next body comes out wrong. Living bodies stay as they are." };
  }
  if (v === "breed") {
    return { title: `Rare ${name}`, blurb: "Hero-heavy births, and only if the line's rare sign is up. Living bodies stay as they are." };
  }
  return { title: name, blurb: "Noted in the hollow." };
}


export const ALMANAC_IDS = [
  "moss",
  "crawler",
  "pupa",
  "lizard",
  "egg",
  "bud",
  "drake",
  "spirit",
  "witch",
  "vampire",
  "succubus",
  "nimbus",
  "skeleton",
  "corpse",
  "wiltbloom",
  ...SPECIES_ORDER.flatMap((sp) => [`${sp}:giant`, `${sp}:deformed`, `${sp}:breed`]),
];


function variantLabel(v: Variant, base: string): string {
  if (v === "giant") return `Giant ${base}`;
  if (v === "deformed") return `Abnormal ${base}`;
  if (v === "breed") return `Rare ${base}`;
  return base;
}


function scaledStats(sp: Species, _variant: Variant) {
  const b = BASE[sp];
  return { hp: Math.max(1, b.hp), atk: Math.max(1, b.atk), def: b.def, mag: b.mag, combat: Math.max(1, b.combat), speed: b.speed };
}

export function freshPressure(): Pressure {
    return {
        hunger: 0,
        predation: 0,
        heroKills: 0,
        starveDeaths: 0,
        peak: 0,
        giantArmed: false,
        deformArmed: false,
        breedArmed: false,
    };
}

export function installUnits(sim: Sim) {
  const STRESS_SP = new Set<Species>(["moss", "crawler", "lizard", "witch"]);
  type Kind = "hero" | "predator" | "starve" | "cannibal";
  const stress: Record<string, number> = { moss: 0, crawler: 0, lizard: 0, witch: 0 };
  const omenOn: Record<string, boolean> = { moss: false, crawler: false, lizard: false, witch: false };
  const armed: Record<string, Variant | null> = { moss: null, crawler: null, lizard: null, witch: null };
  const logs: Record<string, { k: Kind; n: number }[]> = { moss: [], crawler: [], lizard: [], witch: [] };
  const heroKill = new Map<number, Map<string, number>>();
  const groupKill = new Map<string, Map<string, number>>();
  let mossRare = 0;
  let gnawRare = 0;
  let lastLizardHit: string | null = null;
  let wyrmLook = 1;
  let frameDt = 0;
  let hooked = false;
  let lastBolt = -100;
  let scan = 0;
  let scanTime = -1;
  const puddles: { x: number; y: number; until: number }[] = [];
  const confuse = new Map<number, number>();
  const debuffs: { id: number; until: number; atk: number }[] = [];

  function shopTier(sp: Species): number {
      const fam = familyOf(sp);
      if (!fam) return 0;
      return Math.max(0, Math.min(4, sim.upgrades[fam] ?? 0));
  }
  function applyShop(a: Actor, band: number, tierOverride?: number) {
      if (!a.species || (a.form !== "adult" && a.form !== "fly")) return;
      const tier = tierOverride ?? shopTier(a.species);
      a.tier = tier;
      a.maxHp = Math.max(1, Math.round(a.maxHp * band * (1 + 0.18 * tier)));
      a.hp = a.maxHp;
      a.atk = Math.max(1, Math.round(a.atk * band * (1 + 0.14 * tier)));
      a.def = Math.max(0, Math.round(a.def * (1 + 0.08 * tier)));
      a.combat = Math.max(1, Math.round(a.combat * band));
  }
  function applyBranch(a: Actor) {
      if (!a.species || (a.form !== "adult" && a.form !== "fly")) return;
      const sp = a.species;
      if (sp === "moss" && a.variant === "deformed") {
          a.maxHp = Math.max(1, Math.round(a.maxHp * 0.72));
          a.hp = a.maxHp;
          puddles.push({ x: a.x, y: a.y, until: sim.time + 2 });
      }
      if (sp === "moss" && a.variant === "giant") {
          a.maxHp = Math.max(1, Math.round(a.maxHp * 1.8));
          a.hp = a.maxHp;
      }
      if (sp === "moss" && a.variant === "breed") a.speed *= 1.55;
      if (sp === "crawler" && a.variant === "giant" && a.form === "fly") {
          a.maxHp = Math.max(1, Math.round(a.maxHp * 2));
          a.hp = a.maxHp;
      }
      if (sp === "crawler" && a.variant === "breed") a.def += 2;
      if (sp === "lizard" && a.variant === "giant") {
          a.maxHp = Math.max(1, Math.round(a.maxHp * 2.2));
          a.hp = a.maxHp;
          a.speed *= 0.62;
      }
      if (sp === "witch" && a.variant === "giant") a.mag = 0;
  }
  function nearSpecies(a: Actor, sp: Species, dist: number) {
      for (const o of sim.actors) {
          if (!o.alive || o.id === a.id || o.species !== sp) continue;
          if (Math.abs(o.x - a.x) + Math.abs(o.y - a.y) <= dist) return true;
      }
      return false;
  }
  function cannibalOk(pred: Actor, prey: Actor) {
      if (!pred.species || !prey.species || prey.kind !== "monster" || prey.id === pred.id) return false;
      if (prey.form === "egg" || prey.form === "pupa") return false;
      const flashing = pred.hunger <= 0;
      if (pred.hunger >= 25 && !flashing) return false;
      if (pred.species === "lizard") {
          if (prey.species === "lizard" || prey.species === "crawler") return true;
          if (prey.species === "moss") return flashing || sim.countSpecies("moss") >= 4;
      }
      if (pred.species === "drake") {
          if (prey.species === "witch" || prey.species === "crawler" || prey.species === "lizard") return true;
          if (prey.species === "drake" && flashing && (prey.maxHp < pred.maxHp || (prey.maxHp === pred.maxHp && prey.hp < pred.hp))) return true;
      }
      if (pred.species === "crawler" && prey.species === "crawler") return !nearSpecies(pred, "moss", 4);
      if (pred.species === "witch" && prey.species === "witch") return !nearSpecies(pred, "spirit", 4);
      return false;
  }
  function windowTotals(sp: string) {
      const q = logs[sp];
      let remain = 80;
      const t = { hero: 0, predator: 0, starve: 0, cannibal: 0 };
      for (let i = q.length - 1; i >= 0 && remain > 0; i--) {
          const take = Math.min(remain, q[i].n);
          t[q[i].k] += take;
          remain -= take;
      }
      return t;
  }
  function roomMana(sx: number, sy: number) {
      const seen = new Uint8Array(sim.cols * sim.rows);
      const q = [sy * sim.cols + sx];
      seen[q[0]] = 1;
      const walls = new Set<Tile>();
      let head = 0;
      while (head < q.length) {
          const cur = q[head++];
          const x = cur % sim.cols;
          const y = (cur / sim.cols) | 0;
          for (let d = 0; d < 4; d++) {
              const nx = x + DX[d];
              const ny = y + DY[d];
              if (nx < 0 || ny < 0 || nx >= sim.cols || ny >= sim.rows) continue;
              const t = sim.tileAt(nx, ny);
              if (!t) continue;
              if (t.kind === "soil") walls.add(t);
              const ni = ny * sim.cols + nx;
              if (seen[ni] || !sim.isOpen(nx, ny)) continue;
              seen[ni] = 1;
              q.push(ni);
          }
      }
      let m = 0;
      for (const t of walls) m += t.mana;
      return { seen, m };
  }
  function witchRoomReady() {
      const ws = sim.actors.filter((a) => a.alive && a.species === "witch" && (a.form === "adult" || a.form === "fly"));
      const used = new Set<number>();
      for (const w of ws) {
          if (used.has(w.id)) continue;
          const room = roomMana(w.x, w.y);
          const group = ws.filter((o) => room.seen[o.y * sim.cols + o.x]);
          for (const g of group) used.add(g.id);
          if (group.length >= 4 && room.m >= 90) return { group, room };
      }
      return null;
  }
  function rareReady(sp: Species) {
      if (sp === "moss") return mossRare >= 20;
      if (sp === "crawler") return gnawRare >= 20;
      if (sp === "lizard") return lastLizardHit === "knight";
      if (sp === "witch") return witchRoomReady() !== null;
      return false;
  }
  function pickBranch(sp: Species): Variant {
      const t = windowTotals(sp);
      const giant = t.starve;
      const abnormal = t.predator + t.cannibal;
      const rare = t.hero;
      const best = Math.max(giant, abnormal, rare);
      const ties = (giant === best ? 1 : 0) + (abnormal === best ? 1 : 0) + (rare === best ? 1 : 0);
      if (ties > 1) return giant > 0 ? "giant" : "deformed";
      if (rare === best) return rareReady(sp) ? "breed" : giant > 0 ? "giant" : "deformed";
      if (giant === best) return "giant";
      return "deformed";
  }
  function settle(sp: Species) {
      stress[sp] = 0;
      logs[sp] = [];
      armed[sp] = null;
      omenOn[sp] = false;
      if (sim.familySettle) sim.familySettle(SPECIES_NAME[sp]);
  }
  function addStress(sp: Species, kind: Kind) {
      if (!STRESS_SP.has(sp)) return;
      const pts = kind === "starve" ? 12 : kind === "cannibal" ? 10 : 8;
      logs[sp].push({ k: kind, n: pts });
      let sum = 0;
      for (const e of logs[sp]) sum += e.n;
      while (logs[sp].length > 1 && sum - logs[sp][0].n >= 80) {
          sum -= logs[sp][0].n;
          logs[sp].shift();
      }
      const prev = stress[sp];
      stress[sp] = Math.min(100, prev + pts);
      if (!omenOn[sp] && stress[sp] >= 70) {
          omenOn[sp] = true;
          if (sim.familyOmen) sim.familyOmen(SPECIES_NAME[sp]);
      }
      if (stress[sp] >= 80) {
          armed[sp] = pickBranch(sp);
          stress[sp] = 40;
          omenOn[sp] = false;
          sim.mutations += 1;
      }
  }
  function deathKind(sp: Species, cause: string, by: Species | "hero" | "overlord" | "smash" | null): Kind | null {
      if (!STRESS_SP.has(sp)) return null;
      if (cause === "starve") return "starve";
      if (cause === "eaten") return by === sp ? "cannibal" : "predator";
      if (cause === "combat" && by === "hero") return "hero";
      if (cause === "combat" && by && by !== "hero" && by !== "overlord" && by !== "smash") return "predator";
      return null;
  }
  function noteHero(hero: Actor, prey: Actor) {
      if (!prey.species) return;
      if (prey.species === "lizard" && hero.heroClass) lastLizardHit = hero.heroClass;
      if (!STRESS_SP.has(prey.species) || prey.variant === "normal") return;
      const sp = prey.species;
      let hk = heroKill.get(hero.id);
      if (!hk) {
          hk = new Map();
          heroKill.set(hero.id, hk);
      }
      const c = (hk.get(sp) ?? 0) + 1;
      hk.set(sp, c);
      const gid = `${sim.launched}:${sim.raids}`;
      let gk = groupKill.get(gid);
      if (!gk) {
          gk = new Map();
          groupKill.set(gid, gk);
      }
      const g = (gk.get(sp) ?? 0) + 1;
      gk.set(sp, g);
      if (c >= 8 || g >= 12) settle(sp);
  }
  function downAtk(a: Actor) {
      if (debuffs.some((d) => d.id === a.id)) return;
      debuffs.push({ id: a.id, until: sim.time + 4, atk: a.atk });
      a.atk = Math.max(1, Math.round(a.atk * 0.7));
  }
  function splitGiants() {
      const list = sim.actors.slice();
      for (const a of list) {
          if (!a.alive || a.species !== "moss" || a.variant !== "giant" || a.form !== "adult" || a.brood !== "walk") continue;
          if (a.carryN < 10) continue;
          const half = Math.floor(a.carryN / 2);
          const spot = sim.freeNeighbor(a.x, a.y);
          if (!spot || sim.countSpecies("moss") >= CAP.moss) continue;
          a.carryN -= half;
          const twin = spawnMonster("moss", spot.x, spot.y, "giant", "adult");
          twin.carryN = half;
          twin.hunger = a.hunger;
          twin.brood = "walk";
          twin.variant = "giant";
      }
  }
  function pulse(dt: number) {
      const mossN = sim.countSpecies("moss");
      const gnawN = sim.countSpecies("crawler");
      if (mossN >= 11 && mossN <= 15 && gnawN === 0) mossRare += dt;
      else mossRare = 0;
      if (mossN + gnawN > 0 && Math.abs(mossN - gnawN) <= 3) gnawRare += dt;
      else gnawRare = 0;
      for (let i = debuffs.length - 1; i >= 0; i--) {
          if (sim.time < debuffs[i].until) continue;
          const a = sim.actors.find((x) => x.id === debuffs[i].id);
          if (a && a.alive) a.atk = Math.max(a.atk, debuffs[i].atk);
          debuffs.splice(i, 1);
      }
      for (let i = puddles.length - 1; i >= 0; i--) {
          const p = puddles[i];
          if (sim.time >= p.until) {
              puddles.splice(i, 1);
              continue;
          }
          for (const h of sim.actors) {
              if (h.alive && h.kind === "hero" && h.x === p.x && h.y === p.y) h.sleep = Math.max(h.sleep, 0.5);
          }
      }
      if (sim.time - lastBolt < 8) return;
      const ready = witchRoomReady();
      if (!ready) return;
      const witch = ready.group.find((a) => a.variant === "breed") ?? null;
      if (!witch) return;
      const hero = sim.actors.find((h) => h.alive && h.kind === "hero" && ready.room.seen[h.y * sim.cols + h.x]);
      if (!hero) return;
      lastBolt = sim.time;
      sim.strike(witch, hero);
  }
  function dropFloor(a: Actor, kind: "flower" | "cap") {
      const x = a.x;
      const y = a.y;
      a.alive = false;
      a.speed = 0;
      a.sleep = 0;
      if (!sim.blooms.some((b) => b.x === x && b.y === y)) {
          sim.blooms.push({
              x,
              y,
              n: kind === "flower" ? Math.max(0, a.carryN) : 0,
              m: kind === "cap" ? Math.max(1, a.carryM) : 0,
              life: 100000,
              path: false,
          });
      }
      sim.markSeen(kind === "flower" ? "wiltbloom" : "spirit");
      sim.toast(kind === "flower" ? "A Loamite opens into a Bloom." : "A Wisp settles into a cap.");
      sim.burst(x, y, kind === "flower" ? "#d45848" : "#6a5088", 8, 1.6);
  }
  function ensureHooks() {
      if (hooked || !sim.slay || !sim.strike || !sim.tick || !sim.isPrey || !sim.layWeb || !sim.actHero || !sim.actMonster || !sim.transferNutrient) return;
      hooked = true;
      const origSlay = sim.slay;
      const origStrike = sim.strike;
      const origTick = sim.tick;
      const origPrey = sim.isPrey;
      const origWeb = sim.layWeb;
      const origHero = sim.actHero;
      const origTransfer = sim.transferNutrient;
      const origAct = sim.actMonster;
      let gateTime = -1;
      const gate = new Set<number>();
      function gateReset() {
          if (gateTime === sim.time) return;
          gateTime = sim.time;
          gate.clear();
      }
      function gateMark(id: number) {
          gateReset();
          gate.add(id);
      }
      function gateHit(id: number) {
          gateReset();
          return gate.has(id);
      }
      const origPursue = sim.pursue;
      const origTryEat = sim.tryEat;
      const origTryLay = sim.tryLay;
      const origHex = sim.hexSpend;
      if (origPursue) {
          sim.pursue = (a, x, y) => {
              if (gateHit(a.id)) return "wait";
              const step = origPursue(a, x, y);
              if (step === "step") gateMark(a.id);
              return step;
          };
      }
      if (origTryEat) {
          sim.tryEat = (a) => {
              if (gateHit(a.id)) return;
              const before = sim.actors.filter((o) => o.alive).length;
              origTryEat(a);
              if (sim.actors.filter((o) => o.alive).length !== before) gateMark(a.id);
          };
      }
      if (origTryLay) {
          sim.tryLay = (a) => {
              if (gateHit(a.id)) return;
              const n = a.carryN;
              const m = a.carryM;
              const shed = a.shed;
              origTryLay(a);
              if (a.carryN !== n || a.carryM !== m || a.shed !== shed) gateMark(a.id);
          };
      }
      if (origHex) {
          sim.hexSpend = (a) => {
              if (gateHit(a.id)) return;
              const m = a.carryM;
              const webs = sim.webs.length;
              origHex(a);
              if (a.carryM < m || sim.webs.length > webs) gateMark(a.id);
          };
      }
      sim.isPrey = (pred, prey) => origPrey(pred, prey) || cannibalOk(pred, prey);
      sim.actMonster = (a) => {
          if (a.sleep > 0 || a.form === "egg" || a.form === "pupa" || (a.species === "moss" && !!a.brood && a.brood !== "walk")) {
              a.job = "hold";
              return;
          }
          if (a.alive && a.feedCd <= 0 && a.hunger < 25 && a.species && (a.form === "adult" || a.form === "fly")) {
              const prey = sim.nearest(a, (o) => cannibalOk(a, o));
              if (prey) {
                  a.job = "hunt";
                  if (prey.x !== a.x || prey.y !== a.y) sim.pursue(a, prey.x, prey.y);
                  else sim.tryEat(a);
                  return;
              }
          }
          origAct(a);
      };
      sim.layWeb = (x, y) => {
          const here = sim.actorAt(x, y);
          if (here && here.species === "witch" && here.variant === "giant") return;
          origWeb(x, y);
      };
      sim.actHero = (a) => {
          if (a.sleep > 0) {
              a.job = "hold";
              return;
          }
          const until = confuse.get(a.id) ?? 0;
          if (a.alive && until > sim.time) {
              const opts: { x: number; y: number }[] = [];
              for (let d = 0; d < 4; d++) {
                  const x = a.x + DX[d];
                  const y = a.y + DY[d];
                  if (sim.isOpen(x, y) && !sim.actorAt(x, y)) opts.push({ x, y });
              }
              if (opts.length) {
                  const p = opts[Math.floor(sim.rng() * opts.length)];
                  sim.moveTo(a, p.x, p.y);
              }
              a.path = null;
              a.job = "idle";
              return;
          }
          origHero(a);
      };
      sim.transferNutrient = (a) => {
          const dumping = a.carryN >= 5 && a.species === "moss" && a.variant === "breed";
          const before = a.carryN;
          origTransfer(a);
          if (!dumping || a.carryN >= before) return;
          const walls = sim.wallList(a.x, a.y);
          if (!walls.length) return;
          walls.sort((p, q) => p.n - q.n);
          walls[0].t.nutrient += 1;
          syncFluid(walls[0].t);
      };
      sim.strike = (att, def) => {
          const crit = att.species === "lizard" && att.variant === "breed" && sim.rng() < 0.25;
          const oldAtk = att.atk;
          if (crit) att.atk = Math.max(1, Math.round(oldAtk * 2));
          origStrike(att, def);
          if (crit) att.atk = oldAtk;
          if (!def.alive && att.kind === "hero" && def.kind === "monster") noteHero(att, def);
          if (att.species === "crawler" && att.form === "fly" && att.variant === "deformed" && def.alive) {
              def.poison = Math.max(def.poison, 4);
              def.poisonFrom = "crawler";
          }
          if (att.species === "lizard" && att.variant === "deformed" && def.alive && def.kind === "hero") downAtk(def);
          if (att.species === "witch" && att.variant === "deformed" && !def.alive && def.heroClass === "mage") {
              for (const h of sim.actors) if (h.alive && h.kind === "hero") confuse.set(h.id, sim.time + 2);
          }
      };
      sim.slay = (a, cause, by) => {
          if (!a.alive) return;
          if (cause === "starve" && a.hp > 0) {
              if (a.species === "moss" && a.form === "adult" && a.carryN > 0 && a.brood !== "bloom" && a.brood !== "bud") {
                  dropFloor(a, "flower");
                  return;
              }
              a.hunger = 0;
              a.hitFlash = Math.floor(sim.time * 5) % 2 === 0 ? 0.28 : 0;
              return;
          }
          if (a.species === "moss" && a.form === "adult" && a.brood !== "bloom" && a.brood !== "bud") {
              if (cause === "age" || (cause === "starve" && a.carryN > 0)) {
                  dropFloor(a, "flower");
                  return;
              }
          }
          if (cause === "age" && a.species === "spirit" && (a.form === "adult" || a.form === "fly")) {
              dropFloor(a, "cap");
              return;
          }
          if (a.species === "skeleton") {
              const x = a.x;
              const y = a.y;
              origSlay(a, cause, by);
              for (let i = sim.corpses.length - 1; i >= 0; i--) {
                  if (sim.corpses[i].x === x && sim.corpses[i].y === y) sim.corpses.splice(i, 1);
              }
              return;
          }
          const sp = a.species;
          const variant = a.variant;
          const carryN = a.carryN;
          const carryM = a.carryM;
          origSlay(a, cause, by);
          if (a.alive || !sp) return;
          if (sp === "drake") {
              if (cause === "starve" && carryM <= 0) wyrmLook = Math.max(1, wyrmLook - 1);
              else if (carryM >= 70) wyrmLook = Math.min(4, wyrmLook + 1);
          }
          if (sp === "crawler" && variant === "breed" && cause !== "eaten") {
              sim.dumpOrthogonal(a.x, a.y, 0, Math.max(1, Math.floor(carryN * 0.5)), false);
          }
          const kind = deathKind(sp, cause, by);
          if (kind) addStress(sp, kind);
      };
      sim.tick = (dt: number) => {
          frameDt = dt > 0 ? dt : frameDt;
          const pupa = new Set<number>();
          for (const a of sim.actors) {
              if (a.alive && a.form === "pupa" && a.species === "crawler" && a.variant === "giant") pupa.add(a.id);
          }
          origTick(dt);
          for (const a of sim.actors) {
              if (!a.alive || a.form !== "pupa" || a.species !== "crawler" || a.variant !== "giant") continue;
              if (pupa.has(a.id)) continue;
              a.hatch *= 2;
          }
          splitGiants();
          pulse(dt);
      };
  }
  function nextHungry(): Actor | null {
      if (sim.time !== scanTime) {
          scanTime = sim.time;
          scan = 0;
      }
      while (scan < sim.actors.length) {
          const a = sim.actors[scan++];
          if (!a.alive || a.kind !== "monster") continue;
          if (a.form !== "adult" && a.form !== "fly") continue;
          if (!a.species || a.species === "skeleton" || a.species === "bud") continue;
          return a;
      }
      return null;
  }
  function baseHunger(sp: Species): number {
      if (sp === "moss" || sp === "spirit") return 1.25;
      if (sp === "crawler" || sp === "witch") return 1.82;
      if (sp === "vampire" || sp === "succubus" || sp === "nimbus") return 2.8;
      if (sp === "lizard") return 1.54;
      if (sp === "drake") return 1.39;
      return 0;
  }
  function applyMonsterStats(a: Actor, sp: Species, variant: Variant, form: Form) {
      const s = scaledStats(sp, variant);
      const ratio = a.maxHp > 0 ? a.hp / a.maxHp : 1;
      const moving = form === "adult" || form === "fly";
      a.species = sp;
      a.variant = variant;
      a.form = form;
      a.maxHp = s.hp;
      a.hp = moving ? Math.max(1, Math.round(s.hp * (a.hp > 0 && ratio < 1 ? ratio : 1))) : a.hp;
      if (moving && (a.hp <= 0 || a.hp > a.maxHp))
          a.hp = a.maxHp;
      a.atk = moving ? s.atk : 0;
      a.def = s.def;
      a.mag = moving ? s.mag : 0;
      a.combat = moving ? s.combat : 0;
      a.shield = 0;
      a.speed = form === "fly" ? s.speed * 1.35 : moving ? s.speed : 0;
      const base = SPECIES_NAME[sp];
      if (form === "egg")
          a.name = `${variantLabel(variant, base)} Egg`;
      else if (form === "pupa")
          a.name = `${variantLabel(variant, base)} Pupa`;
      else if (form === "fly")
          a.name = `${variantLabel(variant, base)} Fly`;
      else
          a.name = variantLabel(variant, base);
  }
  sim.applyMonsterStats = applyMonsterStats;
  function spawnMonster(sp: Species, x: number, y: number, variant: Variant, form: Form): Actor {
      ensureHooks();
      const a: Actor = {
          id: sim.nextId++,
          kind: "monster",
          species: sp,
          variant,
          form,
          heroClass: null,
          name: SPECIES_NAME[sp],
          x,
          y,
          fx: x,
          fy: y,
          dir: Math.floor(sim.rng() * 4),
          face: sim.rng() < 0.5 ? -1 : 1,
          hp: 1,
          maxHp: 1,
          atk: 1,
          def: 0,
          mag: 0,
          combat: 1,
          speed: 1,
          satiety: 3,
          vitality: 0,
          carryN: 0,
          carryM: 0,
          moveCd: sim.rng() * 0.3,
          swingCd: sim.rng() * 0.2,
          hungerCd: 3.2,
          starve: 0,
          hatch: 0,
          sleep: 0,
          poison: 0,
          poisonAcc: 0,
          feedCd: 0,
          poisonFrom: null,
          carrying: false,
          alive: true,
          path: null,
          pathAt: 0,
          pathTx: -1,
          pathTy: -1,
          hitFlash: 0,
          bob: sim.rng() * 6,
          age: 40,
          windup: 0,
          shield: 0,
          boost: 0,
          tier: 0,
          rattle: 0,
          priestUsed: false,
          shed: 0,
          stuck: 0,
          brood: null,
          rest: 0,
          stamina: 0,
          staminaMax: 0,
          kills: 0,
          job: "",
          idle: 0,
          frust: 0,
          pace: 0,
          stamp: -1,
          anchor: -1,
          wob: -1,
          hunger: 100,
      };
      sim.applyMonsterStats(a, sp, variant, form);
      const band = 0.7 + 0.15 * Math.max(1, sim.birthMajor) + 0.05 * sim.birthSub;
      applyShop(a, band);
      applyBranch(a);
      a.age = sim.lifeOf(sp);
      if (sp === "moss" && form === "adult") {
          a.brood = "walk";
          a.vitality = 22;
          a.satiety = 3;
          a.carryN = 0;
          a.sleep = 0;
          a.rest = 0;
      }
      else if (form === "adult" || form === "fly") {
          a.satiety = 5;
      }
      sim.actors.push(a);
      sim.born[sp] += 1;
      sim.markSeen(sp);
      if (variant !== "normal")
          sim.markSeen(`${sp}:${variant}`);
      if (form === "egg") {
          sim.markSeen("egg");
          sim.everSeenForm.egg = true;
      }
      if (form === "pupa") {
          sim.markSeen("pupa");
          sim.everSeenForm.pupa = true;
      }
      if (sim.born[sp] === 1 && sp !== "skeleton") {
          sim.toast(`${a.name} crawls out of the loam.`);
      }
      else if (sp === "skeleton" && sim.born[sp] === 1) {
          sim.toast("The bones stand up.");
      }
      else if (variant !== "normal" && form === "adult") {
          sim.toast(`${a.name} twists into the world.`);
      }
      sim.sfx(form === "egg" ? "egg" : "birth");
      sim.burst(x, y, variant === "breed" ? "#f0d060" : "#c4a574", 8, 2.2);
      return a;
  }
  sim.spawnMonster = spawnMonster;
  function rollVariant(sp: Species): Variant {
      if (!STRESS_SP.has(sp)) return "normal";
      return armed[sp] ?? "normal";
  }
  sim.rollVariant = rollVariant;
  function maybeArm(_sp: Species) {}
  sim.maybeArm = maybeArm;
  function familyOf(sp: Species): string | null {
      if (sp === "moss")
          return "moss";
      if (sp === "crawler")
          return "crawler";
      if (sp === "lizard")
          return "lizard";
      if (sp === "drake")
          return "drake";
      if (sp === "spirit")
          return "spirit";
      if (sp === "witch" || sp === "vampire" || sp === "succubus" || sp === "nimbus")
          return "witch";
      return null;
  }
  sim.familyOf = familyOf;
  function lifeOf(sp: Species): number {
      if (sp === "moss" || sp === "spirit")
          return 72;
      if (sp === "crawler")
          return 104;
      if (sp === "lizard")
          return 156;
      if (sp === "drake")
          return 240;
      if (sp === "skeleton")
          return 96;
      return 140;
  }
  sim.lifeOf = lifeOf;
  function calmNow() {
      if (sim.prepLeft !== null || sim.ecoWait !== null)
          return true;
      if (sim.built.endless && !sim.raidActive && sim.spawnQueue.length === 0) {
          for (const a of sim.actors)
              if (a.alive && a.kind === "hero")
                  return false;
          return true;
      }
      return false;
  }
  sim.calmNow = calmNow;
  function eat(pred: Actor, prey: Actor) {
      if (!prey.alive || !prey.species)
          return;
      const sp = prey.species;
      sim.pressure[sp].predation += 1;
      sim.maybeArm(sp);
      const whole = sp === "moss" || sp === "spirit";
      const rate = whole ? 1 : 0.5;
      if (pred.species !== "skeleton" && pred.species !== "bud") {
          pred.carryN += Math.floor(prey.carryN * rate);
          pred.carryM += Math.floor(prey.carryM * rate);
      }
      pred.hunger = 100;
      pred.satiety = Math.min(8, pred.satiety + 2);
      pred.vitality += 1;
      pred.hp = Math.min(pred.maxHp, pred.hp + 1);
      if (pred.species === "lizard" && prey.species === "crawler" && prey.form === "fly" && prey.variant === "giant") {
          pred.carryN = Math.max(pred.carryN, 75);
          pred.satiety = 8;
      }
      sim.float(prey.x, prey.y, "eaten", "#e7d7a8");
      sim.burst(prey.x, prey.y, "#6fbf4a", 7, 2);
      sim.sfx("eat");
      pred.feedCd = pred.species === "drake" ? 5.5 : 3.2;
      pred.rest = 1;
      sim.slay(prey, "eaten", pred.species);
  }
  sim.eat = eat;
  function tryEat(a: Actor) {
      if (a.feedCd > 0)
          return;
      for (const o of sim.actors) {
          if (!o.alive || o.id === a.id)
              continue;
          if (o.x === a.x && o.y === a.y && sim.isPrey(a, o)) {
              sim.eat(a, o);
              return;
          }
      }
  }
  sim.tryEat = tryEat;
  function boxHolds(b: { x: number; y: number; w: number; h: number }, x: number, y: number) {
      return x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h;
  }
  function nestFor(a: Actor): { mark: { x: number; y: number }; box: { x: number; y: number; w: number; h: number } | null } | null {
      for (const mark of sim.nestMarks) {
          const box = sim.nestBoxes.find((b) => boxHolds(b, mark.x, mark.y)) ?? null;
          if (mark.x === a.x && mark.y === a.y)
              return { mark, box };
          if (box && boxHolds(box, a.x, a.y))
              return { mark, box };
      }
      return null;
  }
  function eggInNest(nest: { mark: { x: number; y: number }; box: { x: number; y: number; w: number; h: number } | null }) {
      return sim.actors.some((o) => o.alive && o.form === "egg" && o.species === "lizard" && (o.x === nest.mark.x && o.y === nest.mark.y || (nest.box !== null && boxHolds(nest.box, o.x, o.y))));
  }
  function tryLay(a: Actor) {
      if (!a.species || a.form !== "adult")
          return;
      if (a.species === "lizard") {
          if (sim.countSpecies("lizard") >= CAP.lizard)
              return;
          if (a.shed < 1) {
              const box = sim.legalClaimBox(a.x, a.y);
              if (!box || a.carryN < 10)
                  return;
              a.carryN -= 10;
              a.shed = 1;
              sim.nestBoxes.push(box);
              if (!sim.nestMarks.some((n) => n.x === a.x && n.y === a.y))
                  sim.nestMarks.push({ x: a.x, y: a.y });
              sim.float(a.x, a.y, "NEST", "#e7d3a4");
              return;
          }
          if (!sim.inNest(a.x, a.y) || a.carryN < 75)
              return;
          const nest = nestFor(a);
          if (!nest || eggInNest(nest))
              return;
          a.carryN -= 20;
          const egg = sim.spawnMonster("lizard", nest.mark.x, nest.mark.y, sim.rollVariant("lizard"), "egg");
          egg.hp = 8;
          egg.maxHp = 8;
          egg.atk = 0;
          egg.combat = 0;
          egg.speed = 0;
          egg.hatch = 9;
          egg.carryN = 55;
          egg.hunger = 100;
          egg.sleep = 0;
          egg.rest = 0;
          if (!sim.everSeenForm.egg)
              sim.toast("An egg is pressed into the soil.");
          return;
      }
      if (a.species !== "drake")
          return;
      if (a.carryM < 90)
          return;
      if (sim.countSpecies("drake") >= CAP.drake)
          return;
      const spot = sim.freeNeighbor(a.x, a.y);
      if (!spot)
          return;
      a.carryM -= 25;
      const egg = sim.spawnMonster("drake", spot.x, spot.y, "normal", "egg");
      egg.hp = 8;
      egg.maxHp = 8;
      egg.atk = 0;
      egg.combat = 0;
      egg.speed = 0;
      egg.hatch = 12;
      egg.carryM = 55;
      egg.hunger = 100;
      egg.tier = wyrmLook;
      egg.sleep = 0;
      egg.rest = 0;
      if (!sim.everSeenForm.egg)
          sim.toast("An egg is pressed into the soil.");
  }
  sim.tryLay = tryLay;
  function emerge(a: Actor) {
      if (!a.species)
          return;
      const sp = a.species;
      if (a.form === "pupa") {
          if (a.variant === "normal") {
              const rolled = rollVariant(sp);
              if (rolled !== "normal") a.variant = rolled;
          }
          sim.applyMonsterStats(a, sp, a.variant, "fly");
          applyShop(a, 1, shopTier(sp));
          applyBranch(a);
          a.satiety = 5;
          a.vitality = 0;
          a.hatch = 0;
          a.shed = 0;
          a.sleep = 0;
          a.rest = 0;
          a.age = sim.lifeOf(sp);
          a.job = "";
          a.path = null;
          sim.burst(a.x, a.y, "#e2b04a", 8, 2);
          sim.toast("The cocoon splits.");
          return;
      }
      if (a.form === "egg") {
          if (a.variant === "normal") {
              const rolled = rollVariant(sp);
              if (rolled !== "normal") a.variant = rolled;
          }
          sim.applyMonsterStats(a, sp, a.variant, "adult");
          const hatchTier = sp === "drake" ? Math.max(shopTier(sp), wyrmLook) : shopTier(sp);
          applyShop(a, 1, hatchTier);
          applyBranch(a);
          a.satiety = 4;
          a.vitality = 0;
          a.hatch = 0;
          a.age = sim.lifeOf(sp);
          a.hunger = 100;
          a.sleep = 0;
          a.rest = 0;
          sim.burst(a.x, a.y, "#e6d3a3", 8, 2);
          sim.sfx("birth");
      }
  }
  sim.emerge = emerge;
  function layWeb(x: number, y: number) {
      const t = sim.tileAt(x, y);
      if (!t || (t.kind !== "dug" && t.kind !== "entrance"))
          return;
      const hit = sim.webs.find((w) => w.x === x && w.y === y);
      if (hit) {
          hit.life = 8;
          return;
      }
      if (sim.webs.length >= 8)
          return;
      sim.webs.push({ x, y, life: 8 });
  }
  sim.layWeb = layWeb;
  let pendingOver: Bloom | null = null;
  const bloomList = sim.blooms;
  const rawSplice = bloomList.splice.bind(bloomList);
  bloomList.splice = ((start: number, deleteCount?: number, ...rest: Bloom[]) => {
      if ((deleteCount ?? 0) > 0 && rest.length === 0) {
          const idx = start < 0 ? bloomList.length + start : start;
          const cut = bloomList[idx];
          if (cut && cut.life >= 150000) pendingOver = cut;
      }
      return rawSplice(start, deleteCount as number, ...rest);
  }) as typeof bloomList.splice;
  function bloomKids(x: number, y: number, sp: "moss" | "spirit", n: number) {
      pendingOver = null;
      let made = 0;
      for (let i = 0; i < n; i++) {
          const spot = i === 0 && sim.isOpen(x, y) && !sim.actorAt(x, y) ? { x, y } : sim.freeNeighbor(x, y);
          if (!spot) break;
          sim.birthMajor = 1;
          sim.birthSub = 0;
          const kid = sim.spawnMonster(sp, spot.x, spot.y, rollVariant(sp), "adult");
          kid.sleep = 0;
          kid.rest = 0;
          kid.hunger = 100;
          if (sp === "moss") {
              kid.carryN = 10;
              kid.satiety = 3;
              kid.vitality = 22;
              kid.brood = "walk";
          }
          else kid.carryM = 10;
          made += 1;
      }
      if (made) sim.toast(made === 1 ? "A Bloom hatches one." : `A Bloom hatches ${made}.`);
  }
  function plantAge(b: Bloom) {
      if (b.life >= 150000) return 200000 - b.life;
      if (b.path) return 18 - b.life;
      if (b.life > 1000) return 100000 - b.life;
      return 0;
  }
  function ageBlooms() {
      for (let i = sim.blooms.length - 1; i >= 0; i--) {
          const b = sim.blooms[i];
          if (plantAge(b) < 6) continue;
          sim.blooms.splice(i, 1);
          const cap = b.m > 0 && b.n === 0;
          const over = b.life >= 150000;
          const sp = cap ? "spirit" : "moss";
          const n = over ? 1 : cap || b.path ? 2 : b.n >= 11 ? 4 : 3;
          bloomKids(b.x, b.y, sp, n);
      }
  }
  function breakBloom(bloom: Bloom) {
      const idx = sim.blooms.indexOf(bloom);
      if (idx >= 0)
          sim.blooms.splice(idx, 1);
      if (bloom.life >= 150000)
          bloomKids(bloom.x, bloom.y, bloom.m > 0 && bloom.n === 0 ? "spirit" : "moss", 1);
      else if (bloom.m > 0 && bloom.n === 0)
          sim.sproutPair(bloom.x, bloom.y, "spirit");
      else
          sim.sproutPair(bloom.x, bloom.y, "moss");
      sim.burst(bloom.x, bloom.y, "#6fbf4a", 10, 2.2);
      sim.sfx("smash");
  }
  sim.breakBloom = breakBloom;
  function runeSquare(x: number, y: number) {
      for (let dy = 0; dy <= 1; dy++) {
          for (let dx = 0; dx <= 1; dx++) {
              const t = sim.tileAt(x + dx, y + dy);
              if (!t || t.kind !== "soil" || t.mana < 30)
                  return false;
          }
      }
      for (let dy = -1; dy <= 2; dy++) {
          for (let dx = -1; dx <= 2; dx++) {
              if (dx >= 0 && dx <= 1 && dy >= 0 && dy <= 1)
                  continue;
              const t = sim.tileAt(x + dx, y + dy);
              if (!t || (t.kind !== "dug" && t.kind !== "entrance"))
                  return false;
          }
      }
      return true;
  }
  sim.runeSquare = runeSquare;
  function refreshRunes() {
      sim.runeList.length = 0;
      for (let y = 1; y < sim.rows - 1; y++) {
          for (let x = 1; x < sim.cols - 1; x++) {
              if (sim.runeSquare(x, y))
                  sim.runeList.push({ x, y });
          }
      }
  }
  sim.refreshRunes = refreshRunes;
  function runeOf(x: number, y: number) {
      for (const r of sim.runeList) {
          if (x >= r.x && x <= r.x + 1 && y >= r.y && y <= r.y + 1)
              return r;
      }
      return null;
  }
  sim.runeOf = runeOf;
  function breakRune(rx: number, ry: number) {
      const spots: {
          x: number;
          y: number;
      }[] = [];
      for (let dy = -1; dy <= 2; dy++) {
          for (let dx = -1; dx <= 2; dx++) {
              if (dx >= 0 && dx <= 1 && dy >= 0 && dy <= 1)
                  continue;
              const x = rx + dx;
              const y = ry + dy;
              if (sim.isOpen(x, y) && !sim.actorAt(x, y))
                  spots.push({ x, y });
          }
      }
      for (let dy = 0; dy <= 1; dy++) {
          for (let dx = 0; dx <= 1; dx++) {
              const t = sim.tileAt(rx + dx, ry + dy);
              if (!t)
                  continue;
              t.kind = "dug";
              t.nutrient = 0;
              t.mana = 0;
              t.nSub = 0;
              t.mSub = 0;
              t.hardness = 1;
          }
      }
      const spot = spots[0] ?? null;
      let at = spot;
      if (!at) {
          for (let dy = 0; dy <= 1 && !at; dy++) {
              for (let dx = 0; dx <= 1; dx++) {
                  if (!sim.actorAt(rx + dx, ry + dy)) {
                      at = { x: rx + dx, y: ry + dy };
                      break;
                  }
              }
          }
      }
      if (!at || sim.countSpecies("bud") >= CAP.bud)
          return;
      sim.birthMajor = 1;
      sim.birthSub = 0;
      const demon = sim.spawnMonster("bud", at.x, at.y, "normal", "adult");
      demon.name = "Demon";
      demon.carryN = 0;
      demon.carryM = 0;
      demon.hunger = 100;
      demon.sleep = 0;
      demon.rest = 0;
      sim.toast("A Demon steps out of the rune.");
  }
  sim.breakRune = breakRune;
  function plant(sp: Species, x: number, y: number, form: Form = "adult"): Actor {
      const t = sim.tileAt(x, y);
      if (t && t.kind !== "bedrock") {
          t.kind = "dug";
          t.nutrient = 0;
          t.mana = 0;
          t.nSub = 0;
          t.mSub = 0;
          t.hardness = 1;
      }
      sim.birthMajor = 1;
      sim.birthSub = 0;
      const a = sim.spawnMonster(sp, x, y, "normal", form);
      a.sleep = 0;
      a.rest = 0;
      a.moveCd = 0;
      a.hungerCd = 999;
      a.hunger = 999;
      a.hunger = 999;
      a.age = 999;
      return a;
  }
  sim.plant = plant;
  function suckWalls(a: Actor, radius: number) {
      let best: Tile | null = null;
      let bestN = 0;
      for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
              const man = Math.abs(dx) + Math.abs(dy);
              if (man === 0 || man > radius)
                  continue;
              const t = sim.tileAt(a.x + dx, a.y + dy);
              if (!t || t.kind !== "soil" || t.nutrient <= bestN)
                  continue;
              bestN = t.nutrient;
              best = t;
          }
      }
      if (!best || bestN <= 0)
          return;
      const take = Math.min(5, best.nutrient);
      best.nutrient -= take;
      syncFluid(best);
      a.carryN += take;
  }
  sim.suckWalls = suckWalls;
  function sproutPair(x: number, y: number, sp: "moss" | "spirit") {
      const over = pendingOver && pendingOver.x === x && pendingOver.y === y && pendingOver.life >= 150000;
      pendingOver = null;
      if (over) {
          bloomKids(x, y, sp, 1);
          return;
      }
      for (let i = 0; i < 2; i++) {
          const spot = i === 0 && sim.isOpen(x, y) && !sim.actorAt(x, y) ? { x, y } : sim.freeNeighbor(x, y);
          if (!spot)
              break;
          sim.birthMajor = 1;
          sim.birthSub = 0;
          const kid = sim.spawnMonster(sp, spot.x, spot.y, rollVariant(sp), "adult");
          kid.sleep = 0;
          kid.rest = 0;
          kid.hunger = 100;
          if (sp === "moss") {
              kid.carryN = 10;
              kid.satiety = 3;
              kid.vitality = 22;
              kid.brood = "walk";
          }
          else
              kid.carryM = 10;
      }
  }
  sim.sproutPair = sproutPair;
  function hatchLoamites(a: Actor, mode: "natural" | "smash") {
      const n = mode === "smash" ? 2 : a.carryN >= 11 ? 4 : 3;
      const x = a.x;
      const y = a.y;
      a.alive = false;
      let made = 0;
      for (let i = 0; i < n; i++) {
          const spot = i === 0 && sim.isOpen(x, y) && !sim.actorAt(x, y) ? { x, y } : sim.freeNeighbor(x, y);
          if (!spot)
              break;
          sim.birthMajor = 1;
          sim.birthSub = 0;
          const kid = sim.spawnMonster("moss", spot.x, spot.y, rollVariant("moss"), "adult");
          kid.sleep = 0;
          kid.rest = 0;
          kid.carryN = 10;
          kid.satiety = 3;
          kid.vitality = 22;
          kid.brood = "walk";
          kid.hunger = 100;
          kid.hp = kid.maxHp;
          made += 1;
      }
      if (made)
          sim.toast(made === 1 ? "A Bloom hatches a Loamite." : `A Bloom hatches ${made}.`);
  }
  sim.hatchLoamites = hatchLoamites;
  function rootBud(a: Actor) {
      a.brood = "bud";
      a.speed = 0;
      a.name = "Loam Bud";
      sim.markSeen("wiltbloom");
  }
  sim.rootBud = rootBud;
  function tickBrood(a: Actor, dt: number) {
      if (!a.alive || a.species !== "moss" || a.form !== "adult" || !a.brood)
          return;
      if (a.brood === "walk") {
          a.vitality -= dt;
          if (a.vitality <= 0)
              sim.rootBud(a);
          return;
      }
      a.speed = 0;
      a.feedCd -= dt;
      if (a.feedCd <= 0) {
          a.feedCd = 1.15;
          sim.suckWalls(a, a.brood === "bud" ? 1 : 2);
      }
      if (a.brood === "bud" && a.carryN >= 10) {
          a.brood = "bloom";
          a.name = "Loam Bloom";
          a.hatch = 14 + sim.rng() * 2;
          sim.markSeen("wiltbloom");
      }
      if (a.brood === "bloom") {
          a.hatch -= dt;
          const foe = sim.actors.find((h) => h.alive && h.kind === "hero" && Math.abs(h.x - a.x) + Math.abs(h.y - a.y) === 1);
          if (foe && a.swingCd <= 0) {
              a.swingCd = 0.85;
              sim.strike(a, foe);
          }
          if (a.alive && a.hatch <= 0)
              sim.hatchLoamites(a, "natural");
      }
  }
  sim.tickBrood = tickBrood;
  function trySpawn(sp: Species, x: number, y: number, major = 1, sub = 0): Actor | null {
      if (!sim.isOpen(x, y) || sim.actorAt(x, y))
          return null;
      if (sim.countSpecies(sp) >= CAP[sp])
          return null;
      sim.birthMajor = major;
      sim.birthSub = sub;
      return sim.spawnMonster(sp, x, y, sim.rollVariant(sp), "adult");
  }
  sim.trySpawn = trySpawn;
  function wantsSleep(a: Actor) {
      if (a.form !== "adult")
          return false;
      if (a.species !== "lizard" && a.species !== "drake")
          return false;
      if (a.rest <= 0)
          return false;
      if (a.hp < a.maxHp)
          return false;
      if (a.satiety < 6 && a.feedCd <= 1.2)
          return false;
      return true;
  }
  sim.wantsSleep = wantsSleep;
  function corpseAt(x: number, y: number): Corpse | null {
      for (let i = sim.corpses.length - 1; i >= 0; i--) {
          if (sim.corpses[i].x === x && sim.corpses[i].y === y && sim.corpses[i].life > 0)
              return sim.corpses[i];
      }
      return null;
  }
  sim.corpseAt = corpseAt;
  function raiseRattle(c: Corpse) {
      const live = sim.actors.filter((a) => a.alive && a.species === "skeleton");
      if (live.length >= 4) {
          sim.toast("Four Rattles already walk. The pick waits.");
          return;
      }
      const idx = sim.corpses.indexOf(c);
      if (idx >= 0)
          sim.corpses.splice(idx, 1);
      const spot = sim.actorAt(c.x, c.y) ? sim.freeNeighbor(c.x, c.y) : { x: c.x, y: c.y };
      if (!spot) {
          sim.corpses.push(c);
          return;
      }
      sim.birthMajor = 1;
      sim.birthSub = 0;
      const sk = sim.spawnMonster("skeleton", spot.x, spot.y, "normal", "adult");
      sk.heroClass = c.cls;
      sk.mag = c.manaAtDeath;
      if (c.red)
          sk.rattle = 3;
      else if (c.cls === "mage" || c.cls === "priest" || c.manaAtDeath >= 6)
          sk.rattle = 1;
      else if (c.cls === "knight" || c.manaAtDeath >= 3)
          sk.rattle = 2;
      else
          sk.rattle = 0;
      sk.name = sk.rattle === 3 ? "Red Rattle" : sk.rattle === 1 ? "Pale Rattle" : sk.rattle === 2 ? "Plated Rattle" : "Bone Rattle";
      if (sk.rattle === 3) {
          sk.atk = 11;
          sk.speed = 2.15;
          sk.hp = Math.round(sk.hp * 1.15);
          sk.maxHp = sk.hp;
      }
      else if (sk.rattle === 1) {
          sk.mag = Math.max(6, c.manaAtDeath);
          sk.atk = 4;
      }
      else if (sk.rattle === 2) {
          sk.def += 2;
          sk.hp = Math.round(sk.hp * 1.35);
          sk.maxHp = sk.hp;
      }
      sk.hatch = sk.rattle === 0 || sk.rattle === 1 ? 45 : 90;
      sk.satiety = 9;
      sk.hungerCd = 99;
      sk.carryN = 0;
      sk.carryM = 0;
      sk.sleep = 0;
      sk.rest = 0;
      sim.markSeen("skeleton");
      sim.toast(sk.rattle === 3
          ? "The red bones stand up."
          : sk.rattle === 1
              ? "The bones drink mana."
              : sk.rattle === 2
                  ? "The bones plate themselves."
                  : "The bones stand up.");
      sim.sfx("smash");
      sim.emit();
  }
  sim.raiseRattle = raiseRattle;
  function smashCorpse(c: Corpse) {
      sim.raiseRattle(c);
  }
  sim.smashCorpse = smashCorpse;
  function hungerRate(sp: Species): number {
      ensureHooks();
      let rate = baseHunger(sp);
      const actor = nextHungry();
      const mine = actor && actor.species === sp ? actor : null;
      if (mine && mine.variant === "giant" && (sp === "moss" || sp === "crawler" || sp === "lizard" || sp === "witch"))
          rate *= 0.6;
      if (mine && mine.hunger <= 0 && frameDt > 0) {
          mine.hp -= mine.maxHp * 0.04 * frameDt;
          mine.hitFlash = Math.floor(sim.time * 5) % 2 === 0 ? 0.28 : 0;
          if (mine.hp <= 0) {
              mine.hp = 0;
              sim.slay(mine, "starve", null);
          }
      }
      return rate;
  }
  sim.hungerRate = hungerRate;
  function hexSpend(a: Actor) {
      if (a.form !== "adult" || !a.species || a.feedCd > 0)
          return;
      const living = sim.actors.filter((o) => o.alive &&
          o.form !== "egg" &&
          o.form !== "pupa" &&
          (o.species === "witch" || o.species === "vampire" || o.species === "succubus" || o.species === "nimbus")).length;
      if (living < 3 && a.carryM >= 45) {
          const spot = sim.freeNeighbor(a.x, a.y);
          if (!spot || sim.countSpecies(a.species) >= CAP[a.species])
              return;
          a.carryM -= 15;
          a.feedCd = 2.5;
          const kid = sim.spawnMonster(a.species, spot.x, spot.y, rollVariant(a.species), "adult");
          kid.carryM = 30;
          kid.hunger = 100;
          kid.sleep = 0;
          kid.rest = 0;
          return;
      }
      if (living >= 3 && a.carryM >= 42 && sim.webs.length < 8) {
          a.carryM -= 12;
          a.feedCd = 2.5;
          sim.layWeb(a.x, a.y);
      }
  }
  sim.hexSpend = hexSpend;
  function demonSip(a: Actor) {
      a.hunger = 100;
      if (a.feedCd > 0)
          return;
      for (let d = 0; d < 4; d++) {
          const t = sim.tileAt(a.x + DX[d], a.y + DY[d]);
          if (!t || t.kind !== "soil" || t.mana <= 0)
              continue;
          t.mana -= 1;
          syncFluid(t);
          a.feedCd = 2;
          return;
      }
  }
  sim.demonSip = demonSip;
  function smashAt(x: number, y: number) {
      const bloom = sim.blooms.find((b) => b.x === x && b.y === y);
      if (bloom) {
          sim.breakBloom(bloom);
          sim.emit();
          return;
      }
      const ms = sim.actors.filter((a) => a.alive && a.kind === "monster" && a.x === x && a.y === y);
      if (ms.length) {
          ms.sort((a, b) => a.combat - b.combat);
          sim.slay(ms[0], "smash", "smash");
          for (let i = sim.actors.length - 1; i >= 0; i--)
              if (!sim.actors[i].alive)
                  sim.actors.splice(i, 1);
          sim.recomputeHorde();
          sim.checkEnd();
          sim.emit();
          return;
      }
      const pile = sim.corpseAt(x, y);
      if (pile) {
          sim.smashCorpse(pile);
          return;
      }
      sim.toast("Tap a creature, Remains, or a Wiltbloom.");
  }
  sim.smashAt = smashAt;
  let tickHooked = false;
  let tickFn: (dt: number) => void = () => {};
  Object.defineProperty(sim, "tick", {
      configurable: true,
      enumerable: true,
      get() {
          return tickFn;
      },
      set(fn: (dt: number) => void) {
          if (!tickHooked) {
              tickHooked = true;
              tickFn = (dt: number) => {
                  fn(dt);
                  ageBlooms();
              };
              return;
          }
          tickFn = fn;
      },
  });
}
