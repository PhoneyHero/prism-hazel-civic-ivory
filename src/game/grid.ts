import type { Actor, Sim, StageBuild, StageId, Tile, Wave } from "./types";

export const DX = [0, 1, 0, -1];

export const DY = [-1, 0, 1, 0];


function makeBlank(cols: number, rows: number): Tile[] {
  const tiles: Tile[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const border = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
      tiles.push({
        kind: border ? "bedrock" : "soil",
        nutrient: 0,
        nSub: 0,
        mana: 0,
        mSub: 0,
        hardness: 1,
      });
    }
  }
  return tiles;
}


function paint(
  tiles: Tile[],
  cols: number,
  rows: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  nutrient: number,
  mana = 0,
) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (x <= 0 || y <= 0 || x >= cols - 1 || y >= rows - 1) continue;
      const t = tiles[y * cols + x];
      if (t.kind === "bedrock") continue;
      t.nutrient = Math.max(t.nutrient, nutrient);
      t.mana = Math.max(t.mana, mana);
    }
  }
}


function carveEntrance(tiles: Tile[], cols: number, x: number) {
  tiles[1 * cols + x].kind = "entrance";
  tiles[1 * cols + x].nutrient = 0;
  tiles[1 * cols + x].mana = 0;
  tiles[1 * cols + x].hardness = 1;
  tiles[2 * cols + x].kind = "dug";
  tiles[2 * cols + x].nutrient = 0;
  tiles[2 * cols + x].mana = 0;
  tiles[2 * cols + x].hardness = 1;
}


function story(
  dig: number,
  name: string,
  prep: number,
  eco: number,
  waves: Wave[],
  paintFn: (tiles: Tile[], cols: number, rows: number) => void,
): StageBuild {
  const cols = 24;
  const rows = 18;
  const tiles = makeBlank(cols, rows);
  paintFn(tiles, cols, rows);
  const entranceX = 11;
  carveEntrance(tiles, cols, entranceX);
  return {
    cols,
    rows,
    tiles,
    entrance: { x: entranceX, y: 1 },
    dig,
    name,
    endless: false,
    prep,
    eco,
    waves,
  };
}


