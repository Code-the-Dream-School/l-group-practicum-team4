import Character from "../models/Character.js";

const enemies = [
	{
		name: "Slime",
		health: 25,
		attack: 8,
		defense: 10,
		speed: 8,
		coins: 0,
		inventory: [
			{
				name: "Emerald Potion",
				description: "Feeble light of swiftness, strikes of lightning.",
				type: "potion",
				coinCost: 150,
				stat: "speed",
				value: 10,
			},
		],
		gear: {},
		createdBy: null,
	},
	{
		name: "Cyclop",
		health: 40,
		attack: 18,
		defense: 25,
		speed: 5,
		coins: 0,
		inventory: [],
		gear: {
			weapon: {
				name: "Mace",
				description: "The definition of strength and power.",
				type: "weapon",
				coinCost: 80,
				stat: "attack",
				value: 24,
			},
		},
		createdBy: null,
	},
	{
		name: "Scorpion",
		health: 40,
		attack: 15,
		defense: 18,
		speed: 6,
		coins: 0,
		inventory: [],
		gear: {
			helmet: {
				name: "Iron Helmet",
				description: "Basic but guards what's most valuable.",
				type: "helmet",
				coinCost: 20,
				stat: "defense",
				value: 10,
			},
		},
		createdBy: null,
	},
	{
		name: "Mage",
		health: 35,
		attack: 20,
		defense: 10,
		speed: 5,
		coins: 0,
		inventory: [
			{
				name: "Cobalt Potion",
				description: "Fury of the righteous, strikes of true warriors.",
				type: "potion",
				coinCost: 150,
				stat: "attack",
				value: 30,
			},
		],
		gear: {
			weapon: {
				name: "Dagger",
				description: "Strikes faster than lighting.",
				type: "weapon",
				coinCost: 20,
				stat: "speed",
				value: 5,
			},
		},
		createdBy: null,
	},
	{
		name: "Bat",
		health: 20,
		attack: 10,
		defense: 10,
		speed: 10,
		coins: 0,
		inventory: [],
		gear: {},
		createdBy: null,
	},
	{
		name: "Ghost",
		health: 30,
		attack: 12,
		defense: 20,
		speed: 5,
		coins: 0,
		inventory: [],
		gear: {
			shield: {
				name: "Wooden Shield",
				description: "A basic shield made of wood.",
				type: "shield",
				coinCost: 30,
				stat: "defense",
				value: 10,
			},
		},
		createdBy: null,
	},
	{
		name: "Spider",
		health: 28,
		attack: 14,
		defense: 15,
		speed: 8,
		coins: 0,
		inventory: [
			{
				name: "Cobalt Potion",
				description: "Fury of the righteous, strikes of true warriors.",
				type: "potion",
				coinCost: 150,
				stat: "attack",
				value: 30,
			},
		],
		gear: {},
		createdBy: null,
	},
	{
		name: "Rat",
		health: 18,
		attack: 9,
		defense: 6,
		speed: 10,
		coins: 0,
		inventory: [
			{
				name: "Silver Potion",
				description: "Gift of a firm stance, the last line of defense.",
				type: "potion",
				coinCost: 150,
				stat: "defense",
				value: 50,
			},
		],
		gear: {},
		createdBy: null,
	},
	{
		name: "Mimic",
		health: 40,
		attack: 10,
		defense: 20,
		speed: 5,
		coins: 0,
		inventory: [
			{
				name: "Crimson Potion",
				description: "Life from within, salvation for the needy.",
				type: "potion",
				coinCost: 120,
				stat: "health",
				value: 50,
			},
		],
		gear: {},
		createdBy: null,
	},
];

export const seedEnemies = async () => {
	try {
		for (const enemy of enemies) {
			await Character.findOneAndUpdate({ name: enemy.name }, enemy, {
				upsert: true,
				runValidators: true,
			});
		}
	} catch (error) {
		console.error("Error seeding initial values.", error);
	}
};
