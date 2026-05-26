const Character = require("../models/Character");
const Item = require("../models/Item");

const getAllCharacters = async (req, res) => {
  const chars = await Character.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(200).json({ chars, count: chars.length });
};

const getCharacter = async (req, res) => {
  const {
    user: { userId },
    params: { id: charId }
  } = req;
  const char = await Character.findOne({ _id: charId, createdBy: userId });
  if (!char) {
    res.status(404).json({ message: "Character not found" });
    return;
  }
  res.status(200).json({ char });
};

// This creates a new character
const createCharacter = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const char = await Character.create(req.body);
  res.status(201).json({ char });
};

// This replaces the character entirely. This is a destructive process that does not save anything from the previous character object
const replaceCharacter = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: charId }
  } = req;
  const char = await Character.findOneAndReplace(
    { _id: charId, createdBy: userId },
    { ...req.body, createdBy: userId },
    { returnDocument: "after", runValidators: true }
  );
  if (!char) {
    res.status(404).json({ message: "Character not found" });
    return;
  }
  res.status(200).json({ char });
};

// This replaces the character non-destructively. Anything that is missing will be carried over from the previous character object
const updateCharacter = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: charId }
  } = req;
  const char = await Character.findOneAndUpdate(
    { _id: charId, createdBy: userId },
    req.body,
    { returnDocument: "after", runValidators: true }
  );
  if (!char) {
    res.status(404).json({ message: "Character not found" });
    return;
  }
  res.status(200).json({ char });
};

const deleteCharacter = async (req, res) => {
  const {
    user: { userId },
    params: { id: charId }
  } = req;
  const char = await Character.findByIdAndDelete({
    _id: charId,
    createdBy: userId
  });
  if (!char) {
    res.status(404).json({ message: "Character not found" });
    return;
  }
  res.status(200).json({ message: "Character was successfully deleted" });
};

const buySellItem = async (req, res) => {
  const {
    user: { userId },
    query: { cid: charId, iid: itemId, buy: buying }
  } = req;
  const isBuying = buying === "true";
  const char = await Character.findOne({ _id: charId, createdBy: userId });
  if (!char) {
    res.status(404).json({ message: "Character not found" });
    return;
  }
  const item = await Item.findOne({ _id: itemId });
  if (!item) {
    res.status(404).json({ message: "Item not found" });
    return;
  }
  if (!(buying === "true" || buying === "false")) {
    res.status(400).json({ message: "buy must be true or false" });
    return;
  }
  const costFactor = isBuying ? -1 : 1;
  newCoins = Math.max(char.coins + item.coinCost * costFactor, 0);

  if (isBuying) {
    char.inventory.push(item);
  } else {
    if (char.inventory.includes(item)) {
      char.inventory.remove(item);
    } else {
      newCoins = char.coins;
    }
  }
  const updatedChar = await Character.findOneAndUpdate(
    { _id: charId, createdBy: userId },
    { coins: newCoins, inventory: char.inventory },
    { returnDocument: "after", runValidators: true }
  );
  res.status(200).json({ updatedChar });
};

// Equip an item (sent in body) that is present inside the character's inventory. If gear slot is occupied, swap the old gear out with the new gear.
const equipItem = async (req, res) => {
  const {
    user: { userId },
    query: { cid: charId },
    body: { item: item }
  } = req;

  let char = await Character.findOne({ _id: charId, createdBy: userId });
  if (!char) {
    res.status(404).json({ message: "Character not found" });
    return;
  }
  if (!item) {
    res.status(400).json({ message: "No valid item present in request body" });
    return;
  }
  const gearType = item.type;
  if (!(gearType == "weapon" || gearType == "armor" || gearType == "helmet" || gearType == "shield")) {
    res.status(400).json({ message: "Item is not equippable" });
    return;
  }

  const inv = char.inventory;
  const gear = char.gear;

  let oldGear = {};
  let newGear = inv.find(equipped => equipped.type == gearType && equipped.name == item.name);

  if (!newGear) {
    res.status(404).json({ message: "Item not found inside inventory" });
    return;
  }

  switch (gearType) {
    case "weapon":
      if (gear.weapon) {
        oldGear = gear.weapon;
      }
      char.gear.weapon = newGear;
      break;
    case "armor":
      if (gear.armor) {
        oldGear = gear.armor;
      }
      char.gear.armor = newGear;
      break;
    case "helmet":
      if (gear.helmet) {
        oldGear = gear.helmet;
      }
      char.gear.helmet = newGear;
      break;
    case "shield":
      if (gear.shield) {
        oldGear = gear.shield;
      }
      char.gear.shield = newGear;
      break;
    default:
      res.status(500).json({ message: "Server Error: Equip failed" });
      return;
  }

  char.inventory = inv.filter(item => item != newGear);
  if ("name" in oldGear) {
    char.inventory = [...char.inventory, oldGear];
  }

  const updatedChar = await Character.findOneAndUpdate(
    { _id: charId, createdBy: userId },
    { ...char, createdBy: userId },
    { returnDocument: "after", runValidators: true }
  );

  res.status(200).json({ updatedChar });
};

// Unequip an item from a character's specified slot, and enter it into the inventory
const unequipItem = async (req, res) => {
  const {
    user: { userId },
    query: { cid: charId, slot: gearType },
    body: { item: item }
  } = req;

  let char = await Character.findOne({ _id: charId, createdBy: userId });
  if (!char) {
    res.status(404).json({ message: "Character not found" });
    return;
  }
  if (!(gearType == "weapon" || gearType == "armor" || gearType == "helmet" || gearType == "shield")) {
    res.status(400).json({ message: "That slot does not exist" });
    return;
  }

  let gear = char.gear;
  let oldGear = {}

  switch (gearType) {
    case "weapon":
      if (gear.weapon) {
        oldGear = gear.weapon;
        char.gear.weapon = undefined;
      } else {
        res.status(404).json({ message: "Nothing found inside weapon slot"})
        return;
      }
      break;
    case "armor":
      if (gear.armor) {
        oldGear = gear.armor;
        char.gear.armor = undefined;
      } else {
        res.status(404).json({ message: "Nothing found inside armor slot"})
        return;
      }
      break;
    case "helmet":
      if (gear.helmet) {
        oldGear = gear.helmet;
        char.gear.helmet = undefined;
      } else {
        res.status(404).json({ message: "Nothing found inside helmet slot"})
        return;
      }
      break;
    case "shield":
      if (gear.shield) {
        oldGear = gear.shield;
        char.gear.shield = undefined;
      } else {
        res.status(404).json({ message: "Nothing found inside shield slot"})
        return;
      }
      break;
    default:
      res.status(500).json({ message: "Server Error: Unequip failed" });
      return;
  }

  char.inventory = [...char.inventory, oldGear];

  console.log(char);

  const updatedChar = await Character.findOneAndUpdate(
    { _id: charId, createdBy: userId },
    { ...char, createdBy: userId },
    { returnDocument: "after", runValidators: true }
  );

  res.status(200).json({ updatedChar });
}

module.exports = {
  getAllCharacters,
  getCharacter,
  createCharacter,
  replaceCharacter,
  updateCharacter,
  deleteCharacter,
  buySellItem,
  equipItem,
  unequipItem
};
