const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Inventory must have a user"],
    },
    coins: {
      type: Number,
      required: [true, "Inventory must have a coin amount"],
      default: 0,
    },
    wearables: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Item",
      },
    ],
    consumables: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Inventory", InventorySchema);
