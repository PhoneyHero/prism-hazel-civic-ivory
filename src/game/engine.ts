import type { Hud, Save, SfxName, Sim, Species, StageId, Tile, Tool } from "./types"
import { ALMANAC_IDS, SPECIES_NAME, SPECIES_ORDER, variantBlurb } from "./units"
import { DX, DY } from "./grid"
import { PATH_BLOOM_CAP, PATH_BLOOM_CHANCE, syncFluid } from "./soil"
import { HINTS } from "./flow"
import type { Actor, Bloom, Corpse, Floater, HeroClass, LordState, Match, Particle, Phase, Pressure, WaveHero, Web } from "./types";
import { buildStage, installGrid } from "./grid";
import { installSoil, rollWalls } from "./soil";
import { freshPressure, installUnits } from "./units";
import { STAGE_CLOCK, installFlow } from "./flow";
import { installGoals } from "./goals";
import { installHeroes } from "./heroes";
import { installCombat } from "./combat";

// Loam Lord 1.6.5 "Officer"
// Dig spawns or splashes, never both. The Demon is a 2×2 rune, not a wall birth.
export const LOAM_VERSION = "1.6.5";

export const LOAM_VERSION_NAME = "Officer";

const SAVE_KEY = "loam-lord-save-v1";

function blankSave(): Save {
  return { v: 1, cleared: [], seen: [], best: 0, muted: false };
}

function isStage(x: unknown): x is StageId {
  return (
    x === "hollow" ||
    x === "mossworks" ||
    x === "gate" ||
    x === "witchwell" ||
    x === "bone" ||
    x === "deep" ||
    x === "chamber"
  );
}

export function loadSave(): Save {
  if (typeof localStorage === "undefined") return blankSave();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return blankSave();
    const p = JSON.parse(raw) as Partial<Save>;
    return {
      v: 1,
      cleared: Array.isArray(p.cleared) ? p.cleared.filter(isStage) : [],
      seen: Array.isArray(p.seen) ? p.seen.filter((s) => typeof s === "string") : [],
      best: typeof p.best === "number" ? p.best : 0,
      muted: Boolean(p.muted),
    };
  } catch {
    return blankSave();
  }
}

function writeSave(save: Save) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    /* private mode */
  }
}

