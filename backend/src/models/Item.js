const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item must have a name"],
    },
    description: {
      type: String,
      required: [true, "Item must have description"],
    },
    type: {
      type: String,
      required: [true, "Item must have a type"],
      enum: ["wearable", "consumable"],
      default: "consumable",
    },
    coinCost: {
      type: Number,
      required: [true, "Item must have a coin cost"],
    },
    stat: {
      type: String,
      required: [true, "Item must have a stat"],
      enum: ["health", "attack", "defense", "speed"],
      default: "health",
    },
    value: {
      type: Number,
      required: [true, "Item must have a value"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Item", ItemSchema);
