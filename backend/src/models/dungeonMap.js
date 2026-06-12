import mongoose from "mongoose";

const TileSchema = new mongoose.Schema(
	{
		x: { type: Number, required: true },
		y: { type: Number, required: true },
		type: { type: String, enum: ["floor", "wall"], required: true },
		passable: { type: Boolean, required: true },
		object: {
			type: String,
			enum: ["chest", "door", "trap", "enemy_spawn", "exit", "entrance"],
			default: null,
		},
	},
	{ _id: false },
);

const DungeonEnemySchema = new mongoose.Schema(
	{
		enemy: {
			type: mongoose.Types.ObjectId,
			ref: "Character",
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "defeated"],
			default: "active",
		},
	},
	{ _id: false },
);

const DungeonSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
		seed: { type: Number, required: true },
		width: { type: Number, required: true },
		height: { type: Number, required: true },
		level: { type: Number, default: 1 },
		status: {
			type: String,
			enum: ["active", "completed", "abandoned"],
			default: "active",
		},
		tiles: { type: [[Object]], required: true },
		enemies: { type: [DungeonEnemySchema], required: true },
	},
	{ timestamps: true },
);

export default mongoose.model("Dungeon", DungeonSchema);