export function buildStage(id: StageId): StageBuild {
  if (id === "hollow") {
    return story(140, "First Hollow", 45, 50, [
      { heroes: [{ cls: "swordsman", mul: 0.82 }] },
      { heroes: [{ cls: "swordsman", mul: 1.05 }, { cls: "archer", mul: 1 }] },
    ], (tiles, cols, rows) => {
      paint(tiles, cols, rows, 1, 1, 24, 6, 1, 0);
      paint(tiles, cols, rows, 1, 7, 24, 11, 2, 0);
      paint(tiles, cols, rows, 1, 12, 24, 18, 3, 0);
      paint(tiles, cols, rows, 18, 8, 23, 12, 1, 2);
      tiles[16 * cols + 6].nutrient = 4;
      tiles[9 * cols + 4].hardness = 2;
      tiles[14 * cols + 20].hardness = 2;
    });
  }
  if (id === "mossworks") {
    return story(
      160,
      "Mossworks",
      40,
      50,
      [
        { heroes: [{ cls: "swordsman", mul: 1 }] },
        { heroes: [{ cls: "swordsman", mul: 1.08 }, { cls: "archer", mul: 1.05 }] },
        { heroes: [{ cls: "knight", mul: 1.12 }, { cls: "archer", mul: 1.16 }] },
        { heroes: [{ cls: "knight", mul: 1.28 }, { cls: "mage", mul: 1.2 }] },
      ],
      (tiles, cols, rows) => {
        paint(tiles, cols, rows, 1, 1, 24, 18, 1, 0);
        paint(tiles, cols, rows, 1, 4, 8, 18, 3, 0);
        paint(tiles, cols, rows, 16, 4, 24, 18, 2, 0);
        paint(tiles, cols, rows, 9, 12, 16, 18, 3, 0);
        tiles[17 * cols + 4].nutrient = 4;
        tiles[8 * cols + 3].hardness = 2;
        tiles[13 * cols + 18].hardness = 2;
      },
    );
  }
  if (id === "gate") {
    return story(
      180,
      "Twin Gate",
      40,
      55,
      [
        { heroes: [{ cls: "swordsman", mul: 1 }] },
        { heroes: [{ cls: "swordsman", mul: 1.08 }, { cls: "mage", mul: 1.05 }] },
        { heroes: [{ cls: "knight", mul: 1.16 }, { cls: "mage", mul: 1.2 }] },
        { heroes: [{ cls: "knight", mul: 1.3 }, { cls: "priest", mul: 1.22 }, { cls: "archer", mul: 1.24 }] },
      ],
      (tiles, cols, rows) => {
        paint(tiles, cols, rows, 1, 1, 12, 18, 1, 0);
        paint(tiles, cols, rows, 13, 1, 24, 18, 0, 1);
        paint(tiles, cols, rows, 1, 8, 12, 14, 2, 0);
        paint(tiles, cols, rows, 13, 8, 24, 14, 0, 2);
        paint(tiles, cols, rows, 1, 15, 12, 18, 3, 0);
        paint(tiles, cols, rows, 13, 15, 24, 18, 1, 3);
        tiles[17 * cols + 4].nutrient = 4;
        tiles[17 * cols + 20].mana = 4;
        tiles[10 * cols + 6].hardness = 2;
        tiles[12 * cols + 16].hardness = 2;
      },
    );
  }
  if (id === "witchwell") {
    return story(
      180,
      "Witchwell",
      40,
      60,
      [
        { heroes: [{ cls: "mage", mul: 1 }] },
        { heroes: [{ cls: "mage", mul: 1.08 }, { cls: "priest", mul: 1.05 }] },
        { heroes: [{ cls: "archer", mul: 1.12 }, { cls: "mage", mul: 1.16 }, { cls: "priest", mul: 1.1 }] },
        { heroes: [{ cls: "knight", mul: 1.22 }, { cls: "mage", mul: 1.28 }, { cls: "priest", mul: 1.2 }] },
        { heroes: [{ cls: "knight", mul: 1.4 }, { cls: "mage", mul: 1.36 }, { cls: "thief", mul: 1.3 }] },
      ],
      (tiles, cols, rows) => {
        paint(tiles, cols, rows, 1, 1, 24, 6, 0, 1);
        paint(tiles, cols, rows, 1, 7, 24, 12, 1, 2);
        paint(tiles, cols, rows, 1, 13, 24, 18, 1, 3);
        tiles[10 * cols + 18].mana = 4;
        tiles[16 * cols + 8].mana = 4;
        tiles[8 * cols + 5].hardness = 2;
        tiles[14 * cols + 21].hardness = 2;
      },
    );
  }
  if (id === "bone") {
    return story(
      200,
      "Bone Procession",
      40,
      65,
      [
        { heroes: [{ cls: "swordsman", mul: 1 }, { cls: "thief", mul: 1 }] },
        { heroes: [{ cls: "swordsman", mul: 1.08 }, { cls: "archer", mul: 1.08 }] },
        { heroes: [{ cls: "knight", mul: 1.14 }] },
        { heroes: [{ cls: "knight", mul: 1.24 }, { cls: "priest", mul: 1.16 }, { cls: "archer", mul: 1.18 }] },
        { heroes: [{ cls: "knight", mul: 1.4 }, { cls: "mage", mul: 1.34 }] },
      ],
      (tiles, cols, rows) => {
        paint(tiles, cols, rows, 1, 1, 24, 6, 1, 0);
        paint(tiles, cols, rows, 1, 7, 12, 12, 2, 1);
        paint(tiles, cols, rows, 13, 7, 24, 12, 1, 2);
        paint(tiles, cols, rows, 1, 13, 12, 18, 3, 0);
        paint(tiles, cols, rows, 13, 13, 24, 18, 2, 2);
        tiles[17 * cols + 5].nutrient = 4;
        tiles[16 * cols + 20].mana = 4;
        tiles[9 * cols + 4].hardness = 2;
        tiles[14 * cols + 16].hardness = 2;
      },
    );
  }
  if (id === "deep") {
    return story(
      220,
      "Deep Throne",
      40,
      70,
      [
        { heroes: [{ cls: "swordsman", mul: 0.78 }] },
        { heroes: [{ cls: "swordsman", mul: 1 }, { cls: "archer", mul: 1 }] },
        { heroes: [{ cls: "knight", mul: 1.12 }, { cls: "mage", mul: 1.12 }] },
        { heroes: [{ cls: "knight", mul: 1.28 }, { cls: "priest", mul: 1.22 }, { cls: "archer", mul: 1.24 }] },
        { heroes: [{ cls: "knight", mul: 1.55 }, { cls: "knight", mul: 1.55 }, { cls: "mage", mul: 1.5 }] },
        { heroes: [{ cls: "knight", mul: 1.7 }, { cls: "mage", mul: 1.65 }, { cls: "priest", mul: 1.6 }] },
      ],
      (tiles, cols, rows) => {
        paint(tiles, cols, rows, 1, 1, 12, 6, 1, 0);
        paint(tiles, cols, rows, 13, 1, 24, 6, 0, 1);
        paint(tiles, cols, rows, 1, 7, 12, 12, 2, 0);
        paint(tiles, cols, rows, 13, 7, 24, 12, 0, 2);
        paint(tiles, cols, rows, 1, 13, 12, 18, 3, 1);
        paint(tiles, cols, rows, 13, 13, 24, 18, 2, 3);
        tiles[17 * cols + 4].nutrient = 4;
        tiles[17 * cols + 20].mana = 4;
        for (const [x, y] of [
          [4, 6],
          [20, 6],
          [8, 10],
          [18, 11],
          [5, 15],
          [21, 16],
        ] as const) {
          tiles[y * cols + x].hardness = 2;
        }
      },
    );
  }
  const cols = 28;
  const rows = 20;
  const tiles = makeBlank(cols, rows);
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const t = tiles[y * cols + x];
      if (x <= 14) {
        t.nutrient = y < 5 ? 1 : y < 9 ? 2 : y < 13 ? 3 : 4;
        t.mana = (x + y) % 7 === 0 ? 1 : 0;
      } else {
        t.mana = y < 5 ? 1 : y < 9 ? 2 : y < 13 ? 3 : 4;
        t.nutrient = (x + y) % 7 === 0 ? 1 : 0;
      }
      if ((x + y) % 11 === 0 && x !== 7) t.hardness = 2;
    }
  }
  carveEntrance(tiles, cols, 13);
  return {
    cols,
    rows,
    tiles,
    entrance: { x: 13, y: 1 },
    dig: 300,
    name: "The Chamber",
    endless: true,
    prep: 0,
    eco: 0,
    waves: [],
  };
}

