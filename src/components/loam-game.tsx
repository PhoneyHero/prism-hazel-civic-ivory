import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import {
  BookOpen,
  Crown,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Shovel,
  Skull,
  Swords,
  Volume2,
  VolumeX,
} from "lucide-react";
import { createSfx, type Sfx } from "@/game/audio";
import { drawGame, baseTileSize, clampCamera, paintGuideIcon, type Camera, type GridLayout } from "@/game/draw";
import {
  STAGE_META,
  LOAM_VERSION,
  LOAM_VERSION_NAME,
  createMatch,
  loadSave,
  type Hud,
  type Match,
  type Save,
  type Species,
  type StageId,
  type Tool,
} from "@/game/engine";

const CHIP: Record<Species, string> = {
  moss: "text-primary",
  crawler: "text-grub",
  lizard: "text-scale",
  bud: "text-bud",
  drake: "text-accent",
  spirit: "text-wisp",
  witch: "text-hex",
  vampire: "text-vamp",
  succubus: "text-succ",
  nimbus: "text-nimbus",
  skeleton: "text-fg",
};

const GUIDE: { icon: string; name: string; role: string; stats: string; life: string; mutate?: string }[] = [
  {
    icon: "moss",
    name: "Loamite",
    role: "Hauls nutrient. Shop L1 body.",
    stats: "HP 10 · ATK 2",
    life: "A 10–29 nutrient wall. Eats nothing. Eaten by Gnawlings and Scalekin.",
    mutate: "Abnormal Loamite · Giant Loamite · Rare Loamite",
  },
  {
    icon: "loambud",
    name: "Bud",
    role: "Rooted. Does not walk.",
    stats: "HP 10 · ATK 2",
    life: "A Loamite whose vitality runs out. It drinks and stays put.",
  },
  {
    icon: "wiltbloom",
    name: "Wiltbloom",
    role: "Floor flower. Not a walker.",
    stats: "HP — · ATK —",
    life: "Old age or hunger with a belly. Anything may walk the cell. Left 6s: belly 11+ hatches 4, else 3. Smash or stomp hatches 2. No wall splash.",
  },
  {
    icon: "crawler",
    name: "Gnawling",
    role: "Hunts the small. Shop L1 body.",
    stats: "HP 16 · ATK 4",
    life: "A 30–54 nutrient wall. Eats Loamites. Eaten by Scalekin.",
    mutate: "Abnormal Gnawling · Giant Gnawling · Rare Gnawling",
  },
  {
    icon: "pupa",
    name: "Cocoon",
    role: "Still. One state.",
    stats: "HP — · ATK 0",
    life: "A Gnawling with 45 belly in a dead end. Eaten where it sits.",
  },
  {
    icon: "fly",
    name: "Fly",
    role: "The Gnawling after the cocoon.",
    stats: "HP 16 · ATK 4",
    life: "Hatches from a cocoon. At 60 belly it spends 15 to lay an egg of 30.",
  },
  {
    icon: "lizard",
    name: "Scalekin",
    role: "Claims a nest. Shop L1 body.",
    stats: "HP 28 · ATK 6",
    life: "A 55+ nutrient wall. Eats Loamites and Gnawlings. Sleeps, or lays one egg on the nest tile.",
    mutate: "Abnormal Scalekin · Giant Scalekin · Rare Scalekin",
  },
  {
    icon: "nest",
    name: "Nest",
    role: "A claimed 2×3.",
    stats: "HP — · ATK —",
    life: "Costs 10 nutrient. A new nest cannot touch another. One egg, then she waits.",
  },
  {
    icon: "egg",
    name: "Egg",
    role: "Unhatched. Counts as alive.",
    stats: "HP 8 · ATK 0",
    life: "Laid by a Fly, a Scalekin, or a Wyrm. Hatches into that line.",
  },
  {
    icon: "spirit",
    name: "Wisp",
    role: "Mana mote. Shop L1 body.",
    stats: "HP 8 · ATK 1",
    life: "A 10–29 mana wall. Eaten whole. Five on Remains turn the pile red.",
  },
  {
    icon: "cap",
    name: "Mana-cap",
    role: "Floor mushroom. Not a walker.",
    stats: "HP — · ATK —",
    life: "A Wisp's old age. Left 6s, or smashed, it hatches 2 Wisps.",
  },
  {
    icon: "witch",
    name: "Hexwife",
    role: "Webs or splits. Shop L1 body.",
    stats: "HP 36 · ATK 5",
    life: "A 30–54 mana wall. Eats Wisps. Under three of the line she splits. At three she spends mana on a web.",
    mutate: "Abnormal Hexwife · Giant Hexwife · Rare Hexwife",
  },
  {
    icon: "web",
    name: "Web",
    role: "A stuck floor.",
    stats: "HP — · ATK —",
    life: "A Hexwife line of three or more spends 12 mana. Eight webs is the cap.",
  },
  {
    icon: "drake",
    name: "Wyrm",
    role: "One hall each. Shop L1 body.",
    stats: "HP 50 · ATK 11",
    life: "A 55+ mana wall. Eats the mana line. At 90 belly it lays. It does not share a hall.",
  },
  {
    icon: "bud",
    name: "Horned One",
    role: "Holds a room. Does not eat.",
    stats: "HP 45 · ATK 3",
    life: "An isolated 2×2 of mana walls, each 30 or more. The pick spends the dig. Allies in the room gain defense.",
  },
  {
    icon: "skeleton",
    name: "Rattle",
    role: "Raised once.",
    stats: "HP 34 · ATK 6",
    life: "Pick on Remains. No splash. When it dies or the fire ends, that pile is gone. Four may walk.",
  },
  {
    icon: "corpse",
    name: "Remains",
    role: "Bones, not soil.",
    stats: "HP — · ATK —",
    life: "A dead hero. Never bleeds into the walls. Five Wisps turn it red. One raise only.",
  },
  {
    icon: "warden",
    name: "Warden",
    role: "The throne. Not a hero.",
    stats: "HP 34 · ATK 5",
    life: "Seated by the Warden tool. You lose only if a hero carries it onto the stair.",
  },
  {
    icon: "knight",
    name: "Knight",
    role: "The heavy sword.",
    stats: "HP 190 · ATK 24 · DEF 3",
    life: "Comes down the stair. Steps, swings, and skills spend stamina.",
  },
  {
    icon: "swordsman",
    name: "Warrior",
    role: "The sword in the early waves.",
    stats: "HP 126 · ATK 19 · DEF 1",
    life: "A swordsman. Same stamina rules as every other hero.",
  },
  {
    icon: "mage",
    name: "Mage",
    role: "Casts down a hall.",
    stats: "HP 108 · ATK 13 · DEF 4",
    life: "A skill paints mana into the walls.",
  },
  {
    icon: "archer",
    name: "Archer",
    role: "Shoots farther.",
    stats: "HP 104 · ATK 18 · DEF 4",
    life: "Reaches four tiles. A shot still spends stamina.",
  },
  {
    icon: "legendary",
    name: "Legendary",
    role: "Wave 7, alone.",
    stats: "HP 518 · ATK 40 · DEF 3",
    life: "Only on a seven-wave stage. About three times a last-wave knight's health and twice the attack. Same stamina, same splash. Can clear a thin chain.",
  },
];

