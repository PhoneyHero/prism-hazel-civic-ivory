export type Tool = "dig" | "smash" | "lord";

export type StageId = "hollow" | "mossworks" | "gate" | "witchwell" | "bone" | "deep" | "chamber";

export type Phase = "play" | "win" | "lose";

export type Species =
  | "moss"
  | "crawler"
  | "lizard"
  | "bud"
  | "drake"
  | "spirit"
  | "witch"
  | "vampire"
  | "succubus"
  | "nimbus"
  | "skeleton";

export type Variant = "normal" | "giant" | "deformed" | "breed";

export type Form = "adult" | "egg" | "pupa" | "fly";

export type Brood = "walk" | "bud" | "bloom";

export type HeroClass = "swordsman" | "archer" | "mage" | "priest" | "knight" | "thief";

export type LordState = "none" | "seated" | "carried" | "dropped";

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


export interface Tile {
  kind: "bedrock" | "soil" | "dug" | "entrance";
  /** Nutrient fluid. 0–9 dirt, 10–29 Loamite, 30–54 Gnawling, 55+ Scalekin. Never on air. */
  nutrient: number;
  /** Substage 0–2 inside the current band. */
  nSub: number;
  mana: number;
  mSub: number;
  hardness: number;
}


export interface Actor {
  id: number;
  kind: "monster" | "hero" | "overlord";
  species: Species | null;
  variant: Variant;
  form: Form;
  heroClass: HeroClass | null;
  name: string;
  x: number;
  y: number;
  fx: number;
  fy: number;
  dir: number;
  face: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  mag: number;
  combat: number;
  speed: number;
  satiety: number;
  vitality: number;
  carryN: number;
  carryM: number;
  moveCd: number;
  swingCd: number;
  hungerCd: number;
  starve: number;
  hatch: number;
  sleep: number;
  poison: number;
  poisonAcc: number;
  feedCd: number;
  poisonFrom: Species | null;
  carrying: boolean;
  alive: boolean;
  path: { x: number; y: number }[] | null;
  pathAt: number;
  pathTx: number;
  pathTy: number;
  hitFlash: number;
  bob: number;
  /** Seconds of life left. Old age kills even a fed body. */
  age: number;
  windup: number;
  shield: number;
  boost: number;
  tier: number;
  /** 0 bone, 1 caster, 2 plate, 3 red. Rattle only. */
  rattle: number;
  priestUsed: boolean;
  /** Seconds of searching walk accumulated toward a shed. */
  shed: number;
  /** Seconds stuck in a dead-end. */
  stuck: number;
  /** Loamite lifecycle. Null for every other body. */
  brood: Brood | null;
  /** 1 after a fight or a full meal. Newborns stay 0 so they do not spawn asleep. */
  rest: number;
  stamina: number;
  staminaMax: number;
  /** Monsters this hero has slain. Caps the snowball. */
  kills: number;
  /** Current goal tag. Empty when the unit is choosing. */
  job: string;
  /** Seconds with no legal goal. */
  idle: number;
  /** Sealed-in count. Three breaks one wall. */
  frust: number;
  /** Seconds since this path was built. */
  pace: number;
  /** Grid generation this path was built against. */
  stamp: number;
  /** Cell where the stuck timer started. -1 if unset. */
  anchor: number;
  /** The other cell of a two-cell wobble. -1 if unset. */
  wob: number;
  /** 100 after a meal. Drains until starve. Rattle and Demon stay exempt. */
  hunger: number;
}


export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
}


export interface Floater {
  x: number;
  y: number;
  text: string;
  life: number;
  max: number;
  color: string;
}


export interface Bloom {
  x: number;
  y: number;
  n: number;
  m: number;
  life: number;
  /** Sprouted on a dug tile, not a Loamite's own bloom. */
  path: boolean;
}


export interface Web {
  x: number;
  y: number;
  life: number;
}


export interface CameraFocus {
  x: number;
  y: number;
  until: number;
}


