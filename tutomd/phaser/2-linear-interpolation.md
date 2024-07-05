![](image.png)

# Part 2: Linear Interpolation

This guide will show you how you can build a multiplayer experience with Colyseus Multiplayer Framework and Phaser.

## In Part 2, we will:

- Update the player's positions at every tick
- Use **linear interpolation** to smooth player's movement

<iframe src="https://colyseus-phaser-tutorial.glitch.me/#part2" width="100%" height="280"></iframe>

## Materials

<span class="icon icon-link"></span> [Part 2: Phaser Scene source-code](https://github.com/colyseus/tutorial-phaser/blob/master/client/src/scenes/Part2Scene.ts)
<span class="icon icon-link"></span> [Part 2: Colyseus Room source-code](https://github.com/colyseus/tutorial-phaser/blob/master/server/src/rooms/Part2Room.ts)

---

<span class="icon icon-link"></span> [Full source-code on GitHub](https://github.com/colyseus/tutorial-phaser)
<span class="icon icon-link"></span> [Live Project on Glitch](https://glitch.com/~colyseus-phaser-tutorial)

# Why does Part 1 have choppy movement?

On [Part 1](1-basic-player-movement.html) of this tutorial, we updated the player's visual representation at the same instant as state updates are received from the server, using `player.onChange()`:

```typescript
// listening for server updates
player.onChange(() => {
    // update local position immediately
    entity.x = player.x;
    entity.y = player.y;
});
```

By doing so, the result is "choppy" because the frequency of updates received from the server is lower than the frequency the client-side render each frame.

Colyseus sends state updates to the client at every **50ms** (_20fps_) by default, whereas the client-side re-renders at every **16.6ms** (_60fps_).

One simple yet effective way to smooth out the movement is to progressively move the player towards the latest position received at every render frame.

# Applying Linear Interpolation

## Cache remote position

The linear interpolation is going to be applied at every render frame.

To allow that, first we need to cache the latest player position received from the server:

```typescript
// listening for server updates
player.onChange(() => {
    //
    // do not update local position immediately
    // we're going to LERP them during the render loop.
    //
    entity.setData('serverX', player.x);
    entity.setData('serverY', player.y);
});
```

## Interpolate positions at every frame

Now, we are going to iterate over every player entity during our update loop, and use `Phaser.Math.Linear()` to make the entity slowly move from its current position towards the last position cached previously:

```typescript
update(time: number, delta: number): void {
    // (...)

    for (let sessionId in this.playerEntities) {
        // interpolate all player entities
        const entity = this.playerEntities[sessionId];
        const { serverX, serverY } = entity.data.values;

        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
    }
}
```

> The third argument of `Phaser.Math.Linear` is the _percentage_ value. You may want to adjust it for your own needs. It accepts from `0` to `1`. The higher it is, the faster the interpolation is going to happen.