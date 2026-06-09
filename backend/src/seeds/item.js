import Item from "../models/Item.js";

const items = [
	//weapons
	{
		name: "Dagger",
		description: "Strikes faster than lighting.",
		type: "weapon",
		coinCost: 20,
		stat: "speed",
		value: 5,
	},
	{
		name: "Sword",
		description: "Compact and efective, weapon of champions.",
		type: "weapon",
		coinCost: 30,
		stat: "attack",
		value: 10,
	},
	{
		name: "BroadSword",
		description: "The pinnacle of heroism, weapon of greatness.",
		type: "weapon",
		coinCost: 60,
		stat: "attack",
		value: 18,
	},
	{
		name: "Mace",
		description: "The definition of strength and power.",
		type: "weapon",
		coinCost: 80,
		stat: "attack",
		value: 24,
	},
	{
		name: "Axe",
		description: "Fast, accurate and reliable.",
		type: "weapon",
		coinCost: 80,
		stat: "attack",
		value: 24,
	},
	{
		name: "Double Axe",
		description: "Strong and deadly, double danger.",
		type: "weapon",
		coinCost: 120,
		stat: "attack",
		value: 30,
	},
	{
		name: "Spear",
		description: "Long and pointy efective weapon.",
		type: "weapon",
		coinCost: 60,
		stat: "attack",
		value: 24,
	},
	//shields
	{
		name: "Wooden Shield",
		description: "A basic shield made of wood.",
		type: "shield",
		coinCost: 30,
		stat: "defense",
		value: 10,
	},
	{
		name: "Plate Shield",
		description: "High-end shield made of steel.",
		type: "shield",
		coinCost: 60,
		stat: "defense",
		value: 30,
	},
	//armors
	{
		name: "Plate Armor",
		description: "Protection of gods of battle.",
		type: "armor",
		coinCost: 80,
		stat: "defense",
		value: 50,
	},
	//helmets
	{
		name: "Iron Helmet",
		description: "Basic but guards what's most valuable.",
		type: "helmet",
		coinCost: 20,
		stat: "defense",
		value: 10,
	},
	{
		name: "Plate Helmet",
		description: "Looks of a true warrior.",
		type: "helmet",
		coinCost: 0,
		stat: "defense",
		value: 20,
	},
	//potions
	{
		name: "Crimson Potion",
		description: "Life from within, salvation for the needy.",
		type: "potion",
		coinCost: 120,
		stat: "health",
		value: 50,
	},
	{
		name: "Silver Potion",
		description: "Gift of a firm stance, the last line of defense.",
		type: "potion",
		coinCost: 150,
		stat: "defense",
		value: 50,
	},
	{
		name: "Cobalt Potion",
		description: "Fury of the righteous, strikes of true warriors.",
		type: "potion",
		coinCost: 150,
		stat: "attack",
		value: 30,
	},
	{
		name: "Emerald Potion",
		description: "Feeble light of swiftness, strikes of lightning.",
		type: "potion",
		coinCost: 150,
		stat: "speed",
		value: 10,
	},
];

export const seedItems = async () => {
	try {
		for (const item of items) {
			await Item.findOneAndUpdate({ name: item.name }, item, {
				upsert: true,
				runValidators: true,
			});
		}
	} catch (error) {
		console.error("Error seeding initial values.", error);
	}
};