export interface UpgradeOffer {
  id: string;
  name: string;
  tier: number;
  max: number;
  cost: number | null;
}


export interface Corpse {
  x: number;
  y: number;
  life: number;
  n: number;
  m: number;
  manaAtDeath: number;
  cls: HeroClass | null;
  spirits: number;
  red: boolean;
}


export interface DigOption {
  x: number;
  y: number;
  n: number;
  m: number;
  cost: number;
}


export interface Hud {
  stageId: StageId;
  stageName: string;
  digPower: number;
  maxDig: number;
  horde: number;
  peakHorde: number;
  countdown: number | null;
  waveText: string;
  phase: Phase;
  paused: boolean;
  tool: Tool;
  heatmap: boolean;
  ominous: string | null;
  hint: string;
  event: string | null;
  lordLeft: number;
  lordState: LordState;
  drag: number;
  waveNum: number;
  waveTotal: number;
  eco: boolean;
  summoning: boolean;
  upgradeOpen: boolean;
  /** Aye / Nay bar. Never opens the shop by itself. */
  petition: boolean;
  /** Living Rattles under the census. */
  rattleLine: string | null;
  /** Stage clock. Null in the Chamber. */
  clock: number | null;
  upgrades: UpgradeOffer[];
  version: string;
  banner: string | null;
  endless: boolean;
  raidActive: boolean;
  raids: number;
  counts: { id: Species; name: string; n: number }[];
  almanac: { id: string; title: string; blurb: string; seen: boolean }[];
  result: {
    outcome: "win" | "lose";
    reason: string;
    seconds: number;
    peakHorde: number;
    heroesSlain: number;
    mutations: number;
    living: string;
  } | null;
  muted: boolean;
  digs: number;
}


export interface Match {
  cols: number;
  rows: number;
  tiles: Tile[];
  actors: Actor[];
  corpses: Corpse[];
  blooms: Bloom[];
  webs: Web[];
  /** Top-left of each isolated 2×2 mana rune. */
  runes: { x: number; y: number }[];
  /** Scalekin claim marks inside a dug 2×3. */
  nests: { x: number; y: number }[];
  focus: CameraFocus | null;
  particles: Particle[];
  floaters: Floater[];
  shake: number;
  time: number;
  heatmap: boolean;
  tool: Tool;
  reducedMotion: boolean;
  onSfx: (name: SfxName) => void;
  lordState: LordState;
  digs: number;
  born: Record<Species, number>;
  heroesSlain: number;
  monsterDeaths: number;
  tick: (dt: number) => void;
  tap: (x: number, y: number) => void;
  setTool: (t: Tool) => void;
  toggleHeat: () => void;
  togglePause: () => void;
  toggleMute: () => void;
  summon: () => void;
  buyUpgrade: (id: string) => void;
  answerPetition: (yes: boolean) => void;
  closeUpgrades: () => void;
  subscribe: (fn: () => void) => () => void;
  hud: () => Hud;
  listDiggable: () => DigOption[];
  /** Test hook. Dead-end flags and seen tiles for one hero. */
  probeIntel: (id: number) => { dead: number; seen: number } | null;
  /** Test hook. Place a monster on a dug tile. */
  plant: (sp: Species, x: number, y: number, form?: Form) => Actor;
  /** Test hook. Place a hero on a dug tile. */
  plantHero: (cls: HeroClass, x: number, y: number) => Actor;
}


export interface WaveHero {
  cls: HeroClass;
  mul: number;
}


export interface Wave {
  heroes: WaveHero[];
}


export interface Pressure {
  hunger: number;
  predation: number;
  heroKills: number;
  starveDeaths: number;
  peak: number;
  giantArmed: boolean;
  deformArmed: boolean;
  breedArmed: boolean;
}


export interface Save {
  v: 1;
  cleared: StageId[];
  seen: string[];
  best: number;
  muted: boolean;
}