function GuideRow({ row }: { row: (typeof GUIDE)[number] }) {
  return (
    <li className="flex gap-3">
      <GuideIcon id={row.icon} />
      <div className="min-w-0">
        <h3 className="font-display text-base text-fg">{row.name}</h3>
        <p className="text-sm text-muted">{row.role}</p>
        <p className="text-sm text-grub">{row.stats}</p>
        <p className="text-sm leading-relaxed text-muted">{row.life}</p>
        {row.mutate ? <p className="text-sm text-fg">{row.mutate}</p> : null}
      </div>
    </li>
  );
}

function GuideIcon({ id }: { id: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paintGuideIcon(ctx, id, canvas.width);
  }, [id]);
  return <canvas ref={ref} width={32} height={32} className="size-8 shrink-0" aria-hidden />;
}

function wardenLabel(h: Hud | null) {
  if (!h || h.lordState === "none") return "UNCLAIMED";
  if (h.lordState === "carried") return "CARRIED";
  if (h.lordState === "dropped") return "DROPPED";
  if (h.lordLeft <= 0 && h.phase === "play" && !h.eco && (h.waveNum > 0 || h.raidActive)) return "LOCKED";
  return "SEATED";
}

function fmt(sec: number) {
  const s = Math.max(0, Math.ceil(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

function fmtClock(sec: number) {
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.4;

type Screen = "title" | "how" | "play";

export function LoamGame() {
  const [screen, setScreen] = useState<Screen>("title");
  const [save, setSave] = useState<Save | null>(null);
  const [hud, setHud] = useState<Hud | null>(null);
  const [book, setBook] = useState(false);
  const [run, setRun] = useState(0);
  const matchRef = useRef<Match | null>(null);
  const sfxRef = useRef<Sfx | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const layoutRef = useRef<GridLayout>({ tile: 8, ox: 0, oy: 0 });
  const camRef = useRef<Camera>({ zoom: 1, panX: 0, panY: 0 });
  const camReady = useRef(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({ pinch: false, moved: 0, lastX: 0, lastY: 0, lastDist: 1 });
  const bookPaused = useRef(false);
  const bookRef = useRef(false);
  bookRef.current = book;

  useEffect(() => {
    setSave(loadSave());
  }, [screen, run]);

  useEffect(() => {
    const m = matchRef.current;
    const canvas = canvasRef.current;
    if (!m || !canvas || screen !== "play") return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const unsub = m.subscribe(() => setHud(m.hud()));
    setHud(m.hud());

    const paint = () => {
      const ctx = canvas.getContext("2d");
      const parent = canvas.parentElement;
      if (!ctx || !parent) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const bw = Math.max(1, Math.round(w * dpr));
      const bh = Math.max(1, Math.round(h * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!camReady.current && w >= 64 && h >= 64) {
        const tile = baseTileSize(w, h);
        let ex = Math.floor(m.cols / 2);
        let ey = 1;
        for (let i = 0; i < m.tiles.length; i++) {
          if (m.tiles[i].kind === "entrance") {
            ex = i % m.cols;
            ey = Math.floor(i / m.cols);
            break;
          }
        }
        camRef.current.zoom = 1;
        camRef.current.panX = w / 2 - (ex + 0.5) * tile;
        camRef.current.panY = h * 0.22 - (ey + 0.5) * tile;
        clampCamera(camRef.current, w, h, m.cols, m.rows);
        camReady.current = true;
      }
      const focus = m.focus;
      if (focus && m.time < focus.until && w >= 64 && h >= 64) {
        const tile = baseTileSize(w, h) * camRef.current.zoom;
        camRef.current.panX = w / 2 - (focus.x + 0.5) * tile;
        camRef.current.panY = h / 2 - (focus.y + 0.5) * tile;
        clampCamera(camRef.current, w, h, m.cols, m.rows);
      }
      layoutRef.current = drawGame(ctx, m, w, h, camRef.current);
    };

    const frame = (now: number) => {
      const step = Math.min(0.05, (now - last) / 1000);
      last = now;
      const hudNow = m.hud();
      if (!hudNow.paused && hudNow.phase === "play") {
        acc += step;
        const slice = 1 / 30;
        while (acc >= slice) {
          m.tick(slice);
          acc -= slice;
        }
      }
      paint();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const parent = canvas.parentElement;
      if (!parent) return;
      const cam = camRef.current;
      const prev = cam.zoom;
      const next = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, prev * (e.deltaY > 0 ? 1 / 1.08 : 1.08)));
      if (next === prev) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const base = baseTileSize(parent.clientWidth, parent.clientHeight);
      const tile0 = base * prev;
      const tile1 = base * next;
      if (tile0 > 0) {
        const wx = (px - cam.panX) / tile0;
        const wy = (py - cam.panY) / tile0;
        cam.panX = px - wx * tile1;
        cam.panY = py - wy * tile1;
      }
      cam.zoom = next;
      clampCamera(cam, parent.clientWidth, parent.clientHeight, m.cols, m.rows);
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      unsub();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [screen, run]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const m = matchRef.current;
      if (!m || screen !== "play") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "1") m.setTool("dig");
      else if (e.key === "2") m.setTool("smash");
      else if (e.key === "3") m.setTool("lord");
      else if (e.key === "h" || e.key === "H") m.toggleHeat();
      else if (e.key === "p" || e.key === "P" || e.key === " ") {
        e.preventDefault();
        m.togglePause();
      } else if (!bookRef.current && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const step = 48;
        const pan =
          e.key === "ArrowLeft" || e.key === "a" || e.key === "A"
            ? [step, 0]
            : e.key === "ArrowRight" || e.key === "d" || e.key === "D"
              ? [-step, 0]
              : e.key === "ArrowUp" || e.key === "w" || e.key === "W"
                ? [0, step]
                : e.key === "ArrowDown" || e.key === "s" || e.key === "S"
                  ? [0, -step]
                  : null;
        if (!pan) return;
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        if (!canvas || !parent) return;
        e.preventDefault();
        camRef.current.panX += pan[0];
        camRef.current.panY += pan[1];
        clampCamera(camRef.current, parent.clientWidth, parent.clientHeight, m.cols, m.rows);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen]);

  function ensureSfx() {
    if (!sfxRef.current) sfxRef.current = createSfx();
    sfxRef.current.unlock();
    return sfxRef.current;
  }

  function begin(id: StageId) {
    const sfx = ensureSfx();
    const m = createMatch(id);
    m.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    m.onSfx = (name) => {
      if (!m.hud().muted) sfx.play(name);
    };
    if (!m.hud().heatmap) m.toggleHeat();
    matchRef.current = m;
    bookPaused.current = false;
    camReady.current = false;
    camRef.current.zoom = 1;
    setBook(false);
    setHud(m.hud());
    setScreen("play");
    setRun((n) => n + 1);
    const w = window as unknown as { __loam?: Record<string, unknown> };
    w.__loam = {
      tap: (x: number, y: number) => m.tap(x, y),
      tool: (t: Tool) => m.setTool(t),
      hud: () => m.hud(),
      tick: (n: number) => {
        for (let i = 0; i < n; i++) m.tick(1 / 30);
      },
      actors: () =>
        m.actors
          .filter((a) => a.alive)
          .map((a) => ({ k: a.kind, s: a.species, f: a.form, v: a.variant, x: a.x, y: a.y, hp: a.hp })),
      grid: () => ({ cols: m.cols, rows: m.rows, layout: layoutRef.current }),
    };
  }

  function cellAt(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const m = matchRef.current;
    if (!canvas || !m) return null;
    const rect = canvas.getBoundingClientRect();
    const { tile, ox, oy } = layoutRef.current;
    if (tile <= 0) return null;
    const cx = Math.floor((clientX - rect.left - ox) / tile);
    const cy = Math.floor((clientY - rect.top - oy) / tile);
    if (cx < 0 || cy < 0 || cx >= m.cols || cy >= m.rows) return null;
    return { x: cx, y: cy };
  }

  function onPointerDown(e: PointerEvent<HTMLCanvasElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    g.moved = 0;
    g.lastX = e.clientX;
    g.lastY = e.clientY;
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      g.pinch = true;
      g.lastDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
    }
  }

  function onPointerMove(e: PointerEvent<HTMLCanvasElement>) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current.moved += Math.abs(dx) + Math.abs(dy);
    const canvas = canvasRef.current;
    const m = matchRef.current;
    if (!canvas || !m) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    if (pointers.current.size >= 2) {
      const pts = [...pointers.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
      const ratio = dist / gesture.current.lastDist;
      gesture.current.lastDist = dist;
      camRef.current.zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, camRef.current.zoom * ratio));
      clampCamera(camRef.current, parent.clientWidth, parent.clientHeight, m.cols, m.rows);
      return;
    }
    if (gesture.current.moved > 8) {
      camRef.current.panX += dx;
      camRef.current.panY += dy;
      clampCamera(camRef.current, parent.clientWidth, parent.clientHeight, m.cols, m.rows);
    }
  }

  function onPointerUp(e: PointerEvent<HTMLCanvasElement>) {
    const moved = gesture.current.moved;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) gesture.current.pinch = false;
    if (moved > 10 || gesture.current.pinch) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    ensureSfx().play("ui");
    matchRef.current?.tap(cell.x, cell.y);
  }

  function openBook() {
    const m = matchRef.current;
    if (m && !m.hud().paused) {
      m.togglePause();
      bookPaused.current = true;
    }
    setBook(true);
  }

  function closeBook() {
    setBook(false);
    if (bookPaused.current) {
      bookPaused.current = false;
      matchRef.current?.togglePause();
    }
  }

  if (screen !== "play") {
    return (
      <main className="safe-top mx-auto flex h-dvh max-h-dvh w-full max-w-lg flex-col overflow-hidden px-4 py-6">
        <div className="shrink-0">
          <p className="text-xs tracking-wide text-grub">A dungeon you dig</p>
          <h1 className="font-display mt-2 text-4xl leading-none text-fg">Loam Lord</h1>
          <p className="mt-1 text-xs tracking-wide text-grub">
            {LOAM_VERSION} · {LOAM_VERSION_NAME}
          </p>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-muted">
            Dig a living dungeon. Raise the food chain. Keep heroes off the Warden.
          </p>
          <ol className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm">
            <li className="text-primary">Loamite</li>
            <li className="text-muted">→</li>
            <li className="text-grub">Gnawling</li>
            <li className="text-muted">→</li>
            <li className="text-scale">Scalekin</li>
            <li className="text-muted">→</li>
            <li className="text-accent">Wyrm</li>
            <li className="text-muted">·</li>
            <li className="text-wisp">Wisp</li>
            <li className="text-muted">→</li>
            <li className="text-hex">Hexwife</li>
            <li className="text-muted">→</li>
            <li className="text-vamp">Nightkiss</li>
          </ol>
        </div>

        {screen === "how" ? (
          <>
            <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
              <ul className="flex flex-col gap-3 pb-3">
                {GUIDE.map((row) => (
                  <GuideRow key={row.name} row={row} />
                ))}
              </ul>
            </div>
            <button type="button" className="pressy bg-primary text-primary-fg font-display mt-3 min-h-12 shrink-0 rounded-lg" onClick={() => setScreen("title")}>
              Back
            </button>
          </>
        ) : (
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            <div className="flex flex-col gap-3 pb-2">
              {STAGE_META.map((stage) => {
                const cleared = save?.cleared.includes(stage.id);
                return (
                  <button
                    key={stage.id}
                    type="button"
                    className="panel pressy w-full px-4 py-2.5 text-left"
                    onClick={() => begin(stage.id)}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-xl text-fg">{stage.name}</span>
                      {cleared ? <span className="text-xs font-medium text-primary">Cleared</span> : null}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{stage.blurb}</p>
                    <p className="mt-2 text-xs text-grub">{stage.detail}</p>
                  </button>
                );
              })}
              <button
                type="button"
                className="pressy border-line text-fg min-h-12 rounded-lg border-2 bg-transparent"
                onClick={() => {
                  ensureSfx().play("ui");
                  setScreen("how");
                }}
              >
                Field guide
              </button>
              <p className="text-center text-xs text-muted">
                {save && save.best > 0 ? `Best horde ${save.best}` : "Horde Power is the sum of every living fighter."}
              </p>
            </div>
          </div>
        )}
      </main>
    );
  }

  const h = hud;
  const urgent = h?.countdown != null && h.countdown <= 15 && !h.endless;

  return (
    <main className="safe-top relative flex h-dvh flex-col bg-bg text-fg">
      <header className="px-3 pt-2">
        <div className="flex items-start justify-between gap-2">
          <Stat label="Dig Power" value={h ? String(h.digPower) : "–"} hint={h ? `of ${h.maxDig}` : ""} />
          <Stat label="Horde" value={h ? String(h.horde) : "–"} hint={h && h.peakHorde > h.horde ? `peak ${h.peakHorde}` : "power"} />
          <Stat
            label={h?.waveText ?? "Raid"}
            value={h?.countdown != null ? fmt(h.countdown) : h?.endless ? String(h.raids) : h?.phase === "play" ? "—" : "—"}
            hint={h?.endless && !h.raidActive ? "cleared" : ""}
            warn={urgent || h?.raidActive}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-muted">
            {h && h.waveTotal > 0
              ? h.eco
                ? `WAVE ${Math.min(h.waveTotal, (h.waveNum || 0) + 1)}/${h.waveTotal}`
                : h.waveNum > 0
                  ? `WAVE ${h.waveNum}/${h.waveTotal}`
                  : `${h.waveTotal} WAVES`
              : "Sandbox"}
            {h?.clock != null ? ` · clock ${fmt(h.clock)}` : ""}
          </span>
          <span className={h?.lordState === "carried" ? "text-accent" : "text-fg"}>
            Warden {wardenLabel(h)}
            {h && h.lordState !== "carried" && h.lordState !== "none" && (h.eco || h.lordLeft > 0)
              ? ` · ${h.lordLeft} move${h.lordLeft === 1 ? "" : "s"}`
              : ""}
          </span>
        </div>
        {h?.lordState === "carried" ? (
          <div className="mt-1 flex gap-1" aria-label="Drag toward the stair">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-sm ${i / 8 < (h.drag ?? 0) ? "bg-accent" : "bg-line"}`} />
            ))}
          </div>
        ) : null}
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-xs">
          {(h?.counts ?? []).filter((c) => c.n > 0).map((c) => (
            <span key={c.id} className={CHIP[c.id]}>
              {c.name} {c.n}
            </span>
          ))}
          {h?.rattleLine ? <span className="text-muted">{h.rattleLine}</span> : null}
        </div>
        {h?.banner ? <p className="mt-1 text-sm text-accent">{h.banner}</p> : null}
        {h?.ominous ? <p className="mt-1 text-sm text-accent">{h.ominous}</p> : null}
        {h?.event ? <p className="mt-1 text-sm text-fg">{h.event}</p> : null}
        {h?.hint ? <p className="mt-1 text-xs leading-relaxed text-muted">{h.hint}</p> : null}
      </header>

      <div className="relative min-h-0 flex-1">
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <p className="pointer-events-none absolute bottom-1 left-2 text-xs text-muted">Drag to pan · pinch to zoom · wheel zooms</p>
      </div>

      {h?.petition && h.phase === "play" && !book ? (
        <div className="px-3 pb-2">
          <p className="text-sm text-fg">Bless the next brood?</p>
          <div className="mt-2 flex gap-2">
            <button type="button" className="pressy bg-primary text-primary-fg font-display min-h-12 flex-1 rounded-lg" onClick={() => matchRef.current?.answerPetition(true)}>
              Aye
            </button>
            <button type="button" className="pressy border-line min-h-12 flex-1 rounded-lg border-2" onClick={() => matchRef.current?.answerPetition(false)}>
              Nay
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-2 px-3 pb-2">
        <ToolButton active={h?.tool === "dig"} label="Pick" icon={<Shovel className="size-5" />} onClick={() => matchRef.current?.setTool("dig")} />
        <ToolButton active={h?.tool === "smash"} label="Smash" icon={<Skull className="size-5" />} onClick={() => matchRef.current?.setTool("smash")} />
        <ToolButton active={h?.tool === "lord"} label="Warden" icon={<Crown className="size-5" />} onClick={() => matchRef.current?.setTool("lord")} />
      </div>
      <div className="grid grid-cols-4 gap-2 px-3 pb-3">
        <SmallButton label="Heat" icon={h?.heatmap ? <Eye className="size-4" /> : <EyeOff className="size-4" />} onClick={() => matchRef.current?.toggleHeat()} />
        <SmallButton label="Book" icon={<BookOpen className="size-4" />} onClick={openBook} />
        <SmallButton label={h?.paused ? "Play" : "Pause"} icon={h?.paused ? <Play className="size-4" /> : <Pause className="size-4" />} onClick={() => matchRef.current?.togglePause()} />
        {h?.endless ? (
          <SmallButton label="Raid" icon={<Swords className="size-4" />} onClick={() => matchRef.current?.summon()} />
        ) : (
          <SmallButton label={h?.muted ? "Sound" : "Mute"} icon={h?.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />} onClick={() => matchRef.current?.toggleMute()} />
        )}
      </div>

      {h?.upgradeOpen && h.phase === "play" && !h.result && !book ? (
        <Sheet title="Servant Upgrade" onClose={() => matchRef.current?.closeUpgrades()}>
          <p className="text-sm leading-relaxed text-muted">
            Spend Dig Power. Only creatures born after you pay grow stronger. The hollow keeps running.
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {h.upgrades.map((u) => {
              const priced = u.cost != null;
              const afford = priced && h.digPower >= (u.cost ?? 0);
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    disabled={!afford}
                    className="pressy border-line flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border-2 px-3 text-left disabled:opacity-40"
                    onClick={() => matchRef.current?.buyUpgrade(u.id)}
                  >
                    <span className="font-display text-fg">
                      {u.name}
                      <span className="text-muted text-sm"> {u.tier}/{u.max}</span>
                    </span>
                    <span className="text-sm text-grub">{priced ? `${u.cost} DP` : "MAX"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="pressy bg-primary text-primary-fg font-display mt-3 min-h-12 w-full rounded-lg"
            onClick={() => matchRef.current?.closeUpgrades()}
          >
            Continue
          </button>
        </Sheet>
      ) : null}

      {book && h ? (
        <Sheet title="Field guide" onClose={closeBook}>
          <ul className="flex flex-col gap-3">
            {GUIDE.map((row) => (
              <GuideRow key={row.name} row={row} />
            ))}
          </ul>
        </Sheet>
      ) : null}

      {h?.paused && !book && !h.result ? (
        <Sheet title="Paused" onClose={() => matchRef.current?.togglePause()}>
          <div className="flex flex-col gap-2">
            <button type="button" className="pressy bg-primary text-primary-fg font-display flex min-h-12 items-center justify-center gap-2 rounded-lg" onClick={() => matchRef.current?.togglePause()}>
              <Play className="size-5" />
              Resume
            </button>
            <button type="button" className="pressy border-line flex min-h-12 items-center justify-center gap-2 rounded-lg border-2" onClick={() => matchRef.current?.toggleMute()}>
              {h.muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              {h.muted ? "Sound off" : "Sound on"}
            </button>
            <button
              type="button"
              className="pressy border-line flex min-h-12 items-center justify-center gap-2 rounded-lg border-2"
              onClick={() => h && begin(h.stageId)}
            >
              <RotateCcw className="size-5" />
              Retry hollow
            </button>
            <button
              type="button"
              className="pressy border-line min-h-12 rounded-lg border-2"
              onClick={() => {
                matchRef.current = null;
                setScreen("title");
              }}
            >
              Title
            </button>
            <p className="text-center text-xs text-muted">Keys: 1 pick · 2 smash · 3 warden · H heat · P pause · WASD pan</p>
          </div>
        </Sheet>
      ) : null}

      {h?.result ? (
        <Sheet title={h.result.outcome === "win" ? "The hollow holds" : "The hollow falls"}>
          <p className="text-sm leading-relaxed text-muted">{h.result.reason}</p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="panel px-3 py-2">
              <dt className="text-muted">Time</dt>
              <dd className="font-display text-lg">{fmtClock(h.result.seconds)}</dd>
            </div>
            <div className="panel px-3 py-2">
              <dt className="text-muted">Peak horde</dt>
              <dd className="font-display text-lg">{h.result.peakHorde}</dd>
            </div>
            <div className="panel px-3 py-2">
              <dt className="text-muted">Heroes slain</dt>
              <dd className="font-display text-lg">{h.result.heroesSlain}</dd>
            </div>
            <div className="panel px-3 py-2">
              <dt className="text-muted">Mutations</dt>
              <dd className="font-display text-lg">{h.result.mutations}</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm text-fg">{h.result.living}</p>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" className="pressy bg-primary text-primary-fg font-display min-h-12 rounded-lg" onClick={() => begin(h.stageId)}>
              Dig again
            </button>
            {h.result.outcome === "win" && STAGE_META[STAGE_META.findIndex((s) => s.id === h.stageId) + 1] ? (
              <button
                type="button"
                className="pressy bg-accent text-accent-fg font-display min-h-12 rounded-lg"
                onClick={() => {
                  const next = STAGE_META[STAGE_META.findIndex((s) => s.id === h.stageId) + 1];
                  if (next) begin(next.id);
                }}
              >
                On to {STAGE_META[STAGE_META.findIndex((s) => s.id === h.stageId) + 1]?.name}
              </button>
            ) : null}
            <button
              type="button"
              className="pressy border-line min-h-12 rounded-lg border-2"
              onClick={() => {
                matchRef.current = null;
                setScreen("title");
              }}
            >
              Title
            </button>
          </div>
        </Sheet>
      ) : null}
    </main>
  );
}

function Stat({ label, value, hint, warn }: { label: string; value: string; hint?: string; warn?: boolean }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="truncate text-xs tracking-wide text-muted uppercase">{label}</div>
      <div className={`font-display text-2xl leading-none ${warn ? "text-accent" : "text-fg"}`}>{value}</div>
      <div className="truncate text-xs text-muted">{hint}</div>
    </div>
  );
}

function ToolButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`pressy font-display flex min-h-12 items-center justify-center gap-2 rounded-lg ${active ? "bg-primary text-primary-fg" : "border-line text-fg border-2 bg-surface"}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function SmallButton({ label, icon, onClick }: { label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className="pressy border-line text-muted flex min-h-11 items-center justify-center gap-1 rounded-lg border-2 text-sm" onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose?: () => void; children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-bg/80 p-3">
      <div className="panel safe-bottom flex max-h-[80%] min-h-0 flex-col overflow-hidden rounded-lg">
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
          <h2 className="font-display text-xl text-fg">{title}</h2>
          {onClose ? (
            <button type="button" className="pressy bg-raised text-fg min-h-11 rounded-lg px-4" onClick={onClose}>
              Close
            </button>
          ) : null}
        </div>
        <div className="scroll-thin min-h-0 overflow-y-auto overscroll-y-contain px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
