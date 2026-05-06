const express = require("express");
const router = express.Router();
const {
  generateDungeon,
  getDungeon,
} = require("../controllers/dungeonMap.controller");

router.route("/generate").post(generateDungeon);
router.route("/:id").get(getDungeon);

module.exports = router;