export interface StageBuild {
  cols: number;
  rows: number;
  tiles: Tile[];
  entrance: { x: number; y: number };
  dig: number;
  name: string;
  endless: boolean;
  prep: number;
  eco: number;
  waves: Wave[];
}

export interface Sim {
  stageId: StageId;
  built: StageBuild;
  cols: number;
  rows: number;
  tiles: Tile[];
  actors: Actor[];
  particles: Particle[];
  floaters: Floater[];
  rng: () => number;
  save: Save;
  seen: Set<string>;
  listeners: Set<() => void>;
  pressure: Record<Species, Pressure>;
  nextId: number;
  digPower: number;
  maxDig: number;
  phase: Phase;
  paused: boolean;
  tool: Tool;
  heatmap: boolean;
  muted: boolean;
  time: number;
  shake: number;
  digs: number;
  horde: number;
  peakHorde: number;
  hintStep: number;
  event: string;
  eventLife: number;
  ominous: string;
  ominousLife: number;
  banner: string;
  bannerLife: number;
  uiAcc: number;
  birthCd: number;
  reproCd: number;
  nestScan: number;
  auraScan: number;
  nestTiles: { x: number; y: number }[];
  lordLeft: number;
  lordState: LordState;
  carrierId: number | null;
  dragStart: number;
  prepLeft: number | null;
  launched: number;
  ecoWait: number | null;
  clearNoted: number;
  invasionStarted: boolean;
  raidActive: boolean;
  raidWarn: number | null;
  pendingRaid: WaveHero[] | null;
  leakAcc: number;
  sipAcc: number;
  upgradeOpen: boolean;
  petitionAsk: boolean;
  petitionYes: boolean;
  petitionDelay: number | null;
  firstAye: boolean;
  clockLeft: number | null;
  bloomAcc: number;
  staminaFalls: number;
  combatFalls: number;
  heroIntel: Map<number, { seen: Uint8Array; dead: Uint8Array; lord: number }>;
  rattleMem: Map<number, Uint8Array>;
  gridStamp: number;
  birthMajor: number;
  birthSub: number;
  raidTen: boolean;
  upgrades: Record<string, number>;
  raids: number;
  heroesSlain: number;
  monsterDeaths: number;
  mutations: number;
  rattleN: number;
  rattleM: number;
  result: Hud["result"];
  spawnQueue: { cls: HeroClass; mul: number; delay: number; waited: number }[];
  born: Record<Species, number>;
  everSeenForm: { egg: boolean; pupa: boolean };
  corpses: Corpse[];
  blooms: Bloom[];
  webs: Web[];
  runeList: { x: number; y: number }[];
  nestMarks: { x: number; y: number }[];
  nestBoxes: { x: number; y: number; w: number; h: number }[];
  api: Match;
  emit(): any;
  subscribe(fn: () => void): any;
  sfx(name: SfxName): any;
  toast(text: string): any;
  warn(text: string): any;
  shout(text: string): any;
  familyOmen(name: string): any;
  familySettle(name: string): any;
  persist(): any;
  markSeen(id: string): any;
  tileAt(x: number, y: number): Tile | null;
  isOpen(x: number, y: number): any;
  nearOpen(x: number, y: number): any;
  actorAt(x: number, y: number, except?: number): Actor | null;
  countSpecies(sp: Species): any;
  chainAlive(): any;
  heroThreat(): any;
  burst(x: number, y: number, color: string, n: number, speed: number): any;
  float(x: number, y: number, text: string, color: string): any;
  bumpShake(n: number): any;
  applyMonsterStats(a: Actor, sp: Species, variant: Variant, form: Form): any;
  spawnMonster(sp: Species, x: number, y: number, variant: Variant, form: Form): Actor;
  rollVariant(sp: Species): Variant;
  maybeArm(sp: Species): any;
  freeNeighbor(x: number, y: number): {
    x: number;
    y: number;
} | null;
  openNeighbors(x: number, y: number): any;
  inNest(x: number, y: number): any;
  axisGap(a0: number, a1: number, b0: number, b1: number): any;
  boxGap(a: {
    x: number;
    y: number;
    w: number;
    h: number;
}, b: {
    x: number;
    y: number;
    w: number;
    h: number;
}): any;
  boxesAt(x: number, y: number): any;
  legalClaimBox(x: number, y: number): any;
  refreshNests(): any;
  huntsMoss(a: Actor): any;
  isPrey(pred: Actor, prey: Actor): any;
  nearest(pred: Actor, test: (a: Actor) => boolean): Actor | null;
  taxTile(x: number, y: number): any;
  leakStores(): any;
  moveTo(a: Actor, x: number, y: number): any;
  familyOf(sp: Species): string | null;
  lifeOf(sp: Species): number;
  calmNow(): any;
  bumpN(t: Tile): any;
  bumpM(t: Tile): any;
  pullN(t: Tile): boolean;
  pullM(t: Tile): boolean;
  nearestWall(sx: number, sy: number): {
    x: number;
    y: number;
    t: Tile;
} | null;
  giveWall(x: number, y: number, n: number, m: number): any;
  dumpFull(x: number, y: number, n: number, m: number): any;
  wallList(x: number, y: number): {
    t: Tile;
    n: number;
    m: number;
}[];
  transferNutrient(a: Actor): any;
  transferMana(a: Actor): any;
  eat(pred: Actor, prey: Actor): any;
  tryEat(a: Actor): any;
  tryLay(a: Actor): any;
  emerge(a: Actor): any;
  los(ax: number, ay: number, bx: number, by: number, max: number): any;
  sameRoom(ax: number, ay: number, bx: number, by: number, cap?: number): any;
  tickAura(): any;
  layWeb(x: number, y: number): any;
  strike(att: Actor, def: Actor): any;
  pour(x: number, y: number, n: number, m: number): any;
  heroTithe(a: Actor): {
    n: number;
    m: number;
};
  splash(x: number, y: number, n: number, m: number): any;
  breakBloom(bloom: Bloom): any;
  spellWall(t: Tile, bumps: number): any;
  boltRewrite(ax: number, ay: number, tx: number, ty: number, bumps: number): any;
  paintDiamond(x: number, y: number, n: number, m: number): any;
  splitFluid(x: number, y: number, n: number, m: number): any;
  bandSpeciesN(n: number): Species | null;
  bandSpeciesM(m: number): Species | null;
  releaseSoil(x: number, y: number, n: number, m: number): number;
  runeSquare(x: number, y: number): any;
  refreshRunes(): any;
  runeOf(x: number, y: number): any;
  breakRune(rx: number, ry: number): any;
  openDug(x: number, y: number, t: Tile): any;
  noteGrid(): any;
  frustratedDig(a: Actor): any;
  canStep(a: Actor, x: number, y: number): any;
  ensureIntel(a: Actor): any;
  refreshIntel(): any;
  probeIntel(id: number): any;
  plant(sp: Species, x: number, y: number, form?: Form): Actor;
  plantHero(cls: HeroClass, x: number, y: number): Actor;
  route(fromX: number, fromY: number, toX: number, toY: number): {
    x: number;
    y: number;
}[];
  pursue(a: Actor, tx: number, ty: number): "there" | "step" | "wait" | "none";
  nearestOpen(ax: number, ay: number, ok: (x: number, y: number) => boolean): {
    x: number;
    y: number;
} | null;
  farthestFromStair(): {
    x: number;
    y: number;
} | null;
  suckWalls(a: Actor, radius: number): any;
  sproutPair(x: number, y: number, sp: "moss" | "spirit"): any;
  hatchLoamites(a: Actor, mode: "natural" | "smash"): any;
  rootBud(a: Actor): any;
  tickBrood(a: Actor, dt: number): any;
  feedPiles(x: number, y: number, n: number, m: number): any;
  makePile(x: number, y: number, extra?: Partial<Corpse>): Corpse;
  dumpOrthogonal(x: number, y: number, n: number, m: number, forceBand: boolean): any;
  slay(a: Actor, cause: "combat" | "eaten" | "starve" | "smash" | "poison" | "age" | "stamina", by: Species | "hero" | "overlord" | "smash" | null): any;
  dumpOf(sp: Species | null, smash: boolean): any;
  nutrientSpecies(x: number, y: number, n: number, sub: number): Species | null;
  manaSpecies(m: number, sub: number): Species | null;
  trySpawn(sp: Species, x: number, y: number, major?: number, sub?: number): Actor | null;
  birthFromSoil(x: number, y: number, n: number, m: number, nSub?: number, mSub?: number): any;
  passiveBirth(): any;
  staminaPool(): any;
  spawnHero(cls: HeroClass, x: number, y: number, mul?: number): any;
  queueWave(heroes: WaveHero[]): any;
  launchWave(index: number): any;
  releaseSpawns(dt: number): any;
  invasionActive(): any;
  wantsSleep(a: Actor): any;
  standBeside(wx: number, wy: number, ax: number, ay: number): {
    x: number;
    y: number;
} | null;
  soilNear(ax: number, ay: number, radius: number, fluid: "n" | "m", want: "rich" | "poor"): {
    x: number;
    y: number;
    t: Tile;
} | null;
  takeFluid(t: Tile, fluid: "n" | "m", amt: number): any;
  giveFluid(t: Tile, fluid: "n" | "m", amt: number): any;
  truck(a: Actor, fluid: "n" | "m"): any;
  farTile(a: Actor, minD: number, maxD: number): {
    x: number;
    y: number;
} | null;
  horizontalHalls(minLen: number): {
    y: number;
    x0: number;
    x1: number;
}[];
  straightHall(minLen: number): {
    x: number;
    y: number;
    x2: number;
    y2: number;
} | null;
  pingPong(a: Actor, x0: number, y0: number, x1: number, y1: number): any;
  rattleBag(a: Actor): any;
  rattleGoal(a: Actor): {
    x: number;
    y: number;
} | null;
  localAllyCount(x: number, y: number, selfId: number): any;
  demonPost(a: Actor): {
    x: number;
    y: number;
} | null;
  actMonster(a: Actor): any;
  heroReach(a: Actor): any;
  inFight(a: Actor): any;
  noteStuck(a: Actor, dt: number): any;
  actHero(a: Actor): any;
  combat(): any;
  releaseSkill(a: Actor): any;
  finish(outcome: "win" | "lose", reason: string): any;
  checkEnd(): any;
  recomputeHorde(): any;
  advanceHint(): any;
  grantStipend(): any;
  corpseAt(x: number, y: number): Corpse | null;
  raiseRattle(c: Corpse): any;
  smashCorpse(c: Corpse): any;
  hungerRate(sp: Species): number;
  hexSpend(a: Actor): any;
  demonSip(a: Actor): any;
  tick(dt: number): any;
  trimFx(): any;
  digAt(x: number, y: number): any;
  smashAt(x: number, y: number): any;
  livingLord(): Actor | null;
  grab(hero: Actor, lord: Actor): any;
  dropLord(x: number, y: number): any;
  syncCarry(): any;
  bestThrone(): {
    x: number;
    y: number;
} | null;
  seatNew(x: number, y: number): any;
  autoPlace(): any;
  huntLocked(): any;
  placeLord(x: number, y: number): any;
  petitionWindow(): any;
  tap(x: number, y: number): any;
  setTool(t: Tool): any;
  toggleHeat(): any;
  togglePause(): any;
  toggleMute(): any;
  summon(): any;
  buyUpgrade(id: string): any;
  answerPetition(yes: boolean): any;
  closeUpgrades(): any;
  upgradeOffers(): UpgradeOffer[];
  listDiggable(): DigOption[];
  hud(): Hud;
}
