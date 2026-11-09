import { nutrientBand, type Actor, type Match, type Species, type Variant } from "@/game/engine";

const INK = "#140e0a";
const ROCK = "#1c120e";
const ROCK_B = "#2a1a14";
const SOIL = ["#4a3024", "#553728", "#3f291e", "#62402e"];
const SOIL_HI = "#7a5340";
const FLOOR = "#8d734c";
const FLOOR_B = "#756038";
const FLOOR_DK = "#5e4a2e";
const MOSS = "#6fbf4a";
const MOSS_D = "#2c6b30";
const GRUB = "#e2b04a";
const GRUB_D = "#8a5a16";
const SCALE = "#e07a3d";
const SCALE_D = "#8a3a18";
const WISP = "#d5f4f8";
const WISP_D = "#3e8b9c";
const HEX = "#e389a4";
const HEX_D = "#7a3050";
const DRAKE = "#d25038";
const DRAKE_D = "#6a2418";
const PAPER = "#f3e6c8";
const EMBER = "#e25b3a";
const GOLD = "#f0d060";
const STEEL = "#c5d0d6";
const MANA = "#7ec8d4";
const BUD = "#d6e27a";
const BUD_D = "#6a7a28";
const VAMP = "#b45678";
const VAMP_D = "#5c243c";
const SUCC = "#f0b6d4";
const SUCC_D = "#8a4a6a";
const NIMB = "#f7f3c0";
const NIMB_D = "#8a8460";

export interface GridLayout {
  tile: number;
  ox: number;
  oy: number;
}

export interface Camera {
  zoom: number;
  panX: number;
  panY: number;
}

/** Zoom 1 shows about 12×9 tiles. Scale changes only when the caller pinches. */
export function baseTileSize(viewW: number, viewH: number): number {
  return Math.max(18, Math.floor(Math.min(viewW / 12, viewH / 9)));
}

export function clampCamera(cam: Camera, viewW: number, viewH: number, cols: number, rows: number) {
  const tile = baseTileSize(viewW, viewH) * cam.zoom;
  const mapW = cols * tile;
  const mapH = rows * tile;
  const margin = tile * 1.5;
  const minX = Math.min(margin, viewW - margin) - mapW;
  const maxX = viewW - margin;
  const minY = Math.min(margin, viewH - margin) - mapH;
  const maxY = viewH - margin;
  cam.panX = Math.max(minX, Math.min(maxX, cam.panX));
  cam.panY = Math.max(minY, Math.min(maxY, cam.panY));
}

function hash(x: number, y: number) {
  return (x * 17 + y * 31 + x * y) & 3;
}

function blit(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  scale: number,
  rows: string[],
  pal: Record<string, string>,
  flip: boolean,
) {
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  const ox = Math.round(px - (w * scale) / 2);
  const oy = Math.round(py - (h * scale) / 2);
  for (let j = 0; j < h; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      const ch = row[flip ? row.length - 1 - i : i];
      const col = pal[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(ox + i * scale, oy + j * scale, scale, scale);
    }
  }
}

