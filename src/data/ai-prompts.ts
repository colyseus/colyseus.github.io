/**
 * Ready-made prompts for AI coding agents (Claude Code, Codex, Cursor, Gemini
 * CLI, Copilot…) that scaffold a Colyseus 0.18 multiplayer game.
 *
 * Single source of truth: the /ai page's prompt builder, the static
 * /ai/prompts/<id>.txt files and the one-prompt proof of concept all read from
 * here. A preset marked `verified` was run end-to-end, unedited, by a fresh
 * agent — change its text and that claim no longer holds until it's re-run.
 */

export interface PromptPreset {
  id: string;
  /** Chip label on the page. */
  label: string;
  /** One-line teaser under the chip row. */
  blurb: string;
  /** Flags passed to `npm create colyseus-app@latest my-game -- <flags>`. */
  flags: string;
  /**
   * A second agent skill, installed next to Colyseus' for a library newer than the agent's
   * training: `add` is the `npx skills add` arguments, `about` names the library.
   */
  skill?: { add: string; about: string };
  /** A third setup step that fetches ready-made art, so the agent spends its time on the game. */
  assets?: string;
  /** What to build, in a few lines; the agent fills in the details. */
  game: string;
  /** Who simulates what: prediction, interpolation, lag compensation. */
  netcode: string;
  /** What the tests must prove. */
  tests: string;
  verified?: boolean;
}

/** Segments of a built prompt, in order — the builder animates only those that change. */
export type PromptSegmentKey = "intro" | "setup" | "game" | "netcode" | "done";

const INTRO = `Build a multiplayer browser game with Colyseus 0.18. Work on your own until it's done; don't ask
me questions.`;

const skills = (skill?: PromptPreset["skill"]) => skill
  ? `1. npx skills add colyseus/skill -y and npx skills add ${skill.add} -y, then read
   both SKILL.md files: they're newer than what you know about Colyseus and ${skill.about}.
   (No skills support? Use https://docs.colyseus.io/llms.txt for Colyseus.)`
  : `1. npx skills add colyseus/skill -y, then read its SKILL.md: it's newer than what you know about
   Colyseus. (No skills support? Use https://docs.colyseus.io/llms.txt instead.)`;

const setup = (flags: string, skill?: PromptPreset["skill"], assets?: string) => `First, in an empty folder:
${skills(skill)}
2. npm create colyseus-app@latest my-game -- ${flags}
   Build on the scaffold inside my-game/ rather than replacing it.${assets ? `\n3. ${assets}` : ""}`;

const done = (tests: string) => `Done when npx tsc --noEmit, npm test and npm run build pass and everything is committed.
Tests should cover ${tests}.`;

