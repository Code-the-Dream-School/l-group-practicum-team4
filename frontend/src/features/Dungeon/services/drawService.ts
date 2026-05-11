import * as ROT from "rot-js";
import type { Player, Enemy, Character } from "../../../shared/models/models";

export const mapGenerator = (seed: number, width: number, height: number) => {
	ROT.RNG.setSeed(seed);
	const widthTiles = width;
	const heightTiles = height;

	const map = Array.from({ length: heightTiles }, () =>
		Array(widthTiles).fill(1),
	);

	const digger = new ROT.Map.Digger(widthTiles, heightTiles, {
		roomWidth: [6, 12],
		roomHeight: [6, 10],
		dugPercentage: 0.2,
	});

	digger.create((x, y, value) => {
		map[y][x] = value;
	});

	// player starting position
	let playerX = 0,
		playerY = 0;
	for (let y = 5; y < heightTiles - 5; y++) {
		for (let x = 5; x < widthTiles - 5; x++) {
			if (map[y][x] === 0) {
				playerX = x;
				playerY = y;
				break;
			}
		}
		if (playerX !== 0) break;
	}
	return { map, playerX, playerY };
};

export const EnemyGenerator = (
	map: number[][],
	seed: number,
	enemyList: Enemy[],
) => {
	if (!enemyList || enemyList.length === 0) return [];

	ROT.RNG.setSeed(seed + 999);

	const floorTiles: { x: number; y: number }[] = [];
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] === 0) {
				floorTiles.push({ x, y });
			}
		}
	}

	for (let i = floorTiles.length - 1; i > 0; i--) {
		const j = Math.floor(ROT.RNG.getUniform() * (i + 1));
		[floorTiles[i], floorTiles[j]] = [floorTiles[j], floorTiles[i]];
	}

	const placedEnemies: (Enemy & {
		id: number;
		x: number;
		y: number;
		radius: number;
	})[] = [];

	enemyList.forEach((enemyTemplate, index) => {
		if (index >= floorTiles.length) return;

		const tile = floorTiles[index];

		placedEnemies.push({
			...enemyTemplate,
			x: tile.x * 32 + 16,
			y: tile.y * 32 + 16,
			radius: 14,
		} as Enemy & {
			id: number;
			x: number;
			y: number;
			radius: number;
		});
	});

	return placedEnemies;
};

export const MapDraw = (
	ctx: CanvasRenderingContext2D,
	map: number[][],
	tileSize: number,
	originalTileSize: number,
	offsetX: number,
	offsetY: number,
	tileset: HTMLImageElement,
) => {
	if (!ctx || !map || !tileset) return;

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			const screenX = x * tileSize - offsetX;
			const screenY = y * tileSize - offsetY;

			if (
				screenX < -originalTileSize ||
				screenX > ctx.canvas.width ||
				screenY < -originalTileSize ||
				screenY > ctx.canvas.height
			)
				continue;

			const { col, row } = getTileVariant(x, y, map);
			DrawTile(ctx, tileset, col, row, screenX, screenY);
		}
	}
};

