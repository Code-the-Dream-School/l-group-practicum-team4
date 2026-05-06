require("dotenv").config();
const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Character must have a name"],
    },
    health: {
      type: Number,
      required: [true, "Character must have a health stat"],
    },
    attack: {
      type: Number,
      required: [true, "Character must have an attack stat"],
    },
    defense: {
      type: Number,
      required: [true, "Character must have a defense stat"],
    },
    speed: {
      type: Number,
      required: [true, "Character must have a speed stat"],
    },
    wearables: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Item",
      },
    ],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Character", CharacterSchema);
