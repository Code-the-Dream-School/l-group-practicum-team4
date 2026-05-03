const mongoose = require("mongoose");

const DungeonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dungeon must have a name"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Dungeon must have a user"],
    },
    seed: {
      type: String,
      required: [true, "Dungeon must have a seed"],
    },
    enemies: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Character",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Dungeon", DungeonSchema);
