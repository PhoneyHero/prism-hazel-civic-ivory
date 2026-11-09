import type { Actor, Corpse, DigOption, Sim, Species, StageId, Tile } from "./types";
import { DX, DY } from "./grid";
import { NUTRIENT_CHAIN } from "./units";

/** 0 dirt, 1 Loamite, 2 Gnawling, 3 Scalekin / Wyrm. Mana uses the same cuts. */
export function nutrientBand(n: number): 0 | 1 | 2 | 3 {
  if (n < 10) return 0;
  if (n < 30) return 1;
  if (n < 55) return 2;
  return 3;
}


export function bandSub(n: number): number {
  const b = nutrientBand(n);
  if (b === 0) return 0;
  if (b === 1) return n < 16 ? 0 : n < 23 ? 1 : 2;
  if (b === 2) return n < 38 ? 0 : n < 47 ? 1 : 2;
  return n < 70 ? 0 : n < 85 ? 1 : 2;
}


export function syncFluid(t: Tile) {
  if (t.nutrient < 0) t.nutrient = 0;
  if (t.mana < 0) t.mana = 0;
  t.nSub = bandSub(t.nutrient);
  t.mSub = bandSub(t.mana);
  const sim = tileSim.get(t);
  if (sim && t.kind === "soil" && (t.nutrient >= 100 || t.mana >= 100)) spillWall(sim, t);
}


const tileSim = new WeakMap<Tile, Sim>();
const overflowAt = new WeakMap<Tile, number>();


function spillWall(sim: Sim, t: Tile) {
  const now = sim.time;
  const last = overflowAt.get(t) ?? -1e9;
  if (now - last < 8) return;
  const i = sim.tiles.indexOf(t);
  if (i < 0) return;
  const x = i % sim.cols;
  const y = Math.floor(i / sim.cols);
  const air: { x: number; y: number }[] = [];
  for (let d = 0; d < 4; d++) {
    const nx = x + DX[d];
    const ny = y + DY[d];
    if (!sim.isOpen(nx, ny)) continue;
    if (sim.blooms.some((b) => b.x === nx && b.y === ny)) continue;
    air.push({ x: nx, y: ny });
  }
  if (!air.length) return;
  const spot = air[Math.floor(sim.rng() * air.length)];
  const mana = t.nutrient < 100 && t.mana >= 100;
  if (mana) t.mana -= 5;
  else t.nutrient -= 5;
  overflowAt.set(t, now);
  sim.blooms.push({
    x: spot.x,
    y: spot.y,
    n: 0,
    m: mana ? 1 : 0,
    life: 200000,
    path: false,
  });
  syncFluid(t);
}


export const PATH_BLOOM_CHANCE = 0.005;

export const PATH_BLOOM_CAP = 6;


const SOIL_RATIO: Record<StageId, { density: number; n1: number; n2: number; n3: number; m: number }> = {
  hollow: { density: 0.26, n1: 0.7, n2: 0.2, n3: 0.08, m: 0.02 },
  mossworks: { density: 0.28, n1: 0.7, n2: 0.2, n3: 0.08, m: 0.02 },
  gate: { density: 0.28, n1: 0.58, n2: 0.18, n3: 0.08, m: 0.16 },
  witchwell: { density: 0.3, n1: 0.48, n2: 0.14, n3: 0.06, m: 0.32 },
  bone: { density: 0.28, n1: 0.7, n2: 0.2, n3: 0.08, m: 0.02 },
  deep: { density: 0.3, n1: 0.7, n2: 0.2, n3: 0.08, m: 0.02 },
  chamber: { density: 0.28, n1: 0.46, n2: 0.16, n3: 0.08, m: 0.3 },
};


