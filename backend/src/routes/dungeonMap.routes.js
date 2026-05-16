const express = require("express");
const router = express.Router();
const {
  generateDungeon,
  getDungeon,
} = require("../controllers/dungeonMap.controller");

router.route("/generate").get(generateDungeon);
router.route("/:id").get(getDungeon);

module.exports = router;
