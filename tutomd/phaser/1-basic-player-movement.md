![](image.png)

# Part 1: Basic Player Movement

This guide will show you how you can build a multiplayer experience with Colyseus Multiplayer Framework and Phaser.

## In Part 1, you will learn how to:

- Set up a **Colyseus** server and the **Phaser** client
- Connect multiple players into a **room**
- Use keyboard **arrow keys** to move players across the network

<iframe src="https://colyseus-phaser-tutorial.glitch.me/#part1" width="100%" height="280"></iframe>

## Materials

<span class="icon icon-link"></span> [Part 1: Phaser Scene source-code](https://github.com/colyseus/tutorial-phaser/blob/master/client/src/scenes/Part1Scene.ts)
<span class="icon icon-link"></span> [Part 1: Colyseus Room source-code](https://github.com/colyseus/tutorial-phaser/blob/master/server/src/rooms/Part1Room.ts)

---

<span class="icon icon-link"></span> [Full source-code on GitHub](https://github.com/colyseus/tutorial-phaser)
<span class="icon icon-link"></span> [Live Project on Glitch](https://glitch.com/~colyseus-phaser-tutorial)

# Before you start

## Prior Knowledge Expected

- Basic Phaser knowledge ([See Getting Started with Phaser 3](http://phaser.io/tutorials/getting-started-phaser3))
- Basic JavaScript/TypeScript understanding ([See TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html))
- Basic Node.js understanding ([See Introduction to Node.js](https://nodejs.dev/learn/))

## Software requirements

<span class="icon download"></span> [Node.js LTS](https://nodejs.org/en/download/)
<span class="icon download"></span> [Visual Studio Code](https://code.visualstudio.com/download)

# Creating the Server

We will be making a basic server, hosted locally on your computer for keeping player states.

To create a fresh new Colyseus server, run the following from your command-line:

```
npm init colyseus-app ./server
```

Let's make sure you can run the server locally now, by running `npm start`:

```
cd server
npm start
```

If successful, the output should look like this in your command-line:

```
> my-app@1.0.0 start
> ts-node-dev --respawn --transpile-only src/index.ts

✅ development.env loaded.
✅ Express initialized
🏟 Your Colyseus App
⚔️ Listening on ws://localhost:2567
```

# Creating the Client

We are going to set up a new project using NPM, Parcel and TypeScript for the client-side. If you are more comfortable with other tooling, feel free to use the tools of your choice instead.

## Setting up Parcel and TypeScript

Create the client-side project by running the following commands from your terminal:

```
mkdir client
cd client
npm init -y
```

Install the development dependencies (`parcel` and `typescript`):

```
npm install --save-dev parcel typescript
```

Install the runtime dependencies (`phaser` and `colyseus.js`):

```
npm install --save phaser colyseus.js
```

Generate the `tsconfig.json` file by running the following command:

```
npx tsc --init
```

**IMPORTANT**: By default, the generated `tsconfig.json` file has _strict_ type checking enabled. We suggest disabling strict type checking for this tutorial.

```json
// (...)
    /* Type Checking */
    "strict": false,
// (...)
```

Create the `index.html` file, importing our entrypoint file as a module:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Colyseus + Phaser Example</title>
</head>
<body>
    <!---------------------------------------------------->
    <!-- Include entrypoint TypeScript file as a module -->
    <!---------------------------------------------------->
    <script src="index.ts" type="module"></script>
</body>
</html>
```

And, finally, create the entrypoint `index.ts` file TypeScript file, creating a `Phaser.Game` instance, and a `GameScene`:

```typescript
import Phaser from "phaser";

// custom scene class
export class GameScene extends Phaser.Scene {
    preload() {
      // preload scene
    }

    create() {
      // create scene
    }

    update(time: number, delta: number): void {
      // game loop
    }
}

// game config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#b6d53c',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
};

// instantiate the game
const game = new Phaser.Game(config);
```

In order to access the client-side project from your web browser, let's start `parcel` through another terminal tab, which is going to build and serve the client-side files:

```
npx parcel serve index.html
```

Alternatively, you can edit your `package.json` file and add a `"start"` command with this:

```json
  // (...)
  "scripts": {
    "start": "parcel serve index.html",
  },
  // (...)
```

Then, instead of running that first long `parcel` command, you can run `npm start` for short now:

```
npm start
```

If successful, the output should look like this in your command-line:

```
> client@1.0.0 start
> parcel serve index.html

Server running at http://localhost:1234
✨ Built in 6ms
```

# Establishing a Client-Server Connection

From the Phaser scene, let's instantiate our Colyseus `Client` instance, and connect into a `Room`.

We need the `create()` method to be defined as `async` to be able to use `await` inside it.

```javascript
import { Client, Room } from "colyseus.js";

// custom scene class
export class GameScene extends Phaser.Scene {
    // (...)

    client = new Client("ws://localhost:2567");
    room: Room;

    async create() {
      console.log("Joining room...");

      try {
        this.room = await this.client.joinOrCreate("my_room");
        console.log("Joined successfully!");

      } catch (e) {
        console.error(e);
      }
    }

    // (...)
}
```

> Note that we're using the local `ws://localhost:2567` endpoint here. You need to [deploy your server](https://docs.colyseus.io/arena/getting-started/create-application/) to the public internet in order to play with others online. You can also use [Glitch](https://glitch.com/edit/#!/colyseus-phaser-tutorial) to host your server publicly.

When you refresh your browser now, your client is going to establish a connection with the server, and the server is going to create the room `my_room` on demand for you.

Notice that `my_room` is the default room identifier set by the barebones Colyseus server. You can and should change this identifier in the `arena.config.ts` file.

You will be seeing the following message in your server logs, which means a client successfully joined the room!

```
19U8WkmoK joined!
```

# Room State and Schema

In Colyseus, we define shared data through its `Schema` structures.

> `Schema` is a special data type from Colyseus that is capable of encoding its changes/mutations _incrementally_. The encoding and decoding process happens internally by the framework and its SDK.

The state synchronization loop looks like this:

1. State changes (mutations) are synchronized automatically from Server → Clients
2. Clients, by attaching callbacks to their local _read-only_ `Schema` structures, can observe for state mutations and react to it.
3. Clients can send arbitrary messages to the server - which decides what to do with it - and may mutate the state (Go back to step **1.**)

---

Let's go back to editing the Server code, and define our Room State in the Server.

We need to handle multiple `Player` instances, and each `Player` will have `x`, `y` and `z` coordinates:

```typescript
// MyRoomState.ts
import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("number") x: number;
    @type("number") y: number;
}

export class MyRoomState extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}
```

> See more about the [Schema structures](https://docs.colyseus.io/colyseus/state/schema/).

Now, still in the server-side, let's modify our `onJoin()` method to create a `Player` instance whenever a new connection is established with the room.

```typescript
// MyRoom.ts
// (...)
    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");

        const mapWidth = 800;
        const mapHeight = 600;

        // create Player instance
        const player = new Player();

        // place Player at a random position
        player.x = (Math.random() * mapWidth);
        player.y = (Math.random() * mapHeight);

        // place player in the map of players by its sessionId
        // (client.sessionId is unique per connection!)
        this.state.players.set(client.sessionId, player);
    }
// (...)
}
```

Also, when the client disconnects, let's remove the player from the map of players:

```typescript
// MyRoom.ts
// (...)
    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");

        this.state.players.delete(client.sessionId);
    }
// (...)
```

The state mutations we've done on the server-side **can be observed** on the client-side, and that's what we're going to do in the next sections.

# Preloading Assets in the Demo Scene

For this demo, we only need one sprite to represent the player, which we are going to use whenever a player joins the room.

![Player Sprite](https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png)

```typescript
    // (...)

    preload() {
      // preload scene
      this.load.image('ship_0001', 'https://cdn.glitch.global/3e033dcd-d5be-4db4-99e8-086ae90969ec/ship_0001.png');
    }

    // (...)
```

# Listening for State Changes

After a connection with the room has been established, the client-side can start listening for state changes, and create a visual representation of the data in the server.

## Adding new players

As per [Room State and Schema](#room-state-and-schema) section, whenever the server accepts a new connection - the `onJoin()` method is creating a new Player instance within the state.

We're going to listen to this event on the client-side now:

```typescript
// (...)
this.room.state.players.onAdd((player, sessionId) => {
  //
  // A player has joined!
  //
  console.log("A player has joined! Their unique session id is", sessionId);
});
// (...)
```

When playing the Scene, you should see a message in the console of the browser whenever a new client joins the room.

For the visual representation, we need to add a Phaser GameObject for each joining player, and keep a local reference to the GameObject based on their `sessionId`, so we can operate on them later:

```typescript
export class GameScene extends Phaser.Scene {
    // (...)
    room: Room;

    // we will assign each player visual representation here
    // by their `sessionId`
    playerEntities: {[sessionId: string]: any} = {};

    // (...)
    async create() {
        // (...)

        // listen for new players
        this.room.state.players.onAdd((player, sessionId) => {
            const entity = this.physics.add.image(player.x, player.y, 'ship_0001');

            // keep a reference of it on `playerEntities`
            this.playerEntities[sessionId] = entity;
        });

        // (...)
    }
}
```

## Removing disconnected players

When a player is removed from the state (upon `onLeave()` in the server-side), we need to remove their visual representation as well.

```typescript
// (...)
this.room.state.players.onRemove((player, sessionId) => {
    const entity = this.playerEntities[sessionId];
    if (entity) {
        // destroy entity
        entity.destroy();

        // clear local reference
        delete this.playerEntities[sessionId];
    }
});
// (...)
```

# Moving the players

## Sending input messages

For this particular example, we are going to send the player's input at every tick. This is a requirement for the client-side prediction technique applied by the end of this tutorial.

At every `update()` tick, we are going to update the local `inputPayload`, and send it as a message to the server.

```typescript
export class GameScene extends Phaser.Scene {
    // (...)

    // local input cache
    inputPayload = {
        left: false,
        right: false,
        up: false,
        down: false,
    };

    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    preload() {
        // (...)
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update(time: number, delta: number): void {
        // skip loop if not connected with room yet.
        if (!this.room) { return; }

        // send input to the server
        this.inputPayload.left = this.cursorKeys.left.isDown;
        this.inputPayload.right = this.cursorKeys.right.isDown;
        this.inputPayload.up = this.cursorKeys.up.isDown;
        this.inputPayload.down = this.cursorKeys.down.isDown;
        this.room.send(0, this.inputPayload);
    }
    // (...)
```

## Receiving the message from the server

Whenever the message is received in the server, we're going to mutate the player that sent the message through its `sessionId`.

> **⚠️ Note:** We are going to update this method on Part 3. The final implementation with **client-side prediction** needs to process the input at every tick instead of when receiving the message.

```typescript
// MyRoom.ts
// (...)
  onCreate(options: any) {
    this.setState(new MyRoomState());

    // handle player input
    this.onMessage(0, (client, payload) => {
      // get reference to the player who sent the message
      const player = this.state.players.get(client.sessionId);
      const velocity = 2;

      if (payload.left) {
        player.x -= velocity;

      } else if (payload.right) {
        player.x += velocity;
      }

      if (payload.up) {
        player.y -= velocity;

      } else if (payload.down) {
        player.y += velocity;
      }
    });
  }
// (...)
```

## Updating Player's visual representation

Having the mutation on the server, we can detect it on the client-side via `player.onChange()`, or `player.listen()`.

- `player.onChange()` is triggered **per schema instance**
- `player.listen(prop)` is triggered **per property** change

We are going to use `.onChange()` since we need all the new coordinates at once, no matter if just one has changed individually.

```typescript
// (...)
// listen for new players
this.room.state.players.onAdd((player, sessionId) => {
    const entity = this.physics.add.image(player.x, player.y, 'ship_0001');

    // keep a reference of it on `playerEntities`
    this.playerEntities[sessionId] = entity;

    // listening for server updates
    player.onChange(() => {
        // update local position immediately
        entity.x = player.x;
        entity.y = player.y;
    });

    // Alternative, listening to individual properties:
    // player.listen("x", (newX, prevX) => console.log(newX, prevX));
    // player.listen("y", (newY, prevY) => console.log(newY, prevY));
});
// (...)
```

> Read [more about Schema callbacks](https://docs.colyseus.io/colyseus/state/schema/#client-side)

# Extra: Monitoring Rooms and Connections

Colyseus comes with an optional monitoring panel that can be helpful during the development of your game.

To view the monitor panel from your local server, go to http://localhost:2567/colyseus.

![monitor](./monitor.png)

You can see and interact with all spawned rooms and active client connections through this panel.

> See [more information about the monitor panel](https://docs.colyseus.io/colyseus/tools/monitor/).

<!--

# More

We hope you found this tutorial useful, if you'd like to learn more about Colyseus please have a look at the [Colyseus documentation](https://docs.colyseus.io/), and join the [Colyseus Discord community](https://discord.gg/RY8rRS7).

-->
