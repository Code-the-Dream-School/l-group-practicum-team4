const Character = require("../models/Character");

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

const updateCharacter = async (req, res) => {
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

module.exports = {
  getAllCharacters,
  getCharacter,
  createCharacter,
  updateCharacter
};