export const PRESETS: PromptPreset[] = [
  {
    id: "arena-shooter",
    label: "Arena shooter",
    blurb: "2-8 players frag each other in a 3D arena, with predicted movement and lag-compensated shots.",
    flags: "--layout vite --netcode fixed --matchmaking reconnection --git --yes",
    skill: { add: "pixijs/3d --skill pixijs-3d", about: "@pixi/3d" },
    assets: `Download https://github.com/colyseus/one-prompt-assets/releases/download/shooter-v2/shooter-assets.zip,
   unzip it into my-game/public/assets/ and read its ASSETS.md. Build the characters, the blaster
   and the arena from these models only.`,
    game: `Game: a top-down arena shooter in PixiJS with @pixi/3d for 2-8 players, free-for-all. WASD moves,
the mouse aims, click fires a hitscan blaster with a visible tracer. A few hits frag a player, who
respawns after 3 seconds; first to 10 frags wins the round and a new one starts. A fixed map of
cover on the kit's 1-unit grid; walls and crates block both movement and shots. The camera
follows you.`,
    netcode: `Netcode: the server is authoritative, and the netcode is Colyseus' own, not hand-rolled. Read the
skill's references/netcode.md, then https://docs.colyseus.io/netcode/lag-compensation.md and
https://docs.colyseus.io/netcode/determinism.md before writing any of it. The scaffold already
wires this loop for movement; extend it to aiming and shooting:
- Aim angle and trigger travel in the input (defineInput). One shared step function moves, aims
  and fires from that input alone, with cooldowns counted in ticks. The server runs it in
  setFixedTimestep(); your client predicts with it in predict.reconciler(), sending one input
  per step that predict.tick() returns.
- Other players: predict.attachAll() in lerp mode with smoothMs 0, so they're drawn exactly where
  the server will rewind them. Draw everyone through predict.value().
- Shots: the server judges them with allowRewindState() and rewind.lastSeenBy(). Your step judges
  the same shot against predict.readAt(target, ..., ctx.reckonTime) and plays the hit marker
  through predict.defineEvent(), so your marker and the server's verdict agree.
- Fair for the target: the shooter's tracer and the damage show up together, and maxRewindMs
  stays near the interpolation delay + 200 ms, so nobody is hit long after reaching cover.
- Players pass through each other and nothing knocks them back, so only your own input moves
  you. Respawns are teleports (snap).
Load @colyseus/sdk/debug in development, set warnOnDivergence on the reconciler and play at
__net(150, 30): your player must respond without waiting for the server, and the reconciler's
drift.ema must stay near 0 while you move and shoot.`,
    tests: `two clients seeing each other move, the shared step giving identical results
on client and server for the same inputs, and a shot landing on a moving player where the shooter
saw them`,
    verified: true,
  },
  {
    id: "parkour",
    label: "Parkour platformer",
    blurb: "Side-view race for 2-6 players with wall-jumps, moving platforms and stomps.",
    flags: "--preset realtime-action --git --yes",
    game: `Game: a side-view parkour race for 2-6 players: run, jump, wall-jump and stomp your way through
moving platforms and spikes, with checkpoints; first to the flag wins. Canvas, dark neon look.`,
    netcode: `Netcode: the server is authoritative. Predict your own runner locally, running the same step
function on client and server (moving platforms follow the tick), so jumps feel instant;
interpolate the other runners; lag-compensate stomps so they land where you saw them. Load
@colyseus/sdk/debug in development to try it under latency.`,
    tests: "two clients seeing each other move and touching the flag finishing the race",
  },
  {
    id: "io-arena",
    label: ".io arena",
    blurb: "Agar-style free-for-all for 30 players, split into rooms by game mode.",
    flags: "--layout vite --netcode fixed --matchmaking filterby,idle-kick --git --yes",
    game: `Game: an .io arena for up to 30 players: steer your blob toward the mouse, eat pellets to grow,
swallow smaller players. Join with { mode: "ffa" }. Canvas, with a camera that follows you.`,
    netcode: `Netcode: the server is authoritative and owns the pellets. Predict your own blob locally so
steering feels instant; interpolate the rest; lag-compensate swallows so they match what the
eater saw. Load @colyseus/sdk/debug in development to try it under latency.`,
    tests: "two clients seeing each other move and eating a pellet growing a blob",
  },
  {
    id: "turn-based-cards",
    label: "Turn-based cards",
    blurb: "Two-player card duel with private hands and per-turn deadlines.",
    flags: "--preset turn-based --layout vite --git --yes",
    game: `Game: a 2-player card duel: decks of 20, hands of 5, play a card to your lane or pass each turn;
the highest total after 5 rounds wins. DOM UI with deal and flip animations.`,
    netcode: `Netcode: the server owns the deck, the turn order and the turn deadline. Hands are private
(StateView): your opponent only sees how many cards you hold. Turn-based, so no prediction.`,
    tests: "each client seeing only its own hand and an out-of-turn play being rejected",
  },
];

export const DEFAULT_PRESET_ID = "arena-shooter";

export function getPreset(id: string): PromptPreset {
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) throw new Error(`Unknown prompt preset: ${id}`);
  return preset;
}

export function promptSegments(id: string): { key: PromptSegmentKey; text: string }[] {
  const p = getPreset(id);
  return [
    { key: "intro", text: INTRO },
    { key: "setup", text: setup(p.flags, p.skill, p.assets) },
    { key: "game", text: p.game },
    { key: "netcode", text: p.netcode },
    { key: "done", text: done(p.tests) },
  ];
}

export function buildPrompt(id: string): string {
  return promptSegments(id).map((s) => s.text).join("\n\n") + "\n";
}

/**
 * Hand a premium demo to your agent and reshape it. Kept separate from the
 * presets: it assumes an existing project, not an empty folder.
 */
export const CUSTOMIZE_DEMO_PROMPT = `This is a Colyseus 0.18 project. Install the agent skill first (npx skills add colyseus/skill)
and read its SKILL.md. Then read the README and every file before changing anything.

Keep the netcode architecture exactly as it is: the authoritative room, its simulation loop, what
each client is sent, and however the client predicts, reconciles or interpolates.

Change only the rules, content and visuals: <describe your game here>.

Done when npx tsc --noEmit and npm test pass, and two browser tabs still play together smoothly.
`;
