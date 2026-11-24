import type { ImageMetadata } from "astro";

import airHockey from "../../assets/blog/0.18/air-hockey.webp";
import colystrike from "../../assets/demos/colystrike.webp";
import fableOfWar from "../../assets/demos/fable-of-war.webp";
import moba from "../../assets/blog/0.18/moba.webp";
import platformer from "../../assets/blog/0.18/platformer.webp";
import racing from "../../assets/blog/0.18/racing.webp";

/**
 * Premium showcase prototypes: free to play, sponsor-only source.
 *
 * Mirrors `premiumDemos` in the docs repo (components/premium-demos.tsx) —
 * keep the two in sync. The private source repos are deliberately not listed:
 * every "get the source" action goes through SUPPORTERS_ENTRY_URL.
 */
export interface PremiumDemo {
  title: string;
  image: ImageMetadata;
  description: string;
  /** Engines this prototype is implemented on, web client first. */
  engines: string[];
  /** What it proves, netcode-wise — shown as tags. */
  techniques: string[];
  play: string;
}

export const PREMIUM_DEMOS: PremiumDemo[] = [
  {
    title: "ColyStrike (FPS)",
    image: colystrike,
    description: "First-person shooter: predicted movement with reconciliation, server-validated hitscan with lag compensation, and a C4 plant and defuse loop.",
    engines: ["Three.js"],
    techniques: ["Lag compensation", "Server hitscan"],
    play: "https://colystrike.vercel.app/",
  },
  {
    title: "Fable of War (RTS)",
    image: fableOfWar,
    description: "A 50-player RTS battle royale in one room: server-side fog of war through StateView, flow-field pathfinding, and bots in the empty seats.",
    engines: ["PixiJS"],
    techniques: ["Fog of war", "50 players per room"],
    play: "https://wavedash.com/games/fable-of-war",
  },
  {
    title: "MOBA",
    image: moba,
    description: "A 3-lane MOBA on a deterministic shared simulation: fixed timestep and client prediction driving heroes, creeps, towers and 5v5 bot matches.",
    engines: ["Three.js"],
    techniques: ["Deterministic sim", "Fixed timestep"],
    play: "https://moba-colyseus.vercel.app/",
  },
  {
    title: "Air Hockey",
    image: airHockey,
    description: "3D air hockey where everything is predicted: your mallet, the puck, hits and even goals resolve locally and are settled by the server. First to 7 wins.",
    engines: ["Three.js", "Godot", "Unity"],
    techniques: ["Composite prediction", "Predicted physics"],
    play: "https://air-hockey-colyseus.vercel.app/",
  },
  {
    title: "Platformer",
    image: platformer,
    description: "2.5D platformer built as a prediction harness: reconciled movement, rideable moving platforms, and stomps and dashes that hold up under lag.",
    engines: ["Three.js"],
    techniques: ["Reconciliation", "Dead reckoning"],
    play: "https://platformer-colyseus.vercel.app/",
  },
  {
    title: "Colyseus Karts",
    image: racing,
    description: "Kart racing with hold-to-drift mini-turbos, item boxes and rockets: rollback prediction, dead-reckoned projectiles, and rewind-based hit checks.",
    engines: ["Three.js"],
    techniques: ["Rollback", "Rewind hit checks"],
    play: "https://racing-colyseus.vercel.app/",
  },
];

/** Open-source companion: twelve labs isolating each netcode technique. */
export const PREDICTION_PLAYGROUND_URL = "https://prediction-colyseus.vercel.app/";