const SPRITES: Record<string, string[]> = {
  moss: [
    "...ggggg..",
    "..gGGGGGg.",
    ".gGGwwGGGg",
    ".gGGbwbGGg",
    ".gGGGGGGGg",
    "..ggggggg.",
    "...g...g..",
  ],
  crawler: [
    ".a.a.a.a..",
    "aYYYYYYYYa",
    ".YYwwwwYY.",
    "aYYYbYbYYa",
    ".YYYYYYYY.",
    "aYYa..aYYa",
    ".a......a.",
  ],
  lizard: [
    "t..llll...",
    "tt.lLLLl..",
    "t.lLwwLLl.",
    ".lLLbLLL..",
    "..lLLLLl..",
    ".lL.lL.lL.",
    "..l....l..",
  ],
  spirit: [
    "....ss....",
    "...sSSs...",
    "..sSwwSs..",
    "..sSb.bS..",
    "...sSSSs..",
    "....sSs...",
    ".....s....",
  ],
  witch: [
    "h.....h...",
    ".h.hHH.h..",
    "..hHHHHh..",
    ".hHwwHHh..",
    "hHHbwbHH..",
    ".hHHHHHh..",
    "..hH..Hh..",
  ],
  drake: [
    "..ddddddt.",
    ".dDDDDDDtt",
    "dDDwwDDDd.",
    ".DDDbDDD..",
    "dDDDDDDD..",
    "d.dD.Dd.d.",
    ".d.....dd.",
  ],
  bud: [
    "y.......y.",
    ".y.gGg.y..",
    "..gGGGgg..",
    ".gGwwGGg..",
    ".gGYbYGg..",
    "..gGGGgg..",
    "...g..g...",
  ],
  vampire: [
    "rrvvvvvrr.",
    "r.vVVVv.r.",
    ".rvVwwVv.r",
    ".vVVb.bVv.",
    ".rvVVVVv.r",
    "rr.vVVv.rr",
    "r.......r.",
  ],
  succubus: [
    "u..u..u...",
    ".uUUuUu...",
    "..UwwUu.t.",
    ".uUb.bUu..",
    "..UUUUUu..",
    "...u..u...",
    "..u....u..",
  ],
  nimbus: [
    ".nnn.nnn.",
    "nnNNNNNNn",
    "nNNwwNNNn",
    ".nNNb.NNn",
    "nnNNNNNNn",
    ".nnn.nnn.",
    ".........",
  ],
  egg: [
    "..eeee..",
    ".eEEEEe.",
    "eEEwEEe.",
    "eEEEEe..",
    ".eEEEe..",
    "..eee...",
  ],
  pupa: [
    "..ppppp..",
    ".pPPPPPp.",
    "pPPwPPPp.",
    ".pPPPPPp.",
    "..pPPPp..",
    "...ppp...",
  ],
  overlord: [
    "...ccc...",
    "..cCCCc..",
    "..kKKKk..",
    ".kKwwKKk.",
    "kKKbwbKK.",
    ".kKKKKKk.",
    "rRRRRRRRr",
    ".rRRRRRr.",
  ],
  swordsman: [
    "..hhhhh.s",
    ".hHHHHHss",
    "hHHwwHHs.",
    "hHHb.bHs.",
    ".aAAAAa..",
    "..aAaAa..",
    "...a.a...",
  ],
  archer: [
    "..ggggg.q",
    ".gGGGGGqq",
    "gGGwwGGq.",
    "gGGb.bGq.",
    ".aAAAAa..",
    "..a...a..",
    "...a.a...",
  ],
  priest: [
    "...x......",
    "..wwwww...",
    ".wWWWWw...",
    "wWWwwWWw..",
    "wWWb.bWw..",
    ".gGGGGg...",
    "..gGgGg...",
    "...g.g....",
  ],
  thief: [
    "..kkkkk..",
    ".kKKKKKk.",
    "kKKwwKKk.",
    "kKKb.bKk.",
    ".aAAAAa..",
    "..a...a..",
    "...a.a...",
  ],
  knight: [
    "..kkkkk..",
    ".kKKKKKk.",
    "kKKwwKKk.",
    "kKKb.bKk.",
    ".rRRRRr..",
    "..rRrRr..",
    "...r.r...",
  ],
  mage: [
    "...sss.t.",
    "..sSSSstt",
    ".sSwwSSt.",
    "sSSb.bSt.",
    ".mMMMMm..",
    "..mMmMm..",
    "...m.m...",
  ],
  skeleton: [
    "..bBBBb...",
    ".bBwwBBb..",
    ".bBb.bBb..",
    "..bBBBBb..",
    ".bB.B.Bb..",
    "..bB.Bb...",
    ".bB...Bb..",
  ],
  corpse: [
    "..........",
    "..........",
    "...hhhhh..",
    "..hHHHHHh.",
    ".hHHb.bHh.",
    "..aaaaaaa.",
    "..........",
  ],
  champion: [
    "..ggggg..",
    ".gGGGGGg.",
    "gGGwwGGg.",
    "gGGb.bGg.",
    ".rRRRRr..",
    "..rRrRr..",
    "...r.r...",
  ],
};