const getTileVariant = (x: number, y: number, map: number[][]) => {
	const isWall = (px: number, py: number) => {
		if (px < 0 || py < 0 || py >= map.length || px >= map[0].length)
			return true; // fuera = pared
		return map[py][px] === 1;
	};

	const currentIsWall = isWall(x, y);
	const nNeibor = isWall(x, y - 1);
	const sNeibor = isWall(x, y + 1);
	const eNeibor = isWall(x + 1, y);
	const wNeibor = isWall(x - 1, y);
	const neNeibor = isWall(x + 1, y - 1);
	const nwNeibor = isWall(x - 1, y - 1);
	const seNeibor = isWall(x + 1, y + 1);
	const swNeibor = isWall(x - 1, y + 1);

	if (!currentIsWall) {
		if (!nwNeibor && !nNeibor && !wNeibor) return { col: 0, row: 4 }; // suelo variante 1
		if (nNeibor && !wNeibor) return { col: 2, row: 4 }; // suelo variante 2
		if (!nNeibor && wNeibor) return { col: 7, row: 3 }; // suelo variante 3
		if (nwNeibor && !nNeibor && !wNeibor) return { col: 5, row: 4 }; // suelo variante 4
		if (nNeibor && wNeibor) return { col: 6, row: 3 }; // suelo variante 5

		return { col: 1, row: 5 }; // ajusta según tu tileset
	} else {
		if (nNeibor && sNeibor && eNeibor && !wNeibor)
			return { col: 3, row: 1 }; // wall variante 2
		if (nNeibor && sNeibor && !eNeibor && !wNeibor)
			return { col: 6, row: 2 }; // wall variante 3
		if (nNeibor && sNeibor && !eNeibor && wNeibor)
			return { col: 1, row: 1 }; // wall variante 4
		if (nNeibor && !sNeibor && wNeibor && eNeibor)
			return { col: 4, row: 3 }; // wall variante 4
		if (nNeibor && !sNeibor && !swNeibor && !wNeibor)
			return { col: 9, row: 4 }; // wall variante 4
		if (nNeibor && !sNeibor && !eNeibor) return { col: 11, row: 4 }; // wall variante 4
		if (!nNeibor && sNeibor && wNeibor && eNeibor)
			return { col: 2, row: 2 }; // wall variante 4
		if (!nNeibor && sNeibor && !wNeibor && eNeibor)
			return { col: 4, row: 0 }; // wall variante 4
		if (!nNeibor && sNeibor && wNeibor && !eNeibor)
			return { col: 5, row: 0 }; // wall variante 4
		if (nNeibor && sNeibor && wNeibor && eNeibor && !neNeibor)
			return { col: 1, row: 2 }; // wall variante 4
		if (nNeibor && sNeibor && wNeibor && eNeibor && !seNeibor)
			return { col: 1, row: 1 }; // wall variante 4
	}

	// Pared normal (interior)
	return { col: 0, row: 0 }; // wall variante 1
};

const DrawTile = (
	ctx: CanvasRenderingContext2D,
	tileset: HTMLImageElement,
	col: number,
	row: number,
	destX: number,
	destY: number,
) => {
	if (!tileset) return;

	const originalSize = 16;
	const spacing = 1;

	const sx = col * (originalSize + spacing);
	const sy = row * (originalSize + spacing);

	ctx.drawImage(
		tileset,
		sx,
		sy,
		originalSize,
		originalSize,
		destX,
		destY,
		32,
		32,
	);
};

export const PlayerDraw = (
	ctx: CanvasRenderingContext2D,
	tileSize: number,
	tileset: HTMLImageElement,
	player: Player,
) => {
	if (!ctx || !tileset) return;

	const px = ctx.canvas.width / 2 - tileSize / 2;
	const py = ctx.canvas.height / 2 - tileSize / 2 - 4;

	//#region Player sprite
	let col;
	let row;
	if (
		player.gear?.armor?.name == "Plate Armor" &&
		player.gear?.helmet?.name == "Plate Helmet"
	) {
		col = 1;
		row = 8;
	} else if (
		player.gear?.armor?.name == "Plate Armor" &&
		(player.gear?.helmet == null || player.gear?.helmet == undefined)
	) {
		col = 2;
		row = 8;
	} else if (
		(player.gear?.armor == null || player.gear?.armor == undefined) &&
		player.gear?.helmet?.name == "Plate Helmet"
	) {
		col = 2;
		row = 7;
	} else {
		col = 1;
		row = 7;
	}
	//#endregion

	CharacterDraw(ctx, tileSize, tileset, col, row, px, py, player);
};

export const EnemyDraw = (
	ctx: CanvasRenderingContext2D,
	tileSize: number,
	tileset: HTMLImageElement,
	enemy: Enemy,
	px: number,
	py: number,
) => {
	if (!ctx || !tileset) return;

	//#region Enemy sprite
	let col;
	let row;
	switch (enemy.name) {
		case "Slime":
			col = 0;
			row = 9;
			break;
		case "Ciclop":
			col = 1;
			row = 9;
			break;
		case "Scorpion":
			col = 2;
			row = 9;
			break;
		case "Mage":
			col = 3;
			row = 9;
			break;
		case "Bat":
			col = 0;
			row = 10;
			break;
		case "Ghost":
			col = 1;
			row = 10;
			break;
		case "Spider":
			col = 2;
			row = 10;
			break;
		case "Rat":
			col = 3;
			row = 10;
			break;
		default:
			col = 0;
			row = 9;
	}
	//#endregion

	CharacterDraw(ctx, tileSize, tileset, col, row, px, py, enemy);
};

