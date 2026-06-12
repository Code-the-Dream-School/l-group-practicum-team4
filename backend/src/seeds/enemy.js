import Character from "../models/Character.js";
import Item from "../models/Item.js";

export const seedEnemies = async () => {
	try {
		const items = await Item.find({});
		const itemMap = {};
		items.forEach((item) => {
			itemMap[item.name] = item;
		});

		const enemies = [
			{
				name: "Slime",
				health: 80,
				attack: 8,
				defense: 10,
				speed: 8,
				coins: 0,
				inventory: [itemMap["Emerald Potion"]],
				gear: {},
				createdBy: null,
			},
			{
				name: "Cyclop",
				health: 120,
				attack: 18,
				defense: 25,
				speed: 5,
				coins: 0,
				inventory: [],
				gear: {
					weapon: itemMap["Mace"],
				},
				createdBy: null,
			},
			{
				name: "Scorpion",
				health: 80,
				attack: 15,
				defense: 18,
				speed: 6,
				coins: 0,
				inventory: [],
				gear: {
					helmet: itemMap["Iron Helmet"],
				},
				createdBy: null,
			},
			{
				name: "Mage",
				health: 100,
				attack: 20,
				defense: 10,
				speed: 5,
				coins: 0,
				inventory: [itemMap["Cobalt Potion"]],
				gear: {
					weapon: itemMap["Dagger"],
				},
				createdBy: null,
			},
			{
				name: "Bat",
				health: 60,
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
				health: 80,
				attack: 12,
				defense: 20,
				speed: 5,
				coins: 0,
				inventory: [],
				gear: {
					shield: itemMap["Wooden Shield"],
				},
				createdBy: null,
			},
			{
				name: "Spider",
				health: 60,
				attack: 14,
				defense: 15,
				speed: 8,
				coins: 0,
				inventory: [itemMap["Cobalt Potion"]],
				gear: {},
				createdBy: null,
			},
			{
				name: "Rat",
				health: 60,
				attack: 9,
				defense: 6,
				speed: 10,
				coins: 0,
				inventory: [itemMap["Silver Potion"]],
				gear: {},
				createdBy: null,
			},
			{
				name: "Mimic",
				health: 100,
				attack: 10,
				defense: 20,
				speed: 5,
				coins: 0,
				inventory: [itemMap["Crimson Potion"]],
				gear: {},
				createdBy: null,
			},
		];

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
