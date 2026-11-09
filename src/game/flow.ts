import type { Actor, Sim, StageId, UpgradeOffer, WaveHero } from "./types";
import { SPECIES_NAME, SPECIES_ORDER } from "./units";
import { DX, DY } from "./grid";

export const STAGE_META: { id: StageId; name: string; blurb: string; detail: string }[] = [
  {
    id: "hollow",
    name: "First Hollow",
    blurb: "One swordsman. Soft soil. The throne is claimed even if you never tap it.",
    detail: "Dig Power 140 · 3 waves",
  },
  {
    id: "mossworks",
    name: "Mossworks",
    blurb: "Four raids, then one more. Nutrients live in the walls. Spend the stipend before the hollow has to feed itself.",
    detail: "Dig Power 160 · 5 waves",
  },
  {
    id: "gate",
    name: "Twin Gate",
    blurb: "Five raids. Steel feeds the walls. Spells feed the mana. The Warden moves once between hunts.",
    detail: "Dig Power 180 · 5 waves",
  },
  {
    id: "witchwell",
    name: "Witchwell",
    blurb: "Mana-soaked walls. Six raids, a mage first, and a long breath between them.",
    detail: "Dig Power 180 · 6 waves",
  },
  {
    id: "bone",
    name: "Bone Procession",
    blurb: "Six waves. Remains stay until a Rattle rises once. The pick does not splash.",
    detail: "Dig Power 200 · 6 waves",
  },
  {
    id: "deep",
    name: "Deep Throne",
    blurb: "Seven raids. The sixth is still the trio. The seventh is one legend. Upgrades only bless what is born after you pay.",
    detail: "Dig Power 220 · 7 waves",
  },
  {
    id: "chamber",
    name: "The Chamber",
    blurb: "Huge dig power. Summon a raid only after the Warden is seated. Fifteen seconds of warning.",
    detail: "Dig Power 300 · sandbox",
  },
];


export const STAGE_CLOCK: Record<StageId, number | null> = {
  hollow: 260,
  mossworks: 320,
  gate: 355,
  witchwell: 390,
  bone: 455,
  deep: 520,
  chamber: null,
};


export const HINTS = [
  "Tap soil that touches open ground. Under 10, the number splits into the walls. 10 or more births one creature and keeps the higher number in its belly.",
  "A Loamite still hauls about 5 from a rich wall to a poor one. Hunger starts at 100 and drains. At 0 the health bar flashes and the body thins until a meal or death.",
  "Nutrient: 10 Loamite, 30 Gnawling, 55 Scalekin. Mana: 10 Wisp, 30 Hexwife, 55 Wyrm. One tile never births both.",
  "An isolated 2×2 of mana walls, each 30 or more, is a rune. The pick spends one dig and one Demon steps out. It holds a dug room. Allies there grow a thicker hide.",
  "After a wave, the Warden asks Aye or Nay. Aye blesses only what is born after you pay.",
  "An empty census is not defeat. You lose only if a hero carries the Warden onto the stair.",
  "Heroes are hard to drop. They search unvisited floor and turn out of a dead end. They spend stamina to walk, strike, and cast. The last wave hits harder.",
  "Remains are bones. Five Wisps turn them red. The pick raises one Rattle. When it dies, that pile is gone. Four is the cap.",
];


const UPGRADE_COST: Record<string, number[]> = {
  moss: [40, 40, 40, 40],
  crawler: [40, 40, 40, 40],
  lizard: [40, 40, 40, 40],
  spirit: [40, 40, 40, 40],
  witch: [40, 40, 40, 40],
  drake: [40, 40, 40, 40],
};


const UPGRADE_LABEL: Record<string, string> = {
  moss: "Loamite",
  crawler: "Gnawling",
  lizard: "Scalekin",
  spirit: "Wisp",
  witch: "Hexwife",
  drake: "Wyrm",
};

