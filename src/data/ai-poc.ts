/**
 * The one-prompt proof of concept shown on /ai: the `verified` preset from
 * ai-prompts.ts, pasted unedited into a fresh agent session.
 *
 * Every number here is measured from the published run (see RUN.md in the
 * repo), never estimated. The Proof section doesn't render while `repo` is
 * empty, so placeholder values can't ship.
 */
export interface OnePromptRun {
  /** Public repository with the untouched scaffold → agent history. */
  repo: string;
  /** Tag on the agent's last commit — the unedited result. */
  tag: string;
  /** Where the game is playable (static client + shared demos server); empty hides the link. */
  liveUrl: string;
  scaffoldSha: string;
  agentSha: string;
  presetId: string;
  /** What the agent named its game, and one line on what came back. */
  gameName: string;
  gameSummary: string;
  agent: string;
  model: string;
  date: string;
  followUps: number;
  humanEdits: number;
  /** Prompt to the agent's commit, in minutes, npm installs and its own playtests included. */
  durationMin: number;
  filesChanged: number;
  linesAdded: number;
  testsPassing: number;
  /** Fresh runs it took to get here; failed attempts are listed in RUN.md. */
  attempts: number;
  /** Why earlier attempts didn't count, shown next to the result when attempts > 1. */
  attemptsNote: string;
  /** Simulated round-trip time during the capture, in ms. */
  captureRttMs: number;
  /** Simulated jitter on top of `captureRttMs`, in ms. */
  captureJitterMs: number;
  /** Both reconcilers' `drift.ema` through RUN.md's bot duel at the capture's lag. */
  driftEma: number;
  /** ISO date of the capture, for the VideoObject markup. */
  captureDate: string;
  /** Length of the clip, as an ISO 8601 duration. */
  clipDuration: string;
  /**
   * `wide` is both seats side by side; `mobile` is one seat with the other inset,
   * so each view stays legible on a phone.
   */
  video: {
    wide: { mp4: string; webm: string; poster: string; width: number; height: number };
    mobile: { mp4: string; webm: string; poster: string; width: number; height: number };
  };
  /** Condensed from the real session, replayed by the hero terminal. */
  transcript: { kind: "cmd" | "out" | "ok" | "note"; text: string }[];
}

export const ONE_PROMPT_RUN: OnePromptRun = {
  repo: "https://github.com/colyseus/one-prompt-game",
  tag: "one-prompt-v2",
  liveUrl: "https://one-prompt-game.pages.dev",
  scaffoldSha: "df3e513897da34b82783968a0693b493050cf691",
  agentSha: "c7e889169a8dad9598d17cb81270d446cb9955a1",
  presetId: "arena-shooter",
  gameName: "Blaster Arena",
  gameSummary: "a top-down 3D arena shooter in PixiJS with an authoritative server, your own player predicted locally, and lag-compensated shots whose hit markers match the server's verdict, each covered by its own test.",
  agent: "Claude Code",
  model: "Claude Opus 5.5",
  date: "Nov 23, 2026",
  followUps: 0,
  humanEdits: 0,
  durationMin: 64,
  filesChanged: 26,
  linesAdded: 2169,
  testsPassing: 6,
  attempts: 1,
  attemptsNote: "",
  captureRttMs: 150,
  captureJitterMs: 30,
  driftEma: 0,
  captureDate: "2026-11-23",
  clipDuration: "PT13S",
  video: {
    wide: {
      mp4: "/images/ai/one-prompt-shooter.mp4",
      webm: "/images/ai/one-prompt-shooter.webm",
      poster: "/images/ai/one-prompt-shooter-poster.webp",
      width: 1440,
      height: 516,
    },
    mobile: {
      mp4: "/images/ai/one-prompt-shooter-mobile.mp4",
      webm: "/images/ai/one-prompt-shooter-mobile.webm",
      poster: "/images/ai/one-prompt-shooter-mobile-poster.webp",
      width: 718,
      height: 516,
    },
  },
  transcript: [
    { kind: "note", text: "prompt: Build a multiplayer browser game with Colyseus 0.18…" },
    { kind: "cmd", text: "npx skills add colyseus/skill -y" },
    { kind: "ok", text: "colyseus → ./.agents/skills/colyseus" },
    { kind: "cmd", text: "npx skills add pixijs/3d --skill pixijs-3d -y" },
    { kind: "ok", text: "pixijs-3d → ./.agents/skills/pixijs-3d" },
    { kind: "cmd", text: "npm create colyseus-app@latest my-game -- --layout vite --netcode fixed --matchmaking reconnection --git --yes" },
    { kind: "out", text: "Included: shape-vite, netcode-fixed, netcode-fixed-client, reconnection" },
    { kind: "cmd", text: "npm install pixi.js@^8.23.0 @pixi/3d@^0.1.0" },
    { kind: "out", text: "write src/rooms/ArenaRoom.ts · src/shared/simulation.ts · src/client/character.ts" },
    { kind: "cmd", text: "npm test" },
    { kind: "ok", text: "6 passing · a shot lands where the shooter saw the moving player" },
    { kind: "cmd", text: "npm start" },
    { kind: "ok", text: "Blaster Arena on http://localhost:5173 — open two tabs" },
  ],
};

export const hasOnePromptRun = ONE_PROMPT_RUN.repo !== "";
