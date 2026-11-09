import type { Actor, HeroClass, Sim, WaveHero } from "./types";
import { DX, DY } from "./grid";

export const HERO_BASE: Record<
  HeroClass,
  { hp: number; atk: number; def: number; mag: number; speed: number; range: number; name: string }
> = {
  swordsman: { hp: 76, atk: 9, def: 1, mag: 0, speed: 1.62, range: 1, name: "Swordsman" },
  archer: { hp: 54, atk: 8, def: 0, mag: 0, speed: 1.55, range: 4, name: "Archer" },
  mage: { hp: 58, atk: 3, def: 0, mag: 8, speed: 1.45, range: 3, name: "Mage" },
  priest: { hp: 65, atk: 5, def: 1, mag: 5, speed: 1.32, range: 2, name: "Priest" },
  knight: { hp: 140, atk: 14, def: 3, mag: 0, speed: 1.12, range: 1, name: "Knight" },
  thief: { hp: 47, atk: 12, def: 0, mag: 0, speed: 2.15, range: 1, name: "Thief" },
};


/** Wave-1 numbers from before the Officer pass. Last wave is ×2 HP and ×1.7 ATK against these, not stacked on the new base. */
const HERO_OLD: Record<HeroClass, { hp: number; atk: number }> = {
  swordsman: { hp: 42, atk: 6 },
  archer: { hp: 30, atk: 5 },
  mage: { hp: 32, atk: 2 },
  priest: { hp: 36, atk: 3 },
  knight: { hp: 78, atk: 9 },
  thief: { hp: 26, atk: 8 },
};

/** Flat buff on every hero, every wave. Applied after wave scaling, once. Legend bakes it in. */
export const HERO_BUFF = { hp: 50, atk: 10 };

/** ~3× a last-wave knight's HP and ~2× ATK. Last-wave knight is the old knight ×2 HP and ×1.7 ATK, before the flat buff. */
const LEGEND_HP = Math.round(HERO_OLD.knight.hp * 2) * 3 + HERO_BUFF.hp;
const LEGEND_ATK = Math.round(HERO_OLD.knight.atk * 1.7) * 2 + HERO_BUFF.atk;

