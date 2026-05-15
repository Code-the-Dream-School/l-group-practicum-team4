const Dungeon = require("../models/dungeonMap");
const { generateMap } = require("../services/mapGenerator");

const generateDungeon = async (req, res) => {
  try {
    const { width = 30, height = 30, level = 1 } = req.query;
    const seed = Math.floor(Math.random() * 999999);
    const { tiles } = generateMap(Number(width), Number(height), seed);

    // Count objects
    const flatTiles = tiles.flat();
    const enemySpawnCount = flatTiles.filter(
      (t) => t.object === "enemy_spawn",
    ).length;
    const chestCount = flatTiles.filter((t) => t.object === "chest").length;
    const trapCount = flatTiles.filter((t) => t.object === "trap").length;

    const dungeon = await Dungeon.create({
      seed,
      width: Number(width),
      height: Number(height),
      level,
      tiles,
    });

    res.status(201).json({
      success: true,
      dungeon,
      stats: { enemySpawnCount, chestCount, trapCount },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Could not generate dungeon" });
  }
};

// Get a dungeon by ID
const getDungeon = async (req, res) => {
  try {
    const dungeon = await Dungeon.findById(req.params.id);
    if (!dungeon)
      return res
        .status(404)
        .json({ success: false, message: "Dungeon not found" });
    res.status(200).json({ success: true, dungeon });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ success: false, message: "Could not retrieve dungeon" });
  }
};

module.exports = { generateDungeon, getDungeon };
