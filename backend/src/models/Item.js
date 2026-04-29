const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item must have a name"]
  },
  description: {
    type: String,
    required: [true, "Item must have description"]
  },
  coinCost: {
    type: Number,
    required: [true, "Item must have a coin cost"]
  },
  stat: {
    type: String,
    enum: ["health", "attack", "defense", "speed"],
    default: "health"
  },
  value: {
    type: Number,
    required: [true, "Item must have a value"]
  }
});

module.exports = mongoose.model("Item", ItemSchema);
