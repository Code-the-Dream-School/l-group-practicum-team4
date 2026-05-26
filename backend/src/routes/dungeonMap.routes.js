const express = require("express");
const router = express.Router();
const {
  generateDungeon,
  getDungeon,
} = require("../controllers/dungeonMap.controller");
const authMiddleware = require("../middleware/authentication");

router.route("/generate").get(authMiddleware, generateDungeon);
router.route("/:id").get(authMiddleware, getDungeon);

module.exports = router;
