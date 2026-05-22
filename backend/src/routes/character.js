const express = require("express");
const router = express.Router();

const {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  buySellItem
} = require("../controllers/character");

router.route("/").get(getAllCharacters).post(createCharacter);
router
  .route("/:id")
  .get(getCharacter)
  .patch(updateCharacter)
  .delete(deleteCharacter);
router.route("/buysell").patch(buySellItem);

module.exports = router;
