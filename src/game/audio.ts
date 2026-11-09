export type SfxName =
  | "dig"
  | "birth"
  | "eat"
  | "hit"
  | "die"
  | "ominous"
  | "wave"
  | "win"
  | "lose"
  | "place"
  | "smash"
  | "egg"
  | "ui";

export interface Sfx {
  unlock: () => void;
  play: (name: SfxName) => void;
}

export function createSfx(): Sfx {
  let ctx: AudioContext | null = null;

  function ac(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  function tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    delay = 0,
    slide = 0,
  ) {
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  function noise(dur: number, gain: number, delay = 0) {
    const c = ac();
    if (!c) return;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    const f = c.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 420;
    const t0 = c.currentTime + delay;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f);
    f.connect(g);
    g.connect(c.destination);
    src.start(t0);
  }

  const playbook: Record<SfxName, () => void> = {
    dig: () => {
      noise(0.12, 0.18);
      tone(140, 0.08, "square", 0.04);
    },
    birth: () => {
      tone(320, 0.1, "square", 0.05);
      tone(480, 0.12, "square", 0.04, 0.06);
    },
    eat: () => {
      noise(0.08, 0.12);
      tone(180, 0.07, "sawtooth", 0.03, 0, -80);
    },
    hit: () => tone(220, 0.06, "square", 0.04, 0, -90),
    die: () => tone(160, 0.2, "sawtooth", 0.05, 0, -100),
    ominous: () => {
      tone(110, 0.4, "sine", 0.06);
      tone(92, 0.5, "triangle", 0.04, 0.05);
    },
    wave: () => {
      tone(196, 0.15, "square", 0.05);
      tone(156, 0.2, "square", 0.05, 0.12);
      tone(130, 0.28, "square", 0.05, 0.26);
    },
    win: () => {
      tone(392, 0.12, "square", 0.05);
      tone(523, 0.12, "square", 0.05, 0.1);
      tone(659, 0.22, "square", 0.05, 0.2);
    },
    lose: () => {
      tone(220, 0.18, "sawtooth", 0.05);
      tone(160, 0.22, "sawtooth", 0.05, 0.14);
      tone(90, 0.35, "triangle", 0.05, 0.3);
    },
    place: () => tone(240, 0.1, "square", 0.05, 0, 80),
    smash: () => {
      noise(0.16, 0.2);
      tone(100, 0.12, "square", 0.05);
    },
    egg: () => tone(280, 0.14, "triangle", 0.05, 0, 60),
    ui: () => tone(440, 0.05, "square", 0.03),
  };

  return {
    unlock: () => {
      ac();
    },
    play: (name) => {
      try {
        playbook[name]?.();
      } catch {
        /* audio is optional */
      }
    },
  };
}
