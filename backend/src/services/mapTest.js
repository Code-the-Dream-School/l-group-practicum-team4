// just a visual dev tool to see map generation form the backend not a proper test.

const { generateMap } = require("./mapGenerator");

const seed = Math.floor(Math.random() * 999999);
const map = generateMap(30, 30, seed); // use this to change the canvas dimensions

map.tiles.forEach((row) => {
  console.log(
    row
      .map((t) => {
        if (t.object === "entrance") return "E";
        if (t.object === "exit") return "X";
        if (t.object === "chest") return "C";
        if (t.object === "trap") return "T";
        if (t.object === "enemy_spawn") return "S";
        return t.type === "floor" ? "." : "#";
      })
      .join(""),
  );
});

console.log("\nSeed:", map.seed);
console.log("Width:", map.width);
console.log("Height:", map.height);
console.log("Row 0 length:", map.tiles[0].length);