function palette(kind: string, variant: Variant): Record<string, string> {
  if (kind === "moss") return { g: MOSS_D, G: MOSS, w: PAPER, b: INK };
  if (kind === "crawler") return { a: "#6e675c", Y: "#f7f1e4", w: "#1a120c", b: INK };
  if (kind === "lizard") return { l: SCALE_D, L: SCALE, w: PAPER, b: INK, t: "#e7d3a4" };
  if (kind === "spirit") return { s: WISP_D, S: WISP, w: PAPER, b: INK };
  if (kind === "witch") return { h: HEX_D, H: HEX, w: PAPER, b: INK, s: GOLD };
  if (kind === "drake") return { d: DRAKE_D, D: DRAKE, w: PAPER, b: INK, t: GOLD, w2: GOLD };
  if (kind === "bud") return { g: MOSS_D, G: MOSS, y: BUD_D, Y: BUD, w: PAPER, b: INK };
  if (kind === "vampire") return { v: VAMP_D, V: VAMP, w: PAPER, b: INK, r: DRAKE };
  if (kind === "succubus") return { u: SUCC_D, U: SUCC, w: PAPER, b: INK, t: GOLD };
  if (kind === "nimbus") return { n: NIMB_D, N: NIMB, w: PAPER, b: INK, B: "#fff6c8" };
  if (kind === "egg") return { e: variant === "breed" ? GOLD : PAPER, E: variant === "deformed" ? "#c6d64a" : "#e7d3a4", w: INK };
  if (kind === "pupa") return { p: GRUB_D, P: variant === "deformed" ? "#c6d64a" : GRUB, w: PAPER };
  if (kind === "overlord") return { c: "#d7c4ef", C: "#8d6cb5", k: "#241628", K: "#4c3268", w: PAPER, b: INK, r: "#3a2458", R: "#6a4494" };
  if (kind === "knight") return { k: "#8d3a32", K: EMBER, w: PAPER, b: INK, r: "#5c2018", R: "#a84838" };
  if (kind === "mage") return { s: WISP_D, S: WISP, w: PAPER, b: INK, m: "#245e6a", M: MANA, t: GOLD };
  if (kind === "archer") return { g: MOSS_D, G: MOSS, w: PAPER, b: INK, a: "#3e4650", A: "#8aa0aa", q: "#c4a574" };
  if (kind === "priest") return { w: "#efe6cf", W: PAPER, b: INK, g: "#8a6a20", G: GOLD, x: GOLD };
  if (kind === "thief") return { k: "#2a2430", K: "#5c4a68", w: PAPER, b: INK, a: "#3e4650", A: "#8aa0aa" };
  if (kind === "champion") return { g: "#8a6a20", G: GOLD, w: PAPER, b: INK, r: "#5c2018", R: EMBER };
  if (kind === "skeleton") return { b: "#8d8374", B: "#f4efe2", w: "#1a120c" };
  if (kind === "corpse") return { h: "#5e6a72", H: "#8a949c", w: PAPER, b: INK, a: "#3a2a22" };
  if (kind === "swordsman") return { h: "#5e6a72", H: STEEL, w: PAPER, b: INK, a: "#3e4650", A: "#8aa0aa", s: "#d5dde4" };
  return { h: "#5e6a72", H: STEEL, w: PAPER, b: INK, a: "#3e4650", A: "#8aa0aa" };
}

function spriteKey(a: Actor): string {
  if (a.kind === "overlord") return "overlord";
  if (a.kind === "hero") return a.name === "Legend" ? "champion" : (a.heroClass ?? "swordsman");
  if (a.form === "egg") return "egg";
  if (a.form === "pupa") return "pupa";
  return a.species ?? "moss";
}

function soilStep(v: number) {
  if (v <= 3) return 0;
  if (v <= 6) return 1;
  if (v <= 9) return 2;
  if (v <= 16) return 3;
  if (v <= 23) return 4;
  if (v <= 29) return 5;
  if (v <= 37) return 6;
  if (v <= 45) return 7;
  if (v <= 54) return 8;
  if (v <= 69) return 9;
  if (v <= 89) return 10;
  return 11;
}

