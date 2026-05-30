const express = require("express");
const router = express.Router();
const {
  generateDungeon,
  getDungeons,
  // getDungeons — lists all user dungeons, metadata only (no tiles/enemies). Like a save file selection screen.

  getDungeon,
  // getDungeon — returns one full dungeon with tiles and populated enemies. Like loading a save file to play.

  updateDungeon,
} = require("../controllers/dungeonMap.controller");
const authMiddleware = require("../middleware/authentication");

router.route("/generate").get(authMiddleware, generateDungeon);
router.route("/").get(authMiddleware, getDungeons);
router.route("/:id").get(authMiddleware, getDungeon);
router.route("/:id").patch(authMiddleware, updateDungeon);

module.exports = router;
