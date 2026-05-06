const express = require("express");
const router = express.Router();

const {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter
} = require("../controllers/character");

router.route("/").get(getAllCharacters).post(createCharacter);
router.route("/:id").get(getCharacter).patch(updateCharacter);

module.exports = router;