export function installFlow(sim: Sim) {
  if (!sim.built.endless && sim.built.waves.length > 0 && sim.built.waves.length < 7) {
      const next = sim.built.waves.length + 1;
      if (next === 7) {
          sim.built.waves.push({ heroes: [{ cls: "knight", mul: 3 }] });
      }
      else {
          const prev = sim.built.waves[sim.built.waves.length - 1];
          sim.built.waves.push({
              heroes: prev.heroes.map((h) => ({ cls: h.cls, mul: Math.round((h.mul + 0.06) * 100) / 100 })),
          });
      }
  }
  function familyOmen(name: string) {
      sim.warn(`${name} looks ominous`);
  }
  sim.familyOmen = familyOmen;
  function familySettle(name: string) {
      sim.ominous = "";
      sim.ominousLife = 0;
      sim.shout(`${name} settles`);
  }
  sim.familySettle = familySettle;
  function finish(outcome: "win" | "lose", reason: string) {
      if (sim.phase !== "play")
          return;
      sim.phase = outcome;
      const bits: string[] = [];
      for (const sp of SPECIES_ORDER) {
          const n = sim.countSpecies(sp);
          if (n)
              bits.push(`${SPECIES_NAME[sp]} ${n}`);
      }
      sim.result = {
          outcome,
          reason,
          seconds: Math.floor(sim.time),
          peakHorde: sim.peakHorde,
          heroesSlain: sim.heroesSlain,
          mutations: sim.mutations,
          living: bits.join(" · ") || "Nothing living",
      };
      if (outcome === "win") {
          sim.sfx("win");
          sim.burst(sim.built.entrance.x, sim.built.entrance.y, "#6fbf4a", 18, 3);
          if (!sim.save.cleared.includes(sim.stageId) && !sim.built.endless) {
              sim.save.cleared.push(sim.stageId);
          }
      }
      else {
          sim.sfx("lose");
      }
      sim.persist();
      sim.emit();
  }
  sim.finish = finish;
  function checkEnd() {
      if (sim.phase !== "play")
          return;
      const threat = sim.heroThreat();
      if (sim.built.endless) {
          if (sim.raidWarn !== null)
              return;
          if (sim.raidActive && !threat) {
              sim.raidActive = false;
              sim.raids += 1;
              sim.grantStipend();
              sim.toast("The raid breaks on the soil.");
              sim.emit();
          }
          return;
      }
      const wavesDone = sim.built.waves.length > 0 &&
          sim.launched >= sim.built.waves.length &&
          sim.ecoWait === null &&
          sim.clearNoted >= sim.launched &&
          sim.spawnQueue.length === 0;
      if (sim.invasionStarted && wavesDone && !threat && sim.lordState !== "none") {
          const reason = sim.staminaFalls > 0 && sim.combatFalls === 0
              ? "The heroes spent their stamina. The hollow holds."
              : "The hollow holds. The heroes are mulch.";
          sim.finish("win", reason);
          return;
      }
  }
  sim.checkEnd = checkEnd;
  function grantStipend() {
      const warden = sim.actors.some((a) => a.alive && a.kind === "overlord");
      let grant = 0;
      if (warden) {
          let eco = 0;
          for (const a of sim.actors) {
              if (!a.alive || a.kind !== "monster")
                  continue;
              if (a.species === "skeleton" || a.species === "bud")
                  continue;
              eco += 1;
          }
          if (eco >= 4)
              grant = 90;
          else if (eco >= 2)
              grant = 70;
          else
              grant = 50;
      }
      sim.digPower += grant;
      if (sim.digPower > sim.maxDig)
          sim.maxDig = sim.digPower;
      sim.upgradeOpen = false;
      sim.petitionAsk = false;
      sim.petitionYes = false;
      sim.petitionDelay = 3;
      sim.lordLeft = 1;
      sim.raidTen = false;
      sim.shout("The hollow held.");
  }
  sim.grantStipend = grantStipend;
  function livingLord(): Actor | null {
      return sim.actors.find((a) => a.alive && a.kind === "overlord") ?? null;
  }
  sim.livingLord = livingLord;
  function grab(hero: Actor, lord: Actor) {
      if (sim.phase !== "play" || sim.lordState === "carried" || !hero.alive || hero.sleep > 0)
          return;
      sim.lordState = "carried";
      sim.api.lordState = "carried";
      sim.carrierId = hero.id;
      hero.carrying = true;
      sim.dragStart = Math.max(1, Math.abs(hero.x - sim.built.entrance.x) + Math.abs(hero.y - sim.built.entrance.y));
      lord.x = hero.x;
      lord.y = hero.y;
      lord.fx = hero.fx;
      lord.fy = hero.fy;
      if (hero.heroClass === "thief")
          hero.boost = 2;
      sim.api.focus = { x: hero.x, y: hero.y, until: sim.time + 1.2 };
      if (hero.x === sim.built.entrance.x && hero.y === sim.built.entrance.y) {
          sim.finish("lose", "The Warden was carried up the stair.");
      }
      sim.shout("WARDEN SEIZED");
  }
  sim.grab = grab;
  function dropLord(x: number, y: number) {
      const lord = sim.livingLord();
      for (const a of sim.actors)
          a.carrying = false;
      sim.carrierId = null;
      if (!lord) {
          sim.lordState = "none";
          sim.api.lordState = "none";
          return;
      }
      lord.x = x;
      lord.y = y;
      lord.fx = x;
      lord.fy = y;
      lord.hp = Math.max(1, lord.hp);
      sim.lordState = "dropped";
      sim.api.lordState = "dropped";
      sim.shout("Warden dropped.");
  }
  sim.dropLord = dropLord;
  function syncCarry() {
      if (sim.lordState !== "carried")
          return;
      const hero = sim.actors.find((a) => a.alive && a.id === sim.carrierId);
      const lord = sim.livingLord();
      if (!hero || !lord) {
          if (lord)
              sim.dropLord(lord.x, lord.y);
          return;
      }
      lord.x = hero.x;
      lord.y = hero.y;
      if (hero.x === sim.built.entrance.x && hero.y === sim.built.entrance.y) {
          sim.finish("lose", "The Warden was carried up the stair.");
      }
  }
  sim.syncCarry = syncCarry;
  function bestThrone(): {
      x: number;
      y: number;
  } | null {
      const dist = new Int32Array(sim.cols * sim.rows);
      dist.fill(-1);
      const qx = [sim.built.entrance.x];
      const qy = [sim.built.entrance.y];
      dist[sim.built.entrance.y * sim.cols + sim.built.entrance.x] = 0;
      let head = 0;
      while (head < qx.length) {
          const x = qx[head];
          const y = qy[head];
          head++;
          const base = dist[y * sim.cols + x];
          for (let d = 0; d < 4; d++) {
              const nx = x + DX[d];
              const ny = y + DY[d];
              if (!sim.isOpen(nx, ny))
                  continue;
              const ni = ny * sim.cols + nx;
              if (dist[ni] >= 0)
                  continue;
              dist[ni] = base + 1;
              qx.push(nx);
              qy.push(ny);
          }
      }
      let best: {
          x: number;
          y: number;
      } | null = null;
      let bestScore = -1e9;
      for (let y = 1; y < sim.rows - 1; y++) {
          for (let x = 1; x < sim.cols - 1; x++) {
              if (!sim.isOpen(x, y))
                  continue;
              if (x === sim.built.entrance.x && y === sim.built.entrance.y)
                  continue;
              const d = dist[y * sim.cols + x];
              if (d < 0)
                  continue;
              const n = sim.openNeighbors(x, y);
              const occ = sim.actorAt(x, y);
              let score = d * 10;
              if (n === 1 && d >= 3)
                  score += 120;
              else if (n === 1)
                  score -= 25;
              else if (n >= 3)
                  score -= 18;
              if (occ && occ.kind !== "overlord")
                  score -= 40;
              if (score > bestScore) {
                  bestScore = score;
                  best = { x, y };
              }
          }
      }
      return best;
  }
  sim.bestThrone = bestThrone;
  function seatNew(x: number, y: number) {
      const a: Actor = {
          id: sim.nextId++,
          kind: "overlord",
          species: null,
          variant: "normal",
          form: "adult",
          heroClass: null,
          name: "Warden",
          x,
          y,
          fx: x,
          fy: y,
          dir: 2,
          face: 1,
          hp: 34,
          maxHp: 34,
          atk: 5,
          def: 1,
          mag: 0,
          combat: 0,
          speed: 0,
          satiety: 9,
          vitality: 0,
          carryN: 0,
          carryM: 0,
          moveCd: 0,
          swingCd: 0,
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
      sim.actors.push(a);
      sim.lordState = "seated";
      sim.api.lordState = "seated";
      sim.carrierId = null;
      sim.sfx("place");
      sim.burst(x, y, "#e6d3a3", 8, 1.6);
      sim.advanceHint();
  }
  sim.seatNew = seatNew;
  function autoPlace() {
      const spot = sim.bestThrone();
      if (!spot)
          return;
      const occ = sim.actorAt(spot.x, spot.y);
      if (occ && occ.kind === "monster") {
          const nb = sim.freeNeighbor(spot.x, spot.y);
          if (nb) {
              occ.x = nb.x;
              occ.y = nb.y;
              occ.fx = nb.x;
              occ.fy = nb.y;
          }
      }
      sim.seatNew(spot.x, spot.y);
      sim.shout("The Warden takes the far hall.");
  }
  sim.autoPlace = autoPlace;
  function huntLocked() {
      if (sim.lordState === "carried")
          return true;
      if (sim.built.endless)
          return sim.raidActive || sim.spawnQueue.length > 0 || sim.invasionActive();
      if (sim.prepLeft !== null || sim.ecoWait !== null)
          return false;
      return sim.launched > 0 && (sim.invasionActive() || sim.spawnQueue.length > 0);
  }
  sim.huntLocked = huntLocked;
  function placeLord(x: number, y: number) {
      const t = sim.tileAt(x, y);
      if (!t || !sim.isOpen(x, y)) {
          sim.toast("The Warden needs open ground.");
          return;
      }
      if (t.kind === "entrance") {
          sim.toast("Not on the stair.");
          return;
      }
      if (sim.lordState === "carried") {
          sim.toast("The Warden is being dragged. Kill the carrier.");
          return;
      }
      const occ = sim.actorAt(x, y);
      if (occ && occ.kind !== "overlord") {
          sim.toast("That tile is occupied.");
          return;
      }
      const existing = sim.livingLord();
      if (existing) {
          if (existing.x === x && existing.y === y) {
              if (sim.lordState === "dropped") {
                  sim.lordState = "seated";
                  sim.api.lordState = "seated";
                  sim.toast("The Warden is seated again.");
                  sim.emit();
              }
              return;
          }
          if (sim.huntLocked()) {
              sim.toast("The Warden is locked while humans hunt.");
              return;
          }
          if (sim.lordLeft <= 0) {
              sim.toast("The Warden moves once between raids.");
              return;
          }
          sim.lordLeft -= 1;
          existing.x = x;
          existing.y = y;
          existing.fx = x;
          existing.fy = y;
          existing.path = null;
          sim.lordState = "seated";
          sim.api.lordState = "seated";
          sim.carrierId = null;
          for (const a of sim.actors)
              a.carrying = false;
          sim.sfx("place");
          sim.toast("The Warden is seated.");
          for (const a of sim.actors)
              if (a.kind === "hero")
                  a.path = null;
          sim.emit();
          return;
      }
      sim.seatNew(x, y);
      sim.toast("The Warden takes the throne.");
      sim.emit();
  }
  sim.placeLord = placeLord;
  function petitionWindow() {
      if (sim.phase !== "play")
          return false;
      if (sim.lordState === "none" || sim.lordState === "carried")
          return false;
      if (sim.huntLocked())
          return false;
      if (sim.ecoWait !== null)
          return true;
      if (sim.built.endless && sim.raids > 0 && !sim.raidActive && sim.raidWarn === null && sim.spawnQueue.length === 0)
          return true;
      return false;
  }
  sim.petitionWindow = petitionWindow;
  function summon() {
      if (!sim.built.endless || sim.phase !== "play" || sim.raidActive || sim.raidWarn !== null || sim.spawnQueue.length)
          return;
      if (sim.lordState === "none" || sim.lordState === "carried") {
          sim.toast("Seat the Warden before you summon a raid.");
          sim.emit();
          return;
      }
      const table: WaveHero[][] = [
          [{ cls: "swordsman", mul: 1 }],
          [
              { cls: "swordsman", mul: 1 },
              { cls: "archer", mul: 1 },
          ],
          [
              { cls: "knight", mul: 1.1 },
              { cls: "mage", mul: 1.1 },
          ],
          [
              { cls: "priest", mul: 1.2 },
              { cls: "thief", mul: 1.2 },
              { cls: "mage", mul: 1.15 },
          ],
          [
              { cls: "knight", mul: 1.35 },
              { cls: "archer", mul: 1.3 },
              { cls: "priest", mul: 1.3 },
              { cls: "swordsman", mul: 1.25 },
          ],
      ];
      const pack = table[Math.min(table.length - 1, sim.raids)].map((h) => ({
          ...h,
          mul: h.mul + Math.max(0, sim.raids - table.length + 1) * 0.08,
      }));
      if (!sim.chainAlive()) {
          sim.toast("Nothing is alive to meet a raid.");
          sim.emit();
          return;
      }
      sim.pendingRaid = pack;
      sim.raidWarn = 15;
      sim.shout("Raid in fifteen.");
      sim.emit();
  }
  sim.summon = summon;
  function buyUpgrade(id: string) {
      if (!sim.upgradeOpen || sim.phase !== "play") {
          sim.toast("Servant upgrades wait for the stipend.");
          return;
      }
      const costs = UPGRADE_COST[id];
      if (!costs)
          return;
      const tier = sim.upgrades[id] ?? 0;
      if (tier >= costs.length) {
          sim.toast("That line is as strong as the soil allows.");
          return;
      }
      const cost = costs[tier];
      if (sim.digPower < cost) {
          sim.toast("Not enough Dig Power.");
          return;
      }
      sim.digPower -= cost;
      sim.upgrades[id] = tier + 1;
      sim.sfx("ui");
      sim.toast(`${UPGRADE_LABEL[id]} tier ${tier + 1}. New births only.`);
      sim.emit();
  }
  sim.buyUpgrade = buyUpgrade;
  function answerPetition(yes: boolean) {
      sim.petitionAsk = false;
      if (yes && sim.petitionWindow()) {
          sim.petitionYes = true;
          sim.upgradeOpen = true;
          if (sim.firstAye) {
              sim.firstAye = false;
              sim.toast("Only what is born after you pay is blessed.");
          }
          else
              sim.toast("Servant Upgrade. New births only.");
      }
      else {
          sim.upgradeOpen = false;
      }
      sim.emit();
  }
  sim.answerPetition = answerPetition;
  function closeUpgrades() {
      sim.upgradeOpen = false;
      sim.petitionAsk = false;
      sim.emit();
  }
  sim.closeUpgrades = closeUpgrades;
  function upgradeOffers(): UpgradeOffer[] {
      return Object.keys(UPGRADE_COST).map((id) => {
          const costs = UPGRADE_COST[id];
          const tier = sim.upgrades[id] ?? 0;
          return {
              id,
              name: UPGRADE_LABEL[id] ?? id,
              tier,
              max: costs.length,
              cost: tier < costs.length ? costs[tier] : null,
          };
      });
  }
  sim.upgradeOffers = upgradeOffers;
}
