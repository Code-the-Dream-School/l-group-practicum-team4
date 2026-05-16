const { createNoise2D } = require("simplex-noise");
const seedrandom = require("seedrandom");

//Flood fill - finds all floor tiles connected to starting tile
function floodFill(tiles, startX, startY, width, height) {
  const visited = new Set();
  const queue = [[startX, startY]];
  const region = [];

  while (queue.length > 0) {
    const [x, y] = queue.shift();
    const key = `${x},${y}`;

    if (visited.has(key)) continue;
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    if (tiles[y][x].type !== "floor") continue;

    visited.add(key);
    region.push([x, y]);

    queue.push([x + 1, y]);
    queue.push([x - 1, y]);
    queue.push([x, y + 1]);
    queue.push([x, y - 1]);
  }

  return region;
}

// Find all separate floor regions
function findRegions(tiles, width, height) {
  const visited = new Set();
  const regions = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      if (tiles[y][x].type === "floor" && !visited.has(key)) {
        const region = floodFill(tiles, x, y, width, height);
        region.forEach(([rx, ry]) => visited.add(`${rx},${ry}`));
        regions.push(region);
      }
    }
  }

  return regions;
}

// Carving a corridor between two points
function carveCorridor(tiles, x1, y1, x2, y2) {
  let cx = x1;
  let cy = y1;

  // Go horizontal first then vertical
  while (cx !== x2) {
    tiles[cy][cx].type = "floor";
    tiles[cy][cx].passable = true;
    cx += cx < x2 ? 1 : -1;
  }
  while (cy !== y2) {
    tiles[cy][cx].type = "floor";
    tiles[cy][cx].passable = true;
    cy += cy < y2 ? 1 : -1;
  }
}

// Connect all regions to the largest one
function connectRegions(tiles, width, height) {
  const regions = findRegions(tiles, width, height);
  if (regions.length <= 1) return tiles;

  // Sort by size, largest first
  regions.sort((a, b) => b.length - a.length);
  const mainRegion = regions[0];

  // Connect every other region to the main one
  for (let i = 1; i < regions.length; i++) {
    const [x1, y1] = regions[i][0];
    const [x2, y2] = mainRegion[0];
    carveCorridor(tiles, x1, y1, x2, y2);
  }

  return tiles;
}

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

  // Place objects on floor tiles -- approach 1 
  // const random = seedrandom(seed + "_objects");
  // const objects = ["chest", "trap", "enemy_spawn"];
  // for (let y = 0; y < height; y++) {
  //   for (let x = 0; x < width; x++) {
  //     if (tiles[y][x].type === "floor" && random() > 0.72) {
  //       tiles[y][x].object = objects[Math.floor(random() * objects.length)];
  //     }
  //   }
  // }

  // Place objects on floor tiles using percentage based approach -- approach 2 (personal preferance)
  const random = seedrandom(seed + "_objects");
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (tiles[y][x].type === "floor") {
        const roll = random();
        if (roll < 0.05) tiles[y][x].object = "enemy_spawn";
        else if (roll < 0.08) tiles[y][x].object = "chest";
        else if (roll < 0.1) tiles[y][x].object = "trap";
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

  tiles = connectRegions(tiles, width, height);

  return { seed, width, height, tiles };
}

module.exports = { generateMap };
