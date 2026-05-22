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
  }
  res.status(200).json({ char });
};

const createCharacter = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const char = await Character.create(req.body);
  res.status(201).json({ char });
};

const updateCharacter = async (req, res, next) => {
  if (req.params.id === "buysell") {
    return next("route");
  }
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
  }
  const item = await Item.findOne({ _id: itemId });
  if (!item) {
    res.status(404).json({ message: "Item not found" });
  }
  if (!(buying === "true" || buying === "false")) {
    res.status(400).json({ message: "buy must be true or false" });
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

module.exports = {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  buySellItem
};