export function rollWalls(
  tiles: Tile[],
  cols: number,
  rows: number,
  rng: () => number,
  entranceX: number,
  stageId: StageId,
) {
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const t = tiles[y * cols + x];
      if (t.kind !== "soil") {
        t.nutrient = 0;
        t.nSub = 0;
        t.mana = 0;
        t.mSub = 0;
        continue;
      }
      t.nutrient = 0;
      t.nSub = 0;
      t.mana = 0;
      t.mSub = 0;
    }
  }
  const ratio = SOIL_RATIO[stageId];
  let interior = 0;
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) if (tiles[y * cols + x].kind === "soil") interior++;
  }
  const target = Math.max(28, Math.round(interior * ratio.density));
  let n1 = Math.round(target * ratio.n1);
  let n2 = Math.round(target * ratio.n2);
  let n3 = Math.max(2, Math.round(target * ratio.n3));
  let mana = Math.max(1, target - n1 - n2 - n3);
  const used = new Set<number>();
  const mazeBlank = (x: number, y: number) => x >= entranceX + 5 && y >= 5 && y <= rows - 5;

  const claim = (x: number, y: number, ignoreBlank: boolean) => {
    if (x <= 0 || y <= 0 || x >= cols - 1 || y >= rows - 1) return false;
    if (!ignoreBlank && mazeBlank(x, y)) return false;
    const i = y * cols + x;
    if (used.has(i)) return false;
    if (tiles[i].kind !== "soil") return false;
    used.add(i);
    return true;
  };

  const write = (x: number, y: number, kind: "n1" | "n2" | "n3" | "m", stageA: boolean) => {
    const t = tiles[y * cols + x];
    if (kind === "n1") {
      t.nutrient = stageA ? 12 : rng() < 0.72 ? 12 : rng() < 0.55 ? 18 : 24;
      t.nSub = bandSub(t.nutrient);
      t.mana = 0;
      t.mSub = 0;
    } else if (kind === "n2") {
      t.nutrient = rng() < 0.65 ? 34 : 46;
      t.nSub = bandSub(t.nutrient);
      t.mana = 0;
      t.mSub = 0;
    } else if (kind === "n3") {
      t.nutrient = rng() < 0.55 ? 58 : 72;
      t.nSub = bandSub(t.nutrient);
      t.mana = 0;
      t.mSub = 0;
    } else {
      t.nutrient = 0;
      t.nSub = 0;
      t.mana = rng() < 0.62 ? 14 : 36;
      t.mSub = bandSub(t.mana);
    }
  };

  const cluster = (cx: number, cy: number, count: number, kind: "n1" | "n2" | "n3" | "m", ignoreBlank: boolean) => {
    const q: [number, number][] = [[cx, cy]];
    const seen = new Set<number>();
    let placed = 0;
    while (q.length && placed < count) {
      const [x, y] = q.shift()!;
      const i = y * cols + x;
      if (seen.has(i)) continue;
      seen.add(i);
      if (claim(x, y, ignoreBlank)) {
        write(x, y, kind, false);
        placed++;
      }
      const dirs = [0, 1, 2, 3].sort(() => rng() - 0.5);
      for (const d of dirs) q.push([x + DX[d], y + DY[d]]);
      if (seen.size > 80) break;
    }
    return placed;
  };

  const pinned = new Set<number>();
  const claimFace = (x: number, y: number, fixed: boolean) => {
    if (n1 <= 0) return false;
    if (!claim(x, y, true)) return false;
    write(x, y, "n1", fixed);
    pinned.add(y * cols + x);
    n1--;
    return true;
  };
  claimFace(entranceX, 3, true);
  let wx = entranceX;
  let wy = 3;
  let grove = 1;
  let spun = 0;
  while (n1 > 0 && grove < 16 && spun++ < 120) {
    const d = Math.floor(rng() * 4);
    const nx = wx + DX[d];
    const ny = wy + DY[d];
    if (claimFace(nx, ny, false)) {
      grove++;
      wx = nx;
      wy = ny;
    } else if (rng() < 0.35) {
      wx = entranceX;
      wy = 3;
    }
  }

  const jitter = (x: number, y: number): [number, number] => [
    Math.max(1, Math.min(cols - 2, x + Math.floor(rng() * 5) - 2)),
    Math.max(1, Math.min(rows - 2, y + Math.floor(rng() * 5) - 2)),
  ];
  const n1Seeds: [number, number][] = [
    [2, 7],
    [3, 8],
    [entranceX - 4, 8],
    [4, 10],
    [2, 11],
    [entranceX, rows - 4],
    [3, rows - 5],
  ].map(([x, y]) => jitter(x, y));
  for (const [sx, sy] of n1Seeds) {
    if (n1 <= 0) break;
    n1 -= cluster(sx, sy, Math.min(n1, 7), "n1", false);
  }
  let guard = 0;
  while (n1 > 0 && guard++ < 80) {
    const x = 1 + Math.floor(rng() * (cols - 2));
    const y = 1 + Math.floor(rng() * (rows - 2));
    const got = cluster(x, y, Math.min(n1, 4), "n1", false);
    if (!got) n1--;
    else n1 -= got;
  }

  const n2Seeds: [number, number][] = [
    [3, Math.min(rows - 3, Math.floor(rows * 0.62))],
    [entranceX - 2, Math.min(rows - 3, Math.floor(rows * 0.72))],
    [5, rows - 4],
    [2, rows - 3],
  ].map(([x, y]) => jitter(x, y));
  for (const [sx, sy] of n2Seeds) {
    if (n2 <= 0) break;
    n2 -= cluster(sx, sy, Math.min(n2, 5), "n2", false);
  }
  guard = 0;
  while (n2 > 0 && guard++ < 40) {
    const x = 1 + Math.floor(rng() * Math.max(2, entranceX + 2));
    const y = Math.floor(rows * 0.5) + Math.floor(rng() * Math.max(2, rows * 0.4));
    const got = cluster(x, Math.min(rows - 2, y), Math.min(n2, 3), "n2", false);
    if (!got) n2--;
    else n2 -= got;
  }

  const n3Seeds: [number, number][] = [
    [4, rows - 3],
    [entranceX - 1, rows - 3],
    [2, rows - 4],
  ].map(([x, y]) => jitter(x, y));
  for (const [sx, sy] of n3Seeds) {
    if (n3 <= 0) break;
    n3 -= cluster(sx, sy, Math.min(n3, 3), "n3", false);
  }

  const manaHeavy = stageId === "witchwell" || stageId === "chamber" || stageId === "gate";
  const mSeeds: [number, number][] = (manaHeavy
    ? [
        [cols - 3, 3],
        [cols - 4, 6],
        [cols - 3, 9],
        [cols - 4, rows - 4],
        [entranceX + 3, 8],
      ]
    : [
        [cols - 3, rows - 4],
        [cols - 4, rows - 6],
      ]
  ).map(([x, y]) => jitter(x, y));
  for (const [sx, sy] of mSeeds) {
    if (mana <= 0) break;
    mana -= cluster(sx, sy, Math.min(mana, manaHeavy ? 6 : 2), "m", true);
  }

  for (let k = 0; k < 3; k++) {
    const x = 2 + Math.floor(rng() * Math.max(1, cols - 4));
    const y = 4 + Math.floor(rng() * Math.max(1, rows - 6));
    const t = tiles[y * cols + x];
    if (t && t.kind === "soil") t.hardness = 2;
  }

  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const t = tiles[y * cols + x];
      if (t.kind !== "soil" || t.nutrient !== 0 || t.mana !== 0) continue;
      t.nutrient = 1 + Math.floor(rng() * 6);
      t.nSub = 0;
    }
  }

  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const t = tiles[y * cols + x];
      if (t.kind !== "soil" || t.mana <= 0) continue;
      t.mana = Math.max(1, Math.round(t.mana * 1.15));
      syncFluid(t);
    }
  }

  const quadOf = (x: number, y: number) => (y < rows / 2 ? 0 : 2) + (x < cols / 2 ? 0 : 1);
  const spread = (fluid: "n" | "m") => {
    const get = (t: Tile) => (fluid === "n" ? t.nutrient : t.mana);
    const set = (t: Tile, v: number) => {
      if (fluid === "n") t.nutrient = v;
      else t.mana = v;
      syncFluid(t);
    };
    const pinnedCell = (x: number, y: number) => pinned.has(y * cols + x);
    for (let guard = 0; guard < 800; guard++) {
      const sums = [0, 0, 0, 0];
      const cells: { t: Tile; x: number; y: number }[][] = [[], [], [], []];
      let total = 0;
      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const t = tiles[y * cols + x];
          if (t.kind !== "soil") continue;
          const q = quadOf(x, y);
          total += get(t);
          sums[q] += get(t);
          cells[q].push({ t, x, y });
        }
      }
      if (total <= 0) return;
      const cap = total * 0.35;
      let heavy = 0;
      for (let i = 1; i < 4; i++) if (sums[i] > sums[heavy]) heavy = i;
      if (sums[heavy] <= cap + 0.5) return;
      let light = heavy === 0 ? 1 : 0;
      for (let i = 0; i < 4; i++) if (i !== heavy && sums[i] < sums[light]) light = i;
      const srcs = cells[heavy].filter((c) => get(c.t) > 0 && !pinnedCell(c.x, c.y));
      const dsts = cells[light].filter((c) => !pinnedCell(c.x, c.y));
      if (!srcs.length || !dsts.length) return;
      srcs.sort((a, b) => get(b.t) - get(a.t));
      dsts.sort((a, b) => get(a.t) - get(b.t));
      const from = srcs[0];
      const to = dsts[0];
      const fv = get(from.t);
      const tv = get(to.t);
      if (tv === 0 && fv > 0 && sums[heavy] - fv >= fv) {
        set(from.t, 0);
        set(to.t, fv);
        continue;
      }
      const excess = Math.ceil(sums[heavy] - cap);
      const amt = Math.min(fv - 1, Math.max(1, excess));
      if (amt <= 0 || fv < 2) return;
      set(from.t, fv - amt);
      set(to.t, tv + amt);
    }
  };
  spread("n");
  spread("m");
}

