import type { ImageMetadata } from 'astro';

const sdkImages = import.meta.glob<{ default: ImageMetadata }>(
  '/assets/sdks/*.png',
  { eager: true }
);

function resolveImage(filename: string): ImageMetadata {
  const mod = sdkImages[`/assets/sdks/${filename}`];
  if (!mod) throw new Error(`SDK image not found: ${filename}`);
  return mod.default;
}

export interface SDK {
  key: string;
  name: string;
  image?: ImageMetadata;
  svg?: string;
  filename: string;
  install: string;
  installType: "command" | "download" | "link";
  installUrl?: string;
  docsUrl: string;
  demoUrl?: string;
  tag: "Stable" | "Alpha";
}

// Keyed lookup map for use by showcase/other pages (e.g. platforms["javascript"].image)
export const platforms: Record<string, { name: string; image?: ImageMetadata }> = {};

export const sdks: SDK[] = [
  {
    key: "typescript",
    name: "TypeScript",
    image: resolveImage("javascript.png"),
    filename: "client.ts",
    install: "npm install @colyseus/sdk",
    installType: "command",
    docsUrl: "https://docs.colyseus.io/getting-started/typescript",
    demoUrl: "https://github.com/endel/tank-battle-multiplayer/tree/master/web-playcanvas",
    tag: "Stable",
  },
  {
    key: "react",
    name: "React",
    svg: `<svg viewBox="-11.5 -10.23174 23 20.46348"><circle cx="0" cy="0" r="2.05" fill="currentColor"/><g stroke="currentColor" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
    filename: "Game.tsx",
    install: "npm install @colyseus/react",
    installType: "command",
    docsUrl: "https://docs.colyseus.io/getting-started/react",
    demoUrl: "https://github.com/endel/r3f-lobby-car-prototype",
    tag: "Stable",
  },
  {
    key: "unity",
    name: "Unity",
    image: resolveImage("unity.png"),
    filename: "GameClient.cs",
    install: "Download Plugin",
    installType: "download",
    installUrl: "https://github.com/colyseus/colyseus-unity3d/releases/latest/download/Colyseus_Plugin.unitypackage",
    docsUrl: "https://docs.colyseus.io/getting-started/unity",
    demoUrl: "https://github.com/endel/tank-battle-multiplayer/tree/master/unity",
    tag: "Stable",
  },
  {
    key: "godot",
    name: "Godot",
    image: resolveImage("godot.png"),
    filename: "client.gd",
    install: "Download SDK",
    installType: "download",
    installUrl: "https://github.com/colyseus/native-sdk/releases?q=godot+sdk&expanded=true",
    docsUrl: "https://docs.colyseus.io/getting-started/godot",
    demoUrl: "https://github.com/endel/tank-battle-multiplayer/tree/master/godot",
    tag: "Alpha",
  },
  {
    key: "gamemaker",
    name: "GameMaker",
    image: resolveImage("gamemaker.png"),
    filename: "obj_client.gml",
    install: "Download SDK",
    installType: "download",
    installUrl: "https://github.com/colyseus/native-sdk/releases?q=gamemaker+sdk&expanded=true",
    docsUrl: "https://docs.colyseus.io/getting-started/gamemaker",
    demoUrl: "https://github.com/endel/tank-battle-multiplayer/tree/master/gamemaker",
    tag: "Alpha",
  },
  {
    key: "defold",
    name: "Defold",
    image: resolveImage("defold.png"),
    filename: "client.lua",
    install: "See documentation",
    installType: "link",
    docsUrl: "https://docs.colyseus.io/getting-started/defold",
    demoUrl: "https://github.com/endel/tank-battle-multiplayer/tree/master/defold",
    tag: "Stable",
  },
  {
    key: "haxe",
    name: "Haxe",
    image: resolveImage("haxe.png"),
    filename: "Client.hx",
    install: "haxelib install colyseus",
    installType: "command",
    docsUrl: "https://docs.colyseus.io/getting-started/haxe",
    demoUrl: "https://github.com/endel/tank-battle-multiplayer/tree/master/haxe",
    tag: "Stable",
  },
  {
    key: "c",
    name: "C",
    image: resolveImage("c.png"),
    filename: "client.c",
    install: "Download SDK",
    installType: "download",
    installUrl: "https://github.com/colyseus/native-sdk/releases?q=%22Colyseus+Native+SDK+-+Static+Library%22&expanded=true",
    docsUrl: "https://github.com/colyseus/native-sdk",
    demoUrl: "https://github.com/colyseus/native-sdk/tree/main/platforms/raylib",
    tag: "Alpha",
  },
  {
    key: "construct3",
    name: "Construct 3",
    image: resolveImage("construct3.png"),
    filename: "game.js",
    install: "Download Addon",
    installType: "download",
    installUrl: "https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-sdk",
    docsUrl: "https://docs.colyseus.io/getting-started/construct3",
    demoUrl: "https://github.com/colyseus/construct3-demo",
    tag: "Stable",
  },
];

// Populate platforms lookup from sdks
for (const sdk of sdks) {
  if (sdk.image) {
    platforms[sdk.key] = { name: sdk.name, image: sdk.image };
  }
}
platforms["javascript"] = platforms["typescript"];