export function installGrid(sim: Sim) {
  function tileAt(x: number, y: number): Tile | null {
      if (x < 0 || y < 0 || x >= sim.cols || y >= sim.rows)
          return null;
      return sim.tiles[y * sim.cols + x];
  }
  sim.tileAt = tileAt;
  function isOpen(x: number, y: number) {
      const t = sim.tileAt(x, y);
      return !!t && (t.kind === "dug" || t.kind === "entrance");
  }
  sim.isOpen = isOpen;
  function nearOpen(x: number, y: number) {
      for (let d = 0; d < 4; d++)
          if (sim.isOpen(x + DX[d], y + DY[d]))
              return true;
      return false;
  }
  sim.nearOpen = nearOpen;
  function actorAt(x: number, y: number, except?: number): Actor | null {
      for (const a of sim.actors) {
          if (!a.alive || a.id === except)
              continue;
          if (a.x === x && a.y === y)
              return a;
      }
      return null;
  }
  sim.actorAt = actorAt;
  function freeNeighbor(x: number, y: number): {
      x: number;
      y: number;
  } | null {
      const opts: {
          x: number;
          y: number;
      }[] = [];
      for (let d = 0; d < 4; d++) {
          const nx = x + DX[d];
          const ny = y + DY[d];
          if (sim.isOpen(nx, ny) && !sim.actorAt(nx, ny))
              opts.push({ x: nx, y: ny });
      }
      if (!opts.length)
          return null;
      return opts[Math.floor(sim.rng() * opts.length)];
  }
  sim.freeNeighbor = freeNeighbor;
  function openNeighbors(x: number, y: number) {
      let n = 0;
      for (let d = 0; d < 4; d++)
          if (sim.isOpen(x + DX[d], y + DY[d]))
              n++;
      return n;
  }
  sim.openNeighbors = openNeighbors;
  function moveTo(a: Actor, x: number, y: number) {
      if (x > a.x)
          a.face = 1;
      else if (x < a.x)
          a.face = -1;
      if (x === a.x + 1)
          a.dir = 1;
      else if (x === a.x - 1)
          a.dir = 3;
      else if (y === a.y - 1)
          a.dir = 0;
      else if (y === a.y + 1)
          a.dir = 2;
      a.x = x;
      a.y = y;
      if (a.kind === "monster" && a.species !== "skeleton" && !sim.calmNow() && sim.rng() < 0.12)
          sim.taxTile(x, y);
  }
  sim.moveTo = moveTo;
  function los(ax: number, ay: number, bx: number, by: number, max: number) {
      if (ax !== bx && ay !== by)
          return false;
      const dist = Math.abs(bx - ax) + Math.abs(by - ay);
      if (dist <= 0 || dist > max)
          return false;
      const sx = ax === bx ? 0 : bx > ax ? 1 : -1;
      const sy = ay === by ? 0 : by > ay ? 1 : -1;
      for (let i = 1; i < dist; i++) {
          const x = ax + sx * i;
          const y = ay + sy * i;
          if (!sim.isOpen(x, y))
              return false;
          if (sim.actorAt(x, y))
              return false;
      }
      return true;
  }
  sim.los = los;
  function sameRoom(ax: number, ay: number, bx: number, by: number, cap = 4) {
      if (Math.abs(ax - bx) + Math.abs(ay - by) > cap)
          return false;
      const dist = new Int32Array(sim.cols * sim.rows);
      dist.fill(-1);
      const q = [ay * sim.cols + ax];
      dist[ay * sim.cols + ax] = 0;
      let head = 0;
      while (head < q.length) {
          const cur = q[head++];
          if (cur === by * sim.cols + bx)
              return true;
          const d0 = dist[cur];
          if (d0 >= cap)
              continue;
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
      return false;
  }
  sim.sameRoom = sameRoom;
  function noteGrid() {
      sim.gridStamp += 1;
      for (const bag of sim.heroIntel.values()) {
          for (let i = 0; i < bag.dead.length; i++) {
              if (!bag.dead[i])
                  continue;
              const x = i % sim.cols;
              const y = (i / sim.cols) | 0;
              if (sim.openNeighbors(x, y) > 1)
                  bag.dead[i] = 0;
          }
      }
  }
  sim.noteGrid = noteGrid;
  function canStep(a: Actor, x: number, y: number) {
      if (!sim.isOpen(x, y))
          return false;
      const occ = sim.actorAt(x, y, a.id);
      if (!occ)
          return true;
      if (a.kind === "monster" && sim.isPrey(a, occ))
          return true;
      return false;
  }
  sim.canStep = canStep;
  function standBeside(wx: number, wy: number, ax: number, ay: number): {
      x: number;
      y: number;
  } | null {
      let best: {
          x: number;
          y: number;
      } | null = null;
      let bestD = 1e9;
      for (let d = 0; d < 4; d++) {
          const x = wx + DX[d];
          const y = wy + DY[d];
          if (!sim.isOpen(x, y))
              continue;
          const dist = Math.abs(x - ax) + Math.abs(y - ay);
          if (dist < bestD) {
              bestD = dist;
              best = { x, y };
          }
      }
      return best;
  }
  sim.standBeside = standBeside;
}
