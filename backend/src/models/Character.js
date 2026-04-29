require("dotenv").config();
const mongoose = require("mongoose");
const ItemModel = require("./Item");

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Character must have a name"]
  },
  health: {
    type: Number,
    required: [true, "Character must have a health stat"]
  },
  attack: {
    type: Number,
    required: [true, "Character must have an attack stat"]
  },
  defense: {
    type: Number,
    required: [true, "Character must have a defense stat"]
  },
  speed: {
    type: Number,
    required: [true, "Character must have a speed stat"]
  },
  wearables: {
    type: Array,
    default: new Array()
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null
  }
});

module.exports = mongoose.model("Character", CharacterSchema);