function drawSoilFace(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  tile: number,
  nutrient: number,
  mana: number,
  x: number,
  y: number,
  _time: number,
) {
  const n = Math.max(0, nutrient);
  const m = Math.max(0, mana);
  const dominant = m > n ? m : n;
  const step = soilStep(dominant);
  const manaLeads = m > n;
  const dirt = step <= 0 ? "#6a6258" : step === 2 ? "#3e3228" : "#5c4636";
  const dirtHi = step <= 0 ? "#7a736a" : "#6e5644";
  const moss = "#5f7340";
  const mossD = "#3e5228";
  const mote = "#6a5878";
  const moteD = "#4a3c58";
  const ink = "#2a211c";
  ctx.fillStyle = dirt;
  ctx.fillRect(px + 1, py + 1, tile - 2, tile - 2);
  ctx.fillStyle = dirtHi;
  ctx.fillRect(px + 2, py + 2, tile - 4, Math.max(1, Math.floor(tile * 0.08)));

  const speck = Math.max(1, Math.floor(tile * 0.08));
  const spots: [number, number][] = [
    [0.22, 0.28],
    [0.62, 0.22],
    [0.4, 0.48],
    [0.74, 0.58],
    [0.28, 0.72],
    [0.56, 0.76],
  ];
  const paintSpeck = (color: string, i: number, grow = 0) => {
    const [sx, sy] = spots[i % spots.length];
    ctx.fillStyle = color;
    ctx.fillRect(px + tile * sx, py + tile * sy, speck + grow, speck + grow);
  };
  const main = manaLeads ? mote : moss;
  const mainD = manaLeads ? moteD : mossD;

  if (step === 1) {
    paintSpeck(main, (x + y) % 6);
    paintSpeck(dirtHi, (x * 3 + y) % 6);
  }
  if (step === 2) {
    ctx.fillStyle = "#2c241c";
    ctx.fillRect(px + tile * 0.18, py + tile * 0.42, tile * 0.64, Math.max(2, tile * 0.12));
  }
  if (step === 3) {
    const count = 3 + ((x + y) & 1);
    for (let i = 0; i < count; i++) paintSpeck(main, i);
  }
  if (step === 4) {
    ctx.fillStyle = mainD;
    ctx.fillRect(px + tile * 0.22, py + tile * 0.36, tile * 0.56, tile * 0.32);
    paintSpeck(main, 1, 1);
    paintSpeck(main, 4, 1);
  }
  if (step === 5) {
    ctx.strokeStyle = mainD;
    ctx.lineWidth = Math.max(1, tile * 0.06);
    ctx.beginPath();
    ctx.moveTo(px + tile * 0.18, py + tile * 0.3);
    ctx.lineTo(px + tile * 0.48, py + tile * 0.55);
    ctx.lineTo(px + tile * 0.3, py + tile * 0.78);
    ctx.moveTo(px + tile * 0.48, py + tile * 0.55);
    ctx.lineTo(px + tile * 0.8, py + tile * 0.28);
    ctx.stroke();
  }
  if (step === 6) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1, tile * 0.06);
    ctx.strokeRect(px + tile * 0.18, py + tile * 0.18, tile * 0.64, tile * 0.64);
  }
  if (step === 7) {
    ctx.fillStyle = mainD;
    ctx.beginPath();
    ctx.ellipse(px + tile * 0.5, py + tile * 0.52, tile * 0.14, tile * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (step === 8) {
    for (let i = 0; i < 4; i++) paintSpeck(main, i, 1);
  }
  if (step === 9) {
    ctx.fillStyle = mainD;
    for (let i = 0; i < 3; i++) ctx.fillRect(px + tile * 0.18, py + tile * (0.24 + i * 0.22), tile * 0.64, Math.max(2, tile * 0.08));
  }
  if (step === 10) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1, tile * 0.07);
    ctx.beginPath();
    ctx.moveTo(px + tile * 0.2, py + tile * 0.18);
    ctx.lineTo(px + tile * 0.55, py + tile * 0.58);
    ctx.lineTo(px + tile * 0.32, py + tile * 0.84);
    ctx.moveTo(px + tile * 0.55, py + tile * 0.58);
    ctx.lineTo(px + tile * 0.84, py + tile * 0.3);
    ctx.stroke();
  }
  if (step >= 11) {
    ctx.fillStyle = mainD;
    ctx.beginPath();
    ctx.ellipse(px + tile * 0.5, py + tile * 0.5, tile * 0.2, tile * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = Math.max(1, tile * 0.06);
    ctx.strokeRect(px + tile * 0.16, py + tile * 0.16, tile * 0.68, tile * 0.68);
  }
  if (n > 0 && m > 0) {
    const fleck = manaLeads ? moss : mote;
    paintSpeck(fleck, 5);
    paintSpeck(fleck, 2);
  }
}