const CharacterDraw = (
	ctx: CanvasRenderingContext2D,
	tileSize: number,
	tileset: HTMLImageElement,
	col: number,
	row: number,
	px: number,
	py: number,
	character: Character,
) => {
	if (!ctx || !tileset) return;

	//Outside the canvas, do not draw
	if (
		px < -80 ||
		px > ctx.canvas.width + 80 ||
		py < -80 ||
		py > ctx.canvas.height + 80
	) {
		return;
	}

	//#region Character sprite

	DrawSprite(ctx, tileset, col, row, px, py, tileSize, {
		flipX: character.facing == "Left" ? true : false,
	});
	//#endregion

	//#region Weapon sprite

	if (character.gear.weapon && character.gear.weapon?.name) {
		let wCol = 0;
		let wRow = 0;

		switch (character.gear.weapon.name) {
			case "Dagger":
				wCol = 7;
				wRow = 8;
				break;
			case "Sword":
				wCol = 8;
				wRow = 8;
				break;
			case "BroadSword":
				wCol = 10;
				wRow = 8;
				break;
			case "Mace":
				wCol = 9;
				wRow = 9;
				break;
			case "Axe":
				wCol = 11;
				wRow = 9;
				break;
			case "Double Axe":
				wCol = 10;
				wRow = 9;
				break;
			case "Spear":
				wCol = 11;
				wRow = 10;
				break;
			default:
				break;
		}

		DrawSprite(
			ctx,
			tileset,
			wCol,
			wRow,
			character.facing === "Left" ? px - 20 : px + 20,
			py,
			tileSize,
			{
				rotation: -35,
				flipX: character.facing === "Left" ? false : true,
			},
		);
	}
	//#endregion

	//#region Shield sprite
	if (character.gear?.shield && character.gear?.shield?.name) {
		let sCol = 0;
		let sRow = 0;

		switch (character.gear.shield.name) {
			case "Wooden Shield":
				sCol = 5;
				sRow = 8;
				break;
			case "Plate Shield":
				sCol = 6;
				sRow = 8;
				break;
		}

		DrawSprite(
			ctx,
			tileset,
			sCol,
			sRow,
			character.facing === "Left" ? px + 15 : px - 15,
			py + 8,
			tileSize,
			{
				rotation: character.facing === "Left" ? 10 : -10,
			},
		);
	}
	//#endregion
};

interface DrawOptions {
	rotation?: number;
	flipX?: boolean;
	flipY?: boolean;
}

const DrawSprite = (
	ctx: CanvasRenderingContext2D,
	tileset: HTMLImageElement,
	col: number,
	row: number,
	destX: number,
	destY: number,
	size: number,
	options: DrawOptions = {},
) => {
	if (!ctx || !tileset) return;

	const originalSize = 16;
	const spacing = 1;

	const sx = col * (originalSize + spacing);
	const sy = row * (originalSize + spacing);

	const { rotation = 0, flipX = false, flipY = false } = options;

	ctx.save();

	// Mover el origen al centro del jugador
	ctx.translate(destX + size / 2, destY + size / 2);

	// Aplicar flip
	if (flipX) ctx.scale(-1, 1);
	if (flipY) ctx.scale(1, -1);

	// Aplicar rotación (en grados)
	if (rotation !== 0) {
		ctx.rotate((rotation * Math.PI) / 180);
	}

	// Dibujar el tile centrado
	ctx.drawImage(
		tileset,
		sx,
		sy,
		originalSize,
		originalSize,
		0 - size / 2,
		0 - size / 2,
		size,
		size,
	);

	ctx.restore();
};
