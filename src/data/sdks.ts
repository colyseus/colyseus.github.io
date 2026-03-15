export interface SDK {
  key: string;
  name: string;
  image?: string;
  svg?: string;
  filename: string;
  install: string;
  installType: "command" | "download" | "link";
  installUrl?: string;
  docsUrl: string;
  demoUrl?: string;
  tag: "Stable" | "Alpha";
}

export const sdks: SDK[] = [
  {
    key: "typescript",
    name: "TypeScript",
    image: "/images/sdks/javascript.png",
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
    image: "/images/sdks/unity.png",
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
    image: "/images/platforms/godot.png",
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
    image: "/images/platforms/gamemaker.png",
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
    image: "/images/sdks/defold.png",
    filename: "client.lua",
    install: "See documentation",
    installType: "link",
    docsUrl: "https://docs.colyseus.io/getting-started/defold",
    demoUrl: "https://github.com/endel/tank-battle-multiplayer/tree/master/defold",
    tag: "Stable",
  },
  {
    key: "construct3",
    name: "Construct 3",
    image: "/images/sdks/construct3.png",
    filename: "game.js",
    install: "Download Addon",
    installType: "download",
    installUrl: "https://www.construct.net/en/make-games/addons/111/colyseus-multiplayer-sdk",
    docsUrl: "https://docs.colyseus.io/getting-started/construct3",
    demoUrl: "https://github.com/colyseus/construct3-demo",
    tag: "Stable",
  },
  {
    key: "haxe",
    name: "Haxe",
    image: "/images/sdks/haxe.png",
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
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    filename: "client.c",
    install: "Download SDK",
    installType: "download",
    installUrl: "https://github.com/colyseus/native-sdk/releases?q=%22Colyseus+Native+SDK+-+Static+Library%22&expanded=true",
    docsUrl: "https://github.com/colyseus/native-sdk",
    demoUrl: "https://github.com/colyseus/native-sdk/tree/main/platforms/raylib",
    tag: "Alpha",
  },
];