function drawFloorPlant(ctx: CanvasRenderingContext2D, px: number, py: number, tile: number, cap: boolean) {
  ctx.fillStyle = "#3e5228";
  ctx.fillRect(px + tile * 0.46, py + tile * 0.52, Math.max(2, tile * 0.08), tile * 0.26);
  if (cap) {
    ctx.fillStyle = "#5c4a68";
    ctx.beginPath();
    ctx.ellipse(px + tile * 0.5, py + tile * 0.42, Math.max(3, tile * 0.2), Math.max(2, tile * 0.11), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d7c4ef";
    ctx.fillRect(px + tile * 0.4, py + tile * 0.38, Math.max(1, tile * 0.06), Math.max(1, tile * 0.06));
    ctx.fillRect(px + tile * 0.54, py + tile * 0.4, Math.max(1, tile * 0.05), Math.max(1, tile * 0.05));
    return;
  }
  ctx.fillStyle = "#c45a48";
  const petals: [number, number][] = [
    [0.5, 0.26],
    [0.32, 0.4],
    [0.68, 0.4],
    [0.5, 0.5],
  ];
  for (const [fx, fy] of petals) {
    ctx.beginPath();
    ctx.arc(px + tile * fx, py + tile * fy, Math.max(2, tile * 0.09), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#e6c15a";
  ctx.beginPath();
  ctx.arc(px + tile * 0.5, py + tile * 0.4, Math.max(1.5, tile * 0.05), 0, Math.PI * 2);
  ctx.fill();
}

export function drawGame(ctx: CanvasRenderingContext2D, match: Match, w: number, h: number, cam: Camera): GridLayout {
  const tile = baseTileSize(w, h) * cam.zoom;
  const ox = cam.panX;
  const oy = cam.panY;
  const jx = Math.sin(match.time * 53) * match.shake * tile * 0.18;
  const jy = Math.cos(match.time * 41) * match.shake * tile * 0.18;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(jx, jy);

  const gap = Math.max(1, Math.floor(tile * 0.07));
  for (let y = 0; y < match.rows; y++) {
    for (let x = 0; x < match.cols; x++) {
      const t = match.tiles[y * match.cols + x];
      const px = ox + x * tile;
      const py = oy + y * tile;
      if (px > w + tile || py > h + tile || px + tile < -tile || py + tile < -tile) continue;
      if (t.kind === "bedrock") {
        ctx.fillStyle = (x + y) % 2 === 0 ? ROCK : ROCK_B;
        ctx.fillRect(px, py, tile, tile);
        if ((x * 3 + y) % 5 === 0) {
          ctx.fillStyle = "#120c09";
          ctx.fillRect(px + gap * 2, py + tile * 0.45, Math.max(2, tile * 0.4), 1);
        }
        continue;
      }
      if (t.kind === "soil") {
        drawSoilFace(ctx, px, py, tile, t.nutrient, t.mana, x, y, match.time);
        if (t.hardness > 1) {
          ctx.fillStyle = "#d9cbb0";
          const s = Math.max(2, Math.floor(tile * 0.16));
          ctx.fillRect(px + tile * 0.62, py + tile * 0.55, s, s);
          ctx.fillRect(px + tile * 0.28, py + tile * 0.62, s, s);
        }
      } else {
        ctx.fillStyle = t.kind === "entrance" ? "#6d5738" : FLOOR;
        ctx.fillRect(px + gap, py + gap, tile - gap * 2, tile - gap * 2);
        ctx.fillStyle = FLOOR_DK;
        ctx.fillRect(px + gap, py + tile - gap - 1, tile - gap * 2, 1);
        ctx.fillStyle = FLOOR_B;
        if ((x + y) % 2 === 0) ctx.fillRect(px + tile * 0.35, py + tile * 0.4, Math.max(2, tile * 0.18), 1);
        if (t.kind === "entrance") {
          ctx.fillStyle = PAPER;
          const step = Math.max(1, Math.floor(tile / 7));
          for (let i = 0; i < 4; i++) {
            ctx.fillRect(px + tile * 0.22, py + tile * 0.22 + i * step * 1.5, tile * 0.56, step);
          }
        }
      }

      const showSoil = match.heatmap && t.kind === "soil";
      if (showSoil && (t.nutrient > 0 || t.mana > 0)) {
        const pip = Math.max(2, Math.floor(tile * 0.16));
        const nPips = nutrientBand(t.nutrient) > 0 ? Math.min(3, t.nSub + 1) : 0;
        const mPips = nutrientBand(t.mana) > 0 ? Math.min(3, t.mSub + 1) : 0;
        for (let i = 0; i < nPips; i++) {
          ctx.fillStyle = MOSS;
          ctx.fillRect(px + 3 + i * (pip + 1), py + tile - pip - 4, pip, pip);
        }
        for (let i = 0; i < mPips; i++) {
          ctx.fillStyle = "#3aa0c8";
          ctx.fillRect(px + tile - 3 - pip - i * (pip + 1), py + tile - pip - 4, pip, pip);
        }
        ctx.font = `700 ${Math.max(8, Math.floor(tile * 0.28))}px monospace`;
        ctx.textAlign = "left";
        if (t.nutrient > 0) {
          ctx.fillStyle = MOSS;
          ctx.fillText(String(nutrientBand(t.nutrient)), px + 3, py + Math.max(10, tile * 0.32));
        }
        if (t.mana > 0) {
          ctx.fillStyle = "#7ec8e8";
          ctx.textAlign = "right";
          ctx.fillText(String(nutrientBand(t.mana)), px + tile - 3, py + Math.max(10, tile * 0.32));
          ctx.textAlign = "left";
        }
      }

      if (match.tool === "dig" && t.kind === "soil" && match.digs < 400) {
        let open = false;
        const nbs = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ];
        for (const [dx, dy] of nbs) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= match.cols || ny >= match.rows) continue;
          const nt = match.tiles[ny * match.cols + nx];
          if (nt.kind === "dug" || nt.kind === "entrance") open = true;
        }
        if (open) {
          const pulse = match.digs < 3 ? 0.55 + Math.sin(match.time * 5) * 0.35 : 0.7;
          ctx.strokeStyle = `rgba(111, 191, 74, ${pulse})`;
          ctx.lineWidth = Math.max(1, tile * 0.06);
          const m = Math.max(3, tile * 0.22);
          ctx.strokeRect(px + 2, py + 2, m, m);
          if (t.hardness > 1) {
            ctx.fillStyle = PAPER;
            ctx.font = `${Math.max(9, Math.floor(tile * 0.32))}px monospace`;
            ctx.fillText("2", px + tile * 0.38, py + tile * 0.42);
          }
        }
      }
    }
  }

  const scale = Math.max(1, Math.floor(tile / 11));
  for (const r of match.runes) {
    const px = ox + r.x * tile;
    const py = oy + r.y * tile;
    ctx.save();
    ctx.strokeStyle = "#d7b4ff";
    ctx.lineWidth = Math.max(1, tile * 0.07);
    ctx.strokeRect(px + tile * 0.12, py + tile * 0.12, tile * 1.76, tile * 1.76);
    ctx.fillStyle = "#1a1024";
    ctx.fillRect(px + tile * 0.38, py + tile * 0.42, tile * 0.22, tile * 0.16);
    ctx.fillRect(px + tile * 1.28, py + tile * 0.42, tile * 0.22, tile * 0.16);
    ctx.fillStyle = "#f3e7ff";
    ctx.fillRect(px + tile * 0.44, py + tile * 0.46, tile * 0.08, tile * 0.08);
    ctx.fillRect(px + tile * 1.34, py + tile * 0.46, tile * 0.08, tile * 0.08);
    ctx.strokeStyle = "#e7d4ff";
    ctx.beginPath();
    ctx.moveTo(px + tile * 0.55, py + tile * 1.35);
    ctx.lineTo(px + tile * 0.85, py + tile * 1.52);
    ctx.lineTo(px + tile * 1.45, py + tile * 1.35);
    ctx.stroke();
    ctx.restore();
  }
  for (const n of match.nests) {
    const px = ox + n.x * tile;
    const py = oy + n.y * tile;
    ctx.fillStyle = "#c4a574";
    ctx.fillRect(px + tile * 0.28, py + tile * 0.62, tile * 0.44, Math.max(2, tile * 0.08));
    ctx.fillRect(px + tile * 0.36, py + tile * 0.52, tile * 0.28, Math.max(2, tile * 0.08));
  }
  for (const w of match.webs) {
    const px = ox + w.x * tile;
    const py = oy + w.y * tile;
    ctx.strokeStyle = "rgba(227, 137, 164, 0.75)";
    ctx.lineWidth = Math.max(1, tile * 0.06);
    ctx.beginPath();
    ctx.moveTo(px + tile * 0.2, py + tile * 0.25);
    ctx.lineTo(px + tile * 0.8, py + tile * 0.75);
    ctx.moveTo(px + tile * 0.8, py + tile * 0.25);
    ctx.lineTo(px + tile * 0.2, py + tile * 0.75);
    ctx.moveTo(px + tile * 0.5, py + tile * 0.2);
    ctx.lineTo(px + tile * 0.5, py + tile * 0.8);
    ctx.stroke();
  }
  for (const b of match.blooms) {
    const px = ox + b.x * tile;
    const py = oy + b.y * tile;
    drawFloorPlant(ctx, px, py, tile, b.m > 0 && b.n === 0);
  }
  for (const c of match.corpses) {
    const px = ox + c.x * tile + tile / 2;
    const py = oy + c.y * tile + tile * 0.62;
    const rows = SPRITES.corpse;
    const pal = c.red
      ? { h: "#6a1020", H: "#e23a4a", w: PAPER, b: INK, a: "#3a0810" }
      : palette("corpse", "normal");
    blit(ctx, px, py, scale, rows, pal, false);
    const pipR = Math.max(3, tile * 0.11);
    const px0 = ox + c.x * tile + tile * 0.78;
    const py0 = oy + c.y * tile + tile * 0.22;
    if (c.red) {
      ctx.fillStyle = "#e23a4a";
      ctx.beginPath();
      ctx.arc(px0, py0, pipR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = "#8a8070";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px0, py0, pipR, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  const drawActor = (a: Actor) => {
    const grow =
      (a.species === "drake" ? 1.38 : a.variant === "giant" ? 1.28 : a.form === "egg" ? 0.85 : 1) *
      (1 + Math.min(3, a.tier) * 0.07);
    const carried = a.kind === "overlord" && match.lordState === "carried";
    const sc = Math.max(1, Math.round(scale * grow * (carried ? 0.72 : 1)));
    const bob = a.form === "adult" ? Math.sin(a.bob) * Math.max(0.4, tile * 0.04) : 0;
    const px = ox + a.fx * tile + tile / 2;
    const py = oy + a.fy * tile + tile / 2 + bob - (carried ? tile * 0.38 : 0);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(px, oy + a.fy * tile + tile * 0.78, tile * 0.22 * grow, tile * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    const key = spriteKey(a);
    const rows = SPRITES[key] ?? SPRITES.moss;
    let pal = palette(key, a.variant);
    if (a.species === "skeleton" && a.rattle === 1) pal = { ...pal, B: "#d5f4f8", b: "#3e8b9c" };
    if (a.species === "skeleton" && a.rattle === 2) pal = { ...pal, B: "#e7d3a4", b: "#8a6a32" };
    if (a.species === "skeleton" && a.rattle === 3) pal = { ...pal, B: "#e23a4a", b: "#6a1020" };
    blit(ctx, px, py, sc, rows, pal, a.face < 0);
    if (a.form === "fly") {
      ctx.fillStyle = "#f0e2a0";
      ctx.fillRect(px - tile * 0.28, py - tile * 0.02, Math.max(2, tile * 0.16), Math.max(2, tile * 0.08));
      ctx.fillRect(px + tile * 0.12, py - tile * 0.02, Math.max(2, tile * 0.16), Math.max(2, tile * 0.08));
    }
    if (a.species === "moss" && a.brood === "bud") {
      ctx.fillStyle = MOSS_D;
      ctx.beginPath();
      ctx.ellipse(px, py + tile * 0.08, tile * 0.2, tile * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (a.species === "moss" && a.brood === "bloom") {
      ctx.fillStyle = "#d45848";
      ctx.beginPath();
      ctx.arc(px, py - tile * 0.12, Math.max(3, tile * 0.16), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = BUD;
      ctx.beginPath();
      ctx.arc(px, py - tile * 0.12, Math.max(2, tile * 0.06), 0, Math.PI * 2);
      ctx.fill();
    }
    if (match.heatmap && a.kind === "monster" && (a.form === "adult" || a.form === "fly")) {
      ctx.fillStyle = PAPER;
      ctx.font = `700 ${Math.max(8, Math.floor(tile * 0.28))}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText(String(a.tier), px - tile * 0.42, py - tile * 0.34);
    }
    if (a.variant === "deformed") {
      ctx.fillStyle = "#d6e25a";
      ctx.fillRect(px + tile * 0.12, py - tile * 0.12, Math.max(2, sc), Math.max(2, sc));
    }
    if (a.variant === "breed") {
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1;
      ctx.strokeRect(px - tile * 0.28, py - tile * 0.34, tile * 0.56, tile * 0.62);
    }
    if (a.windup > 0 && a.kind === "hero") {
      const dx = a.dir === 1 ? 1 : a.dir === 3 ? -1 : 0;
      const dy = a.dir === 0 ? -1 : a.dir === 2 ? 1 : 0;
      ctx.strokeStyle = "rgba(226, 91, 58, 0.9)";
      ctx.lineWidth = Math.max(1, tile * 0.08);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + dx * tile * 0.7, py + dy * tile * 0.7);
      ctx.stroke();
    }
    if (a.shield > 0) {
      ctx.fillStyle = STEEL;
      ctx.fillRect(px - tile * 0.28, py - tile * 0.05, Math.max(2, tile * 0.1), tile * 0.28);
    }
    if (a.sleep > 0 || a.form === "pupa") {
      ctx.fillStyle = PAPER;
      ctx.font = `${Math.max(8, Math.floor(tile * 0.28))}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText("Zzz", px + tile * 0.16, py - tile * 0.3);
    }
    if (a.hitFlash > 0) {
      ctx.fillStyle = `rgba(255,244,220,${Math.min(0.7, a.hitFlash * 4)})`;
      ctx.fillRect(px - tile * 0.22, py - tile * 0.28, tile * 0.44, tile * 0.5);
    }
    if (a.hp < a.maxHp && a.form !== "egg") {
      const bw = tile * 0.62;
      const bh = Math.max(2, tile * 0.08);
      const bx = px - bw / 2;
      const by = oy + a.fy * tile + 2;
      ctx.fillStyle = INK;
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = a.kind === "hero" ? EMBER : a.kind === "overlord" ? GOLD : MOSS;
      ctx.fillRect(bx, by, bw * Math.max(0, a.hp / a.maxHp), bh);
    }
  };

  const ordered = match.actors.slice().sort((a, b) => a.fy - b.fy || a.x - b.x);
  for (const a of ordered) drawActor(a);

  for (const p of match.particles) {
    const alpha = Math.max(0, p.life / p.max);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(ox + p.x * tile, oy + p.y * tile, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  for (const f of match.floaters) {
    ctx.globalAlpha = Math.max(0, f.life / f.max);
    ctx.fillStyle = f.color;
    ctx.font = `700 ${Math.max(10, Math.floor(tile * 0.36))}px monospace`;
    ctx.textAlign = "center";
    ctx.fillText(f.text, ox + f.x * tile, oy + f.y * tile);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "left";
  ctx.restore();
  return { tile, ox, oy };
}

export function speciesColor(id: Species): string {
  if (id === "moss" || id === "bud") return id === "bud" ? BUD : MOSS;
  if (id === "crawler") return GRUB;
  if (id === "lizard") return SCALE;
  if (id === "spirit" || id === "nimbus") return id === "nimbus" ? NIMB : MANA;
  if (id === "witch" || id === "succubus") return id === "succubus" ? SUCC : HEX;
  if (id === "vampire") return VAMP;
  if (id === "skeleton") return "#efe6d2";
  return DRAKE;
}

export function paintGuideIcon(ctx: CanvasRenderingContext2D, id: string, size: number) {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, size, size);
  if (id === "wall" || id === "heat") {
    drawSoilFace(ctx, 0, 0, size, 18, 0, 2, 3, 0);
    if (id === "heat") {
      ctx.fillStyle = MOSS;
      ctx.fillRect(3, size - 7, 3, 3);
      ctx.fillRect(8, size - 7, 3, 3);
      ctx.fillStyle = PAPER;
      ctx.font = `700 ${Math.max(8, Math.floor(size * 0.38))}px monospace`;
      ctx.textAlign = "left";
      ctx.fillText("1", 3, Math.max(10, size * 0.38));
    }
    return;
  }
  if (id === "wiltbloom" || id === "flower") {
    drawFloorPlant(ctx, 0, 0, size, false);
    return;
  }
  if (id === "mushroom" || id === "cap") {
    drawFloorPlant(ctx, 0, 0, size, true);
    return;
  }
  if (id === "nest") {
    ctx.fillStyle = "#c4a574";
    ctx.fillRect(size * 0.22, size * 0.62, size * 0.56, Math.max(2, size * 0.1));
    ctx.fillRect(size * 0.32, size * 0.48, size * 0.36, Math.max(2, size * 0.1));
    return;
  }
  if (id === "web") {
    ctx.strokeStyle = "rgba(227, 137, 164, 0.9)";
    ctx.lineWidth = Math.max(1, size * 0.06);
    ctx.beginPath();
    ctx.moveTo(size * 0.2, size * 0.25);
    ctx.lineTo(size * 0.8, size * 0.75);
    ctx.moveTo(size * 0.8, size * 0.25);
    ctx.lineTo(size * 0.2, size * 0.75);
    ctx.moveTo(size * 0.5, size * 0.2);
    ctx.lineTo(size * 0.5, size * 0.8);
    ctx.stroke();
    return;
  }
  if (id === "pick") {
    ctx.fillStyle = "#c4a574";
    ctx.fillRect(size * 0.46, size * 0.28, Math.max(2, size * 0.08), size * 0.5);
    ctx.fillStyle = STEEL;
    ctx.fillRect(size * 0.28, size * 0.18, size * 0.44, Math.max(3, size * 0.12));
    return;
  }
  const key = id === "warden" ? "overlord" : id === "fly" || id === "loambud" ? "moss" : id === "legendary" ? "champion" : (id.split(":")[0] ?? "moss");
  const sprite = id === "fly" ? "crawler" : key === "moss" && id === "loambud" ? "moss" : key;
  const rows = SPRITES[sprite] ?? SPRITES.moss;
  const pal = palette(sprite, "normal");
  const scale = Math.max(1, Math.floor(size / ((rows[0]?.length ?? 8) + 1)));
  blit(ctx, size / 2, size / 2 + 1, scale, rows, pal, false);
  if (id === "fly") {
    ctx.fillStyle = "#f0e2a0";
    ctx.fillRect(size * 0.18, size * 0.42, Math.max(2, size * 0.16), Math.max(2, size * 0.08));
    ctx.fillRect(size * 0.64, size * 0.42, Math.max(2, size * 0.16), Math.max(2, size * 0.08));
  }
  if (id === "loambud") {
    ctx.fillStyle = MOSS_D;
    ctx.beginPath();
    ctx.ellipse(size * 0.5, size * 0.62, size * 0.2, size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
