import { getOpenGraph } from "../utils/getOpenGraphImage";

export const sampleProjects = [

  await getOpenGraph("https://github.com/colyseus/colyseus-examples", {
    title: "Basic Examples"
  }),

  await getOpenGraph("https://github.com/colyseus/discord-embedded-app-sdk", {
    title: "Discord Activity Template"
  }),

  await getOpenGraph("https://github.com/endel/colyseus-tic-tac-toe", {
    title: "Tic-Tac-Toe",
    description: "Multiplayer Tic-Tac-Toe demonstrating state synchronization. Client-side using PixiJS or Defold."
  }),

  await getOpenGraph("https://github.com/colyseus/demo-firebase-authentication", {
    title: "Firebase Auth Demo",
    description: "Authentication demonstration using Firebase"
  }),

  await getOpenGraph("https://github.com/colyseus/demo-push-to-talk", {
    title: "Push to Talk",
    description: `Simple "Push To Talk" proof of concept / example.`
  }),

  await getOpenGraph("https://github.com/endel/colyseus-0.15-protocol-buffers", {
    title: "Protocol Buffers Message Exchange",
    description: "Demonstrating Raw Binary Message Exchange"
  }),

  await getOpenGraph("https://github.com/colyseus/kaplay", {
    title: "KAPLAY + Colyseus - Sample App"
  }),

  await getOpenGraph("https://github.com/colyseus/decentraland", {
    title: "Decentraland Scene"
  }),

  await getOpenGraph("https://github.com/endel/mazmorra", {
    title: "Full game: Mazmorra.io",
    description: "Online Multiplayer Dungeon Crawler / RPG"
  }),

  await getOpenGraph("https://github.com/colyseus/babylonjs-hide-and-seek", {
    title: "BabylonJS: Hide and Seek Demo",
    description: "Classic Hide and Seek multiplayer game with BabylonJS and the Graveyard asset pack from BabylonJS/Assets."
  }),

];
