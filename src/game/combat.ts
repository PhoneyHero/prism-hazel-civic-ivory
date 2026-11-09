import type { Actor, Sim, Species } from "./types";
import { HERO_BASE, HERO_BUFF } from "./heroes";
import { DX, DY } from "./grid";

export function installCombat(sim: Sim) {
  function strike(att: Actor, def: Actor) {
      if (!att.alive || !def.alive || att.sleep > 0)
          return;
      if (def.kind === "overlord") {
          if (att.kind === "hero")
              sim.grab(att, def);
          return;
      }
      if (def.shield > 0 && def.kind === "hero") {
          def.shield = 0;
          def.hitFlash = 0.16;
          sim.float(def.x, def.y, "BLOCK", "#c5d0d6");
          sim.pour(def.x, def.y, 0, 3);
          sim.sfx("hit");
          return;
      }
      let dmg: number;
      if (att.kind === "hero" && (att.heroClass === "mage" || att.heroClass === "priest")) {
          dmg = Math.max(1, att.mag - Math.floor(def.def / 2));
      }
      else if (att.species === "witch" ||
          att.species === "vampire" ||
          att.species === "succubus" ||
          att.species === "nimbus") {
          dmg = Math.max(1, att.atk + att.mag - def.def);
      }
      else if (att.species === "skeleton" && att.rattle === 1) {
          dmg = Math.max(1, att.mag - Math.floor(def.def / 2));
      }
      else {
          dmg = Math.max(1, att.atk - def.def);
      }
      if (att.kind === "hero" && def.kind === "monster" && def.maxHp > 0) {
          dmg = Math.min(dmg, Math.max(1, Math.floor(def.maxHp * 0.4)));
      }
      if (att.species === "lizard" || att.species === "drake")
          att.rest = 1;
      if (def.species === "lizard" || def.species === "drake")
          def.rest = 1;
      if (att.variant === "deformed" && dmg > 0) {
          if (sim.rng() < 0.42) {
              def.poison = Math.max(def.poison, 4.2);
              def.poisonFrom = att.species;
          }
          if (sim.rng() < 0.24)
              def.sleep = Math.max(def.sleep, 1.35);
      }
      if ((att.species === "witch" && att.variant !== "giant") ||
          att.species === "vampire" ||
          att.species === "succubus" ||
          att.species === "nimbus") {
          sim.layWeb(def.x, def.y);
      }
      if (dmg <= 0) {
          sim.float(def.x, def.y, "ward", "#d6e27a");
          return;
      }
      if (def.sleep > 0) {
          if (att.kind === "hero")
              dmg *= 2;
          def.sleep = 0;
          sim.float(def.x, def.y, "WAKE", "#f3e6c8");
      }
      def.hp -= dmg;
      def.hitFlash = 0.12;
      sim.float(def.x, def.y, `${dmg}`, def.kind === "hero" ? "#e25b3a" : "#f3e6c8");
      sim.sfx("hit");
      sim.bumpShake(0.12);
      if (def.hp <= 0) {
          if (att.kind === "hero" && def.kind === "monster" && att.combat > 0) {
              att.kills += 1;
              const stacks = Math.min(5, att.kills);
              att.atk = Math.max(1, Math.round(att.combat * (1 + 0.04 * stacks)));
              att.stamina = Math.min(att.staminaMax, att.stamina + 2);
          }
          const by = att.kind === "monster" ? att.species : att.kind === "hero" ? "hero" : "overlord";
          sim.slay(def, "combat", by);
      }
  }
  sim.strike = strike;
  function slay(a: Actor, cause: "combat" | "eaten" | "starve" | "smash" | "poison" | "age" | "stamina", by: Species | "hero" | "overlord" | "smash" | null) {
      if (!a.alive)
          return;
      a.alive = false;
      a.hitFlash = 0.2;
      if (a.kind === "hero") {
          sim.heroesSlain += 1;
          sim.api.heroesSlain = sim.heroesSlain;
          if (cause === "stamina")
              sim.staminaFalls += 1;
          else
              sim.combatFalls += 1;
          const carried = a.carrying || a.id === sim.carrierId;
          if (carried)
              sim.dropLord(a.x, a.y);
          const tithe = sim.heroTithe(a);
          sim.paintDiamond(a.x, a.y, tithe.n, tithe.m);
          sim.corpses.push(sim.makePile(a.x, a.y, { manaAtDeath: a.mag, cls: a.heroClass }));
          sim.burst(a.x, a.y, "#d9d3c7", 12, 2.6);
          sim.sfx("die");
          sim.toast(cause === "stamina" ? `${a.name} collapses. Remains stay.` : `${a.name} falls. Remains stay until the pick raises them.`);
          sim.bumpShake(0.45);
          if (by && by !== "hero" && by !== "overlord" && by !== "smash") {
              const p = sim.pressure[by];
              p.heroKills += 1;
              if (p.heroKills >= 3 && (p.giantArmed || p.deformArmed || p.breedArmed)) {
                  p.giantArmed = false;
                  p.deformArmed = false;
                  p.breedArmed = false;
                  p.hunger = 0;
                  p.predation = Math.max(0, p.predation - 4);
                  sim.toast("Hero-blood steadies the line. Next births come out basic.");
              }
          }
          return;
      }
      if (a.kind === "overlord") {
          a.alive = true;
          a.hp = Math.max(1, a.hp);
          return;
      }
      sim.monsterDeaths += 1;
      sim.api.monsterDeaths = sim.monsterDeaths;
      if (a.species === "skeleton" || a.species === "bud") {
          if (a.species === "skeleton") {
              sim.corpses.push(sim.makePile(a.x, a.y, {
                  manaAtDeath: a.mag,
                  cls: a.heroClass,
                  red: a.rattle === 3,
                  spirits: a.rattle === 3 ? 5 : 0,
              }));
          }
          sim.sfx("die");
          sim.burst(a.x, a.y, a.species === "bud" ? "#6a4494" : "#efe6d2", 6, 1.4);
          return;
      }
      if (a.species === "moss" && cause === "age" && a.brood !== "bloom") {
          a.alive = true;
          a.brood = "bloom";
          a.speed = 0;
          a.name = "Loam Bloom";
          a.hatch = 14;
          sim.markSeen("wiltbloom");
          sim.toast("A Loamite opens into a Bloom.");
          return;
      }
      if (a.species === "moss" && (a.brood === "bud" || a.brood === "bloom") && (cause === "smash" || cause === "combat")) {
          sim.hatchLoamites(a, "smash");
          sim.sfx(cause === "smash" ? "smash" : "die");
          return;
      }
      if (a.species && cause === "starve") {
          sim.pressure[a.species].starveDeaths += 1;
          sim.pressure[a.species].hunger += 2;
          sim.maybeArm(a.species);
      }
      if (cause !== "eaten") {
          sim.dumpOrthogonal(a.x, a.y, Math.floor(a.carryN * 0.5), Math.floor(a.carryM * 0.5), false);
      }
      if (cause === "smash") {
          sim.sfx("smash");
          sim.burst(a.x, a.y, "#c4a574", 12, 2.8);
          sim.toast(`${a.name} is crushed into fertilizer.`);
          sim.birthCd = Math.min(sim.birthCd, 0.35);
      }
      else if (cause !== "eaten") {
          sim.sfx("die");
          sim.burst(a.x, a.y, "#8a5a3a", 6, 1.6);
      }
  }
  sim.slay = slay;
  function combat() {
      const heroes = sim.actors.filter((a) => a.alive && a.kind === "hero");
      const lord = sim.actors.find((a) => a.alive && a.kind === "overlord") ?? null;
      for (const m of sim.actors) {
          if (!m.alive || m.kind !== "monster" || m.form === "egg" || m.form === "pupa")
              continue;
          if (m.swingCd > 0 || m.sleep > 0 || m.windup > 0)
              continue;
          if (m.species === "drake") {
              let breath: Actor | null = null;
              let best = 1e9;
              for (const h of heroes) {
                  if (h.y !== m.y)
                      continue;
                  if (!sim.los(m.x, m.y, h.x, h.y, sim.cols))
                      continue;
                  const d = Math.abs(h.x - m.x);
                  if (d < best) {
                      best = d;
                      breath = h;
                  }
              }
              if (breath) {
                  m.swingCd = 1.2;
                  m.face = breath.x >= m.x ? 1 : -1;
                  m.dir = breath.x >= m.x ? 1 : 3;
                  sim.strike(m, breath);
              }
              continue;
          }
          if (m.species === "bud") {
              let rival: Actor | null = null;
              for (const o of sim.actors) {
                  if (!o.alive || o.id === m.id || o.species !== "bud")
                      continue;
                  if (Math.abs(o.x - m.x) + Math.abs(o.y - m.y) > 1)
                      continue;
                  if (!sim.sameRoom(m.x, m.y, o.x, o.y, 4))
                      continue;
                  rival = o;
                  break;
              }
              if (rival) {
                  m.swingCd = 0.7;
                  sim.strike(m, rival);
                  continue;
              }
              let curse: Actor | null = null;
              let best = 99;
              for (const h of heroes) {
                  if (h.x !== m.x && h.y !== m.y)
                      continue;
                  const d = Math.abs(h.x - m.x) + Math.abs(h.y - m.y);
                  if (d <= 0 || d > 3 || !sim.los(m.x, m.y, h.x, h.y, 3))
                      continue;
                  if (d < best) {
                      best = d;
                      curse = h;
                  }
              }
              if (curse) {
                  m.swingCd = 1.6;
                  m.face = curse.x >= m.x ? 1 : -1;
                  curse.vitality = Math.max(curse.vitality, 2);
                  sim.float(curse.x, curse.y, "SLOW", "#c9a6e8");
                  sim.strike(m, curse);
              }
              continue;
          }
          let target: Actor | null = null;
          if ((m.species === "witch" && m.variant !== "giant") || m.species === "vampire" || m.species === "succubus" || m.species === "nimbus" || (m.species === "skeleton" && m.rattle === 1) || (m.mag > 0 && !(m.species === "witch" && m.variant === "giant"))) {
              let best = 1e9;
              const reach = m.species === "skeleton" ? 3 : 3;
              for (const h of heroes) {
                  if (!sim.los(m.x, m.y, h.x, h.y, reach))
                      continue;
                  const d = Math.abs(h.x - m.x) + Math.abs(h.y - m.y);
                  if (d < best) {
                      best = d;
                      target = h;
                  }
              }
          }
          if (!target && m.species !== "skeleton") {
              for (const h of heroes) {
                  if (Math.abs(h.x - m.x) + Math.abs(h.y - m.y) <= 1) {
                      target = h;
                      break;
                  }
              }
          }
          else if (!target && m.species === "skeleton" && m.rattle !== 1) {
              for (const h of heroes) {
                  if (Math.abs(h.x - m.x) + Math.abs(h.y - m.y) <= 1) {
                      target = h;
                      break;
                  }
              }
          }
          if (target) {
              m.swingCd = m.variant === "giant" ? 0.66 : 0.48;
              sim.strike(m, target);
          }
      }
      for (const h of heroes) {
          if (!h.alive || h.swingCd > 0 || h.sleep > 0 || h.windup > 0 || h.carrying)
              continue;
          const cls = h.heroClass ?? "swordsman";
          let tx = -1;
          let ty = -1;
          if (cls === "priest" && !h.priestUsed) {
              const ally = sim.nearest(h, (o) => o.kind === "hero" && o.id !== h.id && o.hp < o.maxHp && sim.los(h.x, h.y, o.x, o.y, 2));
              if (ally) {
                  tx = ally.x;
                  ty = ally.y;
              }
          }
          const reach = cls === "archer" ? 4 : cls === "swordsman" || cls === "knight" || cls === "thief" ? 1 : HERO_BASE[cls].range;
          const foe = sim.nearest(h, (o) => o.kind === "monster" && o.form !== "egg" && sim.los(h.x, h.y, o.x, o.y, reach));
          if (foe) {
              tx = foe.x;
              ty = foe.y;
          }
          else if (lord && sim.lordState !== "carried" && Math.abs(lord.x - h.x) + Math.abs(lord.y - h.y) <= 1) {
              sim.grab(h, lord);
              continue;
          }
          if (tx < 0)
              continue;
          const heavy = h.atk >= Math.round((HERO_BASE[cls].atk + HERO_BUFF.atk) * 1.45);
          h.windup = heavy ? 0.9 : 0.6;
          h.pathTx = tx;
          h.pathTy = ty;
          if (tx > h.x)
              h.dir = 1;
          else if (tx < h.x)
              h.dir = 3;
          else if (ty < h.y)
              h.dir = 0;
          else if (ty > h.y)
              h.dir = 2;
          sim.float(h.x, h.y, "…", "#f3e6c8");
      }
      if (lord && lord.alive && sim.lordState !== "carried" && lord.swingCd <= 0 && lord.sleep <= 0) {
          const h = heroes.find((o) => o.alive && Math.abs(o.x - lord.x) + Math.abs(o.y - lord.y) <= 1 && !o.carrying);
          if (h) {
              lord.swingCd = 0.44;
              sim.strike(lord, h);
          }
      }
  }
  sim.combat = combat;
  function releaseSkill(a: Actor) {
      if (!a.alive || a.kind !== "hero")
          return;
      const cls = a.heroClass ?? "swordsman";
      const skill = cls === "mage" || cls === "priest" || cls === "archer";
      a.stamina -= skill ? 8 : 2;
      if (a.stamina <= 0) {
          sim.slay(a, "stamina", null);
          return;
      }
      const clsCast = cls === "mage" || cls === "priest";
      sim.paintDiamond(a.x, a.y, clsCast ? 0 : 16, clsCast ? 16 : 0);
      const heavy = a.atk >= Math.round((HERO_BASE[cls].atk + HERO_BUFF.atk) * 1.45);
      const slash = (dir: number, len: number) => {
          const dx = dir === 1 ? 1 : dir === 3 ? -1 : 0;
          const dy = dir === 0 ? -1 : dir === 2 ? 1 : 0;
          if (dx === 0 && dy === 0)
              return;
          for (let i = 1; i <= len; i++) {
              const x = a.x + dx * i;
              const y = a.y + dy * i;
              if (!sim.isOpen(x, y)) {
                  const wall = sim.tileAt(x, y);
                  if (wall && wall.kind === "soil") {
                      sim.bumpN(wall);
                      sim.bumpN(wall);
                  }
                  break;
              }
              const occ = sim.actorAt(x, y);
              if (occ && occ.kind === "monster" && occ.alive)
                  sim.strike(a, occ);
          }
      };
      if (cls === "swordsman") {
          slash(a.dir, 3);
          if (heavy)
              slash((a.dir + 1) % 4, 3);
          return;
      }
      if (cls === "archer") {
          const dx = a.dir === 1 ? 1 : a.dir === 3 ? -1 : 0;
          const dy = a.dir === 0 ? -1 : a.dir === 2 ? 1 : 0;
          for (let i = 1; i <= 4; i++) {
              const x = a.x + dx * i;
              const y = a.y + dy * i;
              const wall = sim.tileAt(x, y);
              if (wall && wall.kind === "soil") {
                  sim.bumpN(wall);
                  sim.bumpN(wall);
                  break;
              }
              if (!sim.isOpen(x, y))
                  break;
              const occ = sim.actorAt(x, y);
              if (occ && occ.alive && occ.kind === "monster") {
                  sim.strike(a, occ);
                  break;
              }
          }
          return;
      }
      if (cls === "mage") {
          sim.boltRewrite(a.x, a.y, a.pathTx, a.pathTy, 2);
          const occ = sim.actorAt(a.pathTx, a.pathTy);
          if (occ && occ.alive && occ.kind === "monster" && sim.los(a.x, a.y, occ.x, occ.y, 3)) {
              sim.strike(a, occ);
              sim.pour(occ.x, occ.y, 0, 2);
          }
          else {
              sim.pour(a.pathTx, a.pathTy, 0, 2);
          }
          return;
      }
      if (cls === "priest") {
          sim.boltRewrite(a.x, a.y, a.pathTx, a.pathTy, 1);
          if (!a.priestUsed) {
              let ally: Actor | null = null;
              let lowest = 2;
              for (const o of sim.actors) {
                  if (!o.alive || o.kind !== "hero" || o.id === a.id)
                      continue;
                  if (!sim.los(a.x, a.y, o.x, o.y, 2))
                      continue;
                  const ratio = o.hp / o.maxHp;
                  if (ratio < lowest) {
                      lowest = ratio;
                      ally = o;
                  }
              }
              if (ally && ally.hp < ally.maxHp) {
                  ally.hp = Math.min(ally.maxHp, ally.hp + 8);
                  a.priestUsed = true;
                  sim.float(ally.x, ally.y, "heal", "#f0d060");
                  sim.pour(a.x, a.y, 0, 3);
              }
          }
          const occ = sim.actorAt(a.pathTx, a.pathTy);
          if (occ && occ.alive && occ.kind === "monster" && sim.los(a.x, a.y, occ.x, occ.y, 2))
              sim.strike(a, occ);
          return;
      }
      const occ = sim.actorAt(a.pathTx, a.pathTy);
      if (occ && occ.alive && occ.kind === "monster" && Math.abs(occ.x - a.x) + Math.abs(occ.y - a.y) <= 1)
          sim.strike(a, occ);
      if (heavy && cls === "knight") {
          slash(a.dir, 2);
          sim.pour(a.x, a.y, 0, 2);
          sim.float(a.x, a.y, "WAR", "#f3e6c8");
          for (let d = 0; d < 4; d++) {
              const wall = sim.tileAt(a.x + DX[d], a.y + DY[d]);
              if (wall && wall.kind === "soil")
                  sim.spellWall(wall, 1);
          }
      }
  }
  sim.releaseSkill = releaseSkill;
}