export function installSoil(sim: Sim) {
  for (const t of sim.tiles) tileSim.set(t, sim);
  function taxTile(x: number, y: number) {
      const walls = sim.wallList(x, y);
      if (!walls.length)
          return;
      const pick = walls[Math.floor(sim.rng() * walls.length)].t;
      if (pick.nutrient > 0 && (pick.mana <= 0 || sim.rng() < 0.55))
          sim.pullN(pick);
      else if (pick.mana > 0)
          sim.pullM(pick);
  }
  sim.taxTile = taxTile;
  function leakStores() {
      const bag: Tile[] = [];
      for (const t of sim.tiles) {
          if (t.kind !== "soil") {
              t.nutrient = 0;
              t.nSub = 0;
              t.mana = 0;
              t.mSub = 0;
              continue;
          }
          if (t.nutrient > 0 || t.mana > 0)
              bag.push(t);
      }
      if (sim.calmNow())
          return;
      const burns = Math.min(3, bag.length);
      for (let k = 0; k < burns; k++) {
          const t = bag[Math.floor(sim.rng() * bag.length)];
          if (t.nutrient > 0 && (t.mana <= 0 || sim.rng() < 0.5))
              sim.pullN(t);
          else if (t.mana > 0)
              sim.pullM(t);
      }
  }
  sim.leakStores = leakStores;
  function bumpN(t: Tile) {
      if (t.kind !== "soil")
          return;
      t.nutrient += 5;
      syncFluid(t);
  }
  sim.bumpN = bumpN;
  function bumpM(t: Tile) {
      if (t.kind !== "soil")
          return;
      t.mana += 5;
      syncFluid(t);
  }
  sim.bumpM = bumpM;
  function pullN(t: Tile): boolean {
      if (t.kind !== "soil" || t.nutrient <= 0)
          return false;
      t.nutrient = Math.max(0, t.nutrient - 5);
      syncFluid(t);
      return true;
  }
  sim.pullN = pullN;
  function pullM(t: Tile): boolean {
      if (t.kind !== "soil" || t.mana <= 0)
          return false;
      t.mana = Math.max(0, t.mana - 5);
      syncFluid(t);
      return true;
  }
  sim.pullM = pullM;
  function nearestWall(sx: number, sy: number): {
      x: number;
      y: number;
      t: Tile;
  } | null {
      let best: {
          x: number;
          y: number;
          t: Tile;
      } | null = null;
      let bestScore = 1e9;
      for (let dy = -4; dy <= 4; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
              if (dx === 0 && dy === 0)
                  continue;
              if (Math.max(Math.abs(dx), Math.abs(dy)) > 4)
                  continue;
              const t = sim.tileAt(sx + dx, sy + dy);
              if (!t || t.kind !== "soil")
                  continue;
              const man = Math.abs(dx) + Math.abs(dy);
              const diag = dx !== 0 && dy !== 0 ? 1 : 0;
              const score = man * 10 + diag * 3;
              if (score < bestScore) {
                  bestScore = score;
                  best = { x: sx + dx, y: sy + dy, t };
              }
          }
      }
      return best;
  }
  sim.nearestWall = nearestWall;
  function giveWall(x: number, y: number, n: number, m: number) {
      sim.dumpFull(x, y, n, m);
  }
  sim.giveWall = giveWall;
  function dumpFull(x: number, y: number, n: number, m: number) {
      if (n <= 0 && m <= 0)
          return;
      const scored: {
          t: Tile;
          score: number;
      }[] = [];
      for (let dy = -6; dy <= 6; dy++) {
          for (let dx = -6; dx <= 6; dx++) {
              if (dx === 0 && dy === 0)
                  continue;
              const t = sim.tileAt(x + dx, y + dy);
              if (!t || t.kind !== "soil")
                  continue;
              const man = Math.abs(dx) + Math.abs(dy);
              scored.push({ t, score: man * 10 + (dx !== 0 && dy !== 0 ? 3 : 0) });
          }
      }
      scored.sort((a, b) => a.score - b.score);
      const walls: Tile[] = [];
      const seenT = new Set<Tile>();
      for (const row of scored) {
          if (seenT.has(row.t))
              continue;
          seenT.add(row.t);
          walls.push(row.t);
          if (walls.length >= 4)
              break;
      }
      if (!walls.length)
          return;
      const shareN = Math.floor(n / walls.length);
      let remN = n - shareN * walls.length;
      const shareM = Math.floor(m / walls.length);
      let remM = m - shareM * walls.length;
      for (const t of walls) {
          const addN = shareN + (remN > 0 ? 1 : 0);
          const addM = shareM + (remM > 0 ? 1 : 0);
          if (remN > 0)
              remN -= 1;
          if (remM > 0)
              remM -= 1;
          if (addN)
              t.nutrient += addN;
          if (addM)
              t.mana += addM;
          syncFluid(t);
      }
  }
  sim.dumpFull = dumpFull;
  function wallList(x: number, y: number): {
      t: Tile;
      n: number;
      m: number;
  }[] {
      const out: {
          t: Tile;
          n: number;
          m: number;
      }[] = [];
      for (let d = 0; d < 4; d++) {
          const t = sim.tileAt(x + DX[d], y + DY[d]);
          if (!t || t.kind !== "soil")
              continue;
          out.push({ t, n: t.nutrient, m: t.mana });
      }
      return out;
  }
  sim.wallList = wallList;
  function transferNutrient(a: Actor) {
      if (a.species !== "moss" || a.brood !== "walk" || a.form !== "adult")
          return;
      const walls = sim.wallList(a.x, a.y);
      if (!walls.length)
          return;
      walls.sort((p, q) => p.n - q.n);
      const poor = walls[0];
      const rich = walls[walls.length - 1];
      if (a.carryN >= 5) {
          const dump = Math.min(5, a.carryN);
          a.carryN -= dump;
          poor.t.nutrient += dump;
          syncFluid(poor.t);
      }
      else if (rich.n >= 5 && rich.t !== poor.t && rich.n >= poor.n + 5) {
          const take = Math.min(5, rich.t.nutrient);
          rich.t.nutrient -= take;
          syncFluid(rich.t);
          a.carryN += take;
      }
      else if (rich.n >= 5 && a.carryN < 5) {
          const take = Math.min(5, rich.t.nutrient);
          rich.t.nutrient -= take;
          syncFluid(rich.t);
          a.carryN += take;
      }
  }
  sim.transferNutrient = transferNutrient;
  function transferMana(a: Actor) {
      const walls = sim.wallList(a.x, a.y);
      if (!walls.length)
          return;
      walls.sort((p, q) => p.m - q.m);
      const poor = walls[0];
      const rich = walls[walls.length - 1];
      if (a.carryM > 0 && poor.m < 3 && sim.rng() < 0.75) {
          a.carryM -= 1;
          if (sim.rng() < 0.25)
              return;
          sim.bumpM(poor.t);
      }
      else if (rich.m > 0 && a.carryM < 5) {
          if (sim.pullM(rich.t)) {
              if (sim.rng() < 0.25)
                  return;
              a.carryM += 1;
          }
      }
  }
  sim.transferMana = transferMana;
  function pour(x: number, y: number, n: number, m: number) {
      if (n <= 0 && m <= 0)
          return;
      const scored: {
          t: Tile;
          score: number;
      }[] = [];
      for (let dy = -6; dy <= 6; dy++) {
          for (let dx = -6; dx <= 6; dx++) {
              if (dx === 0 && dy === 0)
                  continue;
              const t = sim.tileAt(x + dx, y + dy);
              if (!t || t.kind !== "soil")
                  continue;
              const man = Math.abs(dx) + Math.abs(dy);
              const diag = dx !== 0 && dy !== 0 ? 1 : 0;
              scored.push({ t, score: man * 10 + diag * 4 });
          }
      }
      scored.sort((a, b) => a.score - b.score);
      const walls: Tile[] = [];
      const seen = new Set<Tile>();
      for (const row of scored) {
          if (seen.has(row.t))
              continue;
          seen.add(row.t);
          walls.push(row.t);
          if (walls.length >= 4)
              break;
      }
      if (!walls.length) {
          sim.giveWall(x, y, n, m);
          return;
      }
      for (let i = 0; i < n; i++)
          sim.bumpN(walls[i % walls.length]);
      for (let i = 0; i < m; i++)
          sim.bumpM(walls[i % walls.length]);
  }
  sim.pour = pour;
  function splash(x: number, y: number, n: number, m: number) {
      const outN = Math.floor(n * 0.5);
      const outM = Math.floor(m * 0.5);
      sim.giveWall(x, y, outN, outM);
  }
  sim.splash = splash;
  function spellWall(t: Tile, bumps: number) {
      if (t.kind !== "soil" || bumps <= 0)
          return;
      for (let i = 0; i < bumps; i++)
          sim.bumpM(t);
      if (t.mana > 0 && t.nutrient > 0 && t.mana >= t.nutrient) {
          t.mana += t.nutrient;
          t.nutrient = 0;
          syncFluid(t);
      }
  }
  sim.spellWall = spellWall;
  function boltRewrite(ax: number, ay: number, tx: number, ty: number, bumps: number) {
      const sx = ax === tx ? 0 : tx > ax ? 1 : tx < ax ? -1 : 0;
      const sy = ay === ty ? 0 : ty > ay ? 1 : ty < ay ? -1 : 0;
      if (sx === 0 && sy === 0)
          return;
      if (sx !== 0 && sy !== 0) {
          const wall = sim.tileAt(tx, ty);
          if (wall && wall.kind === "soil")
              sim.spellWall(wall, bumps);
          return;
      }
      const dist = Math.max(Math.abs(tx - ax), Math.abs(ty - ay));
      for (let i = 1; i <= Math.max(1, dist); i++) {
          const x = ax + sx * i;
          const y = ay + sy * i;
          const sideA = sim.tileAt(x + sy, y + sx);
          const sideB = sim.tileAt(x - sy, y - sx);
          if (sideA && sideA.kind === "soil" && (sideA.nutrient > 0 || sideA.mana > 0))
              sim.spellWall(sideA, 1);
          if (sideB && sideB.kind === "soil" && (sideB.nutrient > 0 || sideB.mana > 0))
              sim.spellWall(sideB, 1);
          const t = sim.tileAt(x, y);
          if (t && t.kind === "soil") {
              sim.spellWall(t, bumps);
              return;
          }
          if (t && t.kind === "bedrock")
              return;
      }
  }
  sim.boltRewrite = boltRewrite;
  function paintDiamond(x: number, y: number, n: number, m: number) {
      if (n <= 0 && m <= 0)
          return;
      const walls: Tile[] = [];
      for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
              const man = Math.abs(dx) + Math.abs(dy);
              if (man === 0 || man > 2)
                  continue;
              const t = sim.tileAt(x + dx, y + dy);
              if (!t || t.kind !== "soil")
                  continue;
              walls.push(t);
          }
      }
      if (!walls.length)
          return;
      const shareN = Math.floor(n / walls.length);
      let remN = n - shareN * walls.length;
      const shareM = Math.floor(m / walls.length);
      let remM = m - shareM * walls.length;
      for (const t of walls) {
          t.nutrient += shareN + (remN > 0 ? 1 : 0);
          t.mana += shareM + (remM > 0 ? 1 : 0);
          if (remN > 0)
              remN -= 1;
          if (remM > 0)
              remM -= 1;
          syncFluid(t);
      }
  }
  sim.paintDiamond = paintDiamond;
  function splitFluid(x: number, y: number, n: number, m: number) {
      if (n <= 0 && m <= 0)
          return;
      const walls: Tile[] = [];
      for (let d = 0; d < 4; d++) {
          const t = sim.tileAt(x + DX[d], y + DY[d]);
          if (t && t.kind === "soil")
              walls.push(t);
      }
      if (!walls.length)
          return;
      const shareN = Math.floor(n / walls.length);
      let remN = n - shareN * walls.length;
      const shareM = Math.floor(m / walls.length);
      let remM = m - shareM * walls.length;
      for (const t of walls) {
          t.nutrient += shareN + (remN > 0 ? 1 : 0);
          t.mana += shareM + (remM > 0 ? 1 : 0);
          if (remN > 0)
              remN -= 1;
          if (remM > 0)
              remM -= 1;
          syncFluid(t);
      }
  }
  sim.splitFluid = splitFluid;
  function bandSpeciesN(n: number): Species | null {
      if (n >= 55)
          return "lizard";
      if (n >= 30)
          return "crawler";
      if (n >= 10)
          return "moss";
      return null;
  }
  sim.bandSpeciesN = bandSpeciesN;
  function bandSpeciesM(m: number): Species | null {
      if (m >= 55)
          return "drake";
      if (m >= 30)
          return "witch";
      if (m >= 10)
          return "spirit";
      return null;
  }
  sim.bandSpeciesM = bandSpeciesM;
  function releaseSoil(x: number, y: number, n: number, m: number): number {
      if (n < 10 && m < 10) {
          sim.splitFluid(x, y, n, m);
          return 0;
      }
      const nWins = n >= m;
      const sp = nWins ? sim.bandSpeciesN(n) : sim.bandSpeciesM(m);
      if (!sp) {
          sim.splitFluid(x, y, n, m);
          return 0;
      }
      const loseN = nWins ? 0 : n;
      const loseM = nWins ? m : 0;
      if (loseN > 0 || loseM > 0)
          sim.splitFluid(x, y, loseN, loseM);
      const kid = sim.trySpawn(sp, x, y, Math.max(1, nutrientBand(nWins ? n : m)), bandSub(nWins ? n : m));
      if (!kid)
          return 0;
      if (nWins)
          kid.carryN = n;
      else
          kid.carryM = m;
      kid.hunger = 100;
      kid.sleep = 0;
      kid.rest = 0;
      if (sp === "moss") {
          kid.brood = "walk";
          kid.vitality = 22;
          kid.carryN = n;
      }
      return 1;
  }
  sim.releaseSoil = releaseSoil;
  function openDug(x: number, y: number, t: Tile) {
      sim.refreshRunes();
      const rune = sim.runeOf(x, y);
      if (rune) {
          sim.breakRune(rune.x, rune.y);
          sim.refreshRunes();
          sim.noteGrid();
          sim.sfx("dig");
          sim.burst(x, y, "#c9a0ff", 8, 1.8);
          return;
      }
      const n = t.nutrient;
      const m = t.mana;
      t.kind = "dug";
      t.nutrient = 0;
      t.nSub = 0;
      t.mana = 0;
      t.mSub = 0;
      t.hardness = 1;
      sim.releaseSoil(x, y, n, m);
      sim.noteGrid();
      sim.sfx("dig");
      sim.burst(x, y, "#6a4634", 6, 1.6);
  }
  sim.openDug = openDug;
  function feedPiles(x: number, y: number, n: number, m: number) {
      if (n <= 0 && m <= 0)
          return;
      for (const c of sim.corpses) {
          if (Math.abs(c.x - x) + Math.abs(c.y - y) === 1) {
              c.n += n;
              c.m += m;
          }
      }
  }
  sim.feedPiles = feedPiles;
  function makePile(x: number, y: number, extra?: Partial<Corpse>): Corpse {
      return {
          x,
          y,
          life: 1e9,
          n: 0,
          m: 0,
          manaAtDeath: 0,
          cls: null,
          spirits: 0,
          red: false,
          ...extra,
      };
  }
  sim.makePile = makePile;
  function dumpOrthogonal(x: number, y: number, n: number, m: number, forceBand: boolean) {
      const walls: Tile[] = [];
      for (let d = 0; d < 4; d++) {
          const t = sim.tileAt(x + DX[d], y + DY[d]);
          if (t && t.kind === "soil")
              walls.push(t);
      }
      if (!walls.length) {
          sim.dumpFull(x, y, n, m);
          return;
      }
      const shareN = Math.floor(n / walls.length);
      let remN = n - shareN * walls.length;
      const shareM = Math.floor(m / walls.length);
      let remM = m - shareM * walls.length;
      for (const t of walls) {
          t.nutrient += shareN + (remN > 0 ? 1 : 0);
          t.mana += shareM + (remM > 0 ? 1 : 0);
          if (remN > 0)
              remN -= 1;
          if (remM > 0)
              remM -= 1;
          syncFluid(t);
      }
      if (forceBand && n > 0 && !walls.some((t) => t.nutrient >= 10)) {
          walls[0].nutrient = Math.max(walls[0].nutrient, 12);
          syncFluid(walls[0]);
      }
      if (forceBand && m > 0 && n <= 0 && !walls.some((t) => t.mana >= 10)) {
          walls[0].mana = Math.max(walls[0].mana, 12);
          syncFluid(walls[0]);
      }
  }
  sim.dumpOrthogonal = dumpOrthogonal;
  function dumpOf(sp: Species | null, smash: boolean) {
      if (sp === "skeleton")
          return { n: 0, m: 0 };
      const nutrientBorn = !sp || NUTRIENT_CHAIN.includes(sp);
      const base = sp === "drake" ? 40 : sp === "lizard" || sp === "bud" ? 28 : sp === "crawler" ? 14 : 8;
      if (nutrientBorn)
          return { n: smash ? base + 6 : base, m: 0 };
      const mana = sp === "nimbus" || sp === "succubus" || sp === "vampire" ? 36 : sp === "witch" ? 28 : 10;
      return { n: 0, m: smash ? mana + 6 : mana };
  }
  sim.dumpOf = dumpOf;
  function nutrientSpecies(x: number, y: number, n: number, sub: number): Species | null {
      const band = nutrientBand(n);
      if (band <= 0)
          return null;
      if (sim.born.moss < 1)
          return "moss";
      if (sim.born.lizard > 0 && band >= 3 && sub >= 2)
          return "drake";
      if (band >= 3 && sim.born.lizard > 0 && sim.countSpecies("bud") < 1) {
          const lord = sim.livingLord();
          if (lord && Math.abs(lord.x - x) + Math.abs(lord.y - y) <= 4)
              return "bud";
      }
      if (band >= 3 && sim.born.crawler > 0)
          return "lizard";
      if (band >= 2)
          return "crawler";
      return "moss";
  }
  sim.nutrientSpecies = nutrientSpecies;
  function manaSpecies(m: number, sub: number): Species | null {
      const band = nutrientBand(m);
      if (band <= 0)
          return null;
      const witchLine = sim.born.witch + sim.born.vampire + sim.born.succubus > 0;
      if (band >= 3 && witchLine && sub >= 2)
          return "nimbus";
      if (band >= 3 && witchLine)
          return "succubus";
      if (band >= 3)
          return "vampire";
      if (band >= 2)
          return "witch";
      return "spirit";
  }
  sim.manaSpecies = manaSpecies;
  function birthFromSoil(x: number, y: number, n: number, m: number, nSub = 0, mSub = 0) {
      let nBorn = 0;
      const nSp = n > 0 ? sim.nutrientSpecies(x, y, n, nSub) : null;
      const mSp = m > 0 ? sim.manaSpecies(m, mSub) : null;
      if (nSp && sim.trySpawn(nSp, x, y, Math.max(1, nutrientBand(n)), bandSub(n)))
          nBorn += 1;
      if (mSp) {
          if (!nSp || nBorn === 0) {
              if (sim.trySpawn(mSp, x, y, Math.max(1, nutrientBand(m)), mSub))
                  nBorn += 1;
          }
          else {
              let placed = false;
              const near = sim.freeNeighbor(x, y);
              if (near && sim.trySpawn(mSp, near.x, near.y, Math.max(1, nutrientBand(m)), mSub)) {
                  nBorn += 1;
                  placed = true;
              }
              if (!placed) {
                  for (let dy = -2; dy <= 2 && !placed; dy++) {
                      for (let dx = -2; dx <= 2 && !placed; dx++) {
                          if (dx === 0 && dy === 0)
                              continue;
                          const nx = x + dx;
                          const ny = y + dy;
                          if (!sim.isOpen(nx, ny) || sim.actorAt(nx, ny))
                              continue;
                          if (sim.trySpawn(mSp, nx, ny, Math.max(1, nutrientBand(m)), mSub)) {
                              nBorn += 1;
                              placed = true;
                          }
                      }
                  }
              }
          }
      }
      if ((n > 0 || m > 0) && nBorn === 0) {
          console.warn(`[loam] birth miss ${x},${y} N${n}.${nSub} M${m}.${mSub}`);
      }
      return nBorn;
  }
  sim.birthFromSoil = birthFromSoil;
  function passiveBirth() {
      /* Births come from dug walls only. A closed map with no new digs collapses. */
  }
  sim.passiveBirth = passiveBirth;
  function digAt(x: number, y: number) {
      const bloom = sim.blooms.find((b) => b.x === x && b.y === y);
      if (bloom) {
          sim.breakBloom(bloom);
          sim.emit();
          return;
      }
      const pile = sim.corpseAt(x, y);
      if (pile) {
          sim.raiseRattle(pile);
          return;
      }
      const t = sim.tileAt(x, y);
      if (!t || t.kind !== "soil") {
          if (t && (t.kind === "dug" || t.kind === "entrance") && sim.actorAt(x, y)?.kind === "monster") {
              sim.toast("Switch to Smash to sacrifice a creature.");
          }
          return;
      }
      if (!sim.nearOpen(x, y)) {
          sim.toast("Dig soil that touches open ground.");
          return;
      }
      if (sim.digPower < t.hardness) {
          sim.toast(t.hardness > 1 ? "That rock wants 2 Dig Power." : "Dig Power is spent.");
          return;
      }
      sim.refreshRunes();
      const rune = sim.runeOf(x, y);
      if (rune) {
          sim.digPower -= t.hardness;
          sim.digs += 1;
          sim.api.digs = sim.digs;
          sim.breakRune(rune.x, rune.y);
          sim.refreshRunes();
          sim.noteGrid();
          sim.sfx("ominous");
          sim.burst(x, y, "#c9a0ff", 14, 2.6);
          sim.bumpShake(0.35);
          sim.advanceHint();
          sim.emit();
          return;
      }
      const n = t.nutrient;
      const m = t.mana;
      sim.digPower -= t.hardness;
      t.kind = "dug";
      t.nutrient = 0;
      t.nSub = 0;
      t.mana = 0;
      t.mSub = 0;
      sim.digs += 1;
      sim.api.digs = sim.digs;
      sim.sfx("dig");
      sim.burst(x, y, "#6a4634", 10, 2.4);
      sim.bumpShake(0.18);
      const bornNow = sim.releaseSoil(x, y, n, m);
      sim.noteGrid();
      if ((n >= 10 || m >= 10) && bornNow === 0) {
          sim.digPower += 1;
          sim.float(x, y, "EMPTY", "#e25b3a");
          sim.toast("EMPTY");
      }
      sim.advanceHint();
      sim.emit();
  }
  sim.digAt = digAt;
  function listDiggable(): DigOption[] {
      const out: DigOption[] = [];
      for (let y = 1; y < sim.rows - 1; y++) {
          for (let x = 1; x < sim.cols - 1; x++) {
              const t = sim.tiles[y * sim.cols + x];
              if (t.kind !== "soil")
                  continue;
              if (!sim.nearOpen(x, y))
                  continue;
              if (t.hardness > sim.digPower)
                  continue;
              out.push({ x, y, n: t.nutrient, m: t.mana, cost: t.hardness });
          }
      }
      return out;
  }
  sim.listDiggable = listDiggable;
}
