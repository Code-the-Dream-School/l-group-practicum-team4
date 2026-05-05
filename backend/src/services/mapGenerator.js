const { createNoise2D } = require("simplex-noise");
const seedrandom = require("seedrandom");

function generateMap(width = 30, height = 30, seed = Date.now()) {
  const noise2D = createNoise2D(seedrandom(seed));

  let tiles = [];
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      const value = noise2D(x / 10, y / 10); // -1 to 1
      const isFloor = value > 0;
      tiles[y][x] = {
        x,
        y,
        type: isFloor ? "floor" : "wall",
        passable: isFloor,
        object: null,
      };
    }
  }

  // Place objects on floor tiles
  const random = seedrandom(seed + "_objects");
  const objects = ["chest", "trap", "enemy_spawn"];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (tiles[y][x].type === "floor" && random() > 0.92) {
        tiles[y][x].object = objects[Math.floor(random() * objects.length)];
      }
    }
  }

  // Place entrance on first floor tile
  outer: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (tiles[y][x].type === "floor") {
        tiles[y][x].object = "entrance";
        break outer;
      }
    }
  }

  // Place exit on last floor tile
  outer2: for (let y = height - 1; y >= 0; y--) {
    for (let x = width - 1; x >= 0; x--) {
      if (tiles[y][x].type === "floor" && tiles[y][x].object === null) {
        tiles[y][x].object = "exit";
        break outer2;
      }
    }
  }

  return { seed, width, height, tiles };
}

module.exports = { generateMap };