function mulberry(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function installEngine(sim: Sim) {
  function emit() {
      for (const fn of sim.listeners)
          fn();
  }
  sim.emit = emit;
  function subscribe(fn: () => void) {
      sim.listeners.add(fn);
      return () => sim.listeners.delete(fn);
  }
  sim.subscribe = subscribe;
  function sfx(name: SfxName) {
      if (sim.muted)
          return;
      sim.api.onSfx(name);
  }
  sim.sfx = sfx;
  function toast(text: string) {
      sim.event = text;
      sim.eventLife = 3.2;
      sim.emit();
  }
  sim.toast = toast;
  function warn(text: string) {
      sim.ominous = text;
      sim.ominousLife = 4.6;
      sim.sfx("ominous");
      sim.emit();
  }
  sim.warn = warn;
  function shout(text: string) {
      sim.banner = text;
      sim.bannerLife = 2.8;
      sim.toast(text);
  }
  sim.shout = shout;
  function persist() {
      sim.save.seen = [...sim.seen];
      sim.save.best = Math.max(sim.save.best, sim.peakHorde);
      sim.save.muted = sim.muted;
      writeSave(sim.save);
  }
  sim.persist = persist;
  function markSeen(id: string) {
      if (sim.seen.has(id))
          return;
      sim.seen.add(id);
      sim.persist();
  }
  sim.markSeen = markSeen;
  function countSpecies(sp: Species) {
      let n = 0;
      for (const a of sim.actors)
          if (a.alive && a.species === sp)
              n++;
      return n;
  }
  sim.countSpecies = countSpecies;
  function chainAlive() {
      for (const a of sim.actors) {
          if (!a.alive || a.kind !== "monster" || a.species === "skeleton")
              continue;
          return true;
      }
      return false;
  }
  sim.chainAlive = chainAlive;
  function heroThreat() {
      if (sim.spawnQueue.length)
          return true;
      for (const a of sim.actors)
          if (a.alive && a.kind === "hero")
              return true;
      return false;
  }
  sim.heroThreat = heroThreat;
  function burst(x: number, y: number, color: string, n: number, speed: number) {
      const limit = sim.api.reducedMotion ? 4 : n;
      for (let i = 0; i < limit; i++) {
          if (sim.particles.length > 90)
              sim.particles.shift();
          const ang = sim.rng() * Math.PI * 2;
          const sp = speed * (0.35 + sim.rng());
          const life = 0.28 + sim.rng() * 0.28;
          sim.particles.push({
              x: x + 0.5,
              y: y + 0.5,
              vx: Math.cos(ang) * sp,
              vy: Math.sin(ang) * sp,
              life,
              max: life,
              color,
              size: 1.4 + sim.rng() * 2.2,
          });
      }
  }
  sim.burst = burst;
  function float(x: number, y: number, text: string, color: string) {
      if (sim.floaters.length > 24)
          sim.floaters.shift();
      sim.floaters.push({ x: x + 0.5, y: y + 0.2, text, life: 0.7, max: 0.7, color });
  }
  sim.float = float;
  function bumpShake(n: number) {
      if (sim.api.reducedMotion)
          return;
      sim.shake = Math.min(1.4, sim.shake + n);
      sim.api.shake = sim.shake;
  }
  sim.bumpShake = bumpShake;
  function recomputeHorde() {
      let h = 0;
      for (const sp of SPECIES_ORDER) {
          const pop = sim.countSpecies(sp);
          if (pop > sim.pressure[sp].peak)
              sim.pressure[sp].peak = pop;
      }
      for (const a of sim.actors) {
          if (a.alive && a.kind === "monster" && a.form === "adult")
              h += a.combat;
      }
      sim.horde = h;
      if (h > sim.peakHorde) {
          sim.peakHorde = h;
          if (h > sim.save.best) {
              sim.save.best = h;
              sim.persist();
          }
      }
  }
  sim.recomputeHorde = recomputeHorde;
  function advanceHint() {
      const moss = sim.countSpecies("moss") + sim.born.moss;
      const crawlers = sim.born.crawler;
      const lizards = sim.born.lizard;
      let next = sim.hintStep;
      if (sim.hintStep === 0 && sim.digs >= 1)
          next = 1;
      else if (sim.hintStep === 1 && moss >= 1)
          next = 2;
      else if (sim.hintStep === 2 && crawlers >= 1)
          next = 3;
      else if (sim.hintStep === 3 && (lizards >= 1 || sim.nestTiles.length > 0))
          next = 4;
      else if (sim.hintStep === 4 && sim.lordState !== "none")
          next = 5;
      else if (sim.hintStep === 5 && sim.invasionStarted)
          next = 6;
      if (next !== sim.hintStep)
          sim.hintStep = next;
  }
  sim.advanceHint = advanceHint;
  function tick(dt: number) {
      sim.api.time = sim.time;
      sim.api.shake = sim.shake;
      sim.api.digs = sim.digs;
      if (sim.paused || sim.phase !== "play") {
          for (const p of sim.particles)
              p.life -= dt;
          for (const f of sim.floaters)
              f.life -= dt;
          sim.trimFx();
          return;
      }
      sim.time += dt;
      sim.api.time = sim.time;
      sim.eventLife -= dt;
      sim.ominousLife -= dt;
      sim.bannerLife -= dt;
      if (sim.eventLife <= 0)
          sim.event = "";
      if (sim.ominousLife <= 0)
          sim.ominous = "";
      if (sim.bannerLife <= 0)
          sim.banner = "";
      sim.shake = Math.max(0, sim.shake - dt * 2.4);
      sim.api.shake = sim.shake;
      for (const p of sim.particles) {
          p.life -= dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 1.5 * dt;
      }
      for (const f of sim.floaters) {
          f.life -= dt;
          f.y -= dt * 0.55;
      }
      sim.trimFx();
      sim.nestScan -= dt;
      if (sim.nestScan <= 0) {
          sim.nestScan = 0.55;
          sim.refreshNests();
          sim.refreshRunes();
      }
      sim.auraScan -= dt;
      if (sim.auraScan <= 0) {
          sim.auraScan = 0.5;
          sim.tickAura();
      }
      if (sim.prepLeft !== null) {
          sim.prepLeft -= dt;
          if (!sim.raidTen && sim.prepLeft <= 10 && sim.prepLeft > 0) {
              sim.raidTen = true;
              sim.shout("RAID IN 10");
          }
          if (sim.prepLeft <= 0) {
              sim.prepLeft = null;
              if (sim.lordState === "none")
                  sim.autoPlace();
              if (sim.built.waves.length)
                  sim.launchWave(0);
          }
      }
      sim.releaseSpawns(dt);
      for (const a of sim.actors) {
          if (!a.alive)
              continue;
          a.fx += (a.x - a.fx) * Math.min(1, dt * 12);
          a.fy += (a.y - a.fy) * Math.min(1, dt * 12);
          a.bob += dt * (a.form === "adult" ? 6 : 2);
          a.hitFlash = Math.max(0, a.hitFlash - dt);
          a.moveCd -= dt;
          a.swingCd -= dt;
          if (a.sleep > 0) {
              a.sleep -= dt;
              if (a.kind === "monster" && a.hp < a.maxHp)
                  a.hp = Math.min(a.maxHp, a.hp + dt * 0.5);
          }
          if (a.feedCd > 0)
              a.feedCd -= dt;
          if (a.poison > 0) {
              a.poison -= dt;
              a.poisonAcc += dt;
              if (a.poisonAcc >= 1) {
                  a.poisonAcc -= 1;
                  a.hp -= 1;
                  sim.float(a.x, a.y, "1", "#9dcc45");
                  if (a.hp <= 0)
                      sim.slay(a, "poison", a.poisonFrom);
              }
          }
          if (!a.alive)
              continue;
          if (a.kind === "hero" && a.windup <= 0)
              sim.noteStuck(a, dt);
          if (a.path && a.path.length)
              a.pace += dt;
          if ((a.form === "egg" || a.form === "pupa") && a.hatch > 0) {
              a.hatch -= dt;
              if (a.hatch <= 0)
                  sim.emerge(a);
              continue;
          }
          if (a.kind === "monster" && (a.form === "adult" || a.form === "fly") && a.species !== "skeleton") {
              const rooted = a.species === "moss" && a.brood !== null && a.brood !== "walk";
              if (!rooted) {
                  a.age -= dt * (sim.calmNow() ? 0.5 : 1);
                  if (a.age <= 0)
                      sim.slay(a, "age", null);
              }
          }
          if (a.alive && a.species === "moss" && a.form === "adult")
              sim.tickBrood(a, dt);
          if (a.alive && a.species === "spirit") {
              const pile = sim.corpseAt(a.x, a.y);
              if (pile) {
                  pile.spirits += 1;
                  if (pile.spirits >= 5) {
                      pile.red = true;
                      sim.float(pile.x, pile.y, "RED", "#e23a4a");
                  }
                  else
                      sim.float(pile.x, pile.y, `${pile.spirits}`, "#d5f4f8");
                  a.alive = false;
                  sim.burst(a.x, a.y, "#d5f4f8", 6, 1.4);
              }
          }
          if (a.boost > 0)
              a.boost -= dt;
          if (a.kind === "hero" && a.vitality > 0)
              a.vitality = Math.max(0, a.vitality - dt);
          if (a.windup > 0) {
              a.windup -= dt;
              if (a.windup <= 0) {
                  a.windup = 0;
                  a.swingCd = 0.85;
                  sim.releaseSkill(a);
              }
          }
          if (a.kind === "monster" && (a.form === "adult" || a.form === "fly")) {
              if (a.species === "skeleton") {
                  let burn = dt;
                  for (const wisp of sim.actors) {
                      if (!wisp.alive || wisp.species !== "spirit")
                          continue;
                      if (Math.abs(wisp.x - a.x) + Math.abs(wisp.y - a.y) <= 2)
                          burn += dt;
                  }
                  a.hatch -= burn;
                  if (a.hatch <= 0)
                      sim.slay(a, "age", null);
              }
              else {
                  const huntEvery = a.variant === "giant" ? 24 : 11.6;
                  const calm = sim.calmNow();
                  a.hungerCd -= dt;
                  if (a.hungerCd <= 0) {
                      a.hungerCd = calm ? huntEvery * 2 : huntEvery;
                      if (calm) {
                          if (a.satiety > 3)
                              a.satiety -= 1;
                      }
                      else {
                          a.satiety = Math.max(0, a.satiety - 1);
                          if (sim.rng() < 0.25)
                              sim.taxTile(a.x, a.y);
                      }
                  }
                  if (!calm && a.satiety <= 0 && a.species) {
                      sim.pressure[a.species].hunger += dt;
                      sim.maybeArm(a.species);
                  }
                  a.starve = 0;
                  if (a.alive && a.species === "bud")
                      sim.demonSip(a);
                  else if (a.alive &&
                      a.species &&
                      a.species !== "bud" &&
                      (a.species === "witch" || a.species === "vampire" || a.species === "succubus" || a.species === "nimbus")) {
                      sim.hexSpend(a);
                  }
                  if (a.alive && a.species && a.species !== "bud") {
                      const rate = sim.hungerRate(a.species);
                      if (rate > 0) {
                          a.hunger -= dt * rate;
                          if (a.hunger <= 0) {
                              a.hunger = 0;
                              sim.slay(a, "starve", null);
                          }
                      }
                  }
              }
          }
      }
      sim.refreshIntel();
      for (const a of sim.actors) {
          if (!a.alive)
              continue;
          if (a.kind === "monster" &&
              a.species === "crawler" &&
              a.form === "adult" &&
              a.carryN >= 45 &&
              sim.openNeighbors(a.x, a.y) <= 1) {
              a.form = "pupa";
              a.hatch = 7.5;
              a.speed = 0;
              a.atk = 0;
              a.combat = 0;
              a.job = "hold";
              sim.markSeen("pupa");
              if (!sim.everSeenForm.pupa) {
                  sim.everSeenForm.pupa = true;
                  sim.toast("A Gnawling curls into a pupa.");
              }
              sim.sfx("egg");
              continue;
          }
          if (a.sleep > 0 || a.form === "egg" || a.form === "pupa")
              continue;
          if (a.kind === "overlord")
              continue;
          if (a.windup > 0)
              continue;
          if (a.moveCd > 0)
              continue;
          const beforeX = a.x;
          const beforeY = a.y;
          if (a.kind === "hero")
              sim.actHero(a);
          else
              sim.actMonster(a);
          const moved = a.x !== beforeX || a.y !== beforeY;
          if (moved && a.kind === "hero") {
              a.stamina -= 1;
              const bloom = sim.blooms.find((b) => b.x === a.x && b.y === a.y);
              if (bloom) {
                  sim.blooms.splice(sim.blooms.indexOf(bloom), 1);
                  if (bloom.m > 0 && bloom.n === 0)
                      sim.sproutPair(a.x, a.y, "spirit");
                  else
                      sim.sproutPair(a.x, a.y, "moss");
              }
              if (!a.carrying) {
                  a.shed += 1 / Math.max(0.25, a.speed);
                  if (a.shed >= 8) {
                      a.shed = 0;
                      const wall = sim.nearestWall(a.x, a.y);
                      if (wall) {
                          if (a.heroClass === "mage" || a.heroClass === "priest")
                              sim.bumpM(wall.t);
                          else
                              sim.bumpN(wall.t);
                      }
                  }
              }
              if (a.stamina <= 0)
                  sim.slay(a, "stamina", null);
          }
          if (moved && a.kind === "monster") {
              const bloom = sim.blooms.find((b) => b.x === a.x && b.y === a.y);
              if (bloom) {
                  sim.blooms.splice(sim.blooms.indexOf(bloom), 1);
                  if (bloom.m > 0 && bloom.n === 0)
                      sim.sproutPair(bloom.x, bloom.y, "spirit");
                  else
                      sim.sproutPair(bloom.x, bloom.y, "moss");
              }
              if (a.species === "witch" ||
                  a.species === "vampire" ||
                  a.species === "succubus") {
                  a.shed += 1;
                  if (a.shed >= 3 && !sim.webs.some((w) => w.x === a.x && w.y === a.y)) {
                      a.shed = 0;
                      sim.layWeb(a.x, a.y);
                  }
              }
          }
          let spd = a.speed;
          if (a.kind === "hero" && a.vitality > 0)
              spd *= 0.45;
          if (a.carrying)
              spd *= a.boost > 0 ? 1 : 0.6;
          if (a.kind === "hero" && sim.webs.some((w) => w.x === a.x && w.y === a.y))
              spd *= 0.6;
          if (moved)
              a.moveCd = 1 / Math.max(0.25, spd);
          else if (a.job === "idle")
              a.moveCd = 0.4;
          else if (a.job === "hold")
              a.moveCd = 0.3;
          else
              a.moveCd = 0.2;
      }
      sim.syncCarry();
      sim.combat();
      sim.reproCd = Math.max(0, sim.reproCd - dt);
      sim.birthCd -= dt;
      if (sim.birthCd <= 0) {
          sim.birthCd = 4.2;
          sim.passiveBirth();
      }
      sim.leakAcc += dt;
      if (sim.leakAcc >= 4) {
          sim.leakAcc = 0;
          sim.leakStores();
      }
      sim.bloomAcc += dt;
      if (sim.bloomAcc >= 12) {
          sim.bloomAcc -= 12;
          let wilts = 0;
          let caps = 0;
          for (const b of sim.blooms) {
              if (!b.path)
                  continue;
              if (b.n > 0)
                  wilts += 1;
              else if (b.m > 0)
                  caps += 1;
          }
          for (let y = 1; y < sim.rows - 1; y++) {
              for (let x = 1; x < sim.cols - 1; x++) {
                  const t = sim.tiles[y * sim.cols + x];
                  if (t.kind !== "dug")
                      continue;
                  if (sim.blooms.some((b) => b.x === x && b.y === y))
                      continue;
                  if (sim.actorAt(x, y))
                      continue;
                  let donorN: Tile | null = null;
                  let bestN = 0;
                  let donorM: Tile | null = null;
                  let bestM = 0;
                  for (let d = 0; d < 4; d++) {
                      const w = sim.tileAt(x + DX[d], y + DY[d]);
                      if (!w || w.kind !== "soil")
                          continue;
                      if (w.nutrient > bestN) {
                          bestN = w.nutrient;
                          donorN = w;
                      }
                      if (w.mana > bestM) {
                          bestM = w.mana;
                          donorM = w;
                      }
                  }
                  if (wilts < PATH_BLOOM_CAP && donorN && bestN >= 5 && sim.rng() < PATH_BLOOM_CHANCE) {
                      const take = Math.min(5, donorN.nutrient);
                      donorN.nutrient -= take;
                      syncFluid(donorN);
                      sim.blooms.push({ x, y, n: take, m: 0, life: 18, path: true });
                      wilts += 1;
                      continue;
                  }
                  if (caps < PATH_BLOOM_CAP && donorM && bestM >= 5 && sim.rng() < PATH_BLOOM_CHANCE) {
                      const take = Math.min(5, donorM.mana);
                      donorM.mana -= take;
                      syncFluid(donorM);
                      sim.blooms.push({ x, y, n: 0, m: take, life: 18, path: true });
                      caps += 1;
                  }
              }
          }
      }
      for (let i = sim.blooms.length - 1; i >= 0; i--) {
          sim.blooms[i].life -= dt;
          if (sim.blooms[i].life > 0)
              continue;
          const b = sim.blooms[i];
          sim.blooms.splice(i, 1);
          if (!b.path || !sim.isOpen(b.x, b.y) || sim.actorAt(b.x, b.y))
              continue;
          if (b.m > 0 && b.n === 0)
              sim.sproutPair(b.x, b.y, "spirit");
          else
              sim.sproutPair(b.x, b.y, "moss");
      }
      if (sim.petitionDelay !== null && sim.phase === "play") {
          sim.petitionDelay -= dt;
          if (sim.petitionDelay <= 0) {
              sim.petitionDelay = null;
              if (sim.petitionWindow() && !sim.petitionYes) {
                  sim.petitionAsk = true;
                  if (sim.launched <= 1) {
                      const seated = sim.livingLord();
                      if (seated)
                          sim.api.focus = { x: seated.x, y: seated.y, until: sim.time + 1.8 };
                  }
              }
          }
      }
      if (sim.clockLeft !== null && sim.phase === "play") {
          sim.clockLeft -= dt;
          if (sim.clockLeft <= 0) {
              sim.clockLeft = 0;
              const carrier = sim.carrierId != null ? sim.actors.find((a) => a.alive && a.id === sim.carrierId) : null;
              const onStair = !!carrier && sim.lordState === "carried" && carrier.x === sim.built.entrance.x && carrier.y === sim.built.entrance.y;
              if (!onStair)
                  sim.finish("win", "The stage clock ran out. The Warden is still below.");
          }
      }
      for (let i = sim.webs.length - 1; i >= 0; i--) {
          const w = sim.webs[i];
          w.life -= dt;
          const stomper = sim.actors.some((a) => a.alive && a.kind === "hero" && a.x === w.x && a.y === w.y);
          if (stomper)
              sim.dumpOrthogonal(w.x, w.y, 0, 6, false);
          if (stomper || w.life <= 0)
              sim.webs.splice(i, 1);
      }
      if (sim.actors.some((a) => !a.alive)) {
          for (let i = sim.actors.length - 1; i >= 0; i--)
              if (!sim.actors[i].alive)
                  sim.actors.splice(i, 1);
      }
      if (sim.built.endless && sim.raidWarn !== null && sim.phase === "play") {
          sim.raidWarn -= dt;
          if (sim.raidWarn <= 0) {
              sim.raidWarn = null;
              const pack = sim.pendingRaid;
              sim.pendingRaid = null;
              if (pack && sim.lordState !== "none" && sim.lordState !== "carried") {
                  sim.raidActive = true;
                  sim.invasionStarted = true;
                  sim.lordLeft = 0;
                  sim.queueWave(pack);
                  sim.shout("HUMANS IN THE HOLLOW");
              }
          }
      }
      if (!sim.built.endless && sim.prepLeft === null && sim.phase === "play" && sim.launched > 0) {
          const waveClear = sim.spawnQueue.length === 0 && !sim.actors.some((a) => a.alive && a.kind === "hero");
          if (waveClear && sim.clearNoted < sim.launched) {
              sim.clearNoted = sim.launched;
              sim.grantStipend();
              if (sim.launched < sim.built.waves.length)
                  sim.ecoWait = sim.built.eco;
          }
          if (waveClear && sim.ecoWait !== null) {
              if (!sim.raidTen && sim.ecoWait <= 10) {
                  sim.raidTen = true;
                  sim.shout("RAID IN 10");
              }
              sim.ecoWait -= dt;
              if (sim.ecoWait <= 0) {
                  sim.ecoWait = null;
                  sim.launchWave(sim.launched);
              }
          }
      }
      sim.recomputeHorde();
      sim.advanceHint();
      sim.checkEnd();
      sim.uiAcc += dt;
      if (sim.uiAcc > 0.25) {
          sim.uiAcc = 0;
          sim.emit();
      }
      sim.api.time = sim.time;
      sim.api.shake = sim.shake;
      sim.api.digs = sim.digs;
      sim.api.heroesSlain = sim.heroesSlain;
      sim.api.monsterDeaths = sim.monsterDeaths;
  }
  sim.tick = tick;
  function trimFx() {
      for (let i = sim.particles.length - 1; i >= 0; i--)
          if (sim.particles[i].life <= 0)
              sim.particles.splice(i, 1);
      for (let i = sim.floaters.length - 1; i >= 0; i--)
          if (sim.floaters[i].life <= 0)
              sim.floaters.splice(i, 1);
  }
  sim.trimFx = trimFx;
  function tap(x: number, y: number) {
      if (sim.phase !== "play" || sim.paused)
          return;
      if (x < 0 || y < 0 || x >= sim.cols || y >= sim.rows)
          return;
      const lord = sim.livingLord();
      if (lord && lord.x === x && lord.y === y && sim.petitionWindow()) {
          if (sim.petitionDelay !== null)
              return;
          sim.petitionAsk = true;
          sim.upgradeOpen = false;
          sim.emit();
          return;
      }
      if (sim.tool === "dig")
          sim.digAt(x, y);
      else if (sim.tool === "smash")
          sim.smashAt(x, y);
      else
          sim.placeLord(x, y);
  }
  sim.tap = tap;
  function setTool(t: Tool) {
      sim.tool = t;
      sim.api.tool = t;
      sim.sfx("ui");
      sim.emit();
  }
  sim.setTool = setTool;
  function toggleHeat() {
      sim.heatmap = !sim.heatmap;
      sim.api.heatmap = sim.heatmap;
      sim.sfx("ui");
      sim.emit();
  }
  sim.toggleHeat = toggleHeat;
  function togglePause() {
      if (sim.phase !== "play")
          return;
      sim.paused = !sim.paused;
      sim.emit();
  }
  sim.togglePause = togglePause;
  function toggleMute() {
      sim.muted = !sim.muted;
      sim.save.muted = sim.muted;
      sim.persist();
      sim.emit();
  }
  sim.toggleMute = toggleMute;
  function hud(): Hud {
      const counts = SPECIES_ORDER.map((id) => ({ id, name: SPECIES_NAME[id], n: sim.countSpecies(id) }));
      const almanac = ALMANAC_IDS.map((id) => {
          const row = variantBlurb(id);
          return { id, title: row.title, blurb: row.blurb, seen: sim.seen.has(id) };
      });
      let waveText = "The stair is quiet";
      let countdown: number | null = sim.prepLeft;
      if (sim.built.endless) {
          if (sim.raidWarn !== null) {
              waveText = "NEXT RAID";
              countdown = sim.raidWarn;
          }
          else if (sim.raidActive) {
              waveText = "RAID";
              countdown = null;
          }
          else {
              waveText = sim.raids ? `${sim.raids} raid${sim.raids === 1 ? "" : "s"} broken` : "Summon when ready";
              countdown = null;
          }
      }
      else if (sim.prepLeft !== null) {
          waveText = sim.lordState === "none" ? "PREP" : "RAID IN";
          countdown = sim.prepLeft;
      }
      else if (sim.phase === "win")
          waveText = "Held";
      else if (sim.phase === "lose")
          waveText = "Fallen";
      else if (sim.ecoWait !== null) {
          waveText = "NEXT RAID";
          countdown = sim.ecoWait;
      }
      else if (sim.invasionActive() || sim.spawnQueue.length) {
          waveText = `WAVE ${Math.max(1, sim.launched)}/${sim.built.waves.length}`;
          countdown = null;
      }
      const hero = sim.carrierId != null ? sim.actors.find((a) => a.alive && a.id === sim.carrierId) : null;
      let drag = 0;
      if (sim.lordState === "carried" && hero) {
          const d = Math.abs(hero.x - sim.built.entrance.x) + Math.abs(hero.y - sim.built.entrance.y);
          drag = 1 - d / Math.max(1, sim.dragStart);
      }
      sim.api.lordState = sim.lordState;
      return {
          stageId: sim.stageId,
          stageName: sim.built.name,
          digPower: sim.digPower,
          maxDig: sim.maxDig,
          horde: sim.horde,
          peakHorde: sim.peakHorde,
          countdown,
          waveText,
          phase: sim.phase,
          paused: sim.paused,
          tool: sim.tool,
          heatmap: sim.heatmap,
          ominous: sim.ominousLife > 0 ? sim.ominous : null,
          hint: HINTS[sim.hintStep] ?? HINTS[HINTS.length - 1],
          event: sim.eventLife > 0 ? sim.event : null,
          lordLeft: sim.lordLeft,
          lordState: sim.lordState,
          drag: Math.max(0, Math.min(1, drag)),
          waveNum: sim.launched,
          waveTotal: sim.built.endless ? 0 : sim.built.waves.length,
          eco: sim.ecoWait !== null,
          summoning: sim.raidWarn !== null,
          upgradeOpen: sim.upgradeOpen,
          petition: sim.petitionAsk,
          rattleLine: sim.countSpecies("skeleton") > 0 ? `Rattles ${sim.countSpecies("skeleton")}/4` : null,
          clock: sim.clockLeft,
          upgrades: sim.upgradeOffers(),
          version: `${LOAM_VERSION} ${LOAM_VERSION_NAME}`,
          banner: sim.bannerLife > 0 ? sim.banner : null,
          endless: sim.built.endless,
          raidActive: sim.raidActive,
          raids: sim.raids,
          counts,
          almanac,
          result: sim.result,
          muted: sim.muted,
          digs: sim.digs,
      };
  }
  sim.hud = hud;
}

export type {
  Tool, StageId, Phase, Species, Variant, Form, Brood, HeroClass, LordState, SfxName,
  Tile, Actor, Particle, Floater, Bloom, Web, CameraFocus, UpgradeOffer, Corpse,
  DigOption, Hud, Match, Save,
} from "./types";
export { nutrientBand, bandSub, PATH_BLOOM_CHANCE, PATH_BLOOM_CAP } from "./soil";
export { SPECIES_NAME, SPECIES_ORDER } from "./units";
export { STAGE_META } from "./flow";

export function createMatch(stageId: StageId, seed?: number): Match {
  const built = buildStage(stageId);
  const cols = built.cols;
  const rows = built.rows;
  const tiles = built.tiles;
  const actors: Actor[] = [];
  const particles: Particle[] = [];
  const floaters: Floater[] = [];
  const rng = mulberry(seed ?? (Date.now() ^ (stageId.length * 9973)));
  rollWalls(tiles, cols, rows, rng, built.entrance.x, stageId);
  const save = loadSave();
  const seen = new Set(save.seen);
  const listeners = new Set<() => void>();
  const pressure: Record<Species, Pressure> = {
    moss: freshPressure(),
    crawler: freshPressure(),
    lizard: freshPressure(),
    bud: freshPressure(),
    drake: freshPressure(),
    spirit: freshPressure(),
    witch: freshPressure(),
    vampire: freshPressure(),
    succubus: freshPressure(),
    nimbus: freshPressure(),
    skeleton: freshPressure(),
  };
  const sim = {
    stageId,
    built,
    cols,
    rows,
    tiles,
    actors,
    particles,
    floaters,
    rng,
    save,
    seen,
    listeners,
    pressure,
    nextId: 1,
    digPower: built.dig,
    maxDig: built.dig,
    phase: "play" as Phase,
    paused: false,
    tool: "dig" as Tool,
    heatmap: false,
    muted: save.muted,
    time: 0,
    shake: 0,
    digs: 0,
    horde: 0,
    peakHorde: 0,
    hintStep: 0,
    event: "",
    eventLife: 0,
    ominous: "",
    ominousLife: 0,
    banner: "",
    bannerLife: 0,
    uiAcc: 0,
    birthCd: 2.4,
    reproCd: 0,
    nestScan: 0,
    auraScan: 0,
    nestTiles: [] as { x: number; y: number }[],
    lordLeft: 0,
    lordState: "none" as LordState,
    carrierId: null as number | null,
    dragStart: 1,
    prepLeft: built.endless ? null : built.prep,
    launched: 0,
    ecoWait: null as number | null,
    clearNoted: 0,
    invasionStarted: false,
    raidActive: false,
    raidWarn: null as number | null,
    pendingRaid: null as WaveHero[] | null,
    leakAcc: 0,
    sipAcc: 0,
    upgradeOpen: false,
    petitionAsk: false,
    petitionYes: false,
    petitionDelay: null as number | null,
    firstAye: true,
    clockLeft: STAGE_CLOCK[stageId],
    bloomAcc: 0,
    staminaFalls: 0,
    combatFalls: 0,
    heroIntel: new Map<number, { seen: Uint8Array; dead: Uint8Array; lord: number }>(),
    rattleMem: new Map<number, Uint8Array>(),
    gridStamp: 0,
    birthMajor: 1,
    birthSub: 0,
    raidTen: false,
    upgrades: { moss: 0, crawler: 0, lizard: 0, spirit: 0, witch: 0, drake: 0 },
    raids: 0,
    heroesSlain: 0,
    monsterDeaths: 0,
    mutations: 0,
    rattleN: 0,
    rattleM: 0,
    result: null as Hud["result"],
    spawnQueue: [] as { cls: HeroClass; mul: number; delay: number; waited: number }[],
    born: { moss: 0, crawler: 0, lizard: 0, bud: 0, drake: 0, spirit: 0, witch: 0, vampire: 0, succubus: 0, nimbus: 0, skeleton: 0 },
    everSeenForm: { egg: false, pupa: false },
    corpses: [] as Corpse[],
    blooms: [] as Bloom[],
    webs: [] as Web[],
    runeList: [] as { x: number; y: number }[],
    nestMarks: [] as { x: number; y: number }[],
    nestBoxes: [] as { x: number; y: number; w: number; h: number }[],
    api: undefined as unknown as Match,
  } as unknown as Sim;
  installGrid(sim);
  installSoil(sim);
  installUnits(sim);
  installGoals(sim);
  installHeroes(sim);
  installCombat(sim);
  installFlow(sim);
  installEngine(sim);
  const api: Match = {
    cols,
    rows,
    tiles,
    actors,
    corpses: sim.corpses,
    blooms: sim.blooms,
    webs: sim.webs,
    runes: sim.runeList,
    nests: sim.nestMarks,
    focus: null,
    particles,
    floaters,
    shake: 0,
    time: 0,
    heatmap: false,
    tool: "dig",
    reducedMotion: false,
    onSfx: () => {},
    lordState: "none",
    digs: 0,
    born: sim.born,
    heroesSlain: 0,
    monsterDeaths: 0,
    tick: (dt) => sim.tick(dt),
    tap: (x, y) => sim.tap(x, y),
    setTool: (t) => sim.setTool(t),
    toggleHeat: () => sim.toggleHeat(),
    togglePause: () => sim.togglePause(),
    toggleMute: () => sim.toggleMute(),
    summon: () => sim.summon(),
    buyUpgrade: (id) => sim.buyUpgrade(id),
    answerPetition: (yes) => sim.answerPetition(yes),
    closeUpgrades: () => sim.closeUpgrades(),
    subscribe: (fn) => sim.subscribe(fn),
    hud: () => sim.hud(),
    listDiggable: () => sim.listDiggable(),
    probeIntel: (id) => sim.probeIntel(id),
    plant: (sp, x, y, form) => sim.plant(sp, x, y, form),
    plantHero: (cls, x, y) => sim.plantHero(cls, x, y),
  };
  sim.api = api;
  api.tool = sim.tool;
  api.heatmap = sim.heatmap;
  return api;
}
