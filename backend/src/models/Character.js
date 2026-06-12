import mongoose from "mongoose";

import Item from "./Item.js";

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
		coins: {
			type: Number,
			required: [true, "Character must have a coin value"],
			min: [0, "Character cannot hold negative amount of coins"],
		},
		inventory: {
			type: [Item.schema],
			required: [true, "Character must have an inventory"],
		},
		gear: {
			helmet: { type: Item.schema, default: undefined },
			armor: { type: Item.schema, default: undefined },
			weapon: { type: Item.schema, default: undefined },
			shield: { type: Item.schema, default: undefined },
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			default: null,
		},
		spriteKey: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model("Character", CharacterSchema);
