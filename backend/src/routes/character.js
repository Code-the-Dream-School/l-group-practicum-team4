const express = require("express");
const router = express.Router();

const {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  replaceCharacter,
  deleteCharacter,
  buySellItem,
  equipItem,
  unequipItem
} = require("../controllers/character");

router.route("/").get(getAllCharacters).post(createCharacter);
router.route("/buysell").patch(buySellItem);
router.route("/equip").patch(equipItem);
router.route("/unequip").patch(unequipItem);
router
  .route("/:id")
  .get(getCharacter)
  .put(replaceCharacter)
  .patch(updateCharacter)
  .delete(deleteCharacter);

module.exports = router;
