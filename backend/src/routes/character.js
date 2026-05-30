const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

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

router.route("/").get(getAllCharacters).post(authMiddleware, createCharacter);
router.route("/buysell").patch(authMiddleware, buySellItem);
router.route("/equip").patch(authMiddleware, equipItem);
router.route("/unequip").patch(authMiddleware, unequipItem);
router
  .route("/:id")
  .get(authMiddleware, getCharacter)
  .put(authMiddleware, replaceCharacter)
  .patch(authMiddleware, updateCharacter)
  .delete(authMiddleware, deleteCharacter);

module.exports = router;
