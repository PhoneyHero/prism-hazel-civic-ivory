import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Skull, c as Play, d as EyeOff, f as Crown, i as Swords, l as Pause, n as Volume2, o as Shovel, p as BookOpen, s as RotateCcw, t as VolumeX, u as Eye } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BtifoM-0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function createSfx() {
	let ctx = null;
	function ac() {
		if (typeof window === "undefined") return null;
		if (!ctx) {
			const Ctor = window.AudioContext || window.webkitAudioContext;
			if (!Ctor) return null;
			ctx = new Ctor();
		}
		if (ctx.state === "suspended") ctx.resume();
		return ctx;
	}
	function tone(freq, dur, type, gain, delay = 0, slide = 0) {
		const c = ac();
		if (!c) return;
		const t0 = c.currentTime + delay;
		const o = c.createOscillator();
		const g = c.createGain();
		o.type = type;
		o.frequency.setValueAtTime(freq, t0);
		if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
		g.gain.setValueAtTime(gain, t0);
		g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
		o.connect(g);
		g.connect(c.destination);
		o.start(t0);
		o.stop(t0 + dur + .02);
	}
	function noise(dur, gain, delay = 0) {
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
		g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
		src.connect(f);
		f.connect(g);
		g.connect(c.destination);
		src.start(t0);
	}
	const playbook = {
		dig: () => {
			noise(.12, .18);
			tone(140, .08, "square", .04);
		},
		birth: () => {
			tone(320, .1, "square", .05);
			tone(480, .12, "square", .04, .06);
		},
		eat: () => {
			noise(.08, .12);
			tone(180, .07, "sawtooth", .03, 0, -80);
		},
		hit: () => tone(220, .06, "square", .04, 0, -90),
		die: () => tone(160, .2, "sawtooth", .05, 0, -100),
		ominous: () => {
			tone(110, .4, "sine", .06);
			tone(92, .5, "triangle", .04, .05);
		},
		wave: () => {
			tone(196, .15, "square", .05);
			tone(156, .2, "square", .05, .12);
			tone(130, .28, "square", .05, .26);
		},
		win: () => {
			tone(392, .12, "square", .05);
			tone(523, .12, "square", .05, .1);
			tone(659, .22, "square", .05, .2);
		},
		lose: () => {
			tone(220, .18, "sawtooth", .05);
			tone(160, .22, "sawtooth", .05, .14);
			tone(90, .35, "triangle", .05, .3);
		},
		place: () => tone(240, .1, "square", .05, 0, 80),
		smash: () => {
			noise(.16, .2);
			tone(100, .12, "square", .05);
		},
		egg: () => tone(280, .14, "triangle", .05, 0, 60),
		ui: () => tone(440, .05, "square", .03)
	};
	return {
		unlock: () => {
			ac();
		},
		play: (name) => {
			try {
				playbook[name]?.();
			} catch {}
		}
	};
}
var LOAM_VERSION = "1.6.5";
var LOAM_VERSION_NAME = "Officer";
var SPECIES_NAME = {
	moss: "Loamite",
	crawler: "Gnawling",
	lizard: "Scalekin",
	bud: "Demon",
	drake: "Wyrm",
	spirit: "Wisp",
	witch: "Hexwife",
	vampire: "Nightkiss",
	succubus: "Veilmother",
	nimbus: "Stormbride",
	skeleton: "Rattle"
};
var SPECIES_ORDER = [
	"moss",
	"crawler",
	"lizard",
	"bud",
	"drake",
	"spirit",
	"witch",
	"vampire",
	"succubus",
	"nimbus",
	"skeleton"
];
var STAGE_META = [
	{
		id: "hollow",
		name: "First Hollow",
		blurb: "One swordsman. Soft soil. The throne is claimed even if you never tap it.",
		detail: "Dig Power 140 · 2 waves"
	},
	{
		id: "mossworks",
		name: "Mossworks",
		blurb: "Four raids. Nutrients live in the walls. Spend the stipend before the hollow has to feed itself.",
		detail: "Dig Power 160 · 4 waves"
	},
	{
		id: "gate",
		name: "Twin Gate",
		blurb: "Four raids. Steel feeds the walls. Spells feed the mana. The Warden moves once between hunts.",
		detail: "Dig Power 180 · 4 waves"
	},
	{
		id: "witchwell",
		name: "Witchwell",
		blurb: "Mana-soaked walls. Five raids, a mage first, and a long breath between them.",
		detail: "Dig Power 180 · 5 waves"
	},
	{
		id: "bone",
		name: "Bone Procession",
		blurb: "Five waves. Remains stay. The pick raises a Rattle and does not splash.",
		detail: "Dig Power 200 · 5 waves"
	},
	{
		id: "deep",
		name: "Deep Throne",
		blurb: "Six raids. The last trio hits hardest. Upgrades only bless what is born after you pay.",
		detail: "Dig Power 220 · 6 waves"
	},
	{
		id: "chamber",
		name: "The Chamber",
		blurb: "Huge dig power. Summon a raid only after the Warden is seated. Fifteen seconds of warning.",
		detail: "Dig Power 300 · sandbox"
	}
];
var DX = [
	0,
	1,
	0,
	-1
];
var DY = [
	-1,
	0,
	1,
	0
];
/** 0 dirt, 1 Loamite, 2 Gnawling, 3 Scalekin / Wyrm. Mana uses the same cuts. */
function nutrientBand(n) {
	if (n < 10) return 0;
	if (n < 30) return 1;
	if (n < 55) return 2;
	return 3;
}
function bandSub(n) {
	const b = nutrientBand(n);
	if (b === 0) return 0;
	if (b === 1) return n < 16 ? 0 : n < 23 ? 1 : 2;
	if (b === 2) return n < 38 ? 0 : n < 47 ? 1 : 2;
	return n < 70 ? 0 : n < 85 ? 1 : 2;
}
function syncFluid(t) {
	if (t.nutrient < 0) t.nutrient = 0;
	if (t.mana < 0) t.mana = 0;
	t.nSub = bandSub(t.nutrient);
	t.mSub = bandSub(t.mana);
}
var STAGE_CLOCK = {
	hollow: 210,
	mossworks: 270,
	gate: 300,
	witchwell: 330,
	bone: 390,
	deep: 450,
	chamber: null
};
var CAP = {
	moss: 18,
	crawler: 12,
	lizard: 8,
	bud: 4,
	drake: 4,
	spirit: 14,
	witch: 6,
	vampire: 4,
	succubus: 4,
	nimbus: 3,
	skeleton: 10
};
var BASE = {
	moss: {
		hp: 10,
		atk: 2,
		def: 0,
		mag: 0,
		combat: 1,
		speed: 1.65
	},
	crawler: {
		hp: 16,
		atk: 4,
		def: 0,
		mag: 0,
		combat: 3,
		speed: 2.25
	},
	lizard: {
		hp: 28,
		atk: 6,
		def: 1,
		mag: 0,
		combat: 8,
		speed: 1.85
	},
	bud: {
		hp: 45,
		atk: 3,
		def: 4,
		mag: 0,
		combat: 4,
		speed: 1.15
	},
	drake: {
		hp: 50,
		atk: 11,
		def: 2,
		mag: 0,
		combat: 18,
		speed: 1.35
	},
	spirit: {
		hp: 8,
		atk: 1,
		def: 0,
		mag: 0,
		combat: 1,
		speed: 1.75
	},
	witch: {
		hp: 36,
		atk: 5,
		def: 1,
		mag: 7,
		combat: 12,
		speed: 1.25
	},
	vampire: {
		hp: 40,
		atk: 6,
		def: 1,
		mag: 8,
		combat: 14,
		speed: 1.35
	},
	succubus: {
		hp: 22,
		atk: 4,
		def: 0,
		mag: 5,
		combat: 8,
		speed: 1.9
	},
	nimbus: {
		hp: 28,
		atk: 4,
		def: 0,
		mag: 8,
		combat: 12,
		speed: 1.4
	},
	skeleton: {
		hp: 34,
		atk: 6,
		def: 1,
		mag: 0,
		combat: 6,
		speed: .9
	}
};
var HERO_BASE = {
	swordsman: {
		hp: 76,
		atk: 9,
		def: 1,
		mag: 0,
		speed: 1.62,
		range: 1,
		name: "Swordsman"
	},
	archer: {
		hp: 54,
		atk: 8,
		def: 0,
		mag: 0,
		speed: 1.55,
		range: 4,
		name: "Archer"
	},
	mage: {
		hp: 58,
		atk: 3,
		def: 0,
		mag: 8,
		speed: 1.45,
		range: 3,
		name: "Mage"
	},
	priest: {
		hp: 65,
		atk: 5,
		def: 1,
		mag: 5,
		speed: 1.32,
		range: 2,
		name: "Priest"
	},
	knight: {
		hp: 140,
		atk: 14,
		def: 3,
		mag: 0,
		speed: 1.12,
		range: 1,
		name: "Knight"
	},
	thief: {
		hp: 47,
		atk: 12,
		def: 0,
		mag: 0,
		speed: 2.15,
		range: 1,
		name: "Thief"
	}
};
/** Wave-1 numbers from before the Officer pass. Last wave is ×2 HP and ×1.7 ATK against these, not stacked on the new base. */
var HERO_OLD = {
	swordsman: {
		hp: 42,
		atk: 6
	},
	archer: {
		hp: 30,
		atk: 5
	},
	mage: {
		hp: 32,
		atk: 2
	},
	priest: {
		hp: 36,
		atk: 3
	},
	knight: {
		hp: 78,
		atk: 9
	},
	thief: {
		hp: 26,
		atk: 8
	}
};
var CORE_BLURB = {
	moss: {
		title: "Loamite",
		blurb: "Digging a 10–29 nutrient wall puts the whole number in one Loamite belly. It still hauls about 5 between walls. Hunger drains quickly. Old age opens a Bloom. Vitality still roots a Bud first."
	},
	crawler: {
		title: "Gnawling",
		blurb: "A 30–54 wall is one Gnawling, belly equal to that wall. At 45 it walks into a dead end and cocoons. The fly keeps that belly and spends 15, once it holds 60, to lay a Gnawling egg of 30."
	},
	pupa: {
		title: "Pupa",
		blurb: "A still cocoon. It cannot move. When the timer ends, a fly climbs out. Scalekin and heroes both find the wait convenient."
	},
	lizard: {
		title: "Scalekin",
		blurb: "A 55+ nutrient wall is one Scalekin. It claims a dug 2×3 for 10 nutrient, then spends 20 more, once it holds 75, to lay an egg of 55. A new nest cannot touch another, not even by a corner. Sleep costs 5 and only comes after a fight or a meal. Hunger is faster than a Loamite's."
	},
	egg: {
		title: "Egg",
		blurb: "Hatches into whoever laid it. An egg still counts — the chain is not extinct while one remains."
	},
	bud: {
		title: "Horned One",
		blurb: "Not a wall birth. An isolated 2×2 of mana walls, each 30 or more, fuses into a rune. The pick spends that dig and one Demon steps out. It leaves the rune and holds a dug room, preferring one that already has allies. Allies in that room gain a thicker hide. A curse slows a hero down an open hall. Two in one hall fight. It does not eat."
	},
	spirit: {
		title: "Wisp",
		blurb: "A 10–29 mana wall is one Wisp, belly equal to that wall. Eaten whole. Five on a pile of Remains turn it red. Hunger drains like a Loamite."
	},
	witch: {
		title: "Hexwife",
		blurb: "A 30–54 mana wall is one Hexwife. Under three of the line, 45 mana spends 15 to split a child of 30. At three or more, 42 spends 12 on a web. Eight webs is the cap. A hero who breaks one returns 6 mana to the walls."
	},
	vampire: {
		title: "Nightkiss",
		blurb: "Mana 3. A harder Hexwife. Hungers for Wisps, Gnawlings, and Hexwives."
	},
	succubus: {
		title: "Veilmother",
		blurb: "High mana before the hex line matures. Fragile, and she breeds fast."
	},
	nimbus: {
		title: "Stormbride",
		blurb: "Mana peak, once a Hexwife has lived. Paints mana and hexes down an open lane."
	},
	skeleton: {
		title: "Rattle",
		blurb: "Pick raises Remains and does not splash. Red after five Wisps, caster if the dead hero was a mage or priest, plated for a knight, bone for a sword or a thief. Four may walk. A fifth tap waits. When the inner mana ends it is Remains again, and that fall feeds no wall."
	},
	corpse: {
		title: "Remains",
		blurb: "Bones, not soil. They never bleed nutrient. A Wisp that touches the pile is consumed. Five Wisps turn it red. The pick raises one Rattle for free."
	},
	wiltbloom: {
		title: "Bud and Bloom",
		blurb: "A tired Loamite still roots into a Bud and drinks. A full close, belly 11 or more, hatches four Loamites of 10. A thinner flower hatches three. Smash, a stomp, or a path flower hatches two. A mana-cap hatches two Wisps. Nothing from a flower is poured into the walls."
	},
	drake: {
		title: "Wyrm",
		blurb: "A 55+ mana wall is one Wyrm. At 90 it spends 25 to lay an egg of 55. Wyrms do not bite Wyrms. Each takes a different horizontal hall and only competes for food. Breath is still that hall. Sleep costs 5."
	}
};
function variantBlurb(id) {
	const known = CORE_BLURB[id];
	if (known) return known;
	const [sp, v] = id.split(":");
	const name = SPECIES_NAME[sp] ?? sp;
	if (v === "giant") return {
		title: `Bloated ${name}`,
		blurb: "Starvation deaths armed the next births. More health, a split, and a slower hunger."
	};
	if (v === "deformed") return {
		title: `Twisted ${name}`,
		blurb: "Eaten by the tier above. The next births poison, sleep, and move slow."
	};
	if (v === "breed") return {
		title: `Dire ${name}`,
		blurb: "Killed-by-hero pressure. A flat bump to health and strike."
	};
	return {
		title: name,
		blurb: "Noted in the hollow."
	};
}
var ALMANAC_IDS = [
	"moss",
	"crawler",
	"pupa",
	"lizard",
	"egg",
	"bud",
	"drake",
	"spirit",
	"witch",
	"vampire",
	"succubus",
	"nimbus",
	"skeleton",
	"corpse",
	"wiltbloom",
	...SPECIES_ORDER.flatMap((sp) => [
		`${sp}:giant`,
		`${sp}:deformed`,
		`${sp}:breed`
	])
];
var SAVE_KEY = "loam-lord-save-v1";
function blankSave() {
	return {
		v: 1,
		cleared: [],
		seen: [],
		best: 0,
		muted: false
	};
}
function isStage(x) {
	return x === "hollow" || x === "mossworks" || x === "gate" || x === "witchwell" || x === "bone" || x === "deep" || x === "chamber";
}
function loadSave() {
	if (typeof localStorage === "undefined") return blankSave();
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return blankSave();
		const p = JSON.parse(raw);
		return {
			v: 1,
			cleared: Array.isArray(p.cleared) ? p.cleared.filter(isStage) : [],
			seen: Array.isArray(p.seen) ? p.seen.filter((s) => typeof s === "string") : [],
			best: typeof p.best === "number" ? p.best : 0,
			muted: Boolean(p.muted)
		};
	} catch {
		return blankSave();
	}
}
function writeSave(save) {
	if (typeof localStorage === "undefined") return;
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(save));
	} catch {}
}
var HINTS = [
	"Tap soil that touches open ground. Under 10, the number splits into the walls. 10 or more births one creature and keeps the higher number in its belly.",
	"A Loamite still hauls about 5 from a rich wall to a poor one. Hunger starts full and drains quickly. At 0 it dies and half the belly hits the walls.",
	"Nutrient: 10 Loamite, 30 Gnawling, 55 Scalekin. Mana: 10 Wisp, 30 Hexwife, 55 Wyrm. One tile never births both.",
	"An isolated 2×2 of mana walls, each 30 or more, is a rune. The pick spends one dig and one Demon steps out. It holds a dug room. Allies there grow a thicker hide.",
	"After a wave, the Warden asks Aye or Nay. Aye blesses only what is born after you pay.",
	"An empty census is not defeat. You lose only if a hero carries the Warden onto the stair.",
	"Heroes are hard to drop. They search unvisited floor and turn out of a dead end. They spend stamina to walk, strike, and cast. The last wave hits harder.",
	"Remains are bones. Five Wisps turn them red. The pick raises a Rattle. Four is the cap. A fifth tap waits."
];
var UPGRADE_COST = {
	moss: [
		40,
		40,
		40
	],
	crawler: [
		40,
		40,
		40
	],
	lizard: [
		40,
		40,
		40
	],
	spirit: [
		40,
		40,
		40
	],
	witch: [
		40,
		40,
		40
	],
	drake: [40, 40]
};
var UPGRADE_LABEL = {
	moss: "Loamite",
	crawler: "Gnawling",
	lizard: "Scalekin",
	spirit: "Wisp",
	witch: "Hexwife",
	drake: "Wyrm"
};
function mulberry(seed) {
	let s = seed >>> 0;
	return () => {
		s = Math.imul(1664525, s) + 1013904223 >>> 0;
		return s / 4294967296;
	};
}
function variantLabel(v, base) {
	if (v === "giant") return `Bloated ${base}`;
	if (v === "deformed") return `Twisted ${base}`;
	if (v === "breed") return `Dire ${base}`;
	return base;
}
function scaledStats(sp, variant) {
	const b = BASE[sp];
	let hp = b.hp;
	let atk = b.atk;
	let def = b.def;
	let combat = b.combat;
	let speed = b.speed;
	if (variant === "giant") {
		hp = Math.round(hp * 2.15);
		atk = Math.round(atk * 1.25);
		combat = Math.round(combat * 1.75);
		speed *= .62;
	} else if (variant === "deformed") {
		hp = Math.round(hp * .9);
		atk = Math.round(atk * 1.15);
		combat = Math.round(combat * 1.2);
		speed *= .72;
	} else if (variant === "breed") {
		hp = Math.round(hp * 1.35);
		atk = Math.round(atk * 1.5);
		def += 1;
		combat = Math.round(combat * 1.55);
	}
	return {
		hp: Math.max(1, hp),
		atk: Math.max(1, atk),
		def,
		mag: b.mag,
		combat: Math.max(1, combat),
		speed
	};
}
function makeBlank(cols, rows) {
	const tiles = [];
	for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
		const border = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
		tiles.push({
			kind: border ? "bedrock" : "soil",
			nutrient: 0,
			nSub: 0,
			mana: 0,
			mSub: 0,
			hardness: 1
		});
	}
	return tiles;
}
var SOIL_RATIO = {
	hollow: {
		density: .26,
		n1: .7,
		n2: .2,
		n3: .08,
		m: .02
	},
	mossworks: {
		density: .28,
		n1: .7,
		n2: .2,
		n3: .08,
		m: .02
	},
	gate: {
		density: .28,
		n1: .58,
		n2: .18,
		n3: .08,
		m: .16
	},
	witchwell: {
		density: .3,
		n1: .48,
		n2: .14,
		n3: .06,
		m: .32
	},
	bone: {
		density: .28,
		n1: .7,
		n2: .2,
		n3: .08,
		m: .02
	},
	deep: {
		density: .3,
		n1: .7,
		n2: .2,
		n3: .08,
		m: .02
	},
	chamber: {
		density: .28,
		n1: .46,
		n2: .16,
		n3: .08,
		m: .3
	}
};
function rollWalls(tiles, cols, rows, rng, entranceX, stageId) {
	for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
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
	const ratio = SOIL_RATIO[stageId];
	let interior = 0;
	for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) if (tiles[y * cols + x].kind === "soil") interior++;
	const target = Math.max(28, Math.round(interior * ratio.density));
	let n1 = Math.round(target * ratio.n1);
	let n2 = Math.round(target * ratio.n2);
	let n3 = Math.max(2, Math.round(target * ratio.n3));
	let mana = Math.max(1, target - n1 - n2 - n3);
	const used = /* @__PURE__ */ new Set();
	const mazeBlank = (x, y) => x >= entranceX + 5 && y >= 5 && y <= rows - 5;
	const claim = (x, y, ignoreBlank) => {
		if (x <= 0 || y <= 0 || x >= cols - 1 || y >= rows - 1) return false;
		if (!ignoreBlank && mazeBlank(x, y)) return false;
		const i = y * cols + x;
		if (used.has(i)) return false;
		if (tiles[i].kind !== "soil") return false;
		used.add(i);
		return true;
	};
	const write = (x, y, kind, stageA) => {
		const t = tiles[y * cols + x];
		if (kind === "n1") {
			t.nutrient = stageA ? 12 : rng() < .72 ? 12 : rng() < .55 ? 18 : 24;
			t.nSub = bandSub(t.nutrient);
			t.mana = 0;
			t.mSub = 0;
		} else if (kind === "n2") {
			t.nutrient = rng() < .65 ? 34 : 46;
			t.nSub = bandSub(t.nutrient);
			t.mana = 0;
			t.mSub = 0;
		} else if (kind === "n3") {
			t.nutrient = rng() < .55 ? 58 : 72;
			t.nSub = bandSub(t.nutrient);
			t.mana = 0;
			t.mSub = 0;
		} else {
			t.nutrient = 0;
			t.nSub = 0;
			t.mana = rng() < .62 ? 14 : 36;
			t.mSub = bandSub(t.mana);
		}
	};
	const cluster = (cx, cy, count, kind, ignoreBlank) => {
		const q = [[cx, cy]];
		const seen = /* @__PURE__ */ new Set();
		let placed = 0;
		while (q.length && placed < count) {
			const [x, y] = q.shift();
			const i = y * cols + x;
			if (seen.has(i)) continue;
			seen.add(i);
			if (claim(x, y, ignoreBlank)) {
				write(x, y, kind, false);
				placed++;
			}
			const dirs = [
				0,
				1,
				2,
				3
			].sort(() => rng() - .5);
			for (const d of dirs) q.push([x + DX[d], y + DY[d]]);
			if (seen.size > 80) break;
		}
		return placed;
	};
	const face = [
		[entranceX, 3],
		[entranceX - 1, 3],
		[entranceX + 1, 3],
		[entranceX - 2, 3],
		[entranceX + 2, 3],
		[entranceX, 4],
		[entranceX - 1, 4],
		[entranceX + 1, 4],
		[entranceX - 2, 4],
		[entranceX + 2, 4],
		[entranceX - 3, 4],
		[entranceX, 5],
		[entranceX - 1, 5],
		[entranceX + 1, 5],
		[entranceX - 2, 5],
		[entranceX, 6],
		[entranceX - 1, 6],
		[entranceX + 1, 6],
		[2, 4],
		[3, 4],
		[4, 5],
		[3, 5],
		[2, 5],
		[4, 6],
		[5, 5]
	];
	for (const [x, y] of face) {
		if (n1 <= 0) break;
		if (!claim(x, y, true)) continue;
		write(x, y, "n1", true);
		n1--;
	}
	const n1Seeds = [
		[2, 7],
		[3, 8],
		[entranceX - 4, 8],
		[4, 10],
		[2, 11],
		[entranceX, rows - 4],
		[3, rows - 5]
	];
	for (const [sx, sy] of n1Seeds) {
		if (n1 <= 0) break;
		n1 -= cluster(sx, sy, Math.min(n1, 7), "n1", false);
	}
	let guard = 0;
	while (n1 > 0 && guard++ < 80) {
		const got = cluster(1 + Math.floor(rng() * (cols - 2)), 1 + Math.floor(rng() * (rows - 2)), Math.min(n1, 4), "n1", false);
		if (!got) n1--;
		else n1 -= got;
	}
	const n2Seeds = [
		[3, Math.min(rows - 3, Math.floor(rows * .62))],
		[entranceX - 2, Math.min(rows - 3, Math.floor(rows * .72))],
		[5, rows - 4],
		[2, rows - 3]
	];
	for (const [sx, sy] of n2Seeds) {
		if (n2 <= 0) break;
		n2 -= cluster(sx, sy, Math.min(n2, 5), "n2", false);
	}
	guard = 0;
	while (n2 > 0 && guard++ < 40) {
		const x = 1 + Math.floor(rng() * Math.max(2, entranceX + 2));
		const y = Math.floor(rows * .5) + Math.floor(rng() * Math.max(2, rows * .4));
		const got = cluster(x, Math.min(rows - 2, y), Math.min(n2, 3), "n2", false);
		if (!got) n2--;
		else n2 -= got;
	}
	const n3Seeds = [
		[4, rows - 3],
		[entranceX - 1, rows - 3],
		[2, rows - 4]
	];
	for (const [sx, sy] of n3Seeds) {
		if (n3 <= 0) break;
		n3 -= cluster(sx, sy, Math.min(n3, 3), "n3", false);
	}
	const manaHeavy = stageId === "witchwell" || stageId === "chamber" || stageId === "gate";
	const mSeeds = manaHeavy ? [
		[cols - 3, 3],
		[cols - 4, 6],
		[cols - 3, 9],
		[cols - 4, rows - 4],
		[entranceX + 3, 8]
	] : [[cols - 3, rows - 4], [cols - 4, rows - 6]];
	for (const [sx, sy] of mSeeds) {
		if (mana <= 0) break;
		mana -= cluster(sx, sy, Math.min(mana, manaHeavy ? 6 : 2), "m", true);
	}
	for (let k = 0; k < 3; k++) {
		const x = 2 + Math.floor(rng() * Math.max(1, cols - 4));
		const t = tiles[(4 + Math.floor(rng() * Math.max(1, rows - 6))) * cols + x];
		if (t && t.kind === "soil") t.hardness = 2;
	}
	for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
		const t = tiles[y * cols + x];
		if (t.kind !== "soil" || t.nutrient !== 0 || t.mana !== 0) continue;
		t.nutrient = 1 + Math.floor(rng() * 6);
		t.nSub = 0;
	}
}
function paint(tiles, cols, rows, x0, y0, x1, y1, nutrient, mana = 0) {
	for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
		if (x <= 0 || y <= 0 || x >= cols - 1 || y >= rows - 1) continue;
		const t = tiles[y * cols + x];
		if (t.kind === "bedrock") continue;
		t.nutrient = Math.max(t.nutrient, nutrient);
		t.mana = Math.max(t.mana, mana);
	}
}
function carveEntrance(tiles, cols, x) {
	tiles[1 * cols + x].kind = "entrance";
	tiles[1 * cols + x].nutrient = 0;
	tiles[1 * cols + x].mana = 0;
	tiles[1 * cols + x].hardness = 1;
	tiles[2 * cols + x].kind = "dug";
	tiles[2 * cols + x].nutrient = 0;
	tiles[2 * cols + x].mana = 0;
	tiles[2 * cols + x].hardness = 1;
}
function story(dig, name, prep, eco, waves, paintFn) {
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
		entrance: {
			x: entranceX,
			y: 1
		},
		dig,
		name,
		endless: false,
		prep,
		eco,
		waves
	};
}
function buildStage(id) {
	if (id === "hollow") return story(140, "First Hollow", 45, 50, [{ heroes: [{
		cls: "swordsman",
		mul: .82
	}] }, { heroes: [{
		cls: "swordsman",
		mul: 1.05
	}, {
		cls: "archer",
		mul: 1
	}] }], (tiles, cols, rows) => {
		paint(tiles, cols, rows, 1, 1, 24, 6, 1, 0);
		paint(tiles, cols, rows, 1, 7, 24, 11, 2, 0);
		paint(tiles, cols, rows, 1, 12, 24, 18, 3, 0);
		paint(tiles, cols, rows, 18, 8, 23, 12, 1, 2);
		tiles[16 * cols + 6].nutrient = 4;
		tiles[9 * cols + 4].hardness = 2;
		tiles[14 * cols + 20].hardness = 2;
	});
	if (id === "mossworks") return story(160, "Mossworks", 40, 50, [
		{ heroes: [{
			cls: "swordsman",
			mul: 1
		}] },
		{ heroes: [{
			cls: "swordsman",
			mul: 1.08
		}, {
			cls: "archer",
			mul: 1.05
		}] },
		{ heroes: [{
			cls: "knight",
			mul: 1.12
		}, {
			cls: "archer",
			mul: 1.16
		}] },
		{ heroes: [{
			cls: "knight",
			mul: 1.28
		}, {
			cls: "mage",
			mul: 1.2
		}] }
	], (tiles, cols, rows) => {
		paint(tiles, cols, rows, 1, 1, 24, 18, 1, 0);
		paint(tiles, cols, rows, 1, 4, 8, 18, 3, 0);
		paint(tiles, cols, rows, 16, 4, 24, 18, 2, 0);
		paint(tiles, cols, rows, 9, 12, 16, 18, 3, 0);
		tiles[17 * cols + 4].nutrient = 4;
		tiles[8 * cols + 3].hardness = 2;
		tiles[13 * cols + 18].hardness = 2;
	});
	if (id === "gate") return story(180, "Twin Gate", 40, 55, [
		{ heroes: [{
			cls: "swordsman",
			mul: 1
		}] },
		{ heroes: [{
			cls: "swordsman",
			mul: 1.08
		}, {
			cls: "mage",
			mul: 1.05
		}] },
		{ heroes: [{
			cls: "knight",
			mul: 1.16
		}, {
			cls: "mage",
			mul: 1.2
		}] },
		{ heroes: [
			{
				cls: "knight",
				mul: 1.3
			},
			{
				cls: "priest",
				mul: 1.22
			},
			{
				cls: "archer",
				mul: 1.24
			}
		] }
	], (tiles, cols, rows) => {
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
	});
	if (id === "witchwell") return story(180, "Witchwell", 40, 60, [
		{ heroes: [{
			cls: "mage",
			mul: 1
		}] },
		{ heroes: [{
			cls: "mage",
			mul: 1.08
		}, {
			cls: "priest",
			mul: 1.05
		}] },
		{ heroes: [
			{
				cls: "archer",
				mul: 1.12
			},
			{
				cls: "mage",
				mul: 1.16
			},
			{
				cls: "priest",
				mul: 1.1
			}
		] },
		{ heroes: [
			{
				cls: "knight",
				mul: 1.22
			},
			{
				cls: "mage",
				mul: 1.28
			},
			{
				cls: "priest",
				mul: 1.2
			}
		] },
		{ heroes: [
			{
				cls: "knight",
				mul: 1.4
			},
			{
				cls: "mage",
				mul: 1.36
			},
			{
				cls: "thief",
				mul: 1.3
			}
		] }
	], (tiles, cols, rows) => {
		paint(tiles, cols, rows, 1, 1, 24, 6, 0, 1);
		paint(tiles, cols, rows, 1, 7, 24, 12, 1, 2);
		paint(tiles, cols, rows, 1, 13, 24, 18, 1, 3);
		tiles[10 * cols + 18].mana = 4;
		tiles[16 * cols + 8].mana = 4;
		tiles[8 * cols + 5].hardness = 2;
		tiles[14 * cols + 21].hardness = 2;
	});
	if (id === "bone") return story(200, "Bone Procession", 40, 65, [
		{ heroes: [{
			cls: "swordsman",
			mul: 1
		}, {
			cls: "thief",
			mul: 1
		}] },
		{ heroes: [{
			cls: "swordsman",
			mul: 1.08
		}, {
			cls: "archer",
			mul: 1.08
		}] },
		{ heroes: [{
			cls: "knight",
			mul: 1.14
		}] },
		{ heroes: [
			{
				cls: "knight",
				mul: 1.24
			},
			{
				cls: "priest",
				mul: 1.16
			},
			{
				cls: "archer",
				mul: 1.18
			}
		] },
		{ heroes: [{
			cls: "knight",
			mul: 1.4
		}, {
			cls: "mage",
			mul: 1.34
		}] }
	], (tiles, cols, rows) => {
		paint(tiles, cols, rows, 1, 1, 24, 6, 1, 0);
		paint(tiles, cols, rows, 1, 7, 12, 12, 2, 1);
		paint(tiles, cols, rows, 13, 7, 24, 12, 1, 2);
		paint(tiles, cols, rows, 1, 13, 12, 18, 3, 0);
		paint(tiles, cols, rows, 13, 13, 24, 18, 2, 2);
		tiles[17 * cols + 5].nutrient = 4;
		tiles[16 * cols + 20].mana = 4;
		tiles[9 * cols + 4].hardness = 2;
		tiles[14 * cols + 16].hardness = 2;
	});
	if (id === "deep") return story(220, "Deep Throne", 40, 70, [
		{ heroes: [{
			cls: "swordsman",
			mul: .78
		}] },
		{ heroes: [{
			cls: "swordsman",
			mul: 1
		}, {
			cls: "archer",
			mul: 1
		}] },
		{ heroes: [{
			cls: "knight",
			mul: 1.12
		}, {
			cls: "mage",
			mul: 1.12
		}] },
		{ heroes: [
			{
				cls: "knight",
				mul: 1.28
			},
			{
				cls: "priest",
				mul: 1.22
			},
			{
				cls: "archer",
				mul: 1.24
			}
		] },
		{ heroes: [
			{
				cls: "knight",
				mul: 1.55
			},
			{
				cls: "knight",
				mul: 1.55
			},
			{
				cls: "mage",
				mul: 1.5
			}
		] },
		{ heroes: [
			{
				cls: "knight",
				mul: 1.7
			},
			{
				cls: "mage",
				mul: 1.65
			},
			{
				cls: "priest",
				mul: 1.6
			}
		] }
	], (tiles, cols, rows) => {
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
			[21, 16]
		]) tiles[y * cols + x].hardness = 2;
	});
	const cols = 28;
	const rows = 20;
	const tiles = makeBlank(cols, rows);
	for (let y = 1; y < 19; y++) for (let x = 1; x < 27; x++) {
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
	carveEntrance(tiles, cols, 13);
	return {
		cols,
		rows,
		tiles,
		entrance: {
			x: 13,
			y: 1
		},
		dig: 300,
		name: "The Chamber",
		endless: true,
		prep: 0,
		eco: 0,
		waves: []
	};
}
function createMatch(stageId, seed) {
	const built = buildStage(stageId);
	const cols = built.cols;
	const rows = built.rows;
	const tiles = built.tiles;
	const actors = [];
	const particles = [];
	const floaters = [];
	const rng = mulberry(seed ?? Date.now() ^ stageId.length * 9973);
	rollWalls(tiles, cols, rows, rng, built.entrance.x, stageId);
	const save = loadSave();
	const seen = new Set(save.seen);
	const listeners = /* @__PURE__ */ new Set();
	const pressure = {
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
		skeleton: freshPressure()
	};
	let nextId = 1;
	let digPower = built.dig;
	let maxDig = built.dig;
	let phase = "play";
	let paused = false;
	let tool = "dig";
	let heatmap = false;
	let muted = save.muted;
	let time = 0;
	let shake = 0;
	let digs = 0;
	let horde = 0;
	let peakHorde = 0;
	let hintStep = 0;
	let event = "";
	let eventLife = 0;
	let ominous = "";
	let ominousLife = 0;
	let banner = "";
	let bannerLife = 0;
	let uiAcc = 0;
	let birthCd = 2.4;
	let reproCd = 0;
	let nestScan = 0;
	let auraScan = 0;
	let nestTiles = [];
	let lordLeft = 0;
	let lordState = "none";
	let carrierId = null;
	let dragStart = 1;
	let prepLeft = built.endless ? null : built.prep;
	let launched = 0;
	let ecoWait = null;
	let clearNoted = 0;
	let invasionStarted = false;
	let raidActive = false;
	let raidWarn = null;
	let pendingRaid = null;
	let leakAcc = 0;
	let upgradeOpen = false;
	let petitionAsk = false;
	let petitionYes = false;
	let petitionDelay = null;
	let firstAye = true;
	let clockLeft = STAGE_CLOCK[stageId];
	let bloomAcc = 0;
	let staminaFalls = 0;
	let combatFalls = 0;
	const heroIntel = /* @__PURE__ */ new Map();
	const rattleMem = /* @__PURE__ */ new Map();
	let gridStamp = 0;
	let birthMajor = 1;
	let birthSub = 0;
	let raidTen = false;
	const upgrades = {
		moss: 0,
		crawler: 0,
		lizard: 0,
		spirit: 0,
		witch: 0,
		drake: 0
	};
	let raids = 0;
	let heroesSlain = 0;
	let monsterDeaths = 0;
	let mutations = 0;
	let result = null;
	const spawnQueue = [];
	const born = {
		moss: 0,
		crawler: 0,
		lizard: 0,
		bud: 0,
		drake: 0,
		spirit: 0,
		witch: 0,
		vampire: 0,
		succubus: 0,
		nimbus: 0,
		skeleton: 0
	};
	const everSeenForm = {
		egg: false,
		pupa: false
	};
	const corpses = [];
	const blooms = [];
	const webs = [];
	const runeList = [];
	const nestMarks = [];
	const nestBoxes = [];
	const api = {
		cols,
		rows,
		tiles,
		actors,
		corpses,
		blooms,
		webs,
		runes: runeList,
		nests: nestMarks,
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
		born,
		heroesSlain: 0,
		monsterDeaths: 0,
		tick,
		tap,
		setTool,
		toggleHeat,
		togglePause,
		toggleMute,
		summon,
		buyUpgrade,
		answerPetition,
		closeUpgrades,
		subscribe,
		hud,
		listDiggable,
		probeIntel,
		plant,
		plantHero
	};
	function freshPressure() {
		return {
			hunger: 0,
			predation: 0,
			heroKills: 0,
			starveDeaths: 0,
			peak: 0,
			giantArmed: false,
			deformArmed: false,
			breedArmed: false
		};
	}
	function emit() {
		for (const fn of listeners) fn();
	}
	function subscribe(fn) {
		listeners.add(fn);
		return () => listeners.delete(fn);
	}
	function sfx(name) {
		if (muted) return;
		api.onSfx(name);
	}
	function toast(text) {
		event = text;
		eventLife = 3.2;
		emit();
	}
	function warn(text) {
		ominous = text;
		ominousLife = 4.6;
		sfx("ominous");
		emit();
	}
	function shout(text) {
		banner = text;
		bannerLife = 2.8;
		toast(text);
	}
	function persist() {
		save.seen = [...seen];
		save.best = Math.max(save.best, peakHorde);
		save.muted = muted;
		writeSave(save);
	}
	function markSeen(id) {
		if (seen.has(id)) return;
		seen.add(id);
		persist();
	}
	function tileAt(x, y) {
		if (x < 0 || y < 0 || x >= cols || y >= rows) return null;
		return tiles[y * cols + x];
	}
	function isOpen(x, y) {
		const t = tileAt(x, y);
		return !!t && (t.kind === "dug" || t.kind === "entrance");
	}
	function nearOpen(x, y) {
		for (let d = 0; d < 4; d++) if (isOpen(x + DX[d], y + DY[d])) return true;
		return false;
	}
	function actorAt(x, y, except) {
		for (const a of actors) {
			if (!a.alive || a.id === except) continue;
			if (a.x === x && a.y === y) return a;
		}
		return null;
	}
	function countSpecies(sp) {
		let n = 0;
		for (const a of actors) if (a.alive && a.species === sp) n++;
		return n;
	}
	function chainAlive() {
		for (const a of actors) {
			if (!a.alive || a.kind !== "monster" || a.species === "skeleton") continue;
			return true;
		}
		return false;
	}
	function heroThreat() {
		if (spawnQueue.length) return true;
		for (const a of actors) if (a.alive && a.kind === "hero") return true;
		return false;
	}
	function burst(x, y, color, n, speed) {
		const limit = api.reducedMotion ? 4 : n;
		for (let i = 0; i < limit; i++) {
			if (particles.length > 90) particles.shift();
			const ang = rng() * Math.PI * 2;
			const sp = speed * (.35 + rng());
			const life = .28 + rng() * .28;
			particles.push({
				x: x + .5,
				y: y + .5,
				vx: Math.cos(ang) * sp,
				vy: Math.sin(ang) * sp,
				life,
				max: life,
				color,
				size: 1.4 + rng() * 2.2
			});
		}
	}
	function float(x, y, text, color) {
		if (floaters.length > 24) floaters.shift();
		floaters.push({
			x: x + .5,
			y: y + .2,
			text,
			life: .7,
			max: .7,
			color
		});
	}
	function bumpShake(n) {
		if (api.reducedMotion) return;
		shake = Math.min(1.4, shake + n);
		api.shake = shake;
	}
	function applyMonsterStats(a, sp, variant, form) {
		const s = scaledStats(sp, variant);
		const ratio = a.maxHp > 0 ? a.hp / a.maxHp : 1;
		const moving = form === "adult" || form === "fly";
		a.species = sp;
		a.variant = variant;
		a.form = form;
		a.maxHp = s.hp;
		a.hp = moving ? Math.max(1, Math.round(s.hp * (a.hp > 0 && ratio < 1 ? ratio : 1))) : a.hp;
		if (moving && (a.hp <= 0 || a.hp > a.maxHp)) a.hp = a.maxHp;
		a.atk = moving ? s.atk : 0;
		a.def = s.def;
		a.mag = moving ? s.mag : 0;
		a.combat = moving ? s.combat : 0;
		a.shield = 0;
		a.speed = form === "fly" ? s.speed * 1.35 : moving ? s.speed : 0;
		const base = SPECIES_NAME[sp];
		if (form === "egg") a.name = `${variantLabel(variant, base)} Egg`;
		else if (form === "pupa") a.name = `${variantLabel(variant, base)} Pupa`;
		else if (form === "fly") a.name = `${variantLabel(variant, base)} Fly`;
		else a.name = variantLabel(variant, base);
	}
	function spawnMonster(sp, x, y, variant, form) {
		const a = {
			id: nextId++,
			kind: "monster",
			species: sp,
			variant,
			form,
			heroClass: null,
			name: SPECIES_NAME[sp],
			x,
			y,
			fx: x,
			fy: y,
			dir: Math.floor(rng() * 4),
			face: rng() < .5 ? -1 : 1,
			hp: 1,
			maxHp: 1,
			atk: 1,
			def: 0,
			mag: 0,
			combat: 1,
			speed: 1,
			satiety: 3,
			vitality: 0,
			carryN: 0,
			carryM: 0,
			moveCd: rng() * .3,
			swingCd: rng() * .2,
			hungerCd: 3.2,
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
			bob: rng() * 6,
			age: 40,
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
			hunger: 100
		};
		applyMonsterStats(a, sp, variant, form);
		const fam = familyOf(sp);
		const tier = fam ? upgrades[fam] ?? 0 : 0;
		a.tier = tier;
		const mul = (.7 + .15 * Math.max(1, birthMajor) + .05 * birthSub) * (1 + .2 * tier);
		if (form === "adult" || form === "fly") {
			a.maxHp = Math.max(1, Math.round(a.maxHp * mul));
			a.hp = a.maxHp;
			a.atk = Math.max(1, Math.round(a.atk * mul));
			a.combat = Math.max(1, Math.round(a.combat * mul));
			a.satiety = sp === "drake" ? 5 : 5;
		}
		a.age = lifeOf(sp);
		if (sp === "moss" && form === "adult") {
			a.brood = "walk";
			a.vitality = 22;
			a.satiety = 3;
			a.carryN = 0;
			a.sleep = 0;
			a.rest = 0;
		}
		actors.push(a);
		born[sp] += 1;
		if (variant === "giant" && form === "adult" && sp !== "drake") {
			a.satiety = 8;
			a.hungerCd = 18;
			const spot = freeNeighbor(x, y);
			if (spot && countSpecies(sp) + 1 < CAP[sp]) {
				const twin = spawnMonster(sp, spot.x, spot.y, "normal", "adult");
				twin.satiety = 4;
			}
		}
		markSeen(sp);
		if (variant !== "normal") markSeen(`${sp}:${variant}`);
		if (form === "egg") {
			markSeen("egg");
			everSeenForm.egg = true;
		}
		if (form === "pupa") {
			markSeen("pupa");
			everSeenForm.pupa = true;
		}
		if (born[sp] === 1 && sp !== "skeleton") toast(`${a.name} crawls out of the loam.`);
		else if (sp === "skeleton" && born[sp] === 1) toast("The bones stand up.");
		else if (variant !== "normal" && form === "adult") toast(`${a.name} twists into the world.`);
		sfx(form === "egg" ? "egg" : "birth");
		burst(x, y, variant === "breed" ? "#f0d060" : "#c4a574", 8, 2.2);
		return a;
	}
	function rollVariant(sp) {
		if (sp === "drake") return "normal";
		const p = pressure[sp];
		if (p.heroKills >= 3) {
			p.giantArmed = false;
			p.deformArmed = false;
			p.breedArmed = false;
			return "normal";
		}
		if (p.deformArmed) return "deformed";
		if (p.giantArmed) return "giant";
		if (p.breedArmed) {
			p.breedArmed = false;
			mutations += 1;
			return "breed";
		}
		return "normal";
	}
	function maybeArm(sp) {
		if (sp === "drake") return;
		const p = pressure[sp];
		if (!p.giantArmed && p.starveDeaths >= 2 && p.hunger >= 8) {
			p.giantArmed = true;
			p.deformArmed = false;
			mutations += 1;
			warn("OMINOUS");
			toast("Hunger bloats the next births.");
		}
		if (!p.deformArmed && p.predation >= 4) {
			p.deformArmed = true;
			p.giantArmed = false;
			mutations += 1;
			warn("OMINOUS");
			toast("The eaten return wrong.");
		}
	}
	function freeNeighbor(x, y) {
		const opts = [];
		for (let d = 0; d < 4; d++) {
			const nx = x + DX[d];
			const ny = y + DY[d];
			if (isOpen(nx, ny) && !actorAt(nx, ny)) opts.push({
				x: nx,
				y: ny
			});
		}
		if (!opts.length) return null;
		return opts[Math.floor(rng() * opts.length)];
	}
	function openNeighbors(x, y) {
		let n = 0;
		for (let d = 0; d < 4; d++) if (isOpen(x + DX[d], y + DY[d])) n++;
		return n;
	}
	function inNest(x, y) {
		return boxesAt(x, y).length > 0;
	}
	function axisGap(a0, a1, b0, b1) {
		if (a1 < b0) return b0 - a1;
		if (b1 < a0) return a0 - b1;
		return 0;
	}
	function boxGap(a, b) {
		const dx = axisGap(a.x, a.x + a.w - 1, b.x, b.x + b.w - 1);
		const dy = axisGap(a.y, a.y + a.h - 1, b.y, b.y + b.h - 1);
		return Math.max(dx, dy);
	}
	function boxesAt(x, y) {
		const out = [];
		for (const [w, h] of [[2, 3], [3, 2]]) for (let y0 = y - (h - 1); y0 <= y; y0++) for (let x0 = x - (w - 1); x0 <= x; x0++) {
			let ok = true;
			for (let yy = 0; yy < h && ok; yy++) for (let xx = 0; xx < w; xx++) if (!isOpen(x0 + xx, y0 + yy)) ok = false;
			if (ok) out.push({
				x: x0,
				y: y0,
				w,
				h
			});
		}
		return out;
	}
	function legalClaimBox(x, y) {
		for (const box of boxesAt(x, y)) if (nestBoxes.every((n) => boxGap(n, box) >= 2)) return box;
		return null;
	}
	function refreshNests() {
		nestTiles = [];
		for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) if (isOpen(x, y) && inNest(x, y)) nestTiles.push({
			x,
			y
		});
	}
	function huntsMoss(a) {
		if (a.hp < a.maxHp) return true;
		if (a.satiety <= 3) return true;
		return countSpecies("moss") >= 4;
	}
	function isPrey(pred, prey) {
		if (prey.kind !== "monster" || !prey.species || !pred.species) return false;
		const sp = prey.species;
		const form = prey.form;
		if (pred.species === "crawler" && (pred.form === "adult" || pred.form === "fly") && sp === "moss" && form === "adult") return true;
		if (pred.species === "lizard" && sp === "moss" && form !== "egg" && huntsMoss(pred)) return true;
		if (pred.species === "lizard" && sp === "crawler" && form !== "egg") return true;
		if (pred.species === "lizard" && sp === "lizard" && pred.satiety <= 1 && form === "adult" && prey.id !== pred.id) return true;
		if (pred.species === "drake" && prey.species !== "skeleton" && prey.species !== "drake" && prey.species !== "bud" && prey.form !== "egg" && prey.id !== pred.id) return true;
		if (pred.species === "witch" && form === "adult" && (sp === "spirit" || sp === "crawler")) return true;
		if (pred.species === "vampire" && form !== "egg" && (sp === "spirit" || sp === "crawler" || sp === "witch")) return true;
		if (pred.species === "succubus" && sp === "spirit" && form === "adult") return true;
		return false;
	}
	function nearest(pred, test) {
		let best = null;
		let bestD = 1e9;
		for (const a of actors) {
			if (!a.alive || a.id === pred.id || !test(a)) continue;
			const d = Math.abs(a.x - pred.x) + Math.abs(a.y - pred.y);
			if (d < bestD) {
				bestD = d;
				best = a;
			}
		}
		return best;
	}
	function taxTile(x, y) {
		const walls = wallList(x, y);
		if (!walls.length) return;
		const pick = walls[Math.floor(rng() * walls.length)].t;
		if (pick.nutrient > 0 && (pick.mana <= 0 || rng() < .55)) pullN(pick);
		else if (pick.mana > 0) pullM(pick);
	}
	function leakStores() {
		const bag = [];
		for (const t of tiles) {
			if (t.kind !== "soil") {
				t.nutrient = 0;
				t.nSub = 0;
				t.mana = 0;
				t.mSub = 0;
				continue;
			}
			if (t.nutrient > 0 || t.mana > 0) bag.push(t);
		}
		if (calmNow()) return;
		const burns = Math.min(3, bag.length);
		for (let k = 0; k < burns; k++) {
			const t = bag[Math.floor(rng() * bag.length)];
			if (t.nutrient > 0 && (t.mana <= 0 || rng() < .5)) pullN(t);
			else if (t.mana > 0) pullM(t);
		}
	}
	function moveTo(a, x, y) {
		if (x > a.x) a.face = 1;
		else if (x < a.x) a.face = -1;
		if (x === a.x + 1) a.dir = 1;
		else if (x === a.x - 1) a.dir = 3;
		else if (y === a.y - 1) a.dir = 0;
		else if (y === a.y + 1) a.dir = 2;
		a.x = x;
		a.y = y;
		if (a.kind === "monster" && a.species !== "skeleton" && !calmNow() && rng() < .12) taxTile(x, y);
	}
	function familyOf(sp) {
		if (sp === "moss") return "moss";
		if (sp === "crawler") return "crawler";
		if (sp === "lizard") return "lizard";
		if (sp === "drake") return "drake";
		if (sp === "spirit") return "spirit";
		if (sp === "witch" || sp === "vampire" || sp === "succubus" || sp === "nimbus") return "witch";
		return null;
	}
	function lifeOf(sp) {
		if (sp === "moss" || sp === "spirit") return 72;
		if (sp === "crawler") return 104;
		if (sp === "lizard") return 156;
		if (sp === "drake") return 240;
		if (sp === "skeleton") return 96;
		return 140;
	}
	function calmNow() {
		if (prepLeft !== null || ecoWait !== null) return true;
		if (built.endless && !raidActive && spawnQueue.length === 0) {
			for (const a of actors) if (a.alive && a.kind === "hero") return false;
			return true;
		}
		return false;
	}
	function bumpN(t) {
		if (t.kind !== "soil") return;
		t.nutrient += 5;
		syncFluid(t);
	}
	function bumpM(t) {
		if (t.kind !== "soil") return;
		t.mana += 5;
		syncFluid(t);
	}
	function pullN(t) {
		if (t.kind !== "soil" || t.nutrient <= 0) return false;
		t.nutrient = Math.max(0, t.nutrient - 5);
		syncFluid(t);
		return true;
	}
	function pullM(t) {
		if (t.kind !== "soil" || t.mana <= 0) return false;
		t.mana = Math.max(0, t.mana - 5);
		syncFluid(t);
		return true;
	}
	function nearestWall(sx, sy) {
		let best = null;
		let bestScore = 1e9;
		for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
			if (dx === 0 && dy === 0) continue;
			if (Math.max(Math.abs(dx), Math.abs(dy)) > 4) continue;
			const t = tileAt(sx + dx, sy + dy);
			if (!t || t.kind !== "soil") continue;
			const man = Math.abs(dx) + Math.abs(dy);
			const diag = dx !== 0 && dy !== 0 ? 1 : 0;
			const score = man * 10 + diag * 3;
			if (score < bestScore) {
				bestScore = score;
				best = {
					x: sx + dx,
					y: sy + dy,
					t
				};
			}
		}
		return best;
	}
	function giveWall(x, y, n, m) {
		dumpFull(x, y, n, m);
	}
	function dumpFull(x, y, n, m) {
		if (n <= 0 && m <= 0) return;
		const scored = [];
		for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
			if (dx === 0 && dy === 0) continue;
			const t = tileAt(x + dx, y + dy);
			if (!t || t.kind !== "soil") continue;
			const man = Math.abs(dx) + Math.abs(dy);
			scored.push({
				t,
				score: man * 10 + (dx !== 0 && dy !== 0 ? 3 : 0)
			});
		}
		scored.sort((a, b) => a.score - b.score);
		const walls = [];
		const seenT = /* @__PURE__ */ new Set();
		for (const row of scored) {
			if (seenT.has(row.t)) continue;
			seenT.add(row.t);
			walls.push(row.t);
			if (walls.length >= 4) break;
		}
		if (!walls.length) return;
		const shareN = Math.floor(n / walls.length);
		let remN = n - shareN * walls.length;
		const shareM = Math.floor(m / walls.length);
		let remM = m - shareM * walls.length;
		for (const t of walls) {
			const addN = shareN + (remN > 0 ? 1 : 0);
			const addM = shareM + (remM > 0 ? 1 : 0);
			if (remN > 0) remN -= 1;
			if (remM > 0) remM -= 1;
			if (addN) t.nutrient += addN;
			if (addM) t.mana += addM;
			syncFluid(t);
		}
	}
	function wallList(x, y) {
		const out = [];
		for (let d = 0; d < 4; d++) {
			const t = tileAt(x + DX[d], y + DY[d]);
			if (!t || t.kind !== "soil") continue;
			out.push({
				t,
				n: t.nutrient,
				m: t.mana
			});
		}
		return out;
	}
	function eat(pred, prey) {
		if (!prey.alive || !prey.species) return;
		const sp = prey.species;
		pressure[sp].predation += 1;
		maybeArm(sp);
		const rate = sp === "moss" || sp === "spirit" ? 1 : .5;
		if (pred.species !== "skeleton" && pred.species !== "bud") {
			pred.carryN += Math.floor(prey.carryN * rate);
			pred.carryM += Math.floor(prey.carryM * rate);
		}
		pred.hunger = 100;
		pred.satiety = Math.min(8, pred.satiety + 2);
		pred.vitality += 1;
		pred.hp = Math.min(pred.maxHp, pred.hp + 1);
		float(prey.x, prey.y, "eaten", "#e7d7a8");
		burst(prey.x, prey.y, "#6fbf4a", 7, 2);
		sfx("eat");
		pred.feedCd = pred.species === "drake" ? 5.5 : 3.2;
		pred.rest = 1;
		slay(prey, "eaten", pred.species);
	}
	function tryEat(a) {
		if (a.feedCd > 0) return;
		for (const o of actors) {
			if (!o.alive || o.id === a.id) continue;
			if (o.x === a.x && o.y === a.y && isPrey(a, o)) {
				eat(a, o);
				return;
			}
		}
	}
	function tryLay(a) {
		if (!a.species || a.form !== "adult") return;
		if (a.species === "lizard") {
			if (countSpecies("lizard") >= CAP.lizard) return;
			if (a.shed < 1) {
				const box = legalClaimBox(a.x, a.y);
				if (!box || a.carryN < 10) return;
				a.carryN -= 10;
				a.shed = 1;
				nestBoxes.push(box);
				if (!nestMarks.some((n) => n.x === a.x && n.y === a.y)) nestMarks.push({
					x: a.x,
					y: a.y
				});
				float(a.x, a.y, "NEST", "#e7d3a4");
				return;
			}
			if (!inNest(a.x, a.y) || a.carryN < 75) return;
			const spot = freeNeighbor(a.x, a.y);
			if (!spot) return;
			a.carryN -= 20;
			const egg = spawnMonster("lizard", spot.x, spot.y, rollVariant("lizard"), "egg");
			egg.hp = 8;
			egg.maxHp = 8;
			egg.atk = 0;
			egg.combat = 0;
			egg.speed = 0;
			egg.hatch = 9;
			egg.carryN = 55;
			egg.hunger = 100;
			egg.sleep = 0;
			egg.rest = 0;
			if (!everSeenForm.egg) toast("An egg is pressed into the soil.");
			return;
		}
		if (a.species !== "drake") return;
		if (a.carryM < 90) return;
		if (countSpecies("drake") >= CAP.drake) return;
		const spot = freeNeighbor(a.x, a.y);
		if (!spot) return;
		a.carryM -= 25;
		const egg = spawnMonster("drake", spot.x, spot.y, "normal", "egg");
		egg.hp = 8;
		egg.maxHp = 8;
		egg.atk = 0;
		egg.combat = 0;
		egg.speed = 0;
		egg.hatch = 12;
		egg.carryM = 55;
		egg.hunger = 100;
		egg.sleep = 0;
		egg.rest = 0;
		if (!everSeenForm.egg) toast("An egg is pressed into the soil.");
	}
	function emerge(a) {
		if (!a.species) return;
		const sp = a.species;
		const variant = a.variant;
		if (a.form === "pupa") {
			applyMonsterStats(a, sp, variant, "fly");
			const mul = 1 + .2 * a.tier;
			a.maxHp = Math.max(1, Math.round(a.maxHp * mul));
			a.hp = a.maxHp;
			a.atk = Math.max(1, Math.round(a.atk * mul));
			a.combat = Math.max(1, Math.round(a.combat * mul));
			a.speed = Math.max(.4, a.speed);
			a.satiety = 5;
			a.vitality = 0;
			a.hatch = 0;
			a.shed = 0;
			a.sleep = 0;
			a.rest = 0;
			a.age = lifeOf(sp);
			a.job = "";
			a.path = null;
			burst(a.x, a.y, "#e2b04a", 8, 2);
			toast("The cocoon splits.");
			return;
		}
		if (a.form === "egg") {
			applyMonsterStats(a, sp, variant, "adult");
			const mul = 1 + .2 * a.tier;
			a.maxHp = Math.max(1, Math.round(a.maxHp * mul));
			a.hp = a.maxHp;
			a.atk = Math.max(1, Math.round(a.atk * mul));
			a.combat = Math.max(1, Math.round(a.combat * mul));
			a.satiety = 4;
			a.vitality = 0;
			a.hatch = 0;
			a.age = lifeOf(sp);
			a.hunger = 100;
			a.sleep = 0;
			a.rest = 0;
			burst(a.x, a.y, "#e6d3a3", 8, 2);
			sfx("birth");
		}
	}
	function los(ax, ay, bx, by, max) {
		if (ax !== bx && ay !== by) return false;
		const dist = Math.abs(bx - ax) + Math.abs(by - ay);
		if (dist <= 0 || dist > max) return false;
		const sx = ax === bx ? 0 : bx > ax ? 1 : -1;
		const sy = ay === by ? 0 : by > ay ? 1 : -1;
		for (let i = 1; i < dist; i++) {
			const x = ax + sx * i;
			const y = ay + sy * i;
			if (!isOpen(x, y)) return false;
			if (actorAt(x, y)) return false;
		}
		return true;
	}
	function sameRoom(ax, ay, bx, by, cap = 4) {
		if (Math.abs(ax - bx) + Math.abs(ay - by) > cap) return false;
		const dist = new Int32Array(cols * rows);
		dist.fill(-1);
		const q = [ay * cols + ax];
		dist[ay * cols + ax] = 0;
		let head = 0;
		while (head < q.length) {
			const cur = q[head++];
			if (cur === by * cols + bx) return true;
			const d0 = dist[cur];
			if (d0 >= cap) continue;
			const x = cur % cols;
			const y = cur / cols | 0;
			for (let d = 0; d < 4; d++) {
				const nx = x + DX[d];
				const ny = y + DY[d];
				if (!isOpen(nx, ny)) continue;
				const ni = ny * cols + nx;
				if (dist[ni] >= 0) continue;
				dist[ni] = d0 + 1;
				q.push(ni);
			}
		}
		return false;
	}
	function tickAura() {
		for (const a of actors) {
			if (!a.alive || a.kind !== "monster" || a.shield <= 0) continue;
			a.def = Math.max(0, a.def - a.shield);
			a.shield = 0;
		}
		for (const b of actors) {
			if (!b.alive || b.species !== "bud" || b.form !== "adult") continue;
			for (const a of actors) {
				if (!a.alive || a.kind !== "monster" || a.species === "bud" || a.species === "skeleton") continue;
				if (a.shield > 0) continue;
				if (!sameRoom(b.x, b.y, a.x, a.y, 4)) continue;
				const bonus = Math.max(1, Math.round(a.def * .4));
				a.shield = bonus;
				a.def += bonus;
			}
		}
	}
	function layWeb(x, y) {
		const t = tileAt(x, y);
		if (!t || t.kind !== "dug" && t.kind !== "entrance") return;
		const hit = webs.find((w) => w.x === x && w.y === y);
		if (hit) {
			hit.life = 8;
			return;
		}
		if (webs.length >= 8) return;
		webs.push({
			x,
			y,
			life: 8
		});
	}
	function strike(att, def) {
		if (!att.alive || !def.alive || att.sleep > 0) return;
		if (def.kind === "overlord") {
			if (att.kind === "hero") grab(att, def);
			return;
		}
		if (def.shield > 0 && def.kind === "hero") {
			def.shield = 0;
			def.hitFlash = .16;
			float(def.x, def.y, "BLOCK", "#c5d0d6");
			pour(def.x, def.y, 0, 3);
			sfx("hit");
			return;
		}
		let dmg;
		if (att.kind === "hero" && (att.heroClass === "mage" || att.heroClass === "priest")) dmg = Math.max(1, att.mag - Math.floor(def.def / 2));
		else if (att.species === "witch" || att.species === "vampire" || att.species === "succubus" || att.species === "nimbus") dmg = Math.max(1, att.atk + att.mag - def.def);
		else if (att.species === "skeleton" && att.rattle === 1) dmg = Math.max(1, att.mag - Math.floor(def.def / 2));
		else dmg = Math.max(1, att.atk - def.def);
		if (att.kind === "hero" && def.kind === "monster" && def.maxHp > 0) dmg = Math.min(dmg, Math.max(1, Math.floor(def.maxHp * .4)));
		if (att.species === "lizard" || att.species === "drake") att.rest = 1;
		if (def.species === "lizard" || def.species === "drake") def.rest = 1;
		if (att.variant === "deformed" && dmg > 0) {
			if (rng() < .42) {
				def.poison = Math.max(def.poison, 4.2);
				def.poisonFrom = att.species;
			}
			if (rng() < .24) def.sleep = Math.max(def.sleep, 1.35);
		}
		if (att.species === "witch" || att.species === "vampire" || att.species === "succubus" || att.species === "nimbus") layWeb(def.x, def.y);
		if (dmg <= 0) {
			float(def.x, def.y, "ward", "#d6e27a");
			return;
		}
		if (def.sleep > 0) {
			if (att.kind === "hero") dmg *= 2;
			def.sleep = 0;
			float(def.x, def.y, "WAKE", "#f3e6c8");
		}
		def.hp -= dmg;
		def.hitFlash = .12;
		float(def.x, def.y, `${dmg}`, def.kind === "hero" ? "#e25b3a" : "#f3e6c8");
		sfx("hit");
		bumpShake(.12);
		if (def.hp <= 0) {
			if (att.kind === "hero" && def.kind === "monster" && att.combat > 0) {
				att.kills += 1;
				const stacks = Math.min(5, att.kills);
				att.atk = Math.max(1, Math.round(att.combat * (1 + .04 * stacks)));
				att.stamina = Math.min(att.staminaMax, att.stamina + 2);
			}
			slay(def, "combat", att.kind === "monster" ? att.species : att.kind === "hero" ? "hero" : "overlord");
		}
	}
	function pour(x, y, n, m) {
		if (n <= 0 && m <= 0) return;
		const scored = [];
		for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
			if (dx === 0 && dy === 0) continue;
			const t = tileAt(x + dx, y + dy);
			if (!t || t.kind !== "soil") continue;
			const man = Math.abs(dx) + Math.abs(dy);
			const diag = dx !== 0 && dy !== 0 ? 1 : 0;
			scored.push({
				t,
				score: man * 10 + diag * 4
			});
		}
		scored.sort((a, b) => a.score - b.score);
		const walls = [];
		const seen = /* @__PURE__ */ new Set();
		for (const row of scored) {
			if (seen.has(row.t)) continue;
			seen.add(row.t);
			walls.push(row.t);
			if (walls.length >= 4) break;
		}
		if (!walls.length) {
			giveWall(x, y, n, m);
			return;
		}
		for (let i = 0; i < n; i++) bumpN(walls[i % walls.length]);
		for (let i = 0; i < m; i++) bumpM(walls[i % walls.length]);
	}
	function heroTithe(a) {
		const cls = a.heroClass ?? "swordsman";
		if (a.atk >= Math.round(HERO_BASE[cls].atk * 1.5)) {
			if (cls === "mage" || cls === "priest") return {
				n: 0,
				m: 56
			};
			if (cls === "knight") return {
				n: 36,
				m: 24
			};
			return {
				n: 48,
				m: 0
			};
		}
		if (cls === "mage" || cls === "priest") return {
			n: 0,
			m: 40
		};
		if (cls === "knight") return {
			n: 28,
			m: 16
		};
		if (cls === "thief") return {
			n: 24,
			m: 0
		};
		if (cls === "archer") return {
			n: 32,
			m: 0
		};
		return {
			n: 40,
			m: 0
		};
	}
	function breakBloom(bloom) {
		const idx = blooms.indexOf(bloom);
		if (idx >= 0) blooms.splice(idx, 1);
		if (bloom.m > 0 && bloom.n === 0) sproutPair(bloom.x, bloom.y, "spirit");
		else sproutPair(bloom.x, bloom.y, "moss");
		burst(bloom.x, bloom.y, "#6fbf4a", 10, 2.2);
		sfx("smash");
	}
	function spellWall(t, bumps) {
		if (t.kind !== "soil" || bumps <= 0) return;
		for (let i = 0; i < bumps; i++) bumpM(t);
		if (t.mana > 0 && t.nutrient > 0 && t.mana >= t.nutrient) {
			t.mana += t.nutrient;
			t.nutrient = 0;
			syncFluid(t);
		}
	}
	function boltRewrite(ax, ay, tx, ty, bumps) {
		const sx = ax === tx ? 0 : tx > ax ? 1 : tx < ax ? -1 : 0;
		const sy = ay === ty ? 0 : ty > ay ? 1 : ty < ay ? -1 : 0;
		if (sx === 0 && sy === 0) return;
		if (sx !== 0 && sy !== 0) {
			const wall = tileAt(tx, ty);
			if (wall && wall.kind === "soil") spellWall(wall, bumps);
			return;
		}
		const dist = Math.max(Math.abs(tx - ax), Math.abs(ty - ay));
		for (let i = 1; i <= Math.max(1, dist); i++) {
			const x = ax + sx * i;
			const y = ay + sy * i;
			const sideA = tileAt(x + sy, y + sx);
			const sideB = tileAt(x - sy, y - sx);
			if (sideA && sideA.kind === "soil" && (sideA.nutrient > 0 || sideA.mana > 0)) spellWall(sideA, 1);
			if (sideB && sideB.kind === "soil" && (sideB.nutrient > 0 || sideB.mana > 0)) spellWall(sideB, 1);
			const t = tileAt(x, y);
			if (t && t.kind === "soil") {
				spellWall(t, bumps);
				return;
			}
			if (t && t.kind === "bedrock") return;
		}
	}
	function paintDiamond(x, y, n, m) {
		if (n <= 0 && m <= 0) return;
		const walls = [];
		for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
			const man = Math.abs(dx) + Math.abs(dy);
			if (man === 0 || man > 2) continue;
			const t = tileAt(x + dx, y + dy);
			if (!t || t.kind !== "soil") continue;
			walls.push(t);
		}
		if (!walls.length) return;
		const shareN = Math.floor(n / walls.length);
		let remN = n - shareN * walls.length;
		const shareM = Math.floor(m / walls.length);
		let remM = m - shareM * walls.length;
		for (const t of walls) {
			t.nutrient += shareN + (remN > 0 ? 1 : 0);
			t.mana += shareM + (remM > 0 ? 1 : 0);
			if (remN > 0) remN -= 1;
			if (remM > 0) remM -= 1;
			syncFluid(t);
		}
	}
	function splitFluid(x, y, n, m) {
		if (n <= 0 && m <= 0) return;
		const walls = [];
		for (let d = 0; d < 4; d++) {
			const t = tileAt(x + DX[d], y + DY[d]);
			if (t && t.kind === "soil") walls.push(t);
		}
		if (!walls.length) return;
		const shareN = Math.floor(n / walls.length);
		let remN = n - shareN * walls.length;
		const shareM = Math.floor(m / walls.length);
		let remM = m - shareM * walls.length;
		for (const t of walls) {
			t.nutrient += shareN + (remN > 0 ? 1 : 0);
			t.mana += shareM + (remM > 0 ? 1 : 0);
			if (remN > 0) remN -= 1;
			if (remM > 0) remM -= 1;
			syncFluid(t);
		}
	}
	function bandSpeciesN(n) {
		if (n >= 55) return "lizard";
		if (n >= 30) return "crawler";
		if (n >= 10) return "moss";
		return null;
	}
	function bandSpeciesM(m) {
		if (m >= 55) return "drake";
		if (m >= 30) return "witch";
		if (m >= 10) return "spirit";
		return null;
	}
	function releaseSoil(x, y, n, m) {
		if (n < 10 && m < 10) {
			splitFluid(x, y, n, m);
			return 0;
		}
		const nWins = n >= m;
		const sp = nWins ? bandSpeciesN(n) : bandSpeciesM(m);
		if (!sp) {
			splitFluid(x, y, n, m);
			return 0;
		}
		const loseN = nWins ? 0 : n;
		const loseM = nWins ? m : 0;
		if (loseN > 0 || loseM > 0) splitFluid(x, y, loseN, loseM);
		const kid = trySpawn(sp, x, y, Math.max(1, nutrientBand(nWins ? n : m)), bandSub(nWins ? n : m));
		if (!kid) return 0;
		if (nWins) kid.carryN = n;
		else kid.carryM = m;
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
	function runeSquare(x, y) {
		for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
			const t = tileAt(x + dx, y + dy);
			if (!t || t.kind !== "soil" || t.mana < 30) return false;
		}
		for (let dy = -1; dy <= 2; dy++) for (let dx = -1; dx <= 2; dx++) {
			if (dx >= 0 && dx <= 1 && dy >= 0 && dy <= 1) continue;
			const t = tileAt(x + dx, y + dy);
			if (!t || t.kind !== "dug" && t.kind !== "entrance") return false;
		}
		return true;
	}
	function refreshRunes() {
		runeList.length = 0;
		for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) if (runeSquare(x, y)) runeList.push({
			x,
			y
		});
	}
	function runeOf(x, y) {
		for (const r of runeList) if (x >= r.x && x <= r.x + 1 && y >= r.y && y <= r.y + 1) return r;
		return null;
	}
	function breakRune(rx, ry) {
		const spots = [];
		for (let dy = -1; dy <= 2; dy++) for (let dx = -1; dx <= 2; dx++) {
			if (dx >= 0 && dx <= 1 && dy >= 0 && dy <= 1) continue;
			const x = rx + dx;
			const y = ry + dy;
			if (isOpen(x, y) && !actorAt(x, y)) spots.push({
				x,
				y
			});
		}
		for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
			const t = tileAt(rx + dx, ry + dy);
			if (!t) continue;
			t.kind = "dug";
			t.nutrient = 0;
			t.mana = 0;
			t.nSub = 0;
			t.mSub = 0;
			t.hardness = 1;
		}
		let at = spots[0] ?? null;
		if (!at) {
			for (let dy = 0; dy <= 1 && !at; dy++) for (let dx = 0; dx <= 1; dx++) if (!actorAt(rx + dx, ry + dy)) {
				at = {
					x: rx + dx,
					y: ry + dy
				};
				break;
			}
		}
		if (!at || countSpecies("bud") >= CAP.bud) return;
		birthMajor = 1;
		birthSub = 0;
		const demon = spawnMonster("bud", at.x, at.y, "normal", "adult");
		demon.name = "Demon";
		demon.carryN = 0;
		demon.carryM = 0;
		demon.hunger = 100;
		demon.sleep = 0;
		demon.rest = 0;
		toast("A Demon steps out of the rune.");
	}
	function openDug(x, y, t) {
		refreshRunes();
		const rune = runeOf(x, y);
		if (rune) {
			breakRune(rune.x, rune.y);
			refreshRunes();
			noteGrid();
			sfx("dig");
			burst(x, y, "#c9a0ff", 8, 1.8);
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
		releaseSoil(x, y, n, m);
		noteGrid();
		sfx("dig");
		burst(x, y, "#6a4634", 6, 1.6);
	}
	function noteGrid() {
		gridStamp += 1;
		for (const bag of heroIntel.values()) for (let i = 0; i < bag.dead.length; i++) {
			if (!bag.dead[i]) continue;
			if (openNeighbors(i % cols, i / cols | 0) > 1) bag.dead[i] = 0;
		}
	}
	function frustratedDig(a) {
		const prefs = [
			a.dir,
			(a.dir + 3) % 4,
			(a.dir + 1) % 4,
			(a.dir + 2) % 4
		];
		for (const d of prefs) {
			const x = a.x + DX[d];
			const y = a.y + DY[d];
			const t = tileAt(x, y);
			if (!t || t.kind !== "soil") continue;
			openDug(x, y, t);
			float(x, y, "DIG", "#f3e6c8");
			a.dir = d;
			a.path = null;
			a.pace = 99;
			return;
		}
	}
	function canStep(a, x, y) {
		if (!isOpen(x, y)) return false;
		const occ = actorAt(x, y, a.id);
		if (!occ) return true;
		if (a.kind === "monster" && isPrey(a, occ)) return true;
		return false;
	}
	function ensureIntel(a) {
		let bag = heroIntel.get(a.id);
		if (!bag) {
			bag = {
				seen: new Uint8Array(cols * rows),
				dead: new Uint8Array(cols * rows),
				lord: 0
			};
			heroIntel.set(a.id, bag);
		}
		return bag;
	}
	function refreshIntel() {
		const heroes = actors.filter((a) => a.alive && a.kind === "hero");
		for (const a of heroes) {
			const bag = ensureIntel(a);
			const i = a.y * cols + a.x;
			if (i < 0 || i >= bag.seen.length) continue;
			bag.seen[i] = 1;
			if (isOpen(a.x, a.y) && openNeighbors(a.x, a.y) <= 1) bag.dead[i] = 1;
		}
		for (let i = 0; i < heroes.length; i++) for (let j = i + 1; j < heroes.length; j++) {
			const A = heroes[i];
			const B = heroes[j];
			if (Math.abs(A.x - B.x) + Math.abs(A.y - B.y) !== 1) continue;
			const ia = ensureIntel(A);
			const ib = ensureIntel(B);
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
	function probeIntel(id) {
		const bag = heroIntel.get(id);
		if (!bag) return null;
		let dead = 0;
		let seen = 0;
		for (let i = 0; i < bag.dead.length; i++) {
			dead += bag.dead[i];
			seen += bag.seen[i];
		}
		return {
			dead,
			seen
		};
	}
	function plant(sp, x, y, form = "adult") {
		const t = tileAt(x, y);
		if (t && t.kind !== "bedrock") {
			t.kind = "dug";
			t.nutrient = 0;
			t.mana = 0;
			t.nSub = 0;
			t.mSub = 0;
			t.hardness = 1;
		}
		birthMajor = 1;
		birthSub = 0;
		const a = spawnMonster(sp, x, y, "normal", form);
		a.sleep = 0;
		a.rest = 0;
		a.moveCd = 0;
		a.hungerCd = 999;
		a.hunger = 999;
		a.hunger = 999;
		a.age = 999;
		return a;
	}
	function plantHero(cls, x, y) {
		const t = tileAt(x, y);
		if (t && t.kind !== "bedrock") {
			t.kind = "dug";
			t.nutrient = 0;
			t.mana = 0;
			t.nSub = 0;
			t.mSub = 0;
			t.hardness = 1;
		}
		spawnHero(cls, x, y, 1);
		const a = actors[actors.length - 1];
		a.moveCd = 0;
		a.stamina = 400;
		a.staminaMax = 400;
		a.hp = Math.max(a.hp, 80);
		a.maxHp = Math.max(a.maxHp, 80);
		return a;
	}
	function route(fromX, fromY, toX, toY) {
		if (!isOpen(toX, toY)) return [];
		if (fromX === toX && fromY === toY) return [];
		const nCells = cols * rows;
		const prev = new Int32Array(nCells);
		prev.fill(-1);
		const start = fromY * cols + fromX;
		const goal = toY * cols + toX;
		const q = [start];
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
			const cx = cur % cols;
			const cy = cur / cols | 0;
			for (let d = 0; d < 4; d++) {
				const nx = cx + DX[d];
				const ny = cy + DY[d];
				if (!isOpen(nx, ny)) continue;
				const nid = ny * cols + nx;
				if (seen[nid]) continue;
				seen[nid] = 1;
				prev[nid] = cur;
				q.push(nid);
			}
		}
		if (!found) return [];
		const rev = [];
		let cursor = goal;
		let guard = 0;
		while (cursor !== start && guard++ < nCells) {
			rev.push({
				x: cursor % cols,
				y: cursor / cols | 0
			});
			const back = prev[cursor];
			if (back < 0) return [];
			cursor = back;
		}
		rev.reverse();
		return rev;
	}
	function pursue(a, tx, ty) {
		if (a.x === tx && a.y === ty) {
			a.path = [];
			a.pathTx = tx;
			a.pathTy = ty;
			return "there";
		}
		if (!a.path || a.pathTx !== tx || a.pathTy !== ty || a.stamp !== gridStamp || a.pace >= 1.5 || a.path.length > 0 && !isOpen(a.path[0].x, a.path[0].y)) {
			a.path = route(a.x, a.y, tx, ty);
			a.pathTx = tx;
			a.pathTy = ty;
			a.stamp = gridStamp;
			a.pace = 0;
		}
		if (!a.path || a.path.length === 0) return "none";
		if (a.path[0].x === a.x && a.path[0].y === a.y) a.path.shift();
		if (!a.path.length) return "there";
		const step = a.path[0];
		if (!canStep(a, step.x, step.y)) return "wait";
		moveTo(a, step.x, step.y);
		a.path.shift();
		return "step";
	}
	function nearestOpen(ax, ay, ok) {
		const nCells = cols * rows;
		const seen = new Uint8Array(nCells);
		const q = [ay * cols + ax];
		seen[ay * cols + ax] = 1;
		let qi = 0;
		while (qi < q.length) {
			const cur = q[qi++];
			const x = cur % cols;
			const y = cur / cols | 0;
			if ((x !== ax || y !== ay) && ok(x, y)) return {
				x,
				y
			};
			for (let d = 0; d < 4; d++) {
				const nx = x + DX[d];
				const ny = y + DY[d];
				if (!isOpen(nx, ny)) continue;
				const ni = ny * cols + nx;
				if (seen[ni]) continue;
				seen[ni] = 1;
				q.push(ni);
			}
		}
		return null;
	}
	function farthestFromStair() {
		const nCells = cols * rows;
		const dist = new Int32Array(nCells);
		dist.fill(-1);
		const q = [built.entrance.y * cols + built.entrance.x];
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
			const x = cur % cols;
			const y = cur / cols | 0;
			for (let d = 0; d < 4; d++) {
				const nx = x + DX[d];
				const ny = y + DY[d];
				if (!isOpen(nx, ny)) continue;
				const ni = ny * cols + nx;
				if (dist[ni] >= 0) continue;
				dist[ni] = d0 + 1;
				q.push(ni);
			}
		}
		if (best < 0) return null;
		return {
			x: best % cols,
			y: best / cols | 0
		};
	}
	function suckWalls(a, radius) {
		let best = null;
		let bestN = 0;
		for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
			const man = Math.abs(dx) + Math.abs(dy);
			if (man === 0 || man > radius) continue;
			const t = tileAt(a.x + dx, a.y + dy);
			if (!t || t.kind !== "soil" || t.nutrient <= bestN) continue;
			bestN = t.nutrient;
			best = t;
		}
		if (!best || bestN <= 0) return;
		const take = Math.min(5, best.nutrient);
		best.nutrient -= take;
		syncFluid(best);
		a.carryN += take;
	}
	function sproutPair(x, y, sp) {
		for (let i = 0; i < 2; i++) {
			const spot = i === 0 && isOpen(x, y) && !actorAt(x, y) ? {
				x,
				y
			} : freeNeighbor(x, y);
			if (!spot) break;
			birthMajor = 1;
			birthSub = 0;
			const kid = spawnMonster(sp, spot.x, spot.y, "normal", "adult");
			kid.sleep = 0;
			kid.rest = 0;
			kid.hunger = 100;
			if (sp === "moss") {
				kid.carryN = 10;
				kid.satiety = 3;
				kid.vitality = 22;
				kid.brood = "walk";
			} else kid.carryM = 10;
		}
	}
	function hatchLoamites(a, mode) {
		const n = mode === "smash" ? 2 : a.carryN >= 11 ? 4 : 3;
		const x = a.x;
		const y = a.y;
		a.alive = false;
		let made = 0;
		for (let i = 0; i < n; i++) {
			const spot = i === 0 && isOpen(x, y) && !actorAt(x, y) ? {
				x,
				y
			} : freeNeighbor(x, y);
			if (!spot) break;
			birthMajor = 1;
			birthSub = 0;
			const kid = spawnMonster("moss", spot.x, spot.y, "normal", "adult");
			kid.sleep = 0;
			kid.rest = 0;
			kid.carryN = 10;
			kid.satiety = 3;
			kid.vitality = 22;
			kid.brood = "walk";
			kid.hunger = 100;
			kid.hp = kid.maxHp;
			made += 1;
		}
		if (made) toast(made === 1 ? "A Bloom hatches a Loamite." : `A Bloom hatches ${made}.`);
	}
	function rootBud(a) {
		a.brood = "bud";
		a.speed = 0;
		a.name = "Loam Bud";
		markSeen("wiltbloom");
	}
	function tickBrood(a, dt) {
		if (!a.alive || a.species !== "moss" || a.form !== "adult" || !a.brood) return;
		if (a.brood === "walk") {
			a.vitality -= dt;
			if (a.vitality <= 0) rootBud(a);
			return;
		}
		a.speed = 0;
		a.feedCd -= dt;
		if (a.feedCd <= 0) {
			a.feedCd = 1.15;
			suckWalls(a, a.brood === "bud" ? 1 : 2);
		}
		if (a.brood === "bud" && a.carryN >= 10) {
			a.brood = "bloom";
			a.name = "Loam Bloom";
			a.hatch = 14 + rng() * 2;
			markSeen("wiltbloom");
		}
		if (a.brood === "bloom") {
			a.hatch -= dt;
			const foe = actors.find((h) => h.alive && h.kind === "hero" && Math.abs(h.x - a.x) + Math.abs(h.y - a.y) === 1);
			if (foe && a.swingCd <= 0) {
				a.swingCd = .85;
				strike(a, foe);
			}
			if (a.alive && a.hatch <= 0) hatchLoamites(a, "natural");
		}
	}
	function makePile(x, y, extra) {
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
			...extra
		};
	}
	function dumpOrthogonal(x, y, n, m, forceBand) {
		const walls = [];
		for (let d = 0; d < 4; d++) {
			const t = tileAt(x + DX[d], y + DY[d]);
			if (t && t.kind === "soil") walls.push(t);
		}
		if (!walls.length) {
			dumpFull(x, y, n, m);
			return;
		}
		const shareN = Math.floor(n / walls.length);
		let remN = n - shareN * walls.length;
		const shareM = Math.floor(m / walls.length);
		let remM = m - shareM * walls.length;
		for (const t of walls) {
			t.nutrient += shareN + (remN > 0 ? 1 : 0);
			t.mana += shareM + (remM > 0 ? 1 : 0);
			if (remN > 0) remN -= 1;
			if (remM > 0) remM -= 1;
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
	function slay(a, cause, by) {
		if (!a.alive) return;
		a.alive = false;
		a.hitFlash = .2;
		if (a.kind === "hero") {
			heroesSlain += 1;
			api.heroesSlain = heroesSlain;
			if (cause === "stamina") staminaFalls += 1;
			else combatFalls += 1;
			if (a.carrying || a.id === carrierId) dropLord(a.x, a.y);
			const tithe = heroTithe(a);
			paintDiamond(a.x, a.y, tithe.n, tithe.m);
			corpses.push(makePile(a.x, a.y, {
				manaAtDeath: a.mag,
				cls: a.heroClass
			}));
			burst(a.x, a.y, "#d9d3c7", 12, 2.6);
			sfx("die");
			toast(cause === "stamina" ? `${a.name} collapses. Remains stay.` : `${a.name} falls. Remains stay until the pick raises them.`);
			bumpShake(.45);
			if (by && by !== "hero" && by !== "overlord" && by !== "smash") {
				const p = pressure[by];
				p.heroKills += 1;
				if (p.heroKills >= 3 && (p.giantArmed || p.deformArmed || p.breedArmed)) {
					p.giantArmed = false;
					p.deformArmed = false;
					p.breedArmed = false;
					p.hunger = 0;
					p.predation = Math.max(0, p.predation - 4);
					toast("Hero-blood steadies the line. Next births come out basic.");
				}
			}
			return;
		}
		if (a.kind === "overlord") {
			a.alive = true;
			a.hp = Math.max(1, a.hp);
			return;
		}
		monsterDeaths += 1;
		api.monsterDeaths = monsterDeaths;
		if (a.species === "skeleton" || a.species === "bud") {
			if (a.species === "skeleton") corpses.push(makePile(a.x, a.y, {
				manaAtDeath: a.mag,
				cls: a.heroClass,
				red: a.rattle === 3,
				spirits: a.rattle === 3 ? 5 : 0
			}));
			sfx("die");
			burst(a.x, a.y, a.species === "bud" ? "#6a4494" : "#efe6d2", 6, 1.4);
			return;
		}
		if (a.species === "moss" && cause === "age" && a.brood !== "bloom") {
			a.alive = true;
			a.brood = "bloom";
			a.speed = 0;
			a.name = "Loam Bloom";
			a.hatch = 14;
			markSeen("wiltbloom");
			toast("A Loamite opens into a Bloom.");
			return;
		}
		if (a.species === "moss" && (a.brood === "bud" || a.brood === "bloom") && (cause === "smash" || cause === "combat")) {
			hatchLoamites(a, "smash");
			sfx(cause === "smash" ? "smash" : "die");
			return;
		}
		if (a.species && cause === "starve") {
			pressure[a.species].starveDeaths += 1;
			pressure[a.species].hunger += 2;
			maybeArm(a.species);
		}
		if (cause !== "eaten") dumpOrthogonal(a.x, a.y, Math.floor(a.carryN * .5), Math.floor(a.carryM * .5), false);
		if (cause === "smash") {
			sfx("smash");
			burst(a.x, a.y, "#c4a574", 12, 2.8);
			toast(`${a.name} is crushed into fertilizer.`);
			birthCd = Math.min(birthCd, .35);
		} else if (cause !== "eaten") {
			sfx("die");
			burst(a.x, a.y, "#8a5a3a", 6, 1.6);
		}
	}
	function trySpawn(sp, x, y, major = 1, sub = 0) {
		if (!isOpen(x, y) || actorAt(x, y)) return null;
		if (countSpecies(sp) >= CAP[sp]) return null;
		birthMajor = major;
		birthSub = sub;
		return spawnMonster(sp, x, y, rollVariant(sp), "adult");
	}
	function staminaPool() {
		const total = built.waves.length;
		if (!built.endless && total > 0 && launched >= total) return 160;
		if (built.endless) {
			if (raids <= 0) return 90;
			if (raids === 1) return 110;
			if (raids >= 4) return 160;
			return 130;
		}
		if (launched <= 1) return 90;
		if (launched === 2) return 110;
		return 130;
	}
	function spawnHero(cls, x, y, mul = 1) {
		const b = HERO_BASE[cls];
		const old = HERO_OLD[cls];
		const late = !built.endless && launched >= 2 || built.endless && raids >= 1;
		const last = !built.endless && built.waves.length > 0 && launched >= built.waves.length;
		let hp;
		let atk;
		if (last) {
			hp = Math.max(1, Math.round(old.hp * 2 * mul));
			atk = Math.max(1, Math.round(old.atk * 1.7 * mul));
		} else if (late) {
			const span = built.endless ? 4 : Math.max(1, built.waves.length - 1);
			const step = built.endless ? Math.min(raids, span) : launched - 1;
			const t = Math.min(.85, step / span);
			hp = Math.max(1, Math.round((b.hp + (old.hp * 2 - b.hp) * t) * mul));
			atk = Math.max(1, Math.round((b.atk + (old.atk * 1.7 - b.atk) * t) * mul));
		} else {
			hp = Math.max(1, Math.round(b.hp * mul));
			atk = Math.max(1, Math.round(b.atk * mul));
		}
		const pool = staminaPool();
		const named = mul >= 1.6 ? cls === "knight" ? "Oathbound Knight" : cls === "mage" ? "Well-Mage" : cls === "priest" ? "Ash Cantor" : `Veteran ${b.name}` : mul > 1.15 ? `Veteran ${b.name}` : b.name;
		const a = {
			id: nextId++,
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
			def: b.def,
			mag: Math.max(0, Math.round(b.mag * mul)),
			combat: atk,
			speed: b.speed,
			satiety: 9,
			vitality: 0,
			carryN: 0,
			carryM: 0,
			moveCd: .2,
			swingCd: .15,
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
			hunger: 100
		};
		actors.push(a);
		if (cls === "knight") a.shield = 1;
		toast(`A ${b.name.toLowerCase()} steps through the stair.`);
		sfx("wave");
		bumpShake(.35);
		burst(x, y, "#d9d3c7", 10, 2);
	}
	function queueWave(heroes) {
		if (lordState === "none") return;
		invasionStarted = true;
		heroes.forEach((h, i) => spawnQueue.push({
			cls: h.cls,
			mul: h.mul,
			delay: i === 0 ? .2 : 1.25,
			waited: 0
		}));
	}
	function launchWave(index) {
		const wave = built.waves[index];
		if (!wave || lordState === "none") return;
		launched = index + 1;
		lordLeft = 0;
		upgradeOpen = false;
		petitionAsk = false;
		petitionYes = false;
		petitionDelay = null;
		raidTen = false;
		queueWave(wave.heroes);
		shout("HUMANS IN THE HOLLOW");
		if (!built.endless && index === built.waves.length - 1 && built.waves.length >= 6) toast("The oathbound trio descends.");
	}
	function releaseSpawns(dt) {
		if (!spawnQueue.length) return;
		const job = spawnQueue[0];
		job.delay -= dt;
		if (job.delay > 0) return;
		let spot = null;
		if (!actorAt(built.entrance.x, built.entrance.y)) spot = built.entrance;
		else spot = freeNeighbor(built.entrance.x, built.entrance.y);
		job.waited += dt;
		if (!spot && job.waited < 2) {
			job.delay = .25;
			return;
		}
		spawnQueue.shift();
		spawnHero(job.cls, spot?.x ?? built.entrance.x, spot?.y ?? built.entrance.y, job.mul);
	}
	function invasionActive() {
		for (const a of actors) if (a.alive && a.kind === "hero") return true;
		return false;
	}
	function wantsSleep(a) {
		if (a.form !== "adult") return false;
		if (a.species !== "lizard" && a.species !== "drake") return false;
		if (a.rest <= 0) return false;
		if (a.hp < a.maxHp) return false;
		if (a.satiety < 6 && a.feedCd <= 1.2) return false;
		return true;
	}
	function standBeside(wx, wy, ax, ay) {
		let best = null;
		let bestD = 1e9;
		for (let d = 0; d < 4; d++) {
			const x = wx + DX[d];
			const y = wy + DY[d];
			if (!isOpen(x, y)) continue;
			const dist = Math.abs(x - ax) + Math.abs(y - ay);
			if (dist < bestD) {
				bestD = dist;
				best = {
					x,
					y
				};
			}
		}
		return best;
	}
	function soilNear(ax, ay, radius, fluid, want) {
		let best = null;
		let bestV = want === "rich" ? -1 : 1e9;
		for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
			if (Math.abs(x - ax) + Math.abs(y - ay) > radius) continue;
			const t = tileAt(x, y);
			if (!t || t.kind !== "soil") continue;
			const v = fluid === "n" ? t.nutrient : t.mana;
			if (want === "rich" && v <= 0) continue;
			if (!standBeside(x, y, ax, ay)) continue;
			if (want === "rich" ? v > bestV : v < bestV) {
				bestV = v;
				best = {
					x,
					y,
					t
				};
			}
		}
		return best;
	}
	function takeFluid(t, fluid, amt) {
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
	function giveFluid(t, fluid, amt) {
		if (amt <= 0) return;
		if (fluid === "n") t.nutrient += amt;
		else t.mana += amt;
		syncFluid(t);
	}
	function truck(a, fluid) {
		if ((fluid === "n" ? a.carryN : a.carryM) >= 5) {
			const poor = soilNear(a.x, a.y, 8, fluid, "poor");
			if (!poor) {
				if (fluid === "n") rootBud(a);
				else a.job = "idle";
				return;
			}
			const stand = standBeside(poor.x, poor.y, a.x, a.y);
			if (!stand) {
				a.job = "idle";
				return;
			}
			if (a.x === stand.x && a.y === stand.y) {
				const dump = Math.min(5, fluid === "n" ? a.carryN : a.carryM);
				if (fluid === "n") a.carryN -= dump;
				else a.carryM -= dump;
				giveFluid(poor.t, fluid, dump);
				a.job = "spit";
				a.path = null;
				return;
			}
			a.job = "spit";
			if (pursue(a, stand.x, stand.y) === "none") a.job = "idle";
			return;
		}
		const rich = soilNear(a.x, a.y, 4, fluid, "rich");
		if (!rich) {
			const far = farTile(a, 4, 8);
			if (!far) {
				a.job = "idle";
				return;
			}
			a.job = "far";
			pursue(a, far.x, far.y);
			return;
		}
		const stand = standBeside(rich.x, rich.y, a.x, a.y);
		if (!stand) {
			a.job = "idle";
			return;
		}
		if (Math.abs(a.x - rich.x) + Math.abs(a.y - rich.y) === 1) {
			const take = takeFluid(rich.t, fluid, 5);
			if (fluid === "n") a.carryN += take;
			else a.carryM += take;
			a.job = "suck";
			a.path = null;
			return;
		}
		a.job = "suck";
		if (pursue(a, stand.x, stand.y) === "none") a.job = "idle";
	}
	function farTile(a, minD, maxD) {
		if (a.job === "far" && a.pathTx >= 0 && isOpen(a.pathTx, a.pathTy) && (a.x !== a.pathTx || a.y !== a.pathTy)) return {
			x: a.pathTx,
			y: a.pathTy
		};
		const opts = [];
		for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
			if (!isOpen(x, y)) continue;
			const d = Math.abs(x - a.x) + Math.abs(y - a.y);
			if (d < 1 || d > maxD) continue;
			opts.push({
				x,
				y,
				d,
				edge: openNeighbors(x, y)
			});
		}
		const band = opts.filter((o) => o.d >= minD);
		const bag = band.length ? band : opts;
		if (!bag.length) return null;
		bag.sort((p, q) => p.edge - q.edge || q.d - p.d);
		const pick = bag[(a.id + gridStamp) % bag.length];
		return {
			x: pick.x,
			y: pick.y
		};
	}
	function horizontalHalls(minLen) {
		const out = [];
		for (let y = 1; y < rows - 1; y++) {
			let run = 0;
			let start = 1;
			for (let x = 1; x <= cols; x++) if (x < cols && isOpen(x, y)) {
				if (run === 0) start = x;
				run++;
			} else {
				if (run >= minLen) out.push({
					y,
					x0: start,
					x1: start + run - 1
				});
				run = 0;
			}
		}
		return out;
	}
	function straightHall(minLen) {
		let best = null;
		let bestLen = minLen - 1;
		for (const h of horizontalHalls(minLen)) {
			const len = h.x1 - h.x0 + 1;
			if (len > bestLen) {
				bestLen = len;
				best = {
					x: h.x0,
					y: h.y,
					x2: h.x1,
					y2: h.y
				};
			}
		}
		for (let x = 1; x < cols - 1; x++) {
			let run = 0;
			let start = 1;
			for (let y = 1; y <= rows; y++) if (y < rows && isOpen(x, y)) {
				if (run === 0) start = y;
				run++;
			} else {
				if (run > bestLen) {
					bestLen = run;
					best = {
						x,
						y: start,
						x2: x,
						y2: start + run - 1
					};
				}
				run = 0;
			}
		}
		return best;
	}
	function pingPong(a, x0, y0, x1, y1) {
		const at0 = a.x === x0 && a.y === y0;
		const at1 = a.x === x1 && a.y === y1;
		if (a.job !== "east" && a.job !== "west") a.job = "east";
		if (a.job === "east" && at1) a.job = "west";
		else if (a.job === "west" && at0) a.job = "east";
		const tx = a.job === "east" ? x1 : x0;
		const ty = a.job === "east" ? y1 : y0;
		if (a.x === tx && a.y === ty) {
			a.job = "hold";
			return;
		}
		if (pursue(a, tx, ty) === "none") a.job = "idle";
	}
	function rattleBag(a) {
		let bag = rattleMem.get(a.id);
		if (!bag) {
			bag = new Uint8Array(cols * rows);
			rattleMem.set(a.id, bag);
		}
		return bag;
	}
	function rattleGoal(a) {
		const bag = rattleBag(a);
		const here = a.y * cols + a.x;
		if (here >= 0 && here < bag.length) bag[here] = 1;
		const near = nearestOpen(a.x, a.y, (x, y) => {
			return Math.abs(x - a.x) + Math.abs(y - a.y) <= 8 && bag[y * cols + x] === 0;
		});
		if (near) return near;
		bag.fill(0);
		if (here >= 0 && here < bag.length) bag[here] = 1;
		let best = null;
		let bestD = -1;
		for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
			if (!isOpen(x, y)) continue;
			const d = Math.abs(x - a.x) + Math.abs(y - a.y);
			if (d < 1 || d > 8 || d <= bestD) continue;
			bestD = d;
			best = {
				x,
				y
			};
		}
		return best;
	}
	function localAllyCount(x, y, selfId) {
		let n = 0;
		for (const o of actors) {
			if (!o.alive || o.id === selfId || o.kind !== "monster" || !o.species) continue;
			if (o.species === "bud" || o.species === "skeleton") continue;
			if (sameRoom(x, y, o.x, o.y, 4)) n += 1;
		}
		return n;
	}
	function demonPost(a) {
		if (a.anchor >= 0) {
			const x = a.anchor % cols;
			const y = a.anchor / cols | 0;
			if (isOpen(x, y)) {
				const near = localAllyCount(x, y, a.id);
				let any = false;
				for (const o of actors) {
					if (!o.alive || o.id === a.id || o.kind !== "monster" || !o.species) continue;
					if (o.species === "bud" || o.species === "skeleton") continue;
					any = true;
					break;
				}
				if (a.wob === 1 && near > 0) return {
					x,
					y
				};
				if (a.wob === 0 && !any) return {
					x,
					y
				};
			}
		}
		const nCells = cols * rows;
		const seen = new Uint8Array(nCells);
		const compId = new Int32Array(nCells);
		compId.fill(-1);
		const comps = [];
		for (let i = 0; i < nCells; i++) {
			const x = i % cols;
			const y = i / cols | 0;
			if (seen[i] || !isOpen(x, y)) continue;
			const id = comps.length;
			const cells = [];
			const q = [i];
			seen[i] = 1;
			let qi = 0;
			while (qi < q.length) {
				const cur = q[qi++];
				compId[cur] = id;
				cells.push(cur);
				const cx = cur % cols;
				const cy = cur / cols | 0;
				for (let d = 0; d < 4; d++) {
					const nx = cx + DX[d];
					const ny = cy + DY[d];
					if (!isOpen(nx, ny)) continue;
					const ni = ny * cols + nx;
					if (seen[ni]) continue;
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
		const allyOf = comps.map(() => []);
		for (const o of actors) {
			if (!o.alive || o.id === a.id || o.kind !== "monster" || !o.species) continue;
			if (o.species === "bud" || o.species === "skeleton") continue;
			const id = compId[o.y * cols + o.x];
			if (id >= 0) allyOf[id].push(o);
		}
		let bestId = 0;
		let bestAllies = -1;
		let bestSize = -1;
		for (let i = 0; i < comps.length; i++) {
			const n = allyOf[i].length;
			if (n > bestAllies || n === bestAllies && comps[i].length > bestSize) {
				bestAllies = n;
				bestSize = comps[i].length;
				bestId = i;
			}
		}
		const cells = comps[bestId];
		const allies = allyOf[bestId];
		let sx = cells[0] % cols;
		let sy = cells[0] / cols | 0;
		if (allies.length) {
			let bestScore = -1;
			const cand = /* @__PURE__ */ new Set();
			for (const o of allies) {
				cand.add(o.y * cols + o.x);
				for (let d = 0; d < 4; d++) {
					const nx = o.x + DX[d];
					const ny = o.y + DY[d];
					if (isOpen(nx, ny)) cand.add(ny * cols + nx);
				}
			}
			for (const idx of cand) {
				if (compId[idx] !== bestId) continue;
				const cx = idx % cols;
				const cy = idx / cols | 0;
				let score = 0;
				for (const o of allies) if (sameRoom(cx, cy, o.x, o.y, 4)) score += 1;
				const blocked = actorAt(cx, cy, a.id) ? 1 : 0;
				if (score > bestScore || score === bestScore && blocked === 0) {
					bestScore = score;
					sx = cx;
					sy = cy;
				}
			}
		} else {
			let ax = 0;
			let ay = 0;
			for (const idx of cells) {
				ax += idx % cols;
				ay += idx / cols | 0;
			}
			const cx = ax / cells.length;
			const cy = ay / cells.length;
			let bestD = 1e9;
			for (const idx of cells) {
				const px = idx % cols;
				const py = idx / cols | 0;
				const dist = Math.abs(px - cx) + Math.abs(py - cy);
				if (dist < bestD) {
					bestD = dist;
					sx = px;
					sy = py;
				}
			}
		}
		a.anchor = sy * cols + sx;
		a.wob = allies.length > 0 ? 1 : 0;
		return {
			x: sx,
			y: sy
		};
	}
	function actMonster(a) {
		if (a.form === "egg" || a.form === "pupa") return;
		if (a.species === "moss" && (a.brood === "bud" || a.brood === "bloom")) return;
		if (a.sleep > 0) {
			if (nearest(a, (o) => isPrey(a, o) && Math.abs(o.x - a.x) + Math.abs(o.y - a.y) <= 1) || a.hitFlash > 0) a.sleep = 0;
			else {
				a.job = "hold";
				return;
			}
		}
		if (wantsSleep(a)) {
			if (!nearest(a, (o) => isPrey(a, o) && Math.abs(o.x - a.x) + Math.abs(o.y - a.y) <= 1)) {
				if ((a.species === "drake" ? a.carryM : a.carryN) >= 5) {
					if (a.species === "drake") a.carryM -= 5;
					else a.carryN -= 5;
					a.sleep = 8;
					a.job = "hold";
					return;
				}
			}
		}
		if (a.species === "moss") {
			truck(a, "n");
			return;
		}
		if (a.species === "spirit") {
			const bones = corpses.find((c) => c.life > 0 && Math.abs(c.x - a.x) + Math.abs(c.y - a.y) <= 3);
			if (bones && (a.x !== bones.x || a.y !== bones.y)) {
				a.job = "bones";
				pursue(a, bones.x, bones.y);
				return;
			}
			truck(a, "m");
			return;
		}
		if (a.species === "nimbus") {
			if (invasionActive()) {
				const h = nearest(a, (o) => o.kind === "hero" && los(a.x, a.y, o.x, o.y, 3));
				if (h) {
					a.face = h.x >= a.x ? 1 : -1;
					a.job = "hold";
					return;
				}
			}
			truck(a, "m");
			return;
		}
		if (a.species === "crawler") {
			if (a.form === "adult" && a.carryN >= 45) {
				if (openNeighbors(a.x, a.y) <= 1) {
					a.job = "hold";
					return;
				}
				const quiet = nearestOpen(a.x, a.y, (x, y) => openNeighbors(x, y) <= 1);
				if (quiet) {
					a.job = "nest";
					pursue(a, quiet.x, quiet.y);
					return;
				}
			}
			const prey = nearest(a, (o) => isPrey(a, o));
			const close = prey && Math.abs(prey.x - a.x) + Math.abs(prey.y - a.y) <= 3 ? prey : null;
			if (close) {
				a.job = "hunt";
				if (close.x !== a.x || close.y !== a.y) pursue(a, close.x, close.y);
				tryEat(a);
				return;
			}
			if (a.form === "fly" && a.shed < 1 && a.carryN >= 60) {
				if (openNeighbors(a.x, a.y) <= 1) {
					const spot = freeNeighbor(a.x, a.y);
					if (spot && countSpecies("crawler") < CAP.crawler) {
						a.shed = 1;
						a.carryN -= 15;
						const egg = spawnMonster("crawler", spot.x, spot.y, "normal", "egg");
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
				} else {
					const quiet = nearestOpen(a.x, a.y, (x, y) => openNeighbors(x, y) <= 1);
					if (quiet) {
						a.job = "nest";
						pursue(a, quiet.x, quiet.y);
						return;
					}
				}
			}
			const far = farTile(a, 6, 10);
			if (!far) {
				a.job = "idle";
				return;
			}
			a.job = "far";
			pursue(a, far.x, far.y);
			tryEat(a);
			return;
		}
		if (a.species === "lizard") {
			const hungry = a.hp < a.maxHp || a.satiety <= 3;
			const thick = countSpecies("moss") >= 4;
			const prey = nearest(a, (o) => {
				if (!isPrey(a, o)) return false;
				if (o.species === "moss" && !hungry && !thick) return false;
				if (!hungry && a.hp >= a.maxHp && o.species !== "moss" && !thick && o.species === "crawler") return false;
				return hungry || thick || o.species !== "moss";
			});
			if ((hungry || a.hp >= a.maxHp && thick) && prey) {
				a.job = "hunt";
				if (prey.x !== a.x || prey.y !== a.y) pursue(a, prey.x, prey.y);
				tryEat(a);
				return;
			}
			if (a.shed >= 1 ? inNest(a.x, a.y) : legalClaimBox(a.x, a.y) !== null) {
				a.job = "hold";
				tryLay(a);
				return;
			}
			const nest = nearestOpen(a.x, a.y, (x, y) => a.shed >= 1 ? inNest(x, y) : legalClaimBox(x, y) !== null);
			if (nest) {
				a.job = "nest";
				pursue(a, nest.x, nest.y);
				return;
			}
			const far = farTile(a, 4, 8);
			if (far) {
				a.job = "far";
				pursue(a, far.x, far.y);
			} else a.job = "idle";
			return;
		}
		if (a.species === "drake") {
			if (a.satiety <= 3) {
				const prey = nearest(a, (o) => isPrey(a, o));
				if (prey) {
					a.job = "hunt";
					if (prey.x !== a.x || prey.y !== a.y) pursue(a, prey.x, prey.y);
					tryEat(a);
					return;
				}
			}
			if (a.carryM >= 90 && openNeighbors(a.x, a.y) >= 1) tryLay(a);
			const halls = horizontalHalls(4).filter((h) => !actors.some((o) => o.alive && o.id !== a.id && o.species === "drake" && o.y === h.y));
			const hall = halls.find((h) => h.y === a.y && a.x >= h.x0 && a.x <= h.x1) ?? halls.sort((p, q) => q.x1 - q.x0 - (p.x1 - p.x0))[0];
			if (!hall) {
				a.job = "hold";
				return;
			}
			if (a.y !== hall.y) {
				if (pursue(a, hall.x0, hall.y) === "none") a.job = "hold";
				return;
			}
			pingPong(a, hall.x0, hall.y, hall.x1, hall.y);
			return;
		}
		if (a.species === "witch" || a.species === "vampire" || a.species === "succubus") {
			const prey = nearest(a, (o) => isPrey(a, o));
			if (prey) {
				a.job = "hunt";
				if (Math.abs(prey.x - a.x) + Math.abs(prey.y - a.y) <= 1) {
					a.face = prey.x >= a.x ? 1 : -1;
					tryEat(a);
					return;
				}
				pursue(a, prey.x, prey.y);
				tryEat(a);
				return;
			}
			const hero = invasionActive() ? nearest(a, (o) => o.kind === "hero" && los(a.x, a.y, o.x, o.y, 3)) : null;
			if (hero) {
				a.face = hero.x >= a.x ? 1 : -1;
				a.dir = hero.x !== a.x ? hero.x > a.x ? 1 : 3 : hero.y > a.y ? 2 : 0;
				a.job = "hold";
				return;
			}
			const hall = straightHall(4);
			if (!hall) {
				a.job = "idle";
				return;
			}
			pingPong(a, hall.x, hall.y, hall.x2, hall.y2);
			return;
		}
		if (a.species === "bud") {
			const rival = nearest(a, (o) => o.species === "bud" && o.id !== a.id && sameRoom(a.x, a.y, o.x, o.y, 4));
			if (rival) {
				a.job = "fight";
				if (Math.abs(rival.x - a.x) + Math.abs(rival.y - a.y) <= 1) {
					a.face = rival.x >= a.x ? 1 : -1;
					a.job = "hold";
					return;
				}
				pursue(a, rival.x, rival.y);
				return;
			}
			const post = demonPost(a);
			if (!post || post.x === a.x && post.y === a.y) {
				a.job = "hold";
				return;
			}
			a.job = "room";
			pursue(a, post.x, post.y);
			return;
		}
		if (a.species === "skeleton") {
			const h = nearest(a, (o) => o.kind === "hero");
			if (h && Math.abs(h.x - a.x) + Math.abs(h.y - a.y) <= 3 && (h.x === a.x || h.y === a.y)) {
				a.job = "fight";
				if (Math.abs(h.x - a.x) + Math.abs(h.y - a.y) <= 1) {
					a.face = h.x >= a.x ? 1 : -1;
					a.job = "hold";
					return;
				}
				pursue(a, h.x, h.y);
				return;
			}
			const goal = rattleGoal(a);
			if (!goal) {
				a.job = "idle";
				return;
			}
			a.job = "explore";
			if (pursue(a, goal.x, goal.y) === "none") a.job = "idle";
			return;
		}
		a.job = "idle";
	}
	function heroReach(a) {
		if (a.heroClass === "archer") return 4;
		if (a.heroClass === "mage") return 3;
		if (a.heroClass === "priest") return 2;
		return 1;
	}
	function inFight(a) {
		const reach = heroReach(a);
		return actors.some((m) => m.alive && m.kind === "monster" && m.form !== "egg" && m.form !== "pupa" && los(a.x, a.y, m.x, m.y, reach));
	}
	function noteStuck(a, dt) {
		if (inFight(a)) return;
		const cell = a.y * cols + a.x;
		if (a.anchor < 0) {
			a.anchor = cell;
			a.wob = -1;
		}
		if (cell === a.anchor || a.wob >= 0 && cell === a.wob) a.stuck += dt;
		else if (a.wob < 0) {
			a.wob = cell;
			a.stuck += dt;
		} else {
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
	function actHero(a) {
		if (a.frust >= 3) {
			const power = digPower;
			frustratedDig(a);
			digPower = power;
			a.frust = 0;
			a.stuck = 0;
			a.anchor = -1;
			a.wob = -1;
			a.job = "";
			a.path = null;
			return;
		}
		const lord = actors.find((o) => o.alive && o.kind === "overlord") ?? null;
		const lordFree = !!lord && lordState !== "carried";
		if (!a.carrying && lordFree && lord && Math.abs(lord.x - a.x) + Math.abs(lord.y - a.y) <= 1) {
			grab(a, lord);
			return;
		}
		if (a.carrying) {
			a.job = "stair";
			if (pursue(a, built.entrance.x, built.entrance.y) === "none") a.job = "idle";
			return;
		}
		if (lordFree && lord && los(a.x, a.y, lord.x, lord.y, Math.max(cols, rows))) {
			ensureIntel(a).lord = 1;
			a.job = "warden";
			if (pursue(a, lord.x, lord.y) === "none") a.job = "idle";
			return;
		}
		const reach = heroReach(a);
		const shot = nearest(a, (o) => o.kind === "monster" && o.form !== "egg" && o.form !== "pupa" && (o.x === a.x || o.y === a.y) && Math.abs(o.x - a.x) + Math.abs(o.y - a.y) <= 3 && los(a.x, a.y, o.x, o.y, 3));
		if (shot) {
			const d = Math.abs(shot.x - a.x) + Math.abs(shot.y - a.y);
			a.face = shot.x >= a.x ? 1 : -1;
			if (d <= reach) {
				a.job = "hold";
				a.dir = shot.x !== a.x ? shot.x > a.x ? 1 : 3 : shot.y > a.y ? 2 : 0;
				return;
			}
			a.job = "fight";
			pursue(a, shot.x, shot.y);
			return;
		}
		const bag = ensureIntel(a);
		if (a.job === "explore" && a.pathTx >= 0 && isOpen(a.pathTx, a.pathTy) && (a.x !== a.pathTx || a.y !== a.pathTy) && bag.seen[a.pathTy * cols + a.pathTx] === 0 && bag.dead[a.pathTy * cols + a.pathTx] === 0) {
			if (pursue(a, a.pathTx, a.pathTy) !== "none") return;
		}
		const unseen = nearestOpen(a.x, a.y, (x, y) => {
			const i = y * cols + x;
			return bag.seen[i] === 0 && bag.dead[i] === 0;
		});
		if (unseen) {
			a.job = "explore";
			if (pursue(a, unseen.x, unseen.y) === "none") a.job = "idle";
			return;
		}
		if (!bag.lord) {
			const deep = farthestFromStair();
			if (deep && (deep.x !== a.x || deep.y !== a.y)) {
				a.job = "deep";
				if (pursue(a, deep.x, deep.y) !== "none") return;
			}
		}
		a.job = "idle";
	}
	function combat() {
		const heroes = actors.filter((a) => a.alive && a.kind === "hero");
		const lord = actors.find((a) => a.alive && a.kind === "overlord") ?? null;
		for (const m of actors) {
			if (!m.alive || m.kind !== "monster" || m.form === "egg" || m.form === "pupa") continue;
			if (m.swingCd > 0 || m.sleep > 0 || m.windup > 0) continue;
			if (m.species === "drake") {
				let breath = null;
				let best = 1e9;
				for (const h of heroes) {
					if (h.y !== m.y) continue;
					if (!los(m.x, m.y, h.x, h.y, cols)) continue;
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
					strike(m, breath);
				}
				continue;
			}
			if (m.species === "bud") {
				let rival = null;
				for (const o of actors) {
					if (!o.alive || o.id === m.id || o.species !== "bud") continue;
					if (Math.abs(o.x - m.x) + Math.abs(o.y - m.y) > 1) continue;
					if (!sameRoom(m.x, m.y, o.x, o.y, 4)) continue;
					rival = o;
					break;
				}
				if (rival) {
					m.swingCd = .7;
					strike(m, rival);
					continue;
				}
				let curse = null;
				let best = 99;
				for (const h of heroes) {
					if (h.x !== m.x && h.y !== m.y) continue;
					const d = Math.abs(h.x - m.x) + Math.abs(h.y - m.y);
					if (d <= 0 || d > 3 || !los(m.x, m.y, h.x, h.y, 3)) continue;
					if (d < best) {
						best = d;
						curse = h;
					}
				}
				if (curse) {
					m.swingCd = 1.6;
					m.face = curse.x >= m.x ? 1 : -1;
					curse.vitality = Math.max(curse.vitality, 2);
					float(curse.x, curse.y, "SLOW", "#c9a6e8");
					strike(m, curse);
				}
				continue;
			}
			let target = null;
			if (m.species === "witch" || m.species === "vampire" || m.species === "succubus" || m.species === "nimbus" || m.species === "skeleton" && m.rattle === 1 || m.mag > 0) {
				let best = 1e9;
				const reach = m.species === "skeleton" ? 3 : 3;
				for (const h of heroes) {
					if (!los(m.x, m.y, h.x, h.y, reach)) continue;
					const d = Math.abs(h.x - m.x) + Math.abs(h.y - m.y);
					if (d < best) {
						best = d;
						target = h;
					}
				}
			}
			if (!target && m.species !== "skeleton") {
				for (const h of heroes) if (Math.abs(h.x - m.x) + Math.abs(h.y - m.y) <= 1) {
					target = h;
					break;
				}
			} else if (!target && m.species === "skeleton" && m.rattle !== 1) {
				for (const h of heroes) if (Math.abs(h.x - m.x) + Math.abs(h.y - m.y) <= 1) {
					target = h;
					break;
				}
			}
			if (target) {
				m.swingCd = m.variant === "giant" ? .66 : .48;
				strike(m, target);
			}
		}
		for (const h of heroes) {
			if (!h.alive || h.swingCd > 0 || h.sleep > 0 || h.windup > 0 || h.carrying) continue;
			const cls = h.heroClass ?? "swordsman";
			let tx = -1;
			let ty = -1;
			if (cls === "priest" && !h.priestUsed) {
				const ally = nearest(h, (o) => o.kind === "hero" && o.id !== h.id && o.hp < o.maxHp && los(h.x, h.y, o.x, o.y, 2));
				if (ally) {
					tx = ally.x;
					ty = ally.y;
				}
			}
			const reach = cls === "archer" ? 4 : cls === "swordsman" || cls === "knight" || cls === "thief" ? 1 : HERO_BASE[cls].range;
			const foe = nearest(h, (o) => o.kind === "monster" && o.form !== "egg" && los(h.x, h.y, o.x, o.y, reach));
			if (foe) {
				tx = foe.x;
				ty = foe.y;
			} else if (lord && lordState !== "carried" && Math.abs(lord.x - h.x) + Math.abs(lord.y - h.y) <= 1) {
				grab(h, lord);
				continue;
			}
			if (tx < 0) continue;
			h.windup = h.atk >= Math.round(HERO_BASE[cls].atk * 1.45) ? .9 : .6;
			h.pathTx = tx;
			h.pathTy = ty;
			if (tx > h.x) h.dir = 1;
			else if (tx < h.x) h.dir = 3;
			else if (ty < h.y) h.dir = 0;
			else if (ty > h.y) h.dir = 2;
			float(h.x, h.y, "…", "#f3e6c8");
		}
		if (lord && lord.alive && lordState !== "carried" && lord.swingCd <= 0 && lord.sleep <= 0) {
			const h = heroes.find((o) => o.alive && Math.abs(o.x - lord.x) + Math.abs(o.y - lord.y) <= 1 && !o.carrying);
			if (h) {
				lord.swingCd = .44;
				strike(lord, h);
			}
		}
	}
	function releaseSkill(a) {
		if (!a.alive || a.kind !== "hero") return;
		const cls = a.heroClass ?? "swordsman";
		a.stamina -= cls === "mage" || cls === "priest" || cls === "archer" ? 8 : 2;
		if (a.stamina <= 0) {
			slay(a, "stamina", null);
			return;
		}
		const clsCast = cls === "mage" || cls === "priest";
		paintDiamond(a.x, a.y, clsCast ? 0 : 16, clsCast ? 16 : 0);
		const heavy = a.atk >= Math.round(HERO_BASE[cls].atk * 1.45);
		const slash = (dir, len) => {
			const dx = dir === 1 ? 1 : dir === 3 ? -1 : 0;
			const dy = dir === 0 ? -1 : dir === 2 ? 1 : 0;
			if (dx === 0 && dy === 0) return;
			for (let i = 1; i <= len; i++) {
				const x = a.x + dx * i;
				const y = a.y + dy * i;
				if (!isOpen(x, y)) {
					const wall = tileAt(x, y);
					if (wall && wall.kind === "soil") {
						bumpN(wall);
						bumpN(wall);
					}
					break;
				}
				const occ = actorAt(x, y);
				if (occ && occ.kind === "monster" && occ.alive) strike(a, occ);
			}
		};
		if (cls === "swordsman") {
			slash(a.dir, 3);
			if (heavy) slash((a.dir + 1) % 4, 3);
			return;
		}
		if (cls === "archer") {
			const dx = a.dir === 1 ? 1 : a.dir === 3 ? -1 : 0;
			const dy = a.dir === 0 ? -1 : a.dir === 2 ? 1 : 0;
			for (let i = 1; i <= 4; i++) {
				const x = a.x + dx * i;
				const y = a.y + dy * i;
				const wall = tileAt(x, y);
				if (wall && wall.kind === "soil") {
					bumpN(wall);
					bumpN(wall);
					break;
				}
				if (!isOpen(x, y)) break;
				const occ = actorAt(x, y);
				if (occ && occ.alive && occ.kind === "monster") {
					strike(a, occ);
					break;
				}
			}
			return;
		}
		if (cls === "mage") {
			boltRewrite(a.x, a.y, a.pathTx, a.pathTy, 2);
			const occ = actorAt(a.pathTx, a.pathTy);
			if (occ && occ.alive && occ.kind === "monster" && los(a.x, a.y, occ.x, occ.y, 3)) {
				strike(a, occ);
				pour(occ.x, occ.y, 0, 2);
			} else pour(a.pathTx, a.pathTy, 0, 2);
			return;
		}
		if (cls === "priest") {
			boltRewrite(a.x, a.y, a.pathTx, a.pathTy, 1);
			if (!a.priestUsed) {
				let ally = null;
				let lowest = 2;
				for (const o of actors) {
					if (!o.alive || o.kind !== "hero" || o.id === a.id) continue;
					if (!los(a.x, a.y, o.x, o.y, 2)) continue;
					const ratio = o.hp / o.maxHp;
					if (ratio < lowest) {
						lowest = ratio;
						ally = o;
					}
				}
				if (ally && ally.hp < ally.maxHp) {
					ally.hp = Math.min(ally.maxHp, ally.hp + 8);
					a.priestUsed = true;
					float(ally.x, ally.y, "heal", "#f0d060");
					pour(a.x, a.y, 0, 3);
				}
			}
			const occ = actorAt(a.pathTx, a.pathTy);
			if (occ && occ.alive && occ.kind === "monster" && los(a.x, a.y, occ.x, occ.y, 2)) strike(a, occ);
			return;
		}
		const occ = actorAt(a.pathTx, a.pathTy);
		if (occ && occ.alive && occ.kind === "monster" && Math.abs(occ.x - a.x) + Math.abs(occ.y - a.y) <= 1) strike(a, occ);
		if (heavy && cls === "knight") {
			slash(a.dir, 2);
			pour(a.x, a.y, 0, 2);
			float(a.x, a.y, "WAR", "#f3e6c8");
			for (let d = 0; d < 4; d++) {
				const wall = tileAt(a.x + DX[d], a.y + DY[d]);
				if (wall && wall.kind === "soil") spellWall(wall, 1);
			}
		}
	}
	function finish(outcome, reason) {
		if (phase !== "play") return;
		phase = outcome;
		const bits = [];
		for (const sp of SPECIES_ORDER) {
			const n = countSpecies(sp);
			if (n) bits.push(`${SPECIES_NAME[sp]} ${n}`);
		}
		result = {
			outcome,
			reason,
			seconds: Math.floor(time),
			peakHorde,
			heroesSlain,
			mutations,
			living: bits.join(" · ") || "Nothing living"
		};
		if (outcome === "win") {
			sfx("win");
			burst(built.entrance.x, built.entrance.y, "#6fbf4a", 18, 3);
			if (!save.cleared.includes(stageId) && !built.endless) save.cleared.push(stageId);
		} else sfx("lose");
		persist();
		emit();
	}
	function checkEnd() {
		if (phase !== "play") return;
		const threat = heroThreat();
		if (built.endless) {
			if (raidWarn !== null) return;
			if (raidActive && !threat) {
				raidActive = false;
				raids += 1;
				grantStipend();
				toast("The raid breaks on the soil.");
				emit();
			}
			return;
		}
		const wavesDone = built.waves.length > 0 && launched >= built.waves.length && ecoWait === null && clearNoted >= launched && spawnQueue.length === 0;
		if (invasionStarted && wavesDone && !threat && lordState !== "none") {
			finish("win", staminaFalls > 0 && combatFalls === 0 ? "The heroes spent their stamina. The hollow holds." : "The hollow holds. The heroes are mulch.");
			return;
		}
	}
	function recomputeHorde() {
		let h = 0;
		for (const sp of SPECIES_ORDER) {
			const pop = countSpecies(sp);
			if (pop > pressure[sp].peak) pressure[sp].peak = pop;
		}
		for (const a of actors) if (a.alive && a.kind === "monster" && a.form === "adult") h += a.combat;
		horde = h;
		if (h > peakHorde) {
			peakHorde = h;
			if (h > save.best) {
				save.best = h;
				persist();
			}
		}
	}
	function advanceHint() {
		const moss = countSpecies("moss") + born.moss;
		const crawlers = born.crawler;
		const lizards = born.lizard;
		let next = hintStep;
		if (hintStep === 0 && digs >= 1) next = 1;
		else if (hintStep === 1 && moss >= 1) next = 2;
		else if (hintStep === 2 && crawlers >= 1) next = 3;
		else if (hintStep === 3 && (lizards >= 1 || nestTiles.length > 0)) next = 4;
		else if (hintStep === 4 && lordState !== "none") next = 5;
		else if (hintStep === 5 && invasionStarted) next = 6;
		if (next !== hintStep) hintStep = next;
	}
	function grantStipend() {
		const warden = actors.some((a) => a.alive && a.kind === "overlord");
		let grant = 0;
		if (warden) {
			let eco = 0;
			for (const a of actors) {
				if (!a.alive || a.kind !== "monster") continue;
				if (a.species === "skeleton" || a.species === "bud") continue;
				eco += 1;
			}
			if (eco >= 4) grant = 90;
			else if (eco >= 2) grant = 70;
			else grant = 50;
		}
		digPower += grant;
		if (digPower > maxDig) maxDig = digPower;
		upgradeOpen = false;
		petitionAsk = false;
		petitionYes = false;
		petitionDelay = 3;
		lordLeft = 1;
		raidTen = false;
		shout("The hollow held.");
	}
	function corpseAt(x, y) {
		for (let i = corpses.length - 1; i >= 0; i--) if (corpses[i].x === x && corpses[i].y === y && corpses[i].life > 0) return corpses[i];
		return null;
	}
	function raiseRattle(c) {
		if (actors.filter((a) => a.alive && a.species === "skeleton").length >= 4) {
			toast("Four Rattles already walk. The pick waits.");
			return;
		}
		const idx = corpses.indexOf(c);
		if (idx >= 0) corpses.splice(idx, 1);
		const spot = actorAt(c.x, c.y) ? freeNeighbor(c.x, c.y) : {
			x: c.x,
			y: c.y
		};
		if (!spot) {
			corpses.push(c);
			return;
		}
		birthMajor = 1;
		birthSub = 0;
		const sk = spawnMonster("skeleton", spot.x, spot.y, "normal", "adult");
		sk.heroClass = c.cls;
		sk.mag = c.manaAtDeath;
		if (c.red) sk.rattle = 3;
		else if (c.cls === "mage" || c.cls === "priest" || c.manaAtDeath >= 6) sk.rattle = 1;
		else if (c.cls === "knight" || c.manaAtDeath >= 3) sk.rattle = 2;
		else sk.rattle = 0;
		sk.name = sk.rattle === 3 ? "Red Rattle" : sk.rattle === 1 ? "Pale Rattle" : sk.rattle === 2 ? "Plated Rattle" : "Bone Rattle";
		if (sk.rattle === 3) {
			sk.atk = 11;
			sk.speed = 2.15;
			sk.hp = Math.round(sk.hp * 1.15);
			sk.maxHp = sk.hp;
		} else if (sk.rattle === 1) {
			sk.mag = Math.max(6, c.manaAtDeath);
			sk.atk = 4;
		} else if (sk.rattle === 2) {
			sk.def += 2;
			sk.hp = Math.round(sk.hp * 1.35);
			sk.maxHp = sk.hp;
		}
		sk.hatch = sk.rattle === 0 || sk.rattle === 1 ? 45 : 90;
		sk.satiety = 9;
		sk.hungerCd = 99;
		sk.carryN = 0;
		sk.carryM = 0;
		sk.sleep = 0;
		sk.rest = 0;
		markSeen("skeleton");
		toast(sk.rattle === 3 ? "The red bones stand up." : sk.rattle === 1 ? "The bones drink mana." : sk.rattle === 2 ? "The bones plate themselves." : "The bones stand up.");
		sfx("smash");
		emit();
	}
	function smashCorpse(c) {
		raiseRattle(c);
	}
	function hungerRate(sp) {
		if (sp === "moss" || sp === "spirit") return 2;
		if (sp === "crawler" || sp === "witch" || sp === "vampire" || sp === "succubus" || sp === "nimbus") return 2.8;
		if (sp === "lizard") return 3.6;
		if (sp === "drake") return 3.2;
		return 0;
	}
	function hexSpend(a) {
		if (a.form !== "adult" || !a.species || a.feedCd > 0) return;
		const living = actors.filter((o) => o.alive && o.form !== "egg" && o.form !== "pupa" && (o.species === "witch" || o.species === "vampire" || o.species === "succubus" || o.species === "nimbus")).length;
		if (living < 3 && a.carryM >= 45) {
			const spot = freeNeighbor(a.x, a.y);
			if (!spot || countSpecies(a.species) >= CAP[a.species]) return;
			a.carryM -= 15;
			a.feedCd = 2.5;
			const kid = spawnMonster(a.species, spot.x, spot.y, "normal", "adult");
			kid.carryM = 30;
			kid.hunger = 100;
			kid.sleep = 0;
			kid.rest = 0;
			return;
		}
		if (living >= 3 && a.carryM >= 42 && webs.length < 8) {
			a.carryM -= 12;
			a.feedCd = 2.5;
			layWeb(a.x, a.y);
		}
	}
	function demonSip(a) {
		a.hunger = 100;
		if (a.feedCd > 0) return;
		for (let d = 0; d < 4; d++) {
			const t = tileAt(a.x + DX[d], a.y + DY[d]);
			if (!t || t.kind !== "soil" || t.mana <= 0) continue;
			t.mana -= 1;
			syncFluid(t);
			a.feedCd = 2;
			return;
		}
	}
	function tick(dt) {
		api.time = time;
		api.shake = shake;
		api.digs = digs;
		if (paused || phase !== "play") {
			for (const p of particles) p.life -= dt;
			for (const f of floaters) f.life -= dt;
			trimFx();
			return;
		}
		time += dt;
		api.time = time;
		eventLife -= dt;
		ominousLife -= dt;
		bannerLife -= dt;
		if (eventLife <= 0) event = "";
		if (ominousLife <= 0) ominous = "";
		if (bannerLife <= 0) banner = "";
		shake = Math.max(0, shake - dt * 2.4);
		api.shake = shake;
		for (const p of particles) {
			p.life -= dt;
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			p.vy += 1.5 * dt;
		}
		for (const f of floaters) {
			f.life -= dt;
			f.y -= dt * .55;
		}
		trimFx();
		nestScan -= dt;
		if (nestScan <= 0) {
			nestScan = .55;
			refreshNests();
			refreshRunes();
		}
		auraScan -= dt;
		if (auraScan <= 0) {
			auraScan = .5;
			tickAura();
		}
		if (prepLeft !== null) {
			prepLeft -= dt;
			if (!raidTen && prepLeft <= 10 && prepLeft > 0) {
				raidTen = true;
				shout("RAID IN 10");
			}
			if (prepLeft <= 0) {
				prepLeft = null;
				if (lordState === "none") autoPlace();
				if (built.waves.length) launchWave(0);
			}
		}
		releaseSpawns(dt);
		for (const a of actors) {
			if (!a.alive) continue;
			a.fx += (a.x - a.fx) * Math.min(1, dt * 12);
			a.fy += (a.y - a.fy) * Math.min(1, dt * 12);
			a.bob += dt * (a.form === "adult" ? 6 : 2);
			a.hitFlash = Math.max(0, a.hitFlash - dt);
			a.moveCd -= dt;
			a.swingCd -= dt;
			if (a.sleep > 0) {
				a.sleep -= dt;
				if (a.kind === "monster" && a.hp < a.maxHp) a.hp = Math.min(a.maxHp, a.hp + dt * .5);
			}
			if (a.feedCd > 0) a.feedCd -= dt;
			if (a.poison > 0) {
				a.poison -= dt;
				a.poisonAcc += dt;
				if (a.poisonAcc >= 1) {
					a.poisonAcc -= 1;
					a.hp -= 1;
					float(a.x, a.y, "1", "#9dcc45");
					if (a.hp <= 0) slay(a, "poison", a.poisonFrom);
				}
			}
			if (!a.alive) continue;
			if (a.kind === "hero" && a.windup <= 0) noteStuck(a, dt);
			if (a.path && a.path.length) a.pace += dt;
			if ((a.form === "egg" || a.form === "pupa") && a.hatch > 0) {
				a.hatch -= dt;
				if (a.hatch <= 0) emerge(a);
				continue;
			}
			if (a.kind === "monster" && (a.form === "adult" || a.form === "fly") && a.species !== "skeleton") {
				if (!(a.species === "moss" && a.brood !== null && a.brood !== "walk")) {
					a.age -= dt * (calmNow() ? .5 : 1);
					if (a.age <= 0) slay(a, "age", null);
				}
			}
			if (a.alive && a.species === "moss" && a.form === "adult") tickBrood(a, dt);
			if (a.alive && a.species === "spirit") {
				const pile = corpseAt(a.x, a.y);
				if (pile) {
					pile.spirits += 1;
					if (pile.spirits >= 5) {
						pile.red = true;
						float(pile.x, pile.y, "RED", "#e23a4a");
					} else float(pile.x, pile.y, `${pile.spirits}`, "#d5f4f8");
					a.alive = false;
					burst(a.x, a.y, "#d5f4f8", 6, 1.4);
				}
			}
			if (a.boost > 0) a.boost -= dt;
			if (a.kind === "hero" && a.vitality > 0) a.vitality = Math.max(0, a.vitality - dt);
			if (a.windup > 0) {
				a.windup -= dt;
				if (a.windup <= 0) {
					a.windup = 0;
					a.swingCd = .85;
					releaseSkill(a);
				}
			}
			if (a.kind === "monster" && (a.form === "adult" || a.form === "fly")) {
				if (a.species === "skeleton") {
					let burn = dt;
					for (const wisp of actors) {
						if (!wisp.alive || wisp.species !== "spirit") continue;
						if (Math.abs(wisp.x - a.x) + Math.abs(wisp.y - a.y) <= 2) burn += dt;
					}
					a.hatch -= burn;
					if (a.hatch <= 0) slay(a, "age", null);
				} else {
					const huntEvery = a.variant === "giant" ? 24 : 11.6;
					const calm = calmNow();
					a.hungerCd -= dt;
					if (a.hungerCd <= 0) {
						a.hungerCd = calm ? huntEvery * 2 : huntEvery;
						if (calm) {
							if (a.satiety > 3) a.satiety -= 1;
						} else {
							a.satiety = Math.max(0, a.satiety - 1);
							if (rng() < .25) taxTile(a.x, a.y);
						}
					}
					if (!calm && a.satiety <= 0 && a.species) {
						pressure[a.species].hunger += dt;
						maybeArm(a.species);
					}
					a.starve = 0;
					if (a.alive && a.species === "bud") demonSip(a);
					else if (a.alive && a.species && a.species !== "bud" && (a.species === "witch" || a.species === "vampire" || a.species === "succubus" || a.species === "nimbus")) hexSpend(a);
					if (a.alive && a.species && a.species !== "bud") {
						const rate = hungerRate(a.species);
						if (rate > 0) {
							a.hunger -= dt * rate;
							if (a.hunger <= 0) {
								a.hunger = 0;
								slay(a, "starve", null);
							}
						}
					}
				}
			}
		}
		refreshIntel();
		for (const a of actors) {
			if (!a.alive) continue;
			if (a.kind === "monster" && a.species === "crawler" && a.form === "adult" && a.carryN >= 45 && openNeighbors(a.x, a.y) <= 1) {
				a.form = "pupa";
				a.hatch = 7.5;
				a.speed = 0;
				a.atk = 0;
				a.combat = 0;
				a.job = "hold";
				markSeen("pupa");
				if (!everSeenForm.pupa) {
					everSeenForm.pupa = true;
					toast("A Gnawling curls into a pupa.");
				}
				sfx("egg");
				continue;
			}
			if (a.sleep > 0 || a.form === "egg" || a.form === "pupa") continue;
			if (a.kind === "overlord") continue;
			if (a.windup > 0) continue;
			if (a.moveCd > 0) continue;
			const beforeX = a.x;
			const beforeY = a.y;
			if (a.kind === "hero") actHero(a);
			else actMonster(a);
			const moved = a.x !== beforeX || a.y !== beforeY;
			if (moved && a.kind === "hero") {
				a.stamina -= 1;
				const bloom = blooms.find((b) => b.x === a.x && b.y === a.y);
				if (bloom) {
					blooms.splice(blooms.indexOf(bloom), 1);
					if (bloom.m > 0 && bloom.n === 0) sproutPair(a.x, a.y, "spirit");
					else sproutPair(a.x, a.y, "moss");
				}
				if (!a.carrying) {
					a.shed += 1 / Math.max(.25, a.speed);
					if (a.shed >= 8) {
						a.shed = 0;
						const wall = nearestWall(a.x, a.y);
						if (wall) {
							if (a.heroClass === "mage" || a.heroClass === "priest") bumpM(wall.t);
							else bumpN(wall.t);
						}
					}
				}
				if (a.stamina <= 0) slay(a, "stamina", null);
			}
			if (moved && a.kind === "monster") {
				const bloom = blooms.find((b) => b.x === a.x && b.y === a.y);
				if (bloom) {
					blooms.splice(blooms.indexOf(bloom), 1);
					if (bloom.m > 0 && bloom.n === 0) sproutPair(bloom.x, bloom.y, "spirit");
					else sproutPair(bloom.x, bloom.y, "moss");
				}
				if (a.species === "witch" || a.species === "vampire" || a.species === "succubus") {
					a.shed += 1;
					if (a.shed >= 3 && !webs.some((w) => w.x === a.x && w.y === a.y)) {
						a.shed = 0;
						layWeb(a.x, a.y);
					}
				}
			}
			let spd = a.speed;
			if (a.kind === "hero" && a.vitality > 0) spd *= .45;
			if (a.carrying) spd *= a.boost > 0 ? 1 : .6;
			if (a.kind === "hero" && webs.some((w) => w.x === a.x && w.y === a.y)) spd *= .6;
			if (moved) a.moveCd = 1 / Math.max(.25, spd);
			else if (a.job === "idle") a.moveCd = .4;
			else if (a.job === "hold") a.moveCd = .3;
			else a.moveCd = .2;
		}
		syncCarry();
		combat();
		reproCd = Math.max(0, reproCd - dt);
		birthCd -= dt;
		if (birthCd <= 0) birthCd = 4.2;
		leakAcc += dt;
		if (leakAcc >= 4) {
			leakAcc = 0;
			leakStores();
		}
		bloomAcc += dt;
		if (bloomAcc >= 12) {
			bloomAcc -= 12;
			let wilts = 0;
			let caps = 0;
			for (const b of blooms) {
				if (!b.path) continue;
				if (b.n > 0) wilts += 1;
				else if (b.m > 0) caps += 1;
			}
			for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
				if (tiles[y * cols + x].kind !== "dug") continue;
				if (blooms.some((b) => b.x === x && b.y === y)) continue;
				if (actorAt(x, y)) continue;
				let donorN = null;
				let bestN = 0;
				let donorM = null;
				let bestM = 0;
				for (let d = 0; d < 4; d++) {
					const w = tileAt(x + DX[d], y + DY[d]);
					if (!w || w.kind !== "soil") continue;
					if (w.nutrient > bestN) {
						bestN = w.nutrient;
						donorN = w;
					}
					if (w.mana > bestM) {
						bestM = w.mana;
						donorM = w;
					}
				}
				if (wilts < 6 && donorN && bestN >= 5 && rng() < .005) {
					const take = Math.min(5, donorN.nutrient);
					donorN.nutrient -= take;
					syncFluid(donorN);
					blooms.push({
						x,
						y,
						n: take,
						m: 0,
						life: 18,
						path: true
					});
					wilts += 1;
					continue;
				}
				if (caps < 6 && donorM && bestM >= 5 && rng() < .005) {
					const take = Math.min(5, donorM.mana);
					donorM.mana -= take;
					syncFluid(donorM);
					blooms.push({
						x,
						y,
						n: 0,
						m: take,
						life: 18,
						path: true
					});
					caps += 1;
				}
			}
		}
		for (let i = blooms.length - 1; i >= 0; i--) {
			blooms[i].life -= dt;
			if (blooms[i].life > 0) continue;
			const b = blooms[i];
			blooms.splice(i, 1);
			if (!b.path || !isOpen(b.x, b.y) || actorAt(b.x, b.y)) continue;
			if (b.m > 0 && b.n === 0) sproutPair(b.x, b.y, "spirit");
			else sproutPair(b.x, b.y, "moss");
		}
		if (petitionDelay !== null && phase === "play") {
			petitionDelay -= dt;
			if (petitionDelay <= 0) {
				petitionDelay = null;
				if (petitionWindow() && !petitionYes) {
					petitionAsk = true;
					if (launched <= 1) {
						const seated = livingLord();
						if (seated) api.focus = {
							x: seated.x,
							y: seated.y,
							until: time + 1.8
						};
					}
				}
			}
		}
		if (clockLeft !== null && phase === "play") {
			clockLeft -= dt;
			if (clockLeft <= 0) {
				clockLeft = 0;
				const carrier = carrierId != null ? actors.find((a) => a.alive && a.id === carrierId) : null;
				if (!(!!carrier && lordState === "carried" && carrier.x === built.entrance.x && carrier.y === built.entrance.y)) finish("win", "The stage clock ran out. The Warden is still below.");
			}
		}
		for (let i = webs.length - 1; i >= 0; i--) {
			const w = webs[i];
			w.life -= dt;
			const stomper = actors.some((a) => a.alive && a.kind === "hero" && a.x === w.x && a.y === w.y);
			if (stomper) dumpOrthogonal(w.x, w.y, 0, 6, false);
			if (stomper || w.life <= 0) webs.splice(i, 1);
		}
		if (actors.some((a) => !a.alive)) {
			for (let i = actors.length - 1; i >= 0; i--) if (!actors[i].alive) actors.splice(i, 1);
		}
		if (built.endless && raidWarn !== null && phase === "play") {
			raidWarn -= dt;
			if (raidWarn <= 0) {
				raidWarn = null;
				const pack = pendingRaid;
				pendingRaid = null;
				if (pack && lordState !== "none" && lordState !== "carried") {
					raidActive = true;
					invasionStarted = true;
					lordLeft = 0;
					queueWave(pack);
					shout("HUMANS IN THE HOLLOW");
				}
			}
		}
		if (!built.endless && prepLeft === null && phase === "play" && launched > 0) {
			const waveClear = spawnQueue.length === 0 && !actors.some((a) => a.alive && a.kind === "hero");
			if (waveClear && clearNoted < launched) {
				clearNoted = launched;
				grantStipend();
				if (launched < built.waves.length) ecoWait = built.eco;
			}
			if (waveClear && ecoWait !== null) {
				if (!raidTen && ecoWait <= 10) {
					raidTen = true;
					shout("RAID IN 10");
				}
				ecoWait -= dt;
				if (ecoWait <= 0) {
					ecoWait = null;
					launchWave(launched);
				}
			}
		}
		recomputeHorde();
		advanceHint();
		checkEnd();
		uiAcc += dt;
		if (uiAcc > .25) {
			uiAcc = 0;
			emit();
		}
		api.time = time;
		api.shake = shake;
		api.digs = digs;
		api.heroesSlain = heroesSlain;
		api.monsterDeaths = monsterDeaths;
	}
	function trimFx() {
		for (let i = particles.length - 1; i >= 0; i--) if (particles[i].life <= 0) particles.splice(i, 1);
		for (let i = floaters.length - 1; i >= 0; i--) if (floaters[i].life <= 0) floaters.splice(i, 1);
	}
	function digAt(x, y) {
		const bloom = blooms.find((b) => b.x === x && b.y === y);
		if (bloom) {
			breakBloom(bloom);
			emit();
			return;
		}
		const pile = corpseAt(x, y);
		if (pile) {
			raiseRattle(pile);
			return;
		}
		const t = tileAt(x, y);
		if (!t || t.kind !== "soil") {
			if (t && (t.kind === "dug" || t.kind === "entrance") && actorAt(x, y)?.kind === "monster") toast("Switch to Smash to sacrifice a creature.");
			return;
		}
		if (!nearOpen(x, y)) {
			toast("Dig soil that touches open ground.");
			return;
		}
		if (digPower < t.hardness) {
			toast(t.hardness > 1 ? "That rock wants 2 Dig Power." : "Dig Power is spent.");
			return;
		}
		refreshRunes();
		const rune = runeOf(x, y);
		if (rune) {
			digPower -= t.hardness;
			digs += 1;
			api.digs = digs;
			breakRune(rune.x, rune.y);
			refreshRunes();
			noteGrid();
			sfx("ominous");
			burst(x, y, "#c9a0ff", 14, 2.6);
			bumpShake(.35);
			advanceHint();
			emit();
			return;
		}
		const n = t.nutrient;
		const m = t.mana;
		digPower -= t.hardness;
		t.kind = "dug";
		t.nutrient = 0;
		t.nSub = 0;
		t.mana = 0;
		t.mSub = 0;
		digs += 1;
		api.digs = digs;
		sfx("dig");
		burst(x, y, "#6a4634", 10, 2.4);
		bumpShake(.18);
		const bornNow = releaseSoil(x, y, n, m);
		noteGrid();
		if ((n >= 10 || m >= 10) && bornNow === 0) {
			digPower += 1;
			float(x, y, "EMPTY", "#e25b3a");
			toast("EMPTY");
		}
		advanceHint();
		emit();
	}
	function smashAt(x, y) {
		const bloom = blooms.find((b) => b.x === x && b.y === y);
		if (bloom) {
			breakBloom(bloom);
			emit();
			return;
		}
		const ms = actors.filter((a) => a.alive && a.kind === "monster" && a.x === x && a.y === y);
		if (ms.length) {
			ms.sort((a, b) => a.combat - b.combat);
			slay(ms[0], "smash", "smash");
			for (let i = actors.length - 1; i >= 0; i--) if (!actors[i].alive) actors.splice(i, 1);
			recomputeHorde();
			checkEnd();
			emit();
			return;
		}
		const pile = corpseAt(x, y);
		if (pile) {
			smashCorpse(pile);
			return;
		}
		toast("Tap a creature, Remains, or a Wiltbloom.");
	}
	function livingLord() {
		return actors.find((a) => a.alive && a.kind === "overlord") ?? null;
	}
	function grab(hero, lord) {
		if (phase !== "play" || lordState === "carried" || !hero.alive || hero.sleep > 0) return;
		lordState = "carried";
		api.lordState = "carried";
		carrierId = hero.id;
		hero.carrying = true;
		dragStart = Math.max(1, Math.abs(hero.x - built.entrance.x) + Math.abs(hero.y - built.entrance.y));
		lord.x = hero.x;
		lord.y = hero.y;
		lord.fx = hero.fx;
		lord.fy = hero.fy;
		if (hero.heroClass === "thief") hero.boost = 2;
		api.focus = {
			x: hero.x,
			y: hero.y,
			until: time + 1.2
		};
		if (hero.x === built.entrance.x && hero.y === built.entrance.y) finish("lose", "The Warden was carried up the stair.");
		shout("WARDEN SEIZED");
	}
	function dropLord(x, y) {
		const lord = livingLord();
		for (const a of actors) a.carrying = false;
		carrierId = null;
		if (!lord) {
			lordState = "none";
			api.lordState = "none";
			return;
		}
		lord.x = x;
		lord.y = y;
		lord.fx = x;
		lord.fy = y;
		lord.hp = Math.max(1, lord.hp);
		lordState = "dropped";
		api.lordState = "dropped";
		shout("Warden dropped.");
	}
	function syncCarry() {
		if (lordState !== "carried") return;
		const hero = actors.find((a) => a.alive && a.id === carrierId);
		const lord = livingLord();
		if (!hero || !lord) {
			if (lord) dropLord(lord.x, lord.y);
			return;
		}
		lord.x = hero.x;
		lord.y = hero.y;
		if (hero.x === built.entrance.x && hero.y === built.entrance.y) finish("lose", "The Warden was carried up the stair.");
	}
	function bestThrone() {
		const dist = new Int32Array(cols * rows);
		dist.fill(-1);
		const qx = [built.entrance.x];
		const qy = [built.entrance.y];
		dist[built.entrance.y * cols + built.entrance.x] = 0;
		let head = 0;
		while (head < qx.length) {
			const x = qx[head];
			const y = qy[head];
			head++;
			const base = dist[y * cols + x];
			for (let d = 0; d < 4; d++) {
				const nx = x + DX[d];
				const ny = y + DY[d];
				if (!isOpen(nx, ny)) continue;
				const ni = ny * cols + nx;
				if (dist[ni] >= 0) continue;
				dist[ni] = base + 1;
				qx.push(nx);
				qy.push(ny);
			}
		}
		let best = null;
		let bestScore = -1e9;
		for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
			if (!isOpen(x, y)) continue;
			if (x === built.entrance.x && y === built.entrance.y) continue;
			const d = dist[y * cols + x];
			if (d < 0) continue;
			const n = openNeighbors(x, y);
			const occ = actorAt(x, y);
			let score = d * 10;
			if (n === 1 && d >= 3) score += 120;
			else if (n === 1) score -= 25;
			else if (n >= 3) score -= 18;
			if (occ && occ.kind !== "overlord") score -= 40;
			if (score > bestScore) {
				bestScore = score;
				best = {
					x,
					y
				};
			}
		}
		return best;
	}
	function seatNew(x, y) {
		const a = {
			id: nextId++,
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
			hunger: 100
		};
		actors.push(a);
		lordState = "seated";
		api.lordState = "seated";
		carrierId = null;
		sfx("place");
		burst(x, y, "#e6d3a3", 8, 1.6);
		advanceHint();
	}
	function autoPlace() {
		const spot = bestThrone();
		if (!spot) return;
		const occ = actorAt(spot.x, spot.y);
		if (occ && occ.kind === "monster") {
			const nb = freeNeighbor(spot.x, spot.y);
			if (nb) {
				occ.x = nb.x;
				occ.y = nb.y;
				occ.fx = nb.x;
				occ.fy = nb.y;
			}
		}
		seatNew(spot.x, spot.y);
		shout("The Warden takes the far hall.");
	}
	function huntLocked() {
		if (lordState === "carried") return true;
		if (built.endless) return raidActive || spawnQueue.length > 0 || invasionActive();
		if (prepLeft !== null || ecoWait !== null) return false;
		return launched > 0 && (invasionActive() || spawnQueue.length > 0);
	}
	function placeLord(x, y) {
		const t = tileAt(x, y);
		if (!t || !isOpen(x, y)) {
			toast("The Warden needs open ground.");
			return;
		}
		if (t.kind === "entrance") {
			toast("Not on the stair.");
			return;
		}
		if (lordState === "carried") {
			toast("The Warden is being dragged. Kill the carrier.");
			return;
		}
		const occ = actorAt(x, y);
		if (occ && occ.kind !== "overlord") {
			toast("That tile is occupied.");
			return;
		}
		const existing = livingLord();
		if (existing) {
			if (existing.x === x && existing.y === y) {
				if (lordState === "dropped") {
					lordState = "seated";
					api.lordState = "seated";
					toast("The Warden is seated again.");
					emit();
				}
				return;
			}
			if (huntLocked()) {
				toast("The Warden is locked while humans hunt.");
				return;
			}
			if (lordLeft <= 0) {
				toast("The Warden moves once between raids.");
				return;
			}
			lordLeft -= 1;
			existing.x = x;
			existing.y = y;
			existing.fx = x;
			existing.fy = y;
			existing.path = null;
			lordState = "seated";
			api.lordState = "seated";
			carrierId = null;
			for (const a of actors) a.carrying = false;
			sfx("place");
			toast("The Warden is seated.");
			for (const a of actors) if (a.kind === "hero") a.path = null;
			emit();
			return;
		}
		seatNew(x, y);
		toast("The Warden takes the throne.");
		emit();
	}
	function petitionWindow() {
		if (phase !== "play") return false;
		if (lordState === "none" || lordState === "carried") return false;
		if (huntLocked()) return false;
		if (ecoWait !== null) return true;
		if (built.endless && raids > 0 && !raidActive && raidWarn === null && spawnQueue.length === 0) return true;
		return false;
	}
	function tap(x, y) {
		if (phase !== "play" || paused) return;
		if (x < 0 || y < 0 || x >= cols || y >= rows) return;
		const lord = livingLord();
		if (lord && lord.x === x && lord.y === y && petitionWindow()) {
			if (petitionDelay !== null) return;
			petitionAsk = true;
			upgradeOpen = false;
			emit();
			return;
		}
		if (tool === "dig") digAt(x, y);
		else if (tool === "smash") smashAt(x, y);
		else placeLord(x, y);
	}
	function setTool(t) {
		tool = t;
		api.tool = t;
		sfx("ui");
		emit();
	}
	function toggleHeat() {
		heatmap = !heatmap;
		api.heatmap = heatmap;
		sfx("ui");
		emit();
	}
	function togglePause() {
		if (phase !== "play") return;
		paused = !paused;
		emit();
	}
	function toggleMute() {
		muted = !muted;
		save.muted = muted;
		persist();
		emit();
	}
	function summon() {
		if (!built.endless || phase !== "play" || raidActive || raidWarn !== null || spawnQueue.length) return;
		if (lordState === "none" || lordState === "carried") {
			toast("Seat the Warden before you summon a raid.");
			emit();
			return;
		}
		const table = [
			[{
				cls: "swordsman",
				mul: 1
			}],
			[{
				cls: "swordsman",
				mul: 1
			}, {
				cls: "archer",
				mul: 1
			}],
			[{
				cls: "knight",
				mul: 1.1
			}, {
				cls: "mage",
				mul: 1.1
			}],
			[
				{
					cls: "priest",
					mul: 1.2
				},
				{
					cls: "thief",
					mul: 1.2
				},
				{
					cls: "mage",
					mul: 1.15
				}
			],
			[
				{
					cls: "knight",
					mul: 1.35
				},
				{
					cls: "archer",
					mul: 1.3
				},
				{
					cls: "priest",
					mul: 1.3
				},
				{
					cls: "swordsman",
					mul: 1.25
				}
			]
		];
		const pack = table[Math.min(table.length - 1, raids)].map((h) => ({
			...h,
			mul: h.mul + Math.max(0, raids - table.length + 1) * .08
		}));
		if (!chainAlive()) {
			toast("Nothing is alive to meet a raid.");
			emit();
			return;
		}
		pendingRaid = pack;
		raidWarn = 15;
		shout("Raid in fifteen.");
		emit();
	}
	function buyUpgrade(id) {
		if (!upgradeOpen || phase !== "play") {
			toast("Servant upgrades wait for the stipend.");
			return;
		}
		const costs = UPGRADE_COST[id];
		if (!costs) return;
		const tier = upgrades[id] ?? 0;
		if (tier >= costs.length) {
			toast("That line is as strong as the soil allows.");
			return;
		}
		const cost = costs[tier];
		if (digPower < cost) {
			toast("Not enough Dig Power.");
			return;
		}
		digPower -= cost;
		upgrades[id] = tier + 1;
		sfx("ui");
		toast(`${UPGRADE_LABEL[id]} tier ${tier + 1}. New births only.`);
		emit();
	}
	function answerPetition(yes) {
		petitionAsk = false;
		if (yes && petitionWindow()) {
			petitionYes = true;
			upgradeOpen = true;
			if (firstAye) {
				firstAye = false;
				toast("Only what is born after you pay is blessed.");
			} else toast("Servant Upgrade. New births only.");
		} else upgradeOpen = false;
		emit();
	}
	function closeUpgrades() {
		upgradeOpen = false;
		petitionAsk = false;
		emit();
	}
	function upgradeOffers() {
		return Object.keys(UPGRADE_COST).map((id) => {
			const costs = UPGRADE_COST[id];
			const tier = upgrades[id] ?? 0;
			return {
				id,
				name: UPGRADE_LABEL[id] ?? id,
				tier,
				max: costs.length,
				cost: tier < costs.length ? costs[tier] : null
			};
		});
	}
	function listDiggable() {
		const out = [];
		for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
			const t = tiles[y * cols + x];
			if (t.kind !== "soil") continue;
			if (!nearOpen(x, y)) continue;
			if (t.hardness > digPower) continue;
			out.push({
				x,
				y,
				n: t.nutrient,
				m: t.mana,
				cost: t.hardness
			});
		}
		return out;
	}
	function hud() {
		const counts = SPECIES_ORDER.map((id) => ({
			id,
			name: SPECIES_NAME[id],
			n: countSpecies(id)
		}));
		const almanac = ALMANAC_IDS.map((id) => {
			const row = variantBlurb(id);
			return {
				id,
				title: row.title,
				blurb: row.blurb,
				seen: seen.has(id)
			};
		});
		let waveText = "The stair is quiet";
		let countdown = prepLeft;
		if (built.endless) {
			if (raidWarn !== null) {
				waveText = "NEXT RAID";
				countdown = raidWarn;
			} else if (raidActive) {
				waveText = "RAID";
				countdown = null;
			} else {
				waveText = raids ? `${raids} raid${raids === 1 ? "" : "s"} broken` : "Summon when ready";
				countdown = null;
			}
		} else if (prepLeft !== null) {
			waveText = lordState === "none" ? "PREP" : "RAID IN";
			countdown = prepLeft;
		} else if (phase === "win") waveText = "Held";
		else if (phase === "lose") waveText = "Fallen";
		else if (ecoWait !== null) {
			waveText = "NEXT RAID";
			countdown = ecoWait;
		} else if (invasionActive() || spawnQueue.length) {
			waveText = `WAVE ${Math.max(1, launched)}/${built.waves.length}`;
			countdown = null;
		}
		const hero = carrierId != null ? actors.find((a) => a.alive && a.id === carrierId) : null;
		let drag = 0;
		if (lordState === "carried" && hero) drag = 1 - (Math.abs(hero.x - built.entrance.x) + Math.abs(hero.y - built.entrance.y)) / Math.max(1, dragStart);
		api.lordState = lordState;
		return {
			stageId,
			stageName: built.name,
			digPower,
			maxDig,
			horde,
			peakHorde,
			countdown,
			waveText,
			phase,
			paused,
			tool,
			heatmap,
			ominous: ominousLife > 0 ? ominous : null,
			hint: HINTS[hintStep] ?? HINTS[HINTS.length - 1],
			event: eventLife > 0 ? event : null,
			lordLeft,
			lordState,
			drag: Math.max(0, Math.min(1, drag)),
			waveNum: launched,
			waveTotal: built.endless ? 0 : built.waves.length,
			eco: ecoWait !== null,
			summoning: raidWarn !== null,
			upgradeOpen,
			petition: petitionAsk,
			rattleLine: countSpecies("skeleton") > 0 ? `Rattles ${countSpecies("skeleton")}/4` : null,
			clock: clockLeft,
			upgrades: upgradeOffers(),
			version: `${LOAM_VERSION} ${LOAM_VERSION_NAME}`,
			banner: bannerLife > 0 ? banner : null,
			endless: built.endless,
			raidActive,
			raids,
			counts,
			almanac,
			result,
			muted,
			digs
		};
	}
	api.tool = tool;
	api.heatmap = heatmap;
	return api;
}
var INK = "#140e0a";
var ROCK = "#1c120e";
var ROCK_B = "#2a1a14";
var FLOOR = "#8d734c";
var FLOOR_B = "#756038";
var FLOOR_DK = "#5e4a2e";
var MOSS = "#6fbf4a";
var MOSS_D = "#2c6b30";
var GRUB = "#e2b04a";
var GRUB_D = "#8a5a16";
var SCALE = "#e07a3d";
var SCALE_D = "#8a3a18";
var WISP = "#d5f4f8";
var WISP_D = "#3e8b9c";
var HEX = "#e389a4";
var HEX_D = "#7a3050";
var DRAKE = "#d25038";
var DRAKE_D = "#6a2418";
var PAPER = "#f3e6c8";
var EMBER = "#e25b3a";
var GOLD = "#f0d060";
var STEEL = "#c5d0d6";
var MANA = "#7ec8d4";
var BUD = "#d6e27a";
var BUD_D = "#6a7a28";
var VAMP = "#b45678";
var VAMP_D = "#5c243c";
var SUCC = "#f0b6d4";
var SUCC_D = "#8a4a6a";
var NIMB = "#f7f3c0";
var NIMB_D = "#8a8460";
/** Zoom 1 shows about 12×9 tiles. Scale changes only when the caller pinches. */
function baseTileSize(viewW, viewH) {
	return Math.max(18, Math.floor(Math.min(viewW / 12, viewH / 9)));
}
function clampCamera(cam, viewW, viewH, cols, rows) {
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
function blit(ctx, px, py, scale, rows, pal, flip) {
	const h = rows.length;
	const w = rows[0]?.length ?? 0;
	const ox = Math.round(px - w * scale / 2);
	const oy = Math.round(py - h * scale / 2);
	for (let j = 0; j < h; j++) {
		const row = rows[j];
		for (let i = 0; i < row.length; i++) {
			const col = pal[row[flip ? row.length - 1 - i : i]];
			if (!col) continue;
			ctx.fillStyle = col;
			ctx.fillRect(ox + i * scale, oy + j * scale, scale, scale);
		}
	}
}
var SPRITES = {
	moss: [
		"...ggggg..",
		"..gGGGGGg.",
		".gGGwwGGGg",
		".gGGbwbGGg",
		".gGGGGGGGg",
		"..ggggggg.",
		"...g...g.."
	],
	crawler: [
		".a.a.a.a..",
		"aYYYYYYYYa",
		".YYwwwwYY.",
		"aYYYbYbYYa",
		".YYYYYYYY.",
		"aYYa..aYYa",
		".a......a."
	],
	lizard: [
		"t..llll...",
		"tt.lLLLl..",
		"t.lLwwLLl.",
		".lLLbLLL..",
		"..lLLLLl..",
		".lL.lL.lL.",
		"..l....l.."
	],
	spirit: [
		"....ss....",
		"...sSSs...",
		"..sSwwSs..",
		"..sSb.bS..",
		"...sSSSs..",
		"....sSs...",
		".....s...."
	],
	witch: [
		"h.....h...",
		".h.hHH.h..",
		"..hHHHHh..",
		".hHwwHHh..",
		"hHHbwbHH..",
		".hHHHHHh..",
		"..hH..Hh.."
	],
	drake: [
		"..ddddddt.",
		".dDDDDDDtt",
		"dDDwwDDDd.",
		".DDDbDDD..",
		"dDDDDDDD..",
		"d.dD.Dd.d.",
		".d.....dd."
	],
	bud: [
		"y.......y.",
		".y.gGg.y..",
		"..gGGGgg..",
		".gGwwGGg..",
		".gGYbYGg..",
		"..gGGGgg..",
		"...g..g..."
	],
	vampire: [
		"rrvvvvvrr.",
		"r.vVVVv.r.",
		".rvVwwVv.r",
		".vVVb.bVv.",
		".rvVVVVv.r",
		"rr.vVVv.rr",
		"r.......r."
	],
	succubus: [
		"u..u..u...",
		".uUUuUu...",
		"..UwwUu.t.",
		".uUb.bUu..",
		"..UUUUUu..",
		"...u..u...",
		"..u....u.."
	],
	nimbus: [
		".nnn.nnn.",
		"nnNNNNNNn",
		"nNNwwNNNn",
		".nNNb.NNn",
		"nnNNNNNNn",
		".nnn.nnn.",
		"........."
	],
	egg: [
		"..eeee..",
		".eEEEEe.",
		"eEEwEEe.",
		"eEEEEe..",
		".eEEEe..",
		"..eee..."
	],
	pupa: [
		"..ppppp..",
		".pPPPPPp.",
		"pPPwPPPp.",
		".pPPPPPp.",
		"..pPPPp..",
		"...ppp..."
	],
	overlord: [
		"...ccc...",
		"..cCCCc..",
		"..kKKKk..",
		".kKwwKKk.",
		"kKKbwbKK.",
		".kKKKKKk.",
		"rRRRRRRRr",
		".rRRRRRr."
	],
	swordsman: [
		"..hhhhh.s",
		".hHHHHHss",
		"hHHwwHHs.",
		"hHHb.bHs.",
		".aAAAAa..",
		"..aAaAa..",
		"...a.a..."
	],
	archer: [
		"..ggggg.q",
		".gGGGGGqq",
		"gGGwwGGq.",
		"gGGb.bGq.",
		".aAAAAa..",
		"..a...a..",
		"...a.a..."
	],
	priest: [
		"...x......",
		"..wwwww...",
		".wWWWWw...",
		"wWWwwWWw..",
		"wWWb.bWw..",
		".gGGGGg...",
		"..gGgGg...",
		"...g.g...."
	],
	thief: [
		"..kkkkk..",
		".kKKKKKk.",
		"kKKwwKKk.",
		"kKKb.bKk.",
		".aAAAAa..",
		"..a...a..",
		"...a.a..."
	],
	knight: [
		"..kkkkk..",
		".kKKKKKk.",
		"kKKwwKKk.",
		"kKKb.bKk.",
		".rRRRRr..",
		"..rRrRr..",
		"...r.r..."
	],
	mage: [
		"...sss.t.",
		"..sSSSstt",
		".sSwwSSt.",
		"sSSb.bSt.",
		".mMMMMm..",
		"..mMmMm..",
		"...m.m..."
	],
	skeleton: [
		"..bBBBb...",
		".bBwwBBb..",
		".bBb.bBb..",
		"..bBBBBb..",
		".bB.B.Bb..",
		"..bB.Bb...",
		".bB...Bb.."
	],
	corpse: [
		"..........",
		"..........",
		"...hhhhh..",
		"..hHHHHHh.",
		".hHHb.bHh.",
		"..aaaaaaa.",
		".........."
	],
	champion: [
		"..ggggg..",
		".gGGGGGg.",
		"gGGwwGGg.",
		"gGGb.bGg.",
		".rRRRRr..",
		"..rRrRr..",
		"...r.r..."
	]
};
function palette(kind, variant) {
	if (kind === "moss") return {
		g: MOSS_D,
		G: MOSS,
		w: PAPER,
		b: INK
	};
	if (kind === "crawler") return {
		a: "#6e675c",
		Y: "#f7f1e4",
		w: "#1a120c",
		b: INK
	};
	if (kind === "lizard") return {
		l: SCALE_D,
		L: SCALE,
		w: PAPER,
		b: INK,
		t: "#e7d3a4"
	};
	if (kind === "spirit") return {
		s: WISP_D,
		S: WISP,
		w: PAPER,
		b: INK
	};
	if (kind === "witch") return {
		h: HEX_D,
		H: HEX,
		w: PAPER,
		b: INK,
		s: GOLD
	};
	if (kind === "drake") return {
		d: DRAKE_D,
		D: DRAKE,
		w: PAPER,
		b: INK,
		t: GOLD,
		w2: GOLD
	};
	if (kind === "bud") return {
		g: MOSS_D,
		G: MOSS,
		y: BUD_D,
		Y: BUD,
		w: PAPER,
		b: INK
	};
	if (kind === "vampire") return {
		v: VAMP_D,
		V: VAMP,
		w: PAPER,
		b: INK,
		r: DRAKE
	};
	if (kind === "succubus") return {
		u: SUCC_D,
		U: SUCC,
		w: PAPER,
		b: INK,
		t: GOLD
	};
	if (kind === "nimbus") return {
		n: NIMB_D,
		N: NIMB,
		w: PAPER,
		b: INK,
		B: "#fff6c8"
	};
	if (kind === "egg") return {
		e: variant === "breed" ? GOLD : PAPER,
		E: variant === "deformed" ? "#c6d64a" : "#e7d3a4",
		w: INK
	};
	if (kind === "pupa") return {
		p: GRUB_D,
		P: variant === "deformed" ? "#c6d64a" : GRUB,
		w: PAPER
	};
	if (kind === "overlord") return {
		c: "#d7c4ef",
		C: "#8d6cb5",
		k: "#241628",
		K: "#4c3268",
		w: PAPER,
		b: INK,
		r: "#3a2458",
		R: "#6a4494"
	};
	if (kind === "knight") return {
		k: "#8d3a32",
		K: EMBER,
		w: PAPER,
		b: INK,
		r: "#5c2018",
		R: "#a84838"
	};
	if (kind === "mage") return {
		s: WISP_D,
		S: WISP,
		w: PAPER,
		b: INK,
		m: "#245e6a",
		M: MANA,
		t: GOLD
	};
	if (kind === "archer") return {
		g: MOSS_D,
		G: MOSS,
		w: PAPER,
		b: INK,
		a: "#3e4650",
		A: "#8aa0aa",
		q: "#c4a574"
	};
	if (kind === "priest") return {
		w: "#efe6cf",
		W: PAPER,
		b: INK,
		g: "#8a6a20",
		G: GOLD,
		x: GOLD
	};
	if (kind === "thief") return {
		k: "#2a2430",
		K: "#5c4a68",
		w: PAPER,
		b: INK,
		a: "#3e4650",
		A: "#8aa0aa"
	};
	if (kind === "champion") return {
		g: "#8a6a20",
		G: GOLD,
		w: PAPER,
		b: INK,
		r: "#5c2018",
		R: EMBER
	};
	if (kind === "skeleton") return {
		b: "#8d8374",
		B: "#f4efe2",
		w: "#1a120c"
	};
	if (kind === "corpse") return {
		h: "#5e6a72",
		H: "#8a949c",
		w: PAPER,
		b: INK,
		a: "#3a2a22"
	};
	if (kind === "swordsman") return {
		h: "#5e6a72",
		H: STEEL,
		w: PAPER,
		b: INK,
		a: "#3e4650",
		A: "#8aa0aa",
		s: "#d5dde4"
	};
	return {
		h: "#5e6a72",
		H: STEEL,
		w: PAPER,
		b: INK,
		a: "#3e4650",
		A: "#8aa0aa"
	};
}
function spriteKey(a) {
	if (a.kind === "overlord") return "overlord";
	if (a.kind === "hero") return a.heroClass ?? "swordsman";
	if (a.form === "egg") return "egg";
	if (a.form === "pupa") return "pupa";
	return a.species ?? "moss";
}
function soilStep(v) {
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
function drawSoilFace(ctx, px, py, tile, nutrient, mana, x, y, time) {
	const n = Math.max(0, nutrient);
	const m = Math.max(0, mana);
	const manaWins = m > n;
	const step = soilStep(manaWins ? m : n);
	const fleck = manaWins ? n : m;
	const grey = manaWins ? "#5e5868" : "#6e6760";
	const wet = manaWins ? "#241c2e" : "#2a211c";
	const moss = manaWins ? "#cbb6ee" : "#6fbf4a";
	const mossD = manaWins ? "#6a5088" : "#2f6a32";
	const plate = manaWins ? "#4a3c62" : "#5c6840";
	const plateHi = manaWins ? "#e6d8ff" : "#d7c48a";
	const hot = manaWins ? "#f7f1ff" : "#f4efe2";
	const shell = manaWins ? "#3a3050" : "#6a4224";
	const shellHi = manaWins ? "#b9a4e0" : "#c47840";
	let base = grey;
	if (step === 2 || step === 3) base = wet;
	else if (step === 4 || step === 5) base = manaWins ? "#2a2038" : "#24301c";
	else if (step >= 6 && step <= 8) base = plate;
	else if (step === 9 || step === 10) base = shell;
	else if (step >= 11) base = hot;
	ctx.fillStyle = base;
	ctx.fillRect(px + 1, py + 1, tile - 2, tile - 2);
	ctx.fillStyle = step >= 11 ? manaWins ? "#ffe6ff" : "#fff6d8" : step === 0 ? "#8a847c" : plateHi;
	if (step === 0 || step >= 11) ctx.fillRect(px + 2, py + 2, tile - 4, Math.max(1, Math.floor(tile * .1)));
	const speck = Math.max(1, Math.floor(tile * .08));
	const spots = [
		[.22, .28],
		[.58, .24],
		[.4, .48],
		[.72, .55],
		[.28, .7],
		[.56, .74]
	];
	if (step === 1) {
		ctx.fillStyle = moss;
		for (let i = 0; i < 3; i++) ctx.fillRect(px + tile * spots[i][0], py + tile * spots[i][1], speck, speck);
	}
	if (step === 2) {
		ctx.fillStyle = manaWins ? "#4a3c5c" : "#4a382c";
		ctx.fillRect(px + tile * .16, py + tile * .38, tile * .68, Math.max(2, tile * .16));
		ctx.fillStyle = manaWins ? "#1a1422" : "#1a120e";
		ctx.fillRect(px + tile * .22, py + tile * .62, tile * .5, Math.max(1, tile * .06));
	}
	if (step === 3) {
		ctx.fillStyle = moss;
		const count = 4 + (x + y & 1);
		for (let i = 0; i < count; i++) ctx.fillRect(px + tile * spots[i][0], py + tile * spots[i][1], speck + (i & 1), speck);
	}
	if (step === 4) {
		ctx.fillStyle = mossD;
		ctx.fillRect(px + tile * .16, py + tile * .4, tile * .68, tile * .4);
		ctx.fillStyle = manaWins ? "#8a78a8" : "#6d7a48";
		ctx.beginPath();
		ctx.ellipse(px + tile * .5, py + tile * .56, tile * .16, tile * .12, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	if (step === 5) {
		const pulse = .45 + Math.sin(time * 5 + x * .7) * .4;
		ctx.strokeStyle = manaWins ? `rgba(236, 220, 255, ${.55 + pulse * .45})` : `rgba(143, 224, 106, ${.55 + pulse * .45})`;
		ctx.lineWidth = Math.max(1, tile * .07);
		ctx.beginPath();
		ctx.moveTo(px + tile * .16, py + tile * .3);
		ctx.lineTo(px + tile * .48, py + tile * .55);
		ctx.lineTo(px + tile * .28, py + tile * .8);
		ctx.moveTo(px + tile * .48, py + tile * .55);
		ctx.lineTo(px + tile * .84, py + tile * .24);
		ctx.moveTo(px + tile * .36, py + tile * .2);
		ctx.lineTo(px + tile * .7, py + tile * .72);
		ctx.stroke();
	}
	if (step >= 6 && step <= 8) {
		ctx.strokeStyle = plateHi;
		ctx.lineWidth = Math.max(1, tile * .06);
		ctx.strokeRect(px + tile * .16, py + tile * .16, tile * .68, tile * .68);
		ctx.fillStyle = plateHi;
		ctx.fillRect(px + tile * .22, py + tile * .22, speck, speck);
		ctx.fillRect(px + tile * .7, py + tile * .22, speck, speck);
		ctx.fillRect(px + tile * .22, py + tile * .7, speck, speck);
		ctx.fillRect(px + tile * .7, py + tile * .7, speck, speck);
	}
	if (step === 7) {
		ctx.fillStyle = manaWins ? "#f3e7ff" : "#b6e07a";
		ctx.beginPath();
		ctx.ellipse(px + tile * .5, py + tile * .52, tile * .16, tile * .14, 0, 0, Math.PI * 2);
		ctx.fill();
	}
	if (step === 8) {
		ctx.fillStyle = manaWins ? "#fff6ff" : "#e7f6a8";
		for (const [sx, sy] of [
			[.08, .2],
			[.84, .16],
			[.1, .78],
			[.86, .72]
		]) ctx.fillRect(px + tile * sx, py + tile * sy, speck + 1, speck + 1);
	}
	if (step === 9 || step === 10) {
		ctx.fillStyle = shellHi;
		for (let i = 0; i < 3; i++) ctx.fillRect(px + tile * .18, py + tile * (.22 + i * .22), tile * .64, Math.max(2, tile * .1));
		if (manaWins) {
			ctx.strokeStyle = "#f4e8ff";
			ctx.lineWidth = Math.max(1, tile * .05);
			ctx.strokeRect(px + tile * .34, py + tile * .34, tile * .32, tile * .32);
		}
	}
	if (step === 10) {
		ctx.strokeStyle = manaWins ? "#fff6ff" : "#ffe7a8";
		ctx.lineWidth = Math.max(1, tile * .06);
		ctx.beginPath();
		ctx.moveTo(px + tile * .2, py + tile * .22);
		ctx.lineTo(px + tile * .55, py + tile * .58);
		ctx.lineTo(px + tile * .32, py + tile * .82);
		ctx.moveTo(px + tile * .55, py + tile * .58);
		ctx.lineTo(px + tile * .84, py + tile * .28);
		ctx.stroke();
	}
	if (step >= 11) {
		ctx.fillStyle = manaWins ? "#ffffff" : "#fffdf6";
		ctx.beginPath();
		ctx.ellipse(px + tile * .5, py + tile * .5, tile * .22, tile * .2, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = manaWins ? "#e0b4ff" : "#ffb45a";
		ctx.lineWidth = Math.max(2, tile * .08);
		ctx.strokeRect(px + tile * .12, py + tile * .12, tile * .76, tile * .76);
	}
	if (fleck > 0) {
		ctx.fillStyle = manaWins ? "#6fbf4a" : "#e4d2ff";
		ctx.fillRect(px + tile * .78, py + tile * .14, speck, speck);
		ctx.fillRect(px + tile * .7, py + tile * .22, speck, speck);
	}
}
function drawGame(ctx, match, w, h, cam) {
	const tile = baseTileSize(w, h) * cam.zoom;
	const ox = cam.panX;
	const oy = cam.panY;
	const jx = Math.sin(match.time * 53) * match.shake * tile * .18;
	const jy = Math.cos(match.time * 41) * match.shake * tile * .18;
	ctx.clearRect(0, 0, w, h);
	ctx.fillStyle = INK;
	ctx.fillRect(0, 0, w, h);
	ctx.save();
	ctx.translate(jx, jy);
	const gap = Math.max(1, Math.floor(tile * .07));
	for (let y = 0; y < match.rows; y++) for (let x = 0; x < match.cols; x++) {
		const t = match.tiles[y * match.cols + x];
		const px = ox + x * tile;
		const py = oy + y * tile;
		if (px > w + tile || py > h + tile || px + tile < -tile || py + tile < -tile) continue;
		if (t.kind === "bedrock") {
			ctx.fillStyle = (x + y) % 2 === 0 ? ROCK : ROCK_B;
			ctx.fillRect(px, py, tile, tile);
			if ((x * 3 + y) % 5 === 0) {
				ctx.fillStyle = "#120c09";
				ctx.fillRect(px + gap * 2, py + tile * .45, Math.max(2, tile * .4), 1);
			}
			continue;
		}
		if (t.kind === "soil") {
			drawSoilFace(ctx, px, py, tile, t.nutrient, t.mana, x, y, match.time);
			if (t.hardness > 1) {
				ctx.fillStyle = "#d9cbb0";
				const s = Math.max(2, Math.floor(tile * .16));
				ctx.fillRect(px + tile * .62, py + tile * .55, s, s);
				ctx.fillRect(px + tile * .28, py + tile * .62, s, s);
			}
		} else {
			ctx.fillStyle = t.kind === "entrance" ? "#6d5738" : FLOOR;
			ctx.fillRect(px + gap, py + gap, tile - gap * 2, tile - gap * 2);
			ctx.fillStyle = FLOOR_DK;
			ctx.fillRect(px + gap, py + tile - gap - 1, tile - gap * 2, 1);
			ctx.fillStyle = FLOOR_B;
			if ((x + y) % 2 === 0) ctx.fillRect(px + tile * .35, py + tile * .4, Math.max(2, tile * .18), 1);
			if (t.kind === "entrance") {
				ctx.fillStyle = PAPER;
				const step = Math.max(1, Math.floor(tile / 7));
				for (let i = 0; i < 4; i++) ctx.fillRect(px + tile * .22, py + tile * .22 + i * step * 1.5, tile * .56, step);
			}
		}
		if (match.heatmap && t.kind === "soil" && (t.nutrient > 0 || t.mana > 0)) {
			const pip = Math.max(2, Math.floor(tile * .16));
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
			ctx.font = `700 ${Math.max(8, Math.floor(tile * .28))}px monospace`;
			ctx.textAlign = "left";
			if (t.nutrient > 0) {
				ctx.fillStyle = MOSS;
				ctx.fillText(String(nutrientBand(t.nutrient)), px + 3, py + Math.max(10, tile * .32));
			}
			if (t.mana > 0) {
				ctx.fillStyle = "#7ec8e8";
				ctx.textAlign = "right";
				ctx.fillText(String(nutrientBand(t.mana)), px + tile - 3, py + Math.max(10, tile * .32));
				ctx.textAlign = "left";
			}
		}
		if (match.tool === "dig" && t.kind === "soil" && match.digs < 400) {
			let open = false;
			for (const [dx, dy] of [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1]
			]) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx < 0 || ny < 0 || nx >= match.cols || ny >= match.rows) continue;
				const nt = match.tiles[ny * match.cols + nx];
				if (nt.kind === "dug" || nt.kind === "entrance") open = true;
			}
			if (open) {
				ctx.strokeStyle = `rgba(111, 191, 74, ${match.digs < 3 ? .55 + Math.sin(match.time * 5) * .35 : .7})`;
				ctx.lineWidth = Math.max(1, tile * .06);
				const m = Math.max(3, tile * .22);
				ctx.strokeRect(px + 2, py + 2, m, m);
				if (t.hardness > 1) {
					ctx.fillStyle = PAPER;
					ctx.font = `${Math.max(9, Math.floor(tile * .32))}px monospace`;
					ctx.fillText("2", px + tile * .38, py + tile * .42);
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
		ctx.lineWidth = Math.max(1, tile * .07);
		ctx.strokeRect(px + tile * .12, py + tile * .12, tile * 1.76, tile * 1.76);
		ctx.fillStyle = "#1a1024";
		ctx.fillRect(px + tile * .38, py + tile * .42, tile * .22, tile * .16);
		ctx.fillRect(px + tile * 1.28, py + tile * .42, tile * .22, tile * .16);
		ctx.fillStyle = "#f3e7ff";
		ctx.fillRect(px + tile * .44, py + tile * .46, tile * .08, tile * .08);
		ctx.fillRect(px + tile * 1.34, py + tile * .46, tile * .08, tile * .08);
		ctx.strokeStyle = "#e7d4ff";
		ctx.beginPath();
		ctx.moveTo(px + tile * .55, py + tile * 1.35);
		ctx.lineTo(px + tile * .85, py + tile * 1.52);
		ctx.lineTo(px + tile * 1.45, py + tile * 1.35);
		ctx.stroke();
		ctx.restore();
	}
	for (const n of match.nests) {
		const px = ox + n.x * tile;
		const py = oy + n.y * tile;
		ctx.fillStyle = "#c4a574";
		ctx.fillRect(px + tile * .28, py + tile * .62, tile * .44, Math.max(2, tile * .08));
		ctx.fillRect(px + tile * .36, py + tile * .52, tile * .28, Math.max(2, tile * .08));
	}
	for (const w of match.webs) {
		const px = ox + w.x * tile;
		const py = oy + w.y * tile;
		ctx.strokeStyle = "rgba(227, 137, 164, 0.75)";
		ctx.lineWidth = Math.max(1, tile * .06);
		ctx.beginPath();
		ctx.moveTo(px + tile * .2, py + tile * .25);
		ctx.lineTo(px + tile * .8, py + tile * .75);
		ctx.moveTo(px + tile * .8, py + tile * .25);
		ctx.lineTo(px + tile * .2, py + tile * .75);
		ctx.moveTo(px + tile * .5, py + tile * .2);
		ctx.lineTo(px + tile * .5, py + tile * .8);
		ctx.stroke();
	}
	for (const b of match.blooms) {
		const px = ox + b.x * tile;
		const py = oy + b.y * tile;
		ctx.fillStyle = MOSS_D;
		ctx.fillRect(px + tile * .46, py + tile * .48, Math.max(2, tile * .08), tile * .28);
		ctx.fillStyle = b.m > 0 && b.n === 0 ? "#7a4ea3" : "#d45848";
		ctx.beginPath();
		ctx.arc(px + tile * .5, py + tile * .42, Math.max(2, tile * .12), 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = BUD;
		ctx.fillRect(px + tile * .36, py + tile * .36, Math.max(2, tile * .08), Math.max(2, tile * .08));
		ctx.fillRect(px + tile * .56, py + tile * .36, Math.max(2, tile * .08), Math.max(2, tile * .08));
	}
	for (const c of match.corpses) {
		const px = ox + c.x * tile + tile / 2;
		const py = oy + c.y * tile + tile * .62;
		const rows = SPRITES.corpse;
		blit(ctx, px, py, scale, rows, c.red ? {
			h: "#6a1020",
			H: "#e23a4a",
			w: PAPER,
			b: INK,
			a: "#3a0810"
		} : palette("corpse", "normal"), false);
		const pipR = Math.max(3, tile * .11);
		const px0 = ox + c.x * tile + tile * .78;
		const py0 = oy + c.y * tile + tile * .22;
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
	const drawActor = (a) => {
		const grow = (a.species === "drake" ? 1.38 : a.variant === "giant" ? 1.28 : a.form === "egg" ? .85 : 1) * (1 + Math.min(3, a.tier) * .07);
		const carried = a.kind === "overlord" && match.lordState === "carried";
		const sc = Math.max(1, Math.round(scale * grow * (carried ? .72 : 1)));
		const bob = a.form === "adult" ? Math.sin(a.bob) * Math.max(.4, tile * .04) : 0;
		const px = ox + a.fx * tile + tile / 2;
		const py = oy + a.fy * tile + tile / 2 + bob - (carried ? tile * .38 : 0);
		ctx.fillStyle = "rgba(0,0,0,0.35)";
		ctx.beginPath();
		ctx.ellipse(px, oy + a.fy * tile + tile * .78, tile * .22 * grow, tile * .08, 0, 0, Math.PI * 2);
		ctx.fill();
		const key = spriteKey(a);
		const rows = SPRITES[key] ?? SPRITES.moss;
		let pal = palette(key, a.variant);
		if (a.species === "skeleton" && a.rattle === 1) pal = {
			...pal,
			B: "#d5f4f8",
			b: "#3e8b9c"
		};
		if (a.species === "skeleton" && a.rattle === 2) pal = {
			...pal,
			B: "#e7d3a4",
			b: "#8a6a32"
		};
		if (a.species === "skeleton" && a.rattle === 3) pal = {
			...pal,
			B: "#e23a4a",
			b: "#6a1020"
		};
		blit(ctx, px, py, sc, rows, pal, a.face < 0);
		if (a.form === "fly") {
			ctx.fillStyle = "#f0e2a0";
			ctx.fillRect(px - tile * .28, py - tile * .02, Math.max(2, tile * .16), Math.max(2, tile * .08));
			ctx.fillRect(px + tile * .12, py - tile * .02, Math.max(2, tile * .16), Math.max(2, tile * .08));
		}
		if (a.species === "moss" && a.brood === "bud") {
			ctx.fillStyle = MOSS_D;
			ctx.beginPath();
			ctx.ellipse(px, py + tile * .08, tile * .2, tile * .12, 0, 0, Math.PI * 2);
			ctx.fill();
		}
		if (a.species === "moss" && a.brood === "bloom") {
			ctx.fillStyle = "#d45848";
			ctx.beginPath();
			ctx.arc(px, py - tile * .12, Math.max(3, tile * .16), 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = BUD;
			ctx.beginPath();
			ctx.arc(px, py - tile * .12, Math.max(2, tile * .06), 0, Math.PI * 2);
			ctx.fill();
		}
		if (a.kind === "monster" && a.tier > 0 && a.form === "adult") {
			ctx.fillStyle = GOLD;
			for (let i = 0; i < a.tier; i++) ctx.fillRect(px - tile * .2 + i * tile * .12, py - tile * .42, Math.max(2, tile * .08), Math.max(2, tile * .08));
		}
		if (a.variant === "deformed") {
			ctx.fillStyle = "#d6e25a";
			ctx.fillRect(px + tile * .12, py - tile * .12, Math.max(2, sc), Math.max(2, sc));
		}
		if (a.variant === "breed") {
			ctx.strokeStyle = GOLD;
			ctx.lineWidth = 1;
			ctx.strokeRect(px - tile * .28, py - tile * .34, tile * .56, tile * .62);
		}
		if (a.windup > 0 && a.kind === "hero") {
			const dx = a.dir === 1 ? 1 : a.dir === 3 ? -1 : 0;
			const dy = a.dir === 0 ? -1 : a.dir === 2 ? 1 : 0;
			ctx.strokeStyle = "rgba(226, 91, 58, 0.9)";
			ctx.lineWidth = Math.max(1, tile * .08);
			ctx.beginPath();
			ctx.moveTo(px, py);
			ctx.lineTo(px + dx * tile * .7, py + dy * tile * .7);
			ctx.stroke();
		}
		if (a.shield > 0) {
			ctx.fillStyle = STEEL;
			ctx.fillRect(px - tile * .28, py - tile * .05, Math.max(2, tile * .1), tile * .28);
		}
		if (a.sleep > 0) {
			ctx.fillStyle = PAPER;
			ctx.font = `${Math.max(8, Math.floor(tile * .28))}px monospace`;
			ctx.fillText("z", px + tile * .12, py - tile * .28);
		}
		if (a.hitFlash > 0) {
			ctx.fillStyle = `rgba(255,244,220,${Math.min(.7, a.hitFlash * 4)})`;
			ctx.fillRect(px - tile * .22, py - tile * .28, tile * .44, tile * .5);
		}
		if (a.hp < a.maxHp && a.form !== "egg") {
			const bw = tile * .62;
			const bh = Math.max(2, tile * .08);
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
		ctx.globalAlpha = Math.max(0, p.life / p.max);
		ctx.fillStyle = p.color;
		ctx.fillRect(ox + p.x * tile, oy + p.y * tile, p.size, p.size);
	}
	ctx.globalAlpha = 1;
	for (const f of match.floaters) {
		ctx.globalAlpha = Math.max(0, f.life / f.max);
		ctx.fillStyle = f.color;
		ctx.font = `700 ${Math.max(10, Math.floor(tile * .36))}px monospace`;
		ctx.textAlign = "center";
		ctx.fillText(f.text, ox + f.x * tile, oy + f.y * tile);
	}
	ctx.globalAlpha = 1;
	ctx.textAlign = "left";
	ctx.restore();
	return {
		tile,
		ox,
		oy
	};
}
var CHIP = {
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
	skeleton: "text-fg"
};
var HOW = [
	{
		title: "You are the soil",
		body: "Pick digs a wall. Smash sacrifices a creature. The Warden tool seats the overlord. Heroes come down the stair to drag the Warden back up. You are not one of them."
	},
	{
		title: "Nutrient lives in the walls",
		body: "Open floor holds nothing. Under 10, a dig splits that number into the solid neighbors and births nobody. 10 or more births exactly one creature from the higher pile, and that whole number goes into its belly. The lesser pile, if any, splits into the walls. Nutrient: 10 Loamite, 30 Gnawling, 55 Scalekin. Mana: 10 Wisp, 30 Hexwife, 55 Wyrm. One tile never births both, and it never births a Demon."
	},
	{
		title: "Loamite, Bud, Bloom",
		body: "A walking Loamite still hauls about 5 nutrient from a rich wall to a poor one. Hunger starts at full and drains quickly. At 0 the body dies and half its belly hits the orthogonal walls. Vitality still roots a Bud. Old age opens a Bloom. A close with belly 11 or more hatches four Loamites of 10. A thinner flower hatches three. Smash or a stomp hatches two. A path flower hatches two Loamites. A mana-cap hatches two Wisps. A flower does not pour into the walls."
	},
	{
		title: "The chain, and who sleeps",
		body: "A Gnawling with 45 or more walks into a dead end and cocoons. It does not become a fly on the spot. The fly spends 15, once it holds 60, to lay an egg of 30. A Scalekin spends 10 to claim a dug 2×3, then 20 more once it holds 75, and the egg is a Scalekin of 55. A new nest cannot touch another, not even by a corner. If it would, the Scalekin hunts instead. A Wyrm at 90 spends 25 to lay, and it will not share a hall with another Wyrm. A Hexwife line under three splits. At three or more it spends mana on a web. Sleep, for a Scalekin or a Wyrm, costs 5 belly and never happens at birth."
	},
	{
		title: "Three ways to hold",
		body: "An empty census is not defeat. You lose only if a hero carrying the Warden steps on the stair. The carrier can die on the way. The Warden drops and the wave goes on. You win if the heroes die in the fight, if they spend all their stamina, or if the stage clock hits zero while the Warden is still below."
	},
	{
		title: "Heroes tire, then sharpen",
		body: "A step costs 1 stamina, a melee swing 2, a skill 8. The first wave has 90. The second has 110. Middle waves have 130. The last wave has 160, and it hits harder. Heroes are built to walk through a horde. A knight lives through two Scalekin. They search unvisited floor. A dead end is left on the next step. Boxed in, they break one wall. Each monster a hero kills adds a little attack and gives back 2 stamina, up to a fifth more attack."
	},
	{
		title: "Remains and Rattles",
		body: "Remains are bones, not soil. They never bleed nutrient into the walls. A Wisp that touches a pile is consumed. Five Wisps turn it red. The Pick raises a Rattle and does not splash: red bones if the pile is red, a caster if the hero was a mage or priest, plate for a knight, bone for a sword or a thief. Four may walk. A fifth tap does nothing until one falls. When the inner fire ends it is Remains again, and that fall feeds no wall. An isolated 2×2 of mana walls, each 30 or more, fuses into a rune. The pick spends one dig, the mana is consumed, and one Demon steps out. It leaves the rune and holds a dug room. Allies in that room gain defense. A curse slows a hero down an open hall. A Demon does not eat. Two Demons in one hall fight."
	},
	{
		title: "Aye and Nay",
		body: "When a wave dies, wait a breath. The Warden asks if the next brood should be blessed. Aye opens Servant Upgrade. Nay does not. The first Aye says that only what is born after you pay is blessed. Living bodies keep the shape they have. New births show the tier. Hunt time has no shop. Tap the Warden during the quiet to ask again."
	},
	{
		title: "Stress and the Wyrm",
		body: "Eating a Loamite or a Wisp takes the whole belly. Anything else in the chain pays half. Hunger drains quickly, and that is what empties a body. Starvation still bloats the next births. Being eaten twists them. Killing heroes can steady a line back to basic. A Wyrm ignores that stress. Heroes write nutrient or mana into a diamond of walls when they cast or die. A cleared wave pays 50, 70, or 90 Dig Power if the Warden still sits, more when more of the chain is alive. Each upgrade costs 40 and blesses only the next birth."
	}
];
function wardenLabel(h) {
	if (!h || h.lordState === "none") return "UNCLAIMED";
	if (h.lordState === "carried") return "CARRIED";
	if (h.lordState === "dropped") return "DROPPED";
	if (h.lordLeft <= 0 && h.phase === "play" && !h.eco && (h.waveNum > 0 || h.raidActive)) return "LOCKED";
	return "SEATED";
}
function fmt(sec) {
	const s = Math.max(0, Math.ceil(sec));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function fmtClock(sec) {
	return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
}
function LoamGame() {
	const [screen, setScreen] = (0, import_react.useState)("title");
	const [save, setSave] = (0, import_react.useState)(null);
	const [hud, setHud] = (0, import_react.useState)(null);
	const [book, setBook] = (0, import_react.useState)(false);
	const [run, setRun] = (0, import_react.useState)(0);
	const matchRef = (0, import_react.useRef)(null);
	const sfxRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const layoutRef = (0, import_react.useRef)({
		tile: 8,
		ox: 0,
		oy: 0
	});
	const camRef = (0, import_react.useRef)({
		zoom: 1,
		panX: 0,
		panY: 0
	});
	const camReady = (0, import_react.useRef)(false);
	const pointers = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const gesture = (0, import_react.useRef)({
		pinch: false,
		moved: 0,
		lastX: 0,
		lastY: 0,
		lastDist: 1
	});
	const bookPaused = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		setSave(loadSave());
	}, [screen, run]);
	(0, import_react.useEffect)(() => {
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
				for (let i = 0; i < m.tiles.length; i++) if (m.tiles[i].kind === "entrance") {
					ex = i % m.cols;
					ey = Math.floor(i / m.cols);
					break;
				}
				camRef.current.zoom = 1;
				camRef.current.panX = w / 2 - (ex + .5) * tile;
				camRef.current.panY = h * .22 - (ey + .5) * tile;
				clampCamera(camRef.current, w, h, m.cols, m.rows);
				camReady.current = true;
			}
			const focus = m.focus;
			if (focus && m.time < focus.until && w >= 64 && h >= 64) {
				const tile = baseTileSize(w, h) * camRef.current.zoom;
				camRef.current.panX = w / 2 - (focus.x + .5) * tile;
				camRef.current.panY = h / 2 - (focus.y + .5) * tile;
				clampCamera(camRef.current, w, h, m.cols, m.rows);
			}
			layoutRef.current = drawGame(ctx, m, w, h, camRef.current);
		};
		const frame = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			acc += dt;
			let steps = 0;
			while (acc >= 1 / 30 && steps < 3) {
				m.tick(1 / 30);
				acc -= 1 / 30;
				steps += 1;
			}
			if (acc > 1 / 30) acc = 0;
			paint();
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
		const parent = canvas.parentElement;
		const ro = new ResizeObserver(() => paint());
		if (parent) ro.observe(parent);
		return () => {
			cancelAnimationFrame(raf);
			unsub();
			ro.disconnect();
		};
	}, [screen, run]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const m = matchRef.current;
			if (!m || screen !== "play") return;
			if (e.key === "1") m.setTool("dig");
			else if (e.key === "2") m.setTool("smash");
			else if (e.key === "3") m.setTool("lord");
			else if (e.key === "h" || e.key === "H") m.toggleHeat();
			else if (e.key === "p" || e.key === "P" || e.key === "Escape") {
				setBook(false);
				m.togglePause();
			} else if (e.key === "m" || e.key === "M") m.toggleMute();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [screen]);
	function ensureSfx() {
		if (!sfxRef.current) sfxRef.current = createSfx();
		sfxRef.current.unlock();
		return sfxRef.current;
	}
	function begin(id) {
		const sfx = ensureSfx();
		const m = createMatch(id);
		m.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		m.onSfx = (name) => {
			if (!m.hud().muted) sfx.play(name);
		};
		matchRef.current = m;
		bookPaused.current = false;
		camReady.current = false;
		camRef.current.zoom = 1;
		setBook(false);
		setHud(m.hud());
		setScreen("play");
		setRun((n) => n + 1);
		const w = window;
		w.__loam = {
			tap: (x, y) => m.tap(x, y),
			tool: (t) => m.setTool(t),
			hud: () => m.hud(),
			tick: (n) => {
				for (let i = 0; i < n; i++) m.tick(1 / 30);
			},
			actors: () => m.actors.filter((a) => a.alive).map((a) => ({
				k: a.kind,
				s: a.species,
				f: a.form,
				v: a.variant,
				x: a.x,
				y: a.y,
				hp: a.hp
			})),
			grid: () => ({
				cols: m.cols,
				rows: m.rows,
				layout: layoutRef.current
			})
		};
	}
	function localPoint(clientX, clientY) {
		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return {
			x: 0,
			y: 0
		};
		return {
			x: clientX - rect.left,
			y: clientY - rect.top
		};
	}
	function zoomAt(next, anchorX, anchorY) {
		const m = matchRef.current;
		const parent = canvasRef.current?.parentElement;
		if (!m || !parent) return;
		const cam = camRef.current;
		const w = parent.clientWidth;
		const h = parent.clientHeight;
		const z = Math.max(.55, Math.min(2.2, next));
		const oldTile = baseTileSize(w, h) * cam.zoom;
		if (oldTile <= 0) return;
		const wx = (anchorX - cam.panX) / oldTile;
		const wy = (anchorY - cam.panY) / oldTile;
		cam.zoom = z;
		const newTile = baseTileSize(w, h) * z;
		cam.panX = anchorX - wx * newTile;
		cam.panY = anchorY - wy * newTile;
		clampCamera(cam, w, h, m.cols, m.rows);
	}
	function onPointerDown(e) {
		ensureSfx();
		e.currentTarget.setPointerCapture(e.pointerId);
		pointers.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		const pts = [...pointers.current.values()];
		gesture.current.moved = pts.length > 1 ? 40 : 0;
		if (pts.length >= 2) {
			gesture.current.pinch = true;
			gesture.current.lastX = (pts[0].x + pts[1].x) / 2;
			gesture.current.lastY = (pts[0].y + pts[1].y) / 2;
			gesture.current.lastDist = Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
		} else {
			gesture.current.pinch = false;
			gesture.current.lastX = e.clientX;
			gesture.current.lastY = e.clientY;
		}
	}
	function onPointerMove(e) {
		if (!pointers.current.has(e.pointerId)) return;
		pointers.current.set(e.pointerId, {
			x: e.clientX,
			y: e.clientY
		});
		const m = matchRef.current;
		const parent = canvasRef.current?.parentElement;
		if (!m || !parent) return;
		const pts = [...pointers.current.values()];
		const cam = camRef.current;
		if (m.focus && m.time < m.focus.until) {
			gesture.current.moved = 40;
			gesture.current.lastX = e.clientX;
			gesture.current.lastY = e.clientY;
			return;
		}
		if (pts.length >= 2) {
			const midX = (pts[0].x + pts[1].x) / 2;
			const midY = (pts[0].y + pts[1].y) / 2;
			const dist = Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
			cam.panX += midX - gesture.current.lastX;
			cam.panY += midY - gesture.current.lastY;
			const anchor = localPoint(midX, midY);
			const factor = dist / gesture.current.lastDist;
			zoomAt(cam.zoom * factor, anchor.x, anchor.y);
			gesture.current.lastX = midX;
			gesture.current.lastY = midY;
			gesture.current.lastDist = dist;
			gesture.current.pinch = true;
			gesture.current.moved = 40;
			return;
		}
		if (gesture.current.pinch) return;
		const dx = e.clientX - gesture.current.lastX;
		const dy = e.clientY - gesture.current.lastY;
		gesture.current.moved += Math.hypot(dx, dy);
		cam.panX += dx;
		cam.panY += dy;
		gesture.current.lastX = e.clientX;
		gesture.current.lastY = e.clientY;
		clampCamera(cam, parent.clientWidth, parent.clientHeight, m.cols, m.rows);
	}
	function onPointerUp(e) {
		const m = matchRef.current;
		const canvas = canvasRef.current;
		const moved = gesture.current.moved;
		const pinched = gesture.current.pinch;
		pointers.current.delete(e.pointerId);
		if (pointers.current.size >= 2) {
			const pts = [...pointers.current.values()];
			gesture.current.lastX = (pts[0].x + pts[1].x) / 2;
			gesture.current.lastY = (pts[0].y + pts[1].y) / 2;
			gesture.current.lastDist = Math.max(1, Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y));
			gesture.current.pinch = true;
			gesture.current.moved = 40;
			return;
		}
		if (pointers.current.size === 1) {
			const left = [...pointers.current.values()][0];
			gesture.current.pinch = false;
			gesture.current.lastX = left.x;
			gesture.current.lastY = left.y;
			gesture.current.moved = 40;
			return;
		}
		gesture.current.pinch = false;
		gesture.current.moved = 0;
		if (!m || !canvas || book || pinched || moved > 12) return;
		const h = m.hud();
		if (h.phase !== "play" || h.paused) return;
		const rect = canvas.getBoundingClientRect();
		const { ox, oy, tile } = layoutRef.current;
		if (tile <= 0) return;
		const gx = Math.floor((e.clientX - rect.left - ox) / tile);
		const gy = Math.floor((e.clientY - rect.top - oy) / tile);
		m.tap(gx, gy);
	}
	function onPointerCancel(e) {
		pointers.current.delete(e.pointerId);
		if (pointers.current.size === 0) {
			gesture.current.pinch = false;
			gesture.current.moved = 0;
		}
	}
	function openBook() {
		const m = matchRef.current;
		if (!m) return;
		if (!m.hud().paused) {
			m.togglePause();
			bookPaused.current = true;
		} else bookPaused.current = false;
		setBook(true);
	}
	function closeBook() {
		const m = matchRef.current;
		setBook(false);
		if (m && bookPaused.current && m.hud().paused) m.togglePause();
		bookPaused.current = false;
	}
	if (screen === "title" || screen === "how") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-top safe-bottom mx-auto flex h-dvh w-full max-w-lg flex-col overflow-y-auto px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-primary uppercase",
				children: "A god with a pick"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-4xl leading-none text-fg",
				children: "Loam Lord"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs tracking-wide text-grub",
				children: [
					LOAM_VERSION,
					" · ",
					LOAM_VERSION_NAME
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-base leading-relaxed text-muted",
				children: "Dig a living dungeon. Raise the food chain. Keep heroes off the Warden."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 flex flex-wrap gap-x-2 gap-y-1 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-primary",
						children: "Loamite"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted",
						children: "→"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-grub",
						children: "Gnawling"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted",
						children: "→"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-scale",
						children: "Scalekin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted",
						children: "→"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-accent",
						children: "Wyrm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-wisp",
						children: "Wisp"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted",
						children: "→"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-hex",
						children: "Hexwife"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted",
						children: "→"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-vamp",
						children: "Nightkiss"
					})
				]
			}),
			screen === "how" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-3",
				children: [HOW.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "panel px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-base text-fg",
						children: [
							i + 1,
							". ",
							step.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: step.body
					})]
				}, step.title)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pressy bg-primary text-primary-fg font-display min-h-12 rounded-lg",
					onClick: () => setScreen("title"),
					children: "Back"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-3",
				children: [
					STAGE_META.map((stage) => {
						const cleared = save?.cleared.includes(stage.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "panel pressy w-full px-4 py-2.5 text-left",
							onClick: () => begin(stage.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-xl text-fg",
										children: stage.name
									}), cleared ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-primary",
										children: "Cleared"
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-relaxed text-muted",
									children: stage.blurb
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-grub",
									children: stage.detail
								})
							]
						}, stage.id);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pressy border-line text-fg min-h-12 rounded-lg border-2 bg-transparent",
						onClick: () => {
							ensureSfx().play("ui");
							setScreen("how");
						},
						children: "Field guide"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs text-muted",
						children: save && save.best > 0 ? `Best horde ${save.best}` : "Horde Power is the sum of every living fighter."
					})
				]
			})
		]
	});
	const h = hud;
	const urgent = h?.countdown != null && h.countdown <= 15 && !h.endless;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-top relative flex h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-3 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Dig Power",
								value: h ? String(h.digPower) : "–",
								hint: h ? `of ${h.maxDig}` : ""
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Horde",
								value: h ? String(h.horde) : "–",
								hint: h && h.peakHorde > h.horde ? `peak ${h.peakHorde}` : "power"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: h?.waveText ?? "Raid",
								value: h?.countdown != null ? fmt(h.countdown) : h?.endless ? String(h.raids) : h?.phase === "play" ? "—" : "—",
								hint: h?.endless && !h.raidActive ? "cleared" : "",
								warn: urgent || h?.raidActive
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center justify-between gap-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [h && h.waveTotal > 0 ? h.eco ? `WAVE ${Math.min(h.waveTotal, (h.waveNum || 0) + 1)}/${h.waveTotal}` : h.waveNum > 0 ? `WAVE ${h.waveNum}/${h.waveTotal}` : `${h.waveTotal} WAVES` : "Sandbox", h?.clock != null ? ` · clock ${fmt(h.clock)}` : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: h?.lordState === "carried" ? "text-accent" : "text-fg",
							children: [
								"Warden ",
								wardenLabel(h),
								h && h.lordState !== "carried" && h.lordState !== "none" && (h.eco || h.lordLeft > 0) ? ` · ${h.lordLeft} move${h.lordLeft === 1 ? "" : "s"}` : ""
							]
						})]
					}),
					h?.lordState === "carried" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 flex gap-1",
						"aria-label": "Drag toward the stair",
						children: Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 flex-1 rounded-sm ${i / 8 < (h.drag ?? 0) ? "bg-accent" : "bg-line"}` }, i))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-xs",
						children: (h?.counts ?? []).filter((c) => c.n > 0).length ? h?.counts.filter((c) => c.n > 0).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: CHIP[c.id],
							children: [
								c.name,
								" ",
								c.n
							]
						}, c.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Nothing living yet"
						})
					}),
					h?.rattleLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-fg",
						children: h.rattleLine
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 line-clamp-2 min-h-5 text-sm leading-snug ${h?.event ? "text-primary" : "text-muted"}`,
						children: h?.event ?? h?.hint
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted",
						children: [
							"Drag to pan · pinch to zoom · ",
							LOAM_VERSION,
							" ",
							LOAM_VERSION_NAME
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "h-full w-full touch-none",
						onPointerDown,
						onPointerMove,
						onPointerUp,
						onPointerCancel
					}),
					h?.ominous ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-accent text-accent-fg pointer-events-none absolute inset-x-3 top-2 rounded-lg px-3 py-2 text-center text-sm font-medium",
						children: h.ominous
					}) : h?.banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-primary text-primary-fg pointer-events-none absolute inset-x-3 top-2 rounded-lg px-3 py-2 text-center text-sm font-medium",
						children: h.banner
					}) : null,
					h?.heatmap ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "pointer-events-none absolute bottom-2 left-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "Nutrient walls"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: " · "
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-wisp",
								children: "Mana walls"
							})
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "safe-bottom px-3 pt-2",
				children: [
					h?.endless ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "pressy bg-accent text-accent-fg font-display mb-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg disabled:opacity-50",
						disabled: h.raidActive || h.summoning || h.phase !== "play" || h.lordState === "none" || h.lordState === "carried",
						onClick: () => matchRef.current?.summon(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-5" }), h.raidActive ? "Raid underway" : h.summoning ? "Raid incoming" : h.lordState === "none" ? "Seat the Warden to summon" : "Summon raid"]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
								active: h?.tool === "dig",
								label: "Pick",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shovel, { className: "size-5" }),
								onClick: () => matchRef.current?.setTool("dig")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
								active: h?.tool === "smash",
								label: "Smash",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skull, { className: "size-5" }),
								onClick: () => matchRef.current?.setTool("smash")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolButton, {
								active: h?.tool === "lord",
								label: "Warden",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-5" }),
								onClick: () => matchRef.current?.setTool("lord")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 grid grid-cols-3 gap-2 pb-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallButton, {
								label: h?.heatmap ? "Heat on" : "Heat",
								icon: h?.heatmap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }),
								onClick: () => matchRef.current?.toggleHeat()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallButton, {
								label: "Pause",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }),
								onClick: () => {
									setBook(false);
									matchRef.current?.togglePause();
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmallButton, {
								label: "Guide",
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }),
								onClick: openBook
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: h ? `Dig ${h.digPower}. Horde ${h.horde}. ${h.waveText} ${h.countdown != null ? fmt(h.countdown) : ""}. ${h.event ?? ""} ${h.ominous ?? ""}` : ""
			}),
			h?.petition && h.phase === "play" && !h.result && !book ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-3 bottom-28 z-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-line bg-bg flex items-stretch gap-3 rounded-lg border-2 px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-[#4c3268] text-fg flex w-14 shrink-0 flex-col items-center justify-center rounded-md",
						"aria-hidden": true,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-6 text-[#d7c4ef]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 text-[10px] tracking-wide",
							children: "WARDEN"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm leading-snug text-fg",
							children: "WARDEN: The hollow held. Shall I bless the next brood with what the pick still has?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pressy bg-primary text-primary-fg font-display min-h-11 rounded-lg",
								onClick: () => matchRef.current?.answerPetition(true),
								children: "Aye"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pressy border-line font-display min-h-11 rounded-lg border-2",
								onClick: () => matchRef.current?.answerPetition(false),
								children: "Nay"
							})]
						})]
					})]
				})
			}) : null,
			h?.upgradeOpen && h.phase === "play" && !h.result && !book ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				title: "Servant Upgrade",
				onClose: () => matchRef.current?.closeUpgrades(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: "Spend Dig Power. Only creatures born after you pay grow stronger. The hollow keeps running."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-2",
						children: h.upgrades.map((u) => {
							const priced = u.cost != null;
							const afford = priced && h.digPower >= (u.cost ?? 0);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !afford,
								className: "pressy border-line flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border-2 px-3 text-left disabled:opacity-40",
								onClick: () => matchRef.current?.buyUpgrade(u.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-fg",
									children: [u.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted text-sm",
										children: [
											" ",
											u.tier,
											"/",
											u.max
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-grub",
									children: priced ? `${u.cost} DP` : "MAX"
								})]
							}) }, u.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pressy bg-primary text-primary-fg font-display mt-3 min-h-12 w-full rounded-lg",
						onClick: () => matchRef.current?.closeUpgrades(),
						children: "Continue"
					})
				]
			}) : null,
			book && h ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				title: "Field guide",
				onClose: closeBook,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "Empty halls are not defeat. You lose only if a hero carries the Warden onto the stair. Walls hold the nutrient. A Loamite roots, blooms, and hatches. Aye blesses the next birth, not the living. Remains raise Rattles. Heroes tire. The clock can also hold the hollow."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col gap-2",
					children: h.almanac.filter((row) => row.seen || [
						"moss",
						"crawler",
						"lizard",
						"bud",
						"spirit",
						"witch",
						"vampire",
						"succubus",
						"nimbus",
						"drake",
						"egg",
						"pupa",
						"skeleton",
						"corpse",
						"wiltbloom"
					].includes(row.id)).map((row) => {
						const core = [
							"moss",
							"crawler",
							"lizard",
							"bud",
							"spirit",
							"witch",
							"vampire",
							"succubus",
							"nimbus",
							"drake",
							"egg",
							"pupa",
							"skeleton",
							"corpse",
							"wiltbloom"
						].includes(row.id);
						const open = row.seen || core;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "panel px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base text-fg",
								children: open ? row.title : "Undiscovered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: open ? row.blurb : "It has not crawled through your hollows yet."
							})]
						}, row.id);
					})
				})]
			}) : null,
			h?.paused && !book && !h.result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				title: "Paused",
				onClose: () => matchRef.current?.togglePause(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "pressy bg-primary text-primary-fg font-display flex min-h-12 items-center justify-center gap-2 rounded-lg",
							onClick: () => matchRef.current?.togglePause(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5" }), "Resume"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "pressy border-line flex min-h-12 items-center justify-center gap-2 rounded-lg border-2",
							onClick: () => matchRef.current?.toggleMute(),
							children: [h.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" }), h.muted ? "Sound off" : "Sound on"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "pressy border-line flex min-h-12 items-center justify-center gap-2 rounded-lg border-2",
							onClick: () => h && begin(h.stageId),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-5" }), "Retry hollow"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "pressy border-line min-h-12 rounded-lg border-2",
							onClick: () => {
								matchRef.current = null;
								setScreen("title");
							},
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-xs text-muted",
							children: "Keys: 1 pick · 2 smash · 3 warden · H heat · P pause"
						})
					]
				})
			}) : null,
			h?.result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				title: h.result.outcome === "win" ? "The hollow holds" : "The hollow falls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: h.result.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-2 gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-display text-lg",
									children: fmtClock(h.result.seconds)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Peak horde"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-display text-lg",
									children: h.result.peakHorde
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Heroes slain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-display text-lg",
									children: h.result.heroesSlain
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "panel px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Mutations"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-display text-lg",
									children: h.result.mutations
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-fg",
						children: h.result.living
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pressy bg-primary text-primary-fg font-display min-h-12 rounded-lg",
								onClick: () => begin(h.stageId),
								children: "Dig again"
							}),
							h.result.outcome === "win" && STAGE_META[STAGE_META.findIndex((s) => s.id === h.stageId) + 1] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "pressy bg-accent text-accent-fg font-display min-h-12 rounded-lg",
								onClick: () => {
									const next = STAGE_META[STAGE_META.findIndex((s) => s.id === h.stageId) + 1];
									if (next) begin(next.id);
								},
								children: ["On to ", STAGE_META[STAGE_META.findIndex((s) => s.id === h.stageId) + 1]?.name]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "pressy border-line min-h-12 rounded-lg border-2",
								onClick: () => {
									matchRef.current = null;
									setScreen("title");
								},
								children: "Title"
							})
						]
					})
				]
			}) : null
		]
	});
}
function Stat({ label, value, hint, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-xs tracking-wide text-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `font-display text-2xl leading-none ${warn ? "text-accent" : "text-fg"}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "truncate text-xs text-muted",
				children: hint
			})
		]
	});
}
function ToolButton({ active, label, icon, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: `pressy font-display flex min-h-12 items-center justify-center gap-2 rounded-lg ${active ? "bg-primary text-primary-fg" : "border-line text-fg border-2 bg-surface"}`,
		onClick,
		children: [icon, label]
	});
}
function SmallButton({ label, icon, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "pressy border-line text-muted flex min-h-11 items-center justify-center gap-1 rounded-lg border-2 text-sm",
		onClick,
		children: [icon, label]
	});
}
function Sheet({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 flex flex-col justify-end bg-bg/80 p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel safe-bottom flex max-h-[80%] flex-col rounded-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-fg",
					children: title
				}), onClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "pressy bg-raised text-fg min-h-11 rounded-lg px-4",
					onClick: onClose,
					children: "Close"
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scroll-thin overflow-y-auto px-4 pb-4",
				children
			})]
		})
	});
}
var SplitComponent = LoamGame;
//#endregion
export { SplitComponent as component };
