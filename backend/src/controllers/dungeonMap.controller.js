import Dungeon from "../models/dungeonMap.js";
import Character from "../models/Character.js";
import { generateMap } from "../services/mapGenerator.js";

const generateDungeon = async (req, res) => {
	try {
		const { width = 30, height = 30, level = 1 } = req.query;
		const seed = Math.floor(Math.random() * 999999);
		const { tiles } = generateMap(Number(width), Number(height), seed);

		const flatTiles = tiles.flat();
		const enemySpawnCount = flatTiles.filter(
			(t) => t.object === "enemy_spawn",
		).length;
		const chestCount = flatTiles.filter((t) => t.object === "chest").length;
		const trapCount = flatTiles.filter((t) => t.object === "trap").length;

		// Fetch all enemy characters (createdBy: null)
		const availableEnemies = await Character.find({ createdBy: null });

		if (availableEnemies.length === 0) {
			return res.status(500).json({
				success: false,
				message: "No enemy characters found in database",
			});
		}

		// Fill enemy list up to enemySpawnCount by placing multiple instances of the same enemy type  (if needed)
		const enemyList = [];
		for (let i = 0; i < enemySpawnCount; i++) {
			const enemy = availableEnemies[i % availableEnemies.length];
			enemyList.push({ enemy: enemy._id, status: "active" });
		}

		const dungeon = await Dungeon.create({
			seed,
			width: Number(width),
			height: Number(height),
			level,
			tiles,
			enemies: enemyList,
			user: req.user.userId,
		});

		// Populate enemies before returning
		const populatedDungeon = await Dungeon.findById(dungeon._id).populate(
			"enemies.enemy",
		);

		res.status(201).json({
			success: true,
			dungeon: populatedDungeon,
			stats: { enemySpawnCount, chestCount, trapCount },
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Could not generate dungeon",
		});
	}
};

// Get all dungeons for a user
const getDungeons = async (req, res) => {
	try {
		const dungeons = await Dungeon.find({ user: req.user.userId }).select(
			"-tiles -enemies",
		);
		res.status(200).json({ success: true, dungeons });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Could not retrieve dungeons",
		});
	}
};

// Get a single dungeon by ID
const getDungeon = async (req, res) => {
	try {
		const dungeon = await Dungeon.findOne({
			_id: req.params.id,
			user: req.user.userId,
		}).populate("enemies.enemy");
		if (!dungeon)
			return res
				.status(404)
				.json({ success: false, message: "Dungeon not found" });
		res.status(200).json({ success: true, dungeon });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Could not retrieve dungeon",
		});
	}
};

// Update dungeon — tiles and enemy statuses
const updateDungeon = async (req, res) => {
	try {
		const dungeon = await Dungeon.findOneAndUpdate(
			{ _id: req.params.id, user: req.user.userId },
			req.body,
			{ new: true, runValidators: true },
		).populate("enemies.enemy");
		if (!dungeon)
			return res
				.status(404)
				.json({ success: false, message: "Dungeon not found" });
		res.status(200).json({ success: true, dungeon });
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Could not update dungeon",
		});
	}
};

export { generateDungeon, getDungeons, getDungeon, updateDungeon };
