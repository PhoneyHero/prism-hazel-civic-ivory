import type { Actor, Sim, Tile } from "./types";
import { DX, DY } from "./grid";
import { syncFluid } from "./soil";
import { CAP } from "./units";

export function installGoals(sim: Sim) {
  function inNest(x: number, y: number) {
      return sim.boxesAt(x, y).length > 0;
  }
  sim.inNest = inNest;
  function axisGap(a0: number, a1: number, b0: number, b1: number) {
      if (a1 < b0)
          return b0 - a1;
      if (b1 < a0)
          return a0 - b1;
      return 0;
  }
  sim.axisGap = axisGap;
  function boxGap(a: {
      x: number;
      y: number;
      w: number;
      h: number;
  }, b: {
      x: number;
      y: number;
      w: number;
      h: number;
  }) {
      const dx = sim.axisGap(a.x, a.x + a.w - 1, b.x, b.x + b.w - 1);
      const dy = sim.axisGap(a.y, a.y + a.h - 1, b.y, b.y + b.h - 1);
      return Math.max(dx, dy);
  }
  sim.boxGap = boxGap;
  function boxesAt(x: number, y: number) {
      const out: {
          x: number;
          y: number;
          w: number;
          h: number;
      }[] = [];
      const sizes: [
          number,
          number
      ][] = [
          [2, 3],
          [3, 2],
      ];
      for (const [w, h] of sizes) {
          for (let y0 = y - (h - 1); y0 <= y; y0++) {
              for (let x0 = x - (w - 1); x0 <= x; x0++) {
                  let ok = true;
                  for (let yy = 0; yy < h && ok; yy++) {
                      for (let xx = 0; xx < w; xx++)
                          if (!sim.isOpen(x0 + xx, y0 + yy))
                              ok = false;
                  }
                  if (ok)
                      out.push({ x: x0, y: y0, w, h });
              }
          }
      }
      return out;
  }
  sim.boxesAt = boxesAt;
  function legalClaimBox(x: number, y: number) {
      for (const box of sim.boxesAt(x, y)) {
          if (sim.nestBoxes.every((n) => sim.boxGap(n, box) >= 2))
              return box;
      }
      return null;
  }
  sim.legalClaimBox = legalClaimBox;
  function refreshNests() {
      sim.nestTiles = [];
      for (let y = 1; y < sim.rows - 1; y++) {
          for (let x = 1; x < sim.cols - 1; x++) {
              if (sim.isOpen(x, y) && sim.inNest(x, y))
                  sim.nestTiles.push({ x, y });
          }
      }
  }
  sim.refreshNests = refreshNests;
  function huntsMoss(a: Actor) {
      if (a.hp < a.maxHp)
          return true;
      if (a.satiety <= 3)
          return true;
      return sim.countSpecies("moss") >= 4;
  }
  sim.huntsMoss = huntsMoss;
  function isPrey(pred: Actor, prey: Actor) {
      if (prey.kind !== "monster" || !prey.species || !pred.species)
          return false;
      const sp = prey.species;
      const form = prey.form;
      if (pred.species === "crawler" && (pred.form === "adult" || pred.form === "fly") && sp === "moss" && form === "adult")
          return true;
      if (pred.species === "lizard" && sp === "moss" && form !== "egg" && sim.huntsMoss(pred))
          return true;
      if (pred.species === "lizard" && sp === "crawler" && form !== "egg")
          return true;
      if (pred.species === "lizard" && sp === "lizard" && pred.satiety <= 1 && form === "adult" && prey.id !== pred.id)
          return true;
      if (pred.species === "drake" &&
          prey.species !== "skeleton" &&
          prey.species !== "drake" &&
          prey.species !== "bud" &&
          prey.form !== "egg" &&
          prey.id !== pred.id)
          return true;
      if (pred.species === "witch" && form === "adult" && (sp === "spirit" || sp === "crawler"))
          return true;
      if (pred.species === "vampire" && form !== "egg" && (sp === "spirit" || sp === "crawler" || sp === "witch"))
          return true;
      if (pred.species === "succubus" && sp === "spirit" && form === "adult")
          return true;
      return false;
  }
  sim.isPrey = isPrey;
  function nearest(pred: Actor, test: (a: Actor) => boolean): Actor | null {
      let best: Actor | null = null;
      let bestD = 1e9;
      for (const a of sim.actors) {
          if (!a.alive || a.id === pred.id || !test(a))
              continue;
          const d = Math.abs(a.x - pred.x) + Math.abs(a.y - pred.y);
          if (d < bestD) {
              bestD = d;
              best = a;
          }
      }
      return best;
  }
  sim.nearest = nearest;
  function tickAura() {
      for (const a of sim.actors) {
          if (!a.alive || a.kind !== "monster" || a.shield <= 0)
              continue;
          a.def = Math.max(0, a.def - a.shield);
          a.shield = 0;
      }
      for (const b of sim.actors) {
          if (!b.alive || b.species !== "bud" || b.form !== "adult")
              continue;
          for (const a of sim.actors) {
              if (!a.alive || a.kind !== "monster" || a.species === "bud" || a.species === "skeleton")
                  continue;
              if (a.shield > 0)
                  continue;
              if (!sim.sameRoom(b.x, b.y, a.x, a.y, 4))
                  continue;
              const bonus = Math.max(1, Math.round(a.def * 0.4));
              a.shield = bonus;
              a.def += bonus;
          }
      }
  }
  sim.tickAura = tickAura;
  function route(fromX: number, fromY: number, toX: number, toY: number): {
      x: number;
      y: number;
  }[] {
      if (!sim.isOpen(toX, toY))
          return [];
      if (fromX === toX && fromY === toY)
          return [];
      const nCells = sim.cols * sim.rows;
      const prev = new Int32Array(nCells);
      prev.fill(-1);
      const start = fromY * sim.cols + fromX;
      const goal = toY * sim.cols + toX;
      const q: number[] = [start];
      const seen = new Uint8Array(nCells);
      seen[start] = 1;
      let qi = 0;
      let found = false;
      while (qi < q.length) {
          const cur = q[qi++];
          if (cur === goal) {
              found = true;
              break;
          }
          const cx = cur % sim.cols;
          const cy = (cur / sim.cols) | 0;
          for (let d = 0; d < 4; d++) {
              const nx = cx + DX[d];
              const ny = cy + DY[d];
              if (!sim.isOpen(nx, ny))
                  continue;
              const nid = ny * sim.cols + nx;
              if (seen[nid])
                  continue;
              seen[nid] = 1;
              prev[nid] = cur;
              q.push(nid);
          }
      }
      if (!found)
          return [];
      const rev: {
          x: number;
          y: number;
      }[] = [];
      let cursor = goal;
      let guard = 0;
      while (cursor !== start && guard++ < nCells) {
          rev.push({ x: cursor % sim.cols, y: (cursor / sim.cols) | 0 });
          const back = prev[cursor];
          if (back < 0)
              return [];
          cursor = back;
      }
      rev.reverse();
      return rev;
  }
  sim.route = route;
  const stall = new Map<number, { cell: number; since: number; salt: number }>();
  function resting(a: Actor) {
      if (a.sleep > 0)
          return true;
      if (a.form === "pupa" || a.form === "egg")
          return true;
      if (a.species === "moss" && a.brood && a.brood !== "walk")
          return true;
      if (a.job === "hold")
          return true;
      return false;
  }
  function nextBestDug(ax: number, ay: number, tx: number, ty: number, salt: number) {
      const nCells = sim.cols * sim.rows;
      const seen = new Uint8Array(nCells);
      const q: number[] = [ay * sim.cols + ax];
      seen[q[0]] = 1;
      const opts: { x: number; y: number; d: number }[] = [];
      let qi = 0;
      while (qi < q.length) {
          const cur = q[qi++];
          const x = cur % sim.cols;
          const y = (cur / sim.cols) | 0;
          if (x !== ax || y !== ay)
              opts.push({ x, y, d: Math.abs(x - tx) + Math.abs(y - ty) });
          for (let d = 0; d < 4; d++) {
              const nx = x + DX[d];
              const ny = y + DY[d];
              if (!sim.isOpen(nx, ny))
                  continue;
              const ni = ny * sim.cols + nx;
              if (seen[ni])
                  continue;
              seen[ni] = 1;
              q.push(ni);
          }
      }
      if (!opts.length)
          return null;
      let bestD = 1e9;
      for (const o of opts)
          if (o.d < bestD)
              bestD = o.d;
      const near = opts.filter((o) => o.d === bestD);
      return near[Math.abs(salt) % near.length];
  }
  function considerStall(a: Actor, tx: number, ty: number) {
      if (resting(a)) {
          stall.delete(a.id);
          return;
      }
      const cell = a.y * sim.cols + a.x;
      let row = stall.get(a.id);
      if (!row || row.cell !== cell) {
          stall.set(a.id, { cell, since: sim.time, salt: 0 });
          return;
      }
      if (sim.time - row.since < 1.2)
          return;
      row.since = sim.time;
      row.salt += 1;
      a.path = null;
      const again = sim.route(a.x, a.y, tx, ty);
      if (again.length) {
          a.path = again;
          a.pathTx = tx;
          a.pathTy = ty;
          a.stamp = sim.gridStamp;
          a.pace = 0;
          return;
      }
      const alt = nextBestDug(a.x, a.y, tx, ty, row.salt);
      if (!alt)
          return;
      const via = sim.route(a.x, a.y, alt.x, alt.y);
      if (!via.length)
          return;
      a.path = via;
      a.pathTx = alt.x;
      a.pathTy = alt.y;
      a.stamp = sim.gridStamp;
      a.pace = 0;
  }
  function pursue(a: Actor, tx: number, ty: number): "there" | "step" | "wait" | "none" {
      if (a.x === tx && a.y === ty) {
          a.path = [];
          a.pathTx = tx;
          a.pathTy = ty;
          stall.delete(a.id);
          return "there";
      }
      const stale = !a.path ||
          a.pathTx !== tx ||
          a.pathTy !== ty ||
          a.stamp !== sim.gridStamp ||
          a.pace >= 1.5 ||
          (a.path.length > 0 && !sim.isOpen(a.path[0].x, a.path[0].y));
      if (stale) {
          a.path = sim.route(a.x, a.y, tx, ty);
          a.pathTx = tx;
          a.pathTy = ty;
          a.stamp = sim.gridStamp;
          a.pace = 0;
      }
      if (!a.path || a.path.length === 0) {
          considerStall(a, tx, ty);
          return "none";
      }
      if (a.path[0].x === a.x && a.path[0].y === a.y)
          a.path.shift();
      if (!a.path.length) {
          stall.delete(a.id);
          return "there";
      }
      const step = a.path[0];
      if (!sim.isOpen(step.x, step.y)) {
          considerStall(a, tx, ty);
          return "wait";
      }
      stall.delete(a.id);
      sim.moveTo(a, step.x, step.y);
      a.path.shift();
      return "step";
  }
  sim.pursue = pursue;
  function nearestOpen(ax: number, ay: number, ok: (x: number, y: number) => boolean): {
      x: number;
      y: number;
  } | null {
      const nCells = sim.cols * sim.rows;
      const seen = new Uint8Array(nCells);
      const q: number[] = [ay * sim.cols + ax];
      seen[ay * sim.cols + ax] = 1;
      let qi = 0;
      while (qi < q.length) {
          const cur = q[qi++];
          const x = cur % sim.cols;
          const y = (cur / sim.cols) | 0;
          if ((x !== ax || y !== ay) && ok(x, y))
              return { x, y };
          for (let d = 0; d < 4; d++) {
              const nx = x + DX[d];
              const ny = y + DY[d];
              if (!sim.isOpen(nx, ny))
                  continue;
              const ni = ny * sim.cols + nx;
              if (seen[ni])
                  continue;
              seen[ni] = 1;
              q.push(ni);
          }
      }
      return null;
  }
  sim.nearestOpen = nearestOpen;
  function farthestFromStair(): {
      x: number;
      y: number;
  } | null {
      const nCells = sim.cols * sim.rows;
      const dist = new Int32Array(nCells);
      dist.fill(-1);
      const q: number[] = [sim.built.entrance.y * sim.cols + sim.built.entrance.x];
      dist[q[0]] = 0;
      let qi = 0;
      let best = -1;
      let bestD = -1;
      while (qi < q.length) {
          const cur = q[qi++];
          const d0 = dist[cur];
          if (d0 > bestD) {
              bestD = d0;
              best = cur;
          }
          const x = cur % sim.cols;
          const y = (cur / sim.cols) | 0;
          for (let d = 0; d < 4; d++) {
              const nx = x + DX[d];
              const ny = y + DY[d];
              if (!sim.isOpen(nx, ny))
                  continue;
              const ni = ny * sim.cols + nx;
              if (dist[ni] >= 0)
                  continue;
              dist[ni] = d0 + 1;
              q.push(ni);
          }
      }
      if (best < 0)
          return null;
      return { x: best % sim.cols, y: (best / sim.cols) | 0 };
  }
  sim.farthestFromStair = farthestFromStair;
  function soilNear(ax: number, ay: number, radius: number, fluid: "n" | "m", want: "rich" | "poor"): {
      x: number;
      y: number;
      t: Tile;
  } | null {
      let best: {
          x: number;
          y: number;
          t: Tile;
      } | null = null;
      let bestV = want === "rich" ? -1 : 1e9;
      for (let y = 1; y < sim.rows - 1; y++) {
          for (let x = 1; x < sim.cols - 1; x++) {
              if (Math.abs(x - ax) + Math.abs(y - ay) > radius)
                  continue;
              const t = sim.tileAt(x, y);
              if (!t || t.kind !== "soil")
                  continue;
              const v = fluid === "n" ? t.nutrient : t.mana;
              if (want === "rich" && v <= 0)
                  continue;
              if (!sim.standBeside(x, y, ax, ay))
                  continue;
              if (want === "rich" ? v > bestV : v < bestV) {
                  bestV = v;
                  best = { x, y, t };
              }
          }
      }
      return best;
  }
  sim.soilNear = soilNear;
  function takeFluid(t: Tile, fluid: "n" | "m", amt: number) {
      if (fluid === "n") {
          const take = Math.min(amt, t.nutrient);
          t.nutrient -= take;
          syncFluid(t);
          return take;
      }
      const take = Math.min(amt, t.mana);
      t.mana -= take;
      syncFluid(t);
      return take;
  }
  sim.takeFluid = takeFluid;
  function giveFluid(t: Tile, fluid: "n" | "m", amt: number) {
      if (amt <= 0)
          return;
      if (fluid === "n")
          t.nutrient += amt;
      else
          t.mana += amt;
      syncFluid(t);
  }
  sim.giveFluid = giveFluid;
  function truck(a: Actor, fluid: "n" | "m") {
      const carry = fluid === "n" ? a.carryN : a.carryM;
      if (carry >= 5) {
          const poor = sim.soilNear(a.x, a.y, 8, fluid, "poor");
          if (!poor) {
              if (fluid === "n")
                  sim.rootBud(a);
              else
                  a.job = "idle";
              return;
          }
          const stand = sim.standBeside(poor.x, poor.y, a.x, a.y);
          if (!stand) {
              a.job = "idle";
              return;
          }
          if (a.x === stand.x && a.y === stand.y) {
              const dump = Math.min(5, fluid === "n" ? a.carryN : a.carryM);
              if (fluid === "n")
                  a.carryN -= dump;
              else
                  a.carryM -= dump;
              sim.giveFluid(poor.t, fluid, dump);
              a.job = "spit";
              a.path = null;
              return;
          }
          a.job = "spit";
          const step = sim.pursue(a, stand.x, stand.y);
          if (step === "none")
              a.job = "idle";
          return;
      }
      const rich = sim.soilNear(a.x, a.y, 4, fluid, "rich");
      if (!rich) {
          const far = sim.farTile(a, 4, 8);
          if (!far) {
              a.job = "idle";
              return;
          }
          a.job = "far";
          sim.pursue(a, far.x, far.y);
          return;
      }
      const stand = sim.standBeside(rich.x, rich.y, a.x, a.y);
      if (!stand) {
          a.job = "idle";
          return;
      }
      if (Math.abs(a.x - rich.x) + Math.abs(a.y - rich.y) === 1) {
          const take = sim.takeFluid(rich.t, fluid, 5);
          if (fluid === "n")
              a.carryN += take;
          else
              a.carryM += take;
          a.job = "suck";
          a.path = null;
          return;
      }
      a.job = "suck";
      const step = sim.pursue(a, stand.x, stand.y);
      if (step === "none")
          a.job = "idle";
  }
  sim.truck = truck;
  function farTile(a: Actor, minD: number, maxD: number): {
      x: number;
      y: number;
  } | null {
      if (a.job === "far" && a.pathTx >= 0 && sim.isOpen(a.pathTx, a.pathTy) && (a.x !== a.pathTx || a.y !== a.pathTy)) {
          return { x: a.pathTx, y: a.pathTy };
      }
      const opts: {
          x: number;
          y: number;
          d: number;
          edge: number;
      }[] = [];
      for (let y = 1; y < sim.rows - 1; y++) {
          for (let x = 1; x < sim.cols - 1; x++) {
              if (!sim.isOpen(x, y))
                  continue;
              const d = Math.abs(x - a.x) + Math.abs(y - a.y);
              if (d < 1 || d > maxD)
                  continue;
              opts.push({ x, y, d, edge: sim.openNeighbors(x, y) });
          }
      }
      const band = opts.filter((o) => o.d >= minD);
      const bag = band.length ? band : opts;
      if (!bag.length)
          return null;
      bag.sort((p, q) => p.edge - q.edge || q.d - p.d);
      const pick = bag[(a.id + sim.gridStamp) % bag.length];
      return { x: pick.x, y: pick.y };
  }
  sim.farTile = farTile;
  function horizontalHalls(minLen: number): {
      y: number;
      x0: number;
      x1: number;
  }[] {
      const out: {
          y: number;
          x0: number;
          x1: number;
      }[] = [];
      for (let y = 1; y < sim.rows - 1; y++) {
          let run = 0;
          let start = 1;
          for (let x = 1; x <= sim.cols; x++) {
              if (x < sim.cols && sim.isOpen(x, y)) {
                  if (run === 0)
                      start = x;
                  run++;
              }
              else {
                  if (run >= minLen)
                      out.push({ y, x0: start, x1: start + run - 1 });
                  run = 0;
              }
          }
      }
      return out;
  }
  sim.horizontalHalls = horizontalHalls;
  function straightHall(minLen: number): {
      x: number;
      y: number;
      x2: number;
      y2: number;
  } | null {
      let best: {
          x: number;
          y: number;
          x2: number;
          y2: number;
      } | null = null;
      let bestLen = minLen - 1;
      for (const h of sim.horizontalHalls(minLen)) {
          const len = h.x1 - h.x0 + 1;
          if (len > bestLen) {
              bestLen = len;
              best = { x: h.x0, y: h.y, x2: h.x1, y2: h.y };
          }
      }
      for (let x = 1; x < sim.cols - 1; x++) {
          let run = 0;
          let start = 1;
          for (let y = 1; y <= sim.rows; y++) {
              if (y < sim.rows && sim.isOpen(x, y)) {
                  if (run === 0)
                      start = y;
                  run++;
              }
              else {
                  if (run > bestLen) {
                      bestLen = run;
                      best = { x, y: start, x2: x, y2: start + run - 1 };
                  }
                  run = 0;
              }
          }
      }
      return best;
  }
  sim.straightHall = straightHall;
  function pingPong(a: Actor, x0: number, y0: number, x1: number, y1: number) {
      const at0 = a.x === x0 && a.y === y0;
      const at1 = a.x === x1 && a.y === y1;
      if (a.job !== "east" && a.job !== "west")
          a.job = "east";
      if (a.job === "east" && at1)
          a.job = "west";
      else if (a.job === "west" && at0)
          a.job = "east";
      const tx = a.job === "east" ? x1 : x0;
      const ty = a.job === "east" ? y1 : y0;
      if (a.x === tx && a.y === ty) {
          a.job = "hold";
          return;
      }
      const step = sim.pursue(a, tx, ty);
      if (step === "none")
          a.job = "idle";
  }
  sim.pingPong = pingPong;
  function rattleBag(a: Actor) {
      let bag = sim.rattleMem.get(a.id);
      if (!bag) {
          bag = new Uint8Array(sim.cols * sim.rows);
          sim.rattleMem.set(a.id, bag);
      }
      return bag;
  }
  sim.rattleBag = rattleBag;
  function rattleGoal(a: Actor): {
      x: number;
      y: number;
  } | null {
      const bag = sim.rattleBag(a);
      const here = a.y * sim.cols + a.x;
      if (here >= 0 && here < bag.length)
          bag[here] = 1;
      const near = sim.nearestOpen(a.x, a.y, (x, y) => {
          const d = Math.abs(x - a.x) + Math.abs(y - a.y);
          return d <= 8 && bag[y * sim.cols + x] === 0;
      });
      if (near)
          return near;
      bag.fill(0);
      if (here >= 0 && here < bag.length)
          bag[here] = 1;
      let best: {
          x: number;
          y: number;
      } | null = null;
      let bestD = -1;
      for (let y = 1; y < sim.rows - 1; y++) {
          for (let x = 1; x < sim.cols - 1; x++) {
              if (!sim.isOpen(x, y))
                  continue;
              const d = Math.abs(x - a.x) + Math.abs(y - a.y);
              if (d < 1 || d > 8 || d <= bestD)
                  continue;
              bestD = d;
              best = { x, y };
          }
      }
      return best;
  }
  sim.rattleGoal = rattleGoal;
  function localAllyCount(x: number, y: number, selfId: number) {
      let n = 0;
      for (const o of sim.actors) {
          if (!o.alive || o.id === selfId || o.kind !== "monster" || !o.species)
              continue;
          if (o.species === "bud" || o.species === "skeleton")
              continue;
          if (sim.sameRoom(x, y, o.x, o.y, 4))
              n += 1;
      }
      return n;
  }
  sim.localAllyCount = localAllyCount;
  function demonPost(a: Actor): {
      x: number;
      y: number;
  } | null {
      if (a.anchor >= 0) {
          const x = a.anchor % sim.cols;
          const y = (a.anchor / sim.cols) | 0;
          if (sim.isOpen(x, y)) {
              const near = sim.localAllyCount(x, y, a.id);
              let any = false;
              for (const o of sim.actors) {
                  if (!o.alive || o.id === a.id || o.kind !== "monster" || !o.species)
                      continue;
                  if (o.species === "bud" || o.species === "skeleton")
                      continue;
                  any = true;
                  break;
              }
              if (a.wob === 1 && near > 0)
                  return { x, y };
              if (a.wob === 0 && !any)
                  return { x, y };
          }
      }
      const nCells = sim.cols * sim.rows;
      const seen = new Uint8Array(nCells);
      const compId = new Int32Array(nCells);
      compId.fill(-1);
      const comps: number[][] = [];
      for (let i = 0; i < nCells; i++) {
          const x = i % sim.cols;
          const y = (i / sim.cols) | 0;
          if (seen[i] || !sim.isOpen(x, y))
              continue;
          const id = comps.length;
          const cells: number[] = [];
          const q = [i];
          seen[i] = 1;
          let qi = 0;
          while (qi < q.length) {
              const cur = q[qi++];
              compId[cur] = id;
              cells.push(cur);
              const cx = cur % sim.cols;
              const cy = (cur / sim.cols) | 0;
              for (let d = 0; d < 4; d++) {
                  const nx = cx + DX[d];
                  const ny = cy + DY[d];
                  if (!sim.isOpen(nx, ny))
                      continue;
                  const ni = ny * sim.cols + nx;
                  if (seen[ni])
                      continue;
                  seen[ni] = 1;
                  q.push(ni);
              }
          }
          comps.push(cells);
      }
      if (!comps.length) {
          a.anchor = -1;
          return null;
      }
      const allyOf: Actor[][] = comps.map(() => []);
      for (const o of sim.actors) {
          if (!o.alive || o.id === a.id || o.kind !== "monster" || !o.species)
              continue;
          if (o.species === "bud" || o.species === "skeleton")
              continue;
          const id = compId[o.y * sim.cols + o.x];
          if (id >= 0)
              allyOf[id].push(o);
      }
      let bestId = 0;
      let bestAllies = -1;
      let bestSize = -1;
      for (let i = 0; i < comps.length; i++) {
          const n = allyOf[i].length;
          if (n > bestAllies || (n === bestAllies && comps[i].length > bestSize)) {
              bestAllies = n;
              bestSize = comps[i].length;
              bestId = i;
          }
      }
      const cells = comps[bestId];
      const allies = allyOf[bestId];
      let sx = cells[0] % sim.cols;
      let sy = (cells[0] / sim.cols) | 0;
      if (allies.length) {
          let bestScore = -1;
          const cand = new Set<number>();
          for (const o of allies) {
              cand.add(o.y * sim.cols + o.x);
              for (let d = 0; d < 4; d++) {
                  const nx = o.x + DX[d];
                  const ny = o.y + DY[d];
                  if (sim.isOpen(nx, ny))
                      cand.add(ny * sim.cols + nx);
              }
          }
          for (const idx of cand) {
              if (compId[idx] !== bestId)
                  continue;
              const cx = idx % sim.cols;
              const cy = (idx / sim.cols) | 0;
              let score = 0;
              for (const o of allies)
                  if (sim.sameRoom(cx, cy, o.x, o.y, 4))
                      score += 1;
              const blocked = sim.actorAt(cx, cy, a.id) ? 1 : 0;
              if (score > bestScore || (score === bestScore && blocked === 0)) {
                  bestScore = score;
                  sx = cx;
                  sy = cy;
              }
          }
      }
      else {
          let ax = 0;
          let ay = 0;
          for (const idx of cells) {
              ax += idx % sim.cols;
              ay += (idx / sim.cols) | 0;
          }
          const cx = ax / cells.length;
          const cy = ay / cells.length;
          let bestD = 1e9;
          for (const idx of cells) {
              const px = idx % sim.cols;
              const py = (idx / sim.cols) | 0;
              const dist = Math.abs(px - cx) + Math.abs(py - cy);
              if (dist < bestD) {
                  bestD = dist;
                  sx = px;
                  sy = py;
              }
          }
      }
      a.anchor = sy * sim.cols + sx;
      a.wob = allies.length > 0 ? 1 : 0;
      return { x: sx, y: sy };
  }
  sim.demonPost = demonPost;
  function actMonster(a: Actor) {
      if (a.form === "egg" || a.form === "pupa")
          return;
      if (a.species === "moss" && (a.brood === "bud" || a.brood === "bloom"))
          return;
      if (a.sleep > 0) {
          const prey = sim.nearest(a, (o) => sim.isPrey(a, o) && Math.abs(o.x - a.x) + Math.abs(o.y - a.y) <= 1);
          if (prey || a.hitFlash > 0)
              a.sleep = 0;
          else {
              a.job = "hold";
              return;
          }
      }
      if (sim.wantsSleep(a)) {
          const prey = sim.nearest(a, (o) => sim.isPrey(a, o) && Math.abs(o.x - a.x) + Math.abs(o.y - a.y) <= 1);
          if (!prey) {
              const belly = a.species === "drake" ? a.carryM : a.carryN;
              if (belly >= 5) {
                  if (a.species === "drake")
                      a.carryM -= 5;
                  else
                      a.carryN -= 5;
                  a.sleep = 8;
                  a.job = "hold";
                  return;
              }
          }
      }
      if (a.species === "moss") {
          sim.truck(a, "n");
          return;
      }
      if (a.species === "spirit") {
          const bones = sim.corpses.find((c) => c.life > 0 && Math.abs(c.x - a.x) + Math.abs(c.y - a.y) <= 3);
          if (bones && (a.x !== bones.x || a.y !== bones.y)) {
              a.job = "bones";
              sim.pursue(a, bones.x, bones.y);
              return;
          }
          sim.truck(a, "m");
          return;
      }
      if (a.species === "nimbus") {
          if (sim.invasionActive()) {
              const h = sim.nearest(a, (o) => o.kind === "hero" && sim.los(a.x, a.y, o.x, o.y, 3));
              if (h) {
                  a.face = h.x >= a.x ? 1 : -1;
                  a.job = "hold";
                  return;
              }
          }
          sim.truck(a, "m");
          return;
      }
      if (a.species === "crawler") {
          if (a.form === "adult" && a.carryN >= 45) {
              if (sim.openNeighbors(a.x, a.y) <= 1) {
                  a.job = "hold";
                  return;
              }
              const quiet = sim.nearestOpen(a.x, a.y, (x, y) => sim.openNeighbors(x, y) <= 1);
              if (quiet) {
                  a.job = "nest";
                  sim.pursue(a, quiet.x, quiet.y);
                  return;
              }
          }
          const prey = sim.nearest(a, (o) => sim.isPrey(a, o));
          const close = prey && Math.abs(prey.x - a.x) + Math.abs(prey.y - a.y) <= 3 ? prey : null;
          if (close) {
              a.job = "hunt";
              if (close.x !== a.x || close.y !== a.y)
                  sim.pursue(a, close.x, close.y);
              sim.tryEat(a);
              return;
          }
          if (a.form === "fly" && a.shed < 1 && a.carryN >= 60) {
              if (sim.openNeighbors(a.x, a.y) <= 1) {
                  const spot = sim.freeNeighbor(a.x, a.y);
                  if (spot && sim.countSpecies("crawler") < CAP.crawler) {
                      a.shed = 1;
                      a.carryN -= 15;
                      const egg = sim.spawnMonster("crawler", spot.x, spot.y, "normal", "egg");
                      egg.hp = 8;
                      egg.maxHp = 8;
                      egg.atk = 0;
                      egg.speed = 0;
                      egg.hatch = 8;
                      egg.carryN = 30;
                      egg.hunger = 100;
                      egg.sleep = 0;
                      egg.rest = 0;
                      a.job = "hold";
                      return;
                  }
              }
              else {
                  const quiet = sim.nearestOpen(a.x, a.y, (x, y) => sim.openNeighbors(x, y) <= 1);
                  if (quiet) {
                      a.job = "nest";
                      sim.pursue(a, quiet.x, quiet.y);
                      return;
                  }
              }
          }
          const far = sim.farTile(a, 6, 10);
          if (!far) {
              a.job = "idle";
              return;
          }
          a.job = "far";
          sim.pursue(a, far.x, far.y);
          sim.tryEat(a);
          return;
      }
      if (a.species === "lizard") {
          const hungry = a.hp < a.maxHp || a.satiety <= 3;
          const thick = sim.countSpecies("moss") >= 4;
          const prey = sim.nearest(a, (o) => {
              if (!sim.isPrey(a, o))
                  return false;
              if (o.species === "moss" && !hungry && !thick)
                  return false;
              if (!hungry && a.hp >= a.maxHp && o.species !== "moss" && !thick && o.species === "crawler")
                  return false;
              return hungry || thick || o.species !== "moss";
          });
          const hunt = hungry || (a.hp >= a.maxHp && thick);
          if (hunt && prey) {
              a.job = "hunt";
              if (prey.x !== a.x || prey.y !== a.y)
                  sim.pursue(a, prey.x, prey.y);
              sim.tryEat(a);
              return;
          }
          const home = a.shed >= 1 ? sim.inNest(a.x, a.y) : sim.legalClaimBox(a.x, a.y) !== null;
          if (home) {
              a.job = "hold";
              sim.tryLay(a);
              return;
          }
          const nest = sim.nearestOpen(a.x, a.y, (x, y) => (a.shed >= 1 ? sim.inNest(x, y) : sim.legalClaimBox(x, y) !== null));
          if (nest) {
              a.job = "nest";
              sim.pursue(a, nest.x, nest.y);
              return;
          }
          const far = sim.farTile(a, 4, 8);
          if (far) {
              a.job = "far";
              sim.pursue(a, far.x, far.y);
          }
          else
              a.job = "idle";
          return;
      }
      if (a.species === "drake") {
          if (a.satiety <= 3) {
              const prey = sim.nearest(a, (o) => sim.isPrey(a, o));
              if (prey) {
                  a.job = "hunt";
                  if (prey.x !== a.x || prey.y !== a.y)
                      sim.pursue(a, prey.x, prey.y);
                  sim.tryEat(a);
                  return;
              }
          }
          if (a.carryM >= 90 && sim.openNeighbors(a.x, a.y) >= 1)
              sim.tryLay(a);
          const halls = sim.horizontalHalls(4).filter((h) => !sim.actors.some((o) => o.alive && o.id !== a.id && o.species === "drake" && o.y === h.y));
          const here = halls.find((h) => h.y === a.y && a.x >= h.x0 && a.x <= h.x1);
          const hall = here ?? halls.sort((p, q) => q.x1 - q.x0 - (p.x1 - p.x0))[0];
          if (!hall) {
              a.job = "hold";
              return;
          }
          if (a.y !== hall.y) {
              const step = sim.pursue(a, hall.x0, hall.y);
              if (step === "none")
                  a.job = "hold";
              return;
          }
          sim.pingPong(a, hall.x0, hall.y, hall.x1, hall.y);
          return;
      }
      if (a.species === "witch" || a.species === "vampire" || a.species === "succubus") {
          const prey = sim.nearest(a, (o) => sim.isPrey(a, o));
          if (prey) {
              a.job = "hunt";
              if (Math.abs(prey.x - a.x) + Math.abs(prey.y - a.y) <= 1) {
                  a.face = prey.x >= a.x ? 1 : -1;
                  sim.tryEat(a);
                  return;
              }
              sim.pursue(a, prey.x, prey.y);
              sim.tryEat(a);
              return;
          }
          const hero = sim.invasionActive()
              ? sim.nearest(a, (o) => o.kind === "hero" && sim.los(a.x, a.y, o.x, o.y, 3))
              : null;
          if (hero) {
              a.face = hero.x >= a.x ? 1 : -1;
              a.dir = hero.x !== a.x ? (hero.x > a.x ? 1 : 3) : hero.y > a.y ? 2 : 0;
              a.job = "hold";
              return;
          }
          const hall = sim.straightHall(4);
          if (!hall) {
              a.job = "idle";
              return;
          }
          sim.pingPong(a, hall.x, hall.y, hall.x2, hall.y2);
          return;
      }
      if (a.species === "bud") {
          const rival = sim.nearest(a, (o) => o.species === "bud" && o.id !== a.id && sim.sameRoom(a.x, a.y, o.x, o.y, 4));
          if (rival) {
              a.job = "fight";
              if (Math.abs(rival.x - a.x) + Math.abs(rival.y - a.y) <= 1) {
                  a.face = rival.x >= a.x ? 1 : -1;
                  a.job = "hold";
                  return;
              }
              sim.pursue(a, rival.x, rival.y);
              return;
          }
          const post = sim.demonPost(a);
          if (!post || (post.x === a.x && post.y === a.y)) {
              a.job = "hold";
              return;
          }
          a.job = "room";
          sim.pursue(a, post.x, post.y);
          return;
      }
      if (a.species === "skeleton") {
          const h = sim.nearest(a, (o) => o.kind === "hero");
          if (h && Math.abs(h.x - a.x) + Math.abs(h.y - a.y) <= 3 && (h.x === a.x || h.y === a.y)) {
              a.job = "fight";
              if (Math.abs(h.x - a.x) + Math.abs(h.y - a.y) <= 1) {
                  a.face = h.x >= a.x ? 1 : -1;
                  a.job = "hold";
                  return;
              }
              sim.pursue(a, h.x, h.y);
              return;
          }
          const goal = sim.rattleGoal(a);
          if (!goal) {
              a.job = "idle";
              return;
          }
          a.job = "explore";
          const step = sim.pursue(a, goal.x, goal.y);
          if (step === "none")
              a.job = "idle";
          return;
      }
      a.job = "idle";
  }
  sim.actMonster = actMonster;
}