export function installHeroes(sim: Sim) {
  function heroTithe(a: Actor): {
      n: number;
      m: number;
  } {
      const cls = a.heroClass ?? "swordsman";
      const late = a.atk >= Math.round((HERO_BASE[cls].atk + HERO_BUFF.atk) * 1.5);
      if (late) {
          if (cls === "mage" || cls === "priest")
              return { n: 0, m: 56 };
          if (cls === "knight")
              return { n: 36, m: 24 };
          return { n: 48, m: 0 };
      }
      if (cls === "mage" || cls === "priest")
          return { n: 0, m: 40 };
      if (cls === "knight")
          return { n: 28, m: 16 };
      if (cls === "thief")
          return { n: 24, m: 0 };
      if (cls === "archer")
          return { n: 32, m: 0 };
      return { n: 40, m: 0 };
  }
  sim.heroTithe = heroTithe;
  function frustratedDig(a: Actor) {
      const prefs = [a.dir, (a.dir + 3) % 4, (a.dir + 1) % 4, (a.dir + 2) % 4];
      for (const d of prefs) {
          const x = a.x + DX[d];
          const y = a.y + DY[d];
          const t = sim.tileAt(x, y);
          if (!t || t.kind !== "soil")
              continue;
          sim.openDug(x, y, t);
          sim.float(x, y, "DIG", "#f3e6c8");
          a.dir = d;
          a.path = null;
          a.pace = 99;
          return;
      }
  }
  sim.frustratedDig = frustratedDig;
  function ensureIntel(a: Actor) {
      let bag = sim.heroIntel.get(a.id);
      if (!bag) {
          bag = { seen: new Uint8Array(sim.cols * sim.rows), dead: new Uint8Array(sim.cols * sim.rows), lord: 0 };
          sim.heroIntel.set(a.id, bag);
      }
      return bag;
  }
  sim.ensureIntel = ensureIntel;
  function refreshIntel() {
      const heroes = sim.actors.filter((a) => a.alive && a.kind === "hero");
      for (const a of heroes) {
          const bag = sim.ensureIntel(a);
          const i = a.y * sim.cols + a.x;
          if (i < 0 || i >= bag.seen.length)
              continue;
          bag.seen[i] = 1;
          if (sim.isOpen(a.x, a.y) && sim.openNeighbors(a.x, a.y) <= 1)
              bag.dead[i] = 1;
      }
      for (let i = 0; i < heroes.length; i++) {
          for (let j = i + 1; j < heroes.length; j++) {
              const A = heroes[i];
              const B = heroes[j];
              if (Math.abs(A.x - B.x) + Math.abs(A.y - B.y) !== 1)
                  continue;
              const ia = sim.ensureIntel(A);
              const ib = sim.ensureIntel(B);
              for (let k = 0; k < ia.seen.length; k++) {
                  const seen = ia.seen[k] | ib.seen[k];
                  const dead = ia.dead[k] | ib.dead[k];
                  ia.seen[k] = seen;
                  ib.seen[k] = seen;
                  ia.dead[k] = dead;
                  ib.dead[k] = dead;
              }
          }
      }
  }
  sim.refreshIntel = refreshIntel;
  function probeIntel(id: number) {
      const bag = sim.heroIntel.get(id);
      if (!bag)
          return null;
      let dead = 0;
      let seen = 0;
      for (let i = 0; i < bag.dead.length; i++) {
          dead += bag.dead[i];
          seen += bag.seen[i];
      }
      return { dead, seen };
  }
  sim.probeIntel = probeIntel;
  function plantHero(cls: HeroClass, x: number, y: number): Actor {
      const t = sim.tileAt(x, y);
      if (t && t.kind !== "bedrock") {
          t.kind = "dug";
          t.nutrient = 0;
          t.mana = 0;
          t.nSub = 0;
          t.mSub = 0;
          t.hardness = 1;
      }
      sim.spawnHero(cls, x, y, 1);
      const a = sim.actors[sim.actors.length - 1];
      a.moveCd = 0;
      a.stamina = 400;
      a.staminaMax = 400;
      a.hp = Math.max(a.hp, 80);
      a.maxHp = Math.max(a.maxHp, 80);
      return a;
  }
  sim.plantHero = plantHero;
  function staminaPool() {
      const total = sim.built.waves.length;
      const last = !sim.built.endless && total > 0 && sim.launched >= total;
      if (last)
          return 160;
      if (sim.built.endless) {
          if (sim.raids <= 0)
              return 90;
          if (sim.raids === 1)
              return 110;
          if (sim.raids >= 4)
              return 160;
          return 130;
      }
      if (sim.launched <= 1)
          return 90;
      if (sim.launched === 2)
          return 110;
      return 130;
  }
  sim.staminaPool = staminaPool;
  function spawnHero(cls: HeroClass, x: number, y: number, mul = 1) {
      const b = HERO_BASE[cls];
      const old = HERO_OLD[cls];
      const late = (!sim.built.endless && sim.launched >= 2) || (sim.built.endless && sim.raids >= 1);
      const last = !sim.built.endless && sim.built.waves.length > 0 && sim.launched >= sim.built.waves.length;
      const legend = cls === "knight" && mul >= 2.5;
      let hp: number;
      let atk: number;
      if (legend) {
          hp = LEGEND_HP;
          atk = LEGEND_ATK;
      }
      else if (last) {
          hp = Math.max(1, Math.round(old.hp * 2 * mul)) + HERO_BUFF.hp;
          atk = Math.max(1, Math.round(old.atk * 1.7 * mul)) + HERO_BUFF.atk;
      }
      else if (late) {
          const span = sim.built.endless ? 4 : Math.max(1, sim.built.waves.length - 1);
          const step = sim.built.endless ? Math.min(sim.raids, span) : sim.launched - 1;
          const t = Math.min(0.85, step / span);
          hp = Math.max(1, Math.round((b.hp + (old.hp * 2 - b.hp) * t) * mul)) + HERO_BUFF.hp;
          atk = Math.max(1, Math.round((b.atk + (old.atk * 1.7 - b.atk) * t) * mul)) + HERO_BUFF.atk;
      }
      else {
          hp = Math.max(1, Math.round(b.hp * mul)) + HERO_BUFF.hp;
          atk = Math.max(1, Math.round(b.atk * mul)) + HERO_BUFF.atk;
      }
      let def = b.def;
      if (def <= 0)
          def = cls === "knight" || cls === "swordsman" ? 8 : 4;
      const pool = sim.staminaPool();
      const named = legend
          ? "Legend"
          : mul >= 1.6
              ? cls === "knight"
                  ? "Oathbound Knight"
                  : cls === "mage"
                      ? "Well-Mage"
                      : cls === "priest"
                          ? "Ash Cantor"
                          : `Veteran ${b.name}`
              : mul > 1.15
                  ? `Veteran ${b.name}`
                  : b.name;
      const a: Actor = {
          id: sim.nextId++,
          kind: "hero",
          species: null,
          variant: "normal",
          form: "adult",
          heroClass: cls,
          name: named,
          x,
          y,
          fx: x,
          fy: y,
          dir: 2,
          face: 1,
          hp,
          maxHp: hp,
          atk,
          def,
          mag: Math.max(0, Math.round(b.mag * mul)),
          combat: atk,
          speed: b.speed,
          satiety: 9,
          vitality: 0,
          carryN: 0,
          carryM: 0,
          moveCd: 0.2,
          swingCd: 0.15,
          hungerCd: 99,
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
          bob: 0,
          age: 99,
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
          stamina: pool,
          staminaMax: pool,
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
      sim.actors.push(a);
      if (cls === "knight")
          a.shield = 1;
      sim.toast(legend ? "A legend steps through the stair." : `A ${b.name.toLowerCase()} steps through the stair.`);
      sim.sfx("wave");
      sim.bumpShake(0.35);
      sim.burst(x, y, "#d9d3c7", 10, 2);
  }
  sim.spawnHero = spawnHero;
  function queueWave(heroes: WaveHero[]) {
      if (sim.lordState === "none")
          return;
      sim.invasionStarted = true;
      heroes.forEach((h, i) => sim.spawnQueue.push({ cls: h.cls, mul: h.mul, delay: i === 0 ? 0.2 : 1.25, waited: 0 }));
  }
  sim.queueWave = queueWave;
  function launchWave(index: number) {
      const wave = sim.built.waves[index];
      if (!wave || sim.lordState === "none")
          return;
      sim.launched = index + 1;
      sim.lordLeft = 0;
      sim.upgradeOpen = false;
      sim.petitionAsk = false;
      sim.petitionYes = false;
      sim.petitionDelay = null;
      sim.raidTen = false;
      sim.queueWave(wave.heroes);
      sim.shout("HUMANS IN THE HOLLOW");
      if (!sim.built.endless && wave.heroes.length === 1 && wave.heroes[0].mul >= 2.5) {
          sim.toast("The last wave is one legend.");
      }
      else if (!sim.built.endless && index === sim.built.waves.length - 1 && sim.built.waves.length >= 6 && wave.heroes.length >= 3) {
          sim.toast("The oathbound trio descends.");
      }
  }
  sim.launchWave = launchWave;
  function releaseSpawns(dt: number) {
      if (!sim.spawnQueue.length)
          return;
      const job = sim.spawnQueue[0];
      job.delay -= dt;
      if (job.delay > 0)
          return;
      let spot: {
          x: number;
          y: number;
      } | null = null;
      if (!sim.actorAt(sim.built.entrance.x, sim.built.entrance.y))
          spot = sim.built.entrance;
      else
          spot = sim.freeNeighbor(sim.built.entrance.x, sim.built.entrance.y);
      job.waited += dt;
      if (!spot && job.waited < 2) {
          job.delay = 0.25;
          return;
      }
      sim.spawnQueue.shift();
      sim.spawnHero(job.cls, spot?.x ?? sim.built.entrance.x, spot?.y ?? sim.built.entrance.y, job.mul);
  }
  sim.releaseSpawns = releaseSpawns;
  function invasionActive() {
      for (const a of sim.actors)
          if (a.alive && a.kind === "hero")
              return true;
      return false;
  }
  sim.invasionActive = invasionActive;
  function heroReach(a: Actor) {
      if (a.heroClass === "archer")
          return 4;
      if (a.heroClass === "mage")
          return 3;
      if (a.heroClass === "priest")
          return 2;
      return 1;
  }
  sim.heroReach = heroReach;
  function inFight(a: Actor) {
      const reach = sim.heroReach(a);
      return sim.actors.some((m) => m.alive && m.kind === "monster" && m.form !== "egg" && m.form !== "pupa" && sim.los(a.x, a.y, m.x, m.y, reach));
  }
  sim.inFight = inFight;
  function noteStuck(a: Actor, dt: number) {
      if (sim.inFight(a))
          return;
      const cell = a.y * sim.cols + a.x;
      if (a.anchor < 0) {
          a.anchor = cell;
          a.wob = -1;
      }
      if (cell === a.anchor || (a.wob >= 0 && cell === a.wob))
          a.stuck += dt;
      else if (a.wob < 0) {
          a.wob = cell;
          a.stuck += dt;
      }
      else {
          a.anchor = cell;
          a.wob = -1;
          a.stuck = 0;
          a.frust = 0;
      }
      if (a.stuck >= 2.5) {
          a.frust += 1;
          a.stuck = 0;
      }
  }
  sim.noteStuck = noteStuck;
  function actHero(a: Actor) {
      if (a.frust >= 3) {
          const power = sim.digPower;
          sim.frustratedDig(a);
          sim.digPower = power;
          a.frust = 0;
          a.stuck = 0;
          a.anchor = -1;
          a.wob = -1;
          a.job = "";
          a.path = null;
          return;
      }
      const lord = sim.actors.find((o) => o.alive && o.kind === "overlord") ?? null;
      const lordFree = !!lord && sim.lordState !== "carried";
      if (!a.carrying && lordFree && lord && Math.abs(lord.x - a.x) + Math.abs(lord.y - a.y) <= 1) {
          sim.grab(a, lord);
          return;
      }
      if (a.carrying) {
          a.job = "stair";
          const step = sim.pursue(a, sim.built.entrance.x, sim.built.entrance.y);
          if (step === "none")
              a.job = "idle";
          return;
      }
      if (lordFree && lord && sim.los(a.x, a.y, lord.x, lord.y, Math.max(sim.cols, sim.rows))) {
          sim.ensureIntel(a).lord = 1;
          a.job = "warden";
          const step = sim.pursue(a, lord.x, lord.y);
          if (step === "none")
              a.job = "idle";
          return;
      }
      const reach = sim.heroReach(a);
      const shot = sim.nearest(a, (o) => o.kind === "monster" &&
          o.form !== "egg" &&
          o.form !== "pupa" &&
          (o.x === a.x || o.y === a.y) &&
          Math.abs(o.x - a.x) + Math.abs(o.y - a.y) <= 3 &&
          sim.los(a.x, a.y, o.x, o.y, 3));
      if (shot) {
          const d = Math.abs(shot.x - a.x) + Math.abs(shot.y - a.y);
          a.face = shot.x >= a.x ? 1 : -1;
          if (d <= reach) {
              a.job = "hold";
              a.dir = shot.x !== a.x ? (shot.x > a.x ? 1 : 3) : shot.y > a.y ? 2 : 0;
              return;
          }
          a.job = "fight";
          sim.pursue(a, shot.x, shot.y);
          return;
      }
      const bag = sim.ensureIntel(a);
      if (a.job === "explore" &&
          a.pathTx >= 0 &&
          sim.isOpen(a.pathTx, a.pathTy) &&
          (a.x !== a.pathTx || a.y !== a.pathTy) &&
          bag.seen[a.pathTy * sim.cols + a.pathTx] === 0 &&
          bag.dead[a.pathTy * sim.cols + a.pathTx] === 0) {
          const step = sim.pursue(a, a.pathTx, a.pathTy);
          if (step !== "none")
              return;
      }
      const unseen = sim.nearestOpen(a.x, a.y, (x, y) => {
          const i = y * sim.cols + x;
          return bag.seen[i] === 0 && bag.dead[i] === 0;
      });
      if (unseen) {
          a.job = "explore";
          const step = sim.pursue(a, unseen.x, unseen.y);
          if (step === "none")
              a.job = "idle";
          return;
      }
      if (!bag.lord) {
          const deep = sim.farthestFromStair();
          if (deep && (deep.x !== a.x || deep.y !== a.y)) {
              a.job = "deep";
              const step = sim.pursue(a, deep.x, deep.y);
              if (step !== "none")
                  return;
          }
      }
      a.job = "idle";
  }
  sim.actHero = actHero;
}
