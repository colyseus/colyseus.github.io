![](image.png)

# Part 4: Fixed Tickrate

This guide will show you how you can build a multiplayer experience with Colyseus Multiplayer Framework and Phaser.

## In Part 4, we will:

- Learn why determinism is important
- **Enqueue** incoming player inputs on the server
- **Dequeue** player inputs at every tick on the server
- Use fixed tick-rate on both the server and the client-side

<iframe src="https://colyseus-phaser-tutorial.glitch.me/#part4" width="100%" height="280"></iframe>

## Materials

<span class="icon icon-link"></span> [Part 4: Phaser Scene source-code](https://github.com/colyseus/tutorial-phaser/blob/master/client/src/scenes/Part4Scene.ts)
<span class="icon icon-link"></span> [Part 4: Colyseus Room source-code](https://github.com/colyseus/tutorial-phaser/blob/master/server/src/rooms/Part4Room.ts)

---

<span class="icon icon-link"></span> [Full source-code on GitHub](https://github.com/colyseus/tutorial-phaser)
<span class="icon icon-link"></span> [Live Project on Glitch](https://glitch.com/~colyseus-phaser-tutorial)

# Determinism

In order to avoid differences between the server and client simulations, both the server and the client need to be **deterministic**. Given the same inputs on both client and server, they should produce the same output.

The server and client must process the input and apply the same update loop logic at a fixed tick rate.

# Enqueue/dequeue player input on the server-side

## Enqueue player input

A common technique we can apply is to enqueue player inputs, and process them all at the next server tick.

Let's update the server's `Player` definition to hold a queue of inputs:

```typescript
export class Player extends Schema {
  // (...)
  inputQueue: any[] = [];
}
```

Now, when receiving the player input messages, instead of processing them immediately, we are going to enqueue them to be processed later:

```typescript
// MyRoom.ts
// (...)
this.onMessage(0, (client, payload) => {
    // handle player input
    const player = this.state.players.get(client.sessionId);

    // enqueue input to user input buffer.
    player.inputQueue.push(payload);
});
```

## Process/dequeue player input at every tick

We need to have an update loop in the server-side with the same implementation we do for the client-side.

For this, we use `this.setSimulationInterval()` to register the update loop:

```typescript
// MyRoom.ts
// (...)
onCreate() {
    // (...)
    this.setSimulationInterval((deltaTime) => {
        this.update(deltaTime);
    });
}
```

The enqueued inputs from every player need to be processed during the `update` loop:

```typescript
update(deltaTime: number) {
    const velocity = 2;

    this.state.players.forEach(player => {
        let input: any;

        // dequeue player inputs
        while (input = player.inputQueue.shift()) {
            if (input.left) {
                player.x -= velocity;

            } else if (input.right) {
                player.x += velocity;
            }

            if (input.up) {
                player.y -= velocity;

            } else if (input.down) {
                player.y += velocity;
            }
        }
    });
}
```

# Fixed tick-rate

It is more practical and simple to understand “ticks per second” than “milliseconds per frame” when dealing with determinism.

We can manually force more ticks during a single render frame to make sure the simulation behaves the same, even when the rendering frame-rate drops.

## Fixed tick-rate on Phaser

We are going to copy the entire `update()` implementation we have on the client-side, and move it to a `fixedTick()` method.

```typescript
// (...)
export class GameScene extends Phaser.Scene {
    // (...)

    fixedTick() {
        //
        // paste the previous `update()` implementation here!
        //
    }

    // (...)
}
```

Now, during the `update()` loop, we are going to allow having multiple ticks on a single frame, if needed:

```typescript
// (...)
elapsedTime = 0;
fixedTimeStep = 1000 / 60;

update(time: number, delta: number): void {
    // skip loop if not connected yet.
    if (!this.currentPlayer) { return; }

    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
        this.elapsedTime -= this.fixedTimeStep;
        this.fixedTick(time, this.fixedTimeStep);
    }
}
```

## Fixed tick-rate on Colyseus

Let's do the same for the server-side now:

```typescript
// MyRoom.ts
// (...)
onCreate() {
    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
        elapsedTime += deltaTime;

        while (elapsedTime >= this.fixedTimeStep) {
            elapsedTime -= this.fixedTimeStep;
            this.fixedTick(this.fixedTimeStep);
        }
    });
}
// (...)
```

For consistency, we have also renamed the server-side `update()` method to `fixedUpdate()`.

# More

We hope you found this tutorial helpful, if you'd like to learn more about Colyseus please take a look at the [Colyseus documentation](http://docs.colyseus.io/), and join the [Colyseus Discord community](https://discord.gg/RY8rRS7).
