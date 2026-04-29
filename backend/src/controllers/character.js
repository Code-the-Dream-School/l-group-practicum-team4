const Character = require("../models/Character");

const createTestChar = async (req, res) => {
  const charJSON = {
    name: "bob",
    health: 10,
    attack: 2,
    defense: 3,
    speed: 1,
    wearables: []
  };
  try {
    const newCharacter = await Character.create(charJSON);
    res.json(newCharacter);
  } catch (e) {
    console.log(error);
    res.json("Could not create new character");
  }
};

const getTestChar = async (req, res) => {
  const charData = await Character.find();
  res.json(charData);
};

module.exports = { createTestChar, getTestChar };
