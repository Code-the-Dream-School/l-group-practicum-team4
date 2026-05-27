import * as ROT from "rot-js";
import type {
	Player,
	Enemy,
	Character,
	MapTile,
} from "../../../shared/models/models";

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
	map: MapTile[][],
	seed: number,
	enemyList: Enemy[],
) => {
	if (!enemyList || enemyList.length === 0) return [];

	const floorTiles: { x: number; y: number }[] = [];

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x].object === "enemy_spawn") floorTiles.push({ x, y });
		}
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
			x: tile.x,
			y: tile.y,
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
	map: MapTile[][],
	tileSize: number,
	originalTileSize: number,
	offsetX: number,
	offsetY: number,
	tileset: HTMLImageElement,
) => {
	const isWall = (px: number, py: number) => {
		if (px < 0 || py < 0 || py >= map.length || px >= map[0].length)
			return true; // fuera = pared
		return map[py][px].type === "wall" || map[py][px].type === "cealing";
	};

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
			) {
				continue;
			}

			const nNeibor = isWall(x, y - 1);
			const sNeibor = isWall(x, y + 1);
			const eNeibor = isWall(x + 1, y);
			const wNeibor = isWall(x - 1, y);
			const neNeibor = isWall(x + 1, y - 1);
			const nwNeibor = isWall(x - 1, y - 1);
			const seNeibor = isWall(x + 1, y + 1);
			const swNeibor = isWall(x - 1, y + 1);

			if (
				nNeibor &&
				sNeibor &&
				eNeibor &&
				wNeibor &&
				neNeibor &&
				nwNeibor &&
				seNeibor &&
				swNeibor
			)
				map[y][x].type = "cealing";

			const { col, row } = getTileVariant(x, y, map);
			DrawTile(ctx, tileset, col, row, screenX, screenY);
		}
	}
};

const getTileVariant = (x: number, y: number, map: MapTile[][]) => {
	const currentTile = map[y][x].type;

	const nNeibor = y !== 0 ? map[y - 1][x].type : "wall";
	const sNeibor = y < map.length - 1 ? map[y + 1][x].type : "wall";
	const eNeibor = x < map[0].length - 1 ? map[y][x + 1].type : "wall";
	const wNeibor = x !== 0 ? map[y][x - 1].type : "wall";

	const neNeibor =
		x < map[0].length - 1 && y !== 0 ? map[y - 1][x + 1].type : "wall";
	const nwNeibor = x !== 0 && y !== 0 ? map[y - 1][x - 1].type : "wall";
	const seNeibor =
		x < map[0].length - 1 && y < map.length - 1
			? map[y + 1][x + 1].type
			: "wall";
	const swNeibor =
		x !== 0 && y < map.length - 1 ? map[y + 1][x - 1].type : "wall";
	const sseNeibor =
		x < map[0].length - 1 && y < map.length - 2
			? map[y + 2][x + 1].type
			: "wall";

	if (currentTile === "floor") {
		if (nNeibor === "wall" && wNeibor === "floor") {
			return { col: 2, row: 4 };
		}
		if (nNeibor === "wall" && wNeibor === "wall") return { col: 6, row: 3 };
		if (nNeibor === "floor" && wNeibor === "wall")
			return { col: 7, row: 3 };
		if (nwNeibor === "wall" && nNeibor === "floor" && wNeibor === "floor") {
			return { col: 5, row: 4 };
		}

		return { col: 0, row: 4 };
	}

	if (currentTile === "wall") {
		if (
			nNeibor === "wall" &&
			sNeibor === "wall" &&
			eNeibor === "floor" &&
			wNeibor === "floor"
		)
			return { col: 6, row: 2 };

		if (sNeibor === "floor" && wNeibor === "wall" && eNeibor === "wall") {
			if (((x * y) % 10) % 2 === 0) return { col: 4, row: 3 };
			else return { col: 4, row: 2 };
		}
		if (
			nNeibor === "wall" &&
			sNeibor == "floor" &&
			swNeibor === "floor" &&
			eNeibor === "wall"
		)
			return { col: 9, row: 4 };

		if (
			nNeibor === "wall" &&
			sNeibor == "floor" &&
			wNeibor === "wall" &&
			eNeibor === "floor"
		)
			return { col: 11, row: 4 };
		if (
			nNeibor === "floor" &&
			sNeibor === "cealing" &&
			wNeibor === "wall" &&
			eNeibor === "wall"
		)
			return { col: 2, row: 2 };
		if (
			nNeibor === "floor" &&
			sNeibor === "wall" &&
			wNeibor === "floor" &&
			eNeibor === "wall" &&
			seNeibor === "wall" &&
			nwNeibor === "floor" &&
			sseNeibor === "floor"
		)
			return { col: 1, row: 3 };
		if (
			nNeibor === "floor" &&
			sNeibor === "wall" &&
			wNeibor === "floor" &&
			eNeibor === "wall"
		)
			return { col: 4, row: 0 };
		if (
			nNeibor === "floor" &&
			sNeibor === "wall" &&
			wNeibor === "wall" &&
			eNeibor === "floor"
		)
			return { col: 5, row: 0 };

		if (
			nNeibor === "wall" &&
			sNeibor === "cealing" &&
			eNeibor === "wall" &&
			neNeibor === "floor"
		)
			return { col: 1, row: 2 };
		if (
			nNeibor === "wall" &&
			wNeibor === "wall" &&
			nwNeibor === "floor" &&
			sNeibor === "wall" &&
			eNeibor === "wall"
		)
			return { col: 2, row: 3 };
		if (
			nNeibor === "wall" &&
			wNeibor === "wall" &&
			nwNeibor === "floor" &&
			sNeibor === "wall"
		)
			return { col: 0, row: 3 };
		if (
			nNeibor === "wall" &&
			wNeibor === "wall" &&
			nwNeibor === "floor" &&
			sNeibor === "wall" &&
			eNeibor === "cealing"
		)
			return { col: 3, row: 3 };

		if (nNeibor === "wall" && wNeibor === "wall" && nwNeibor === "floor")
			return { col: 3, row: 2 };
		if (
			(eNeibor === "floor" || eNeibor === "wall") &&
			wNeibor === "cealing" &&
			swNeibor === "wall"
		)
			return { col: 5, row: 1 };
		if (
			(wNeibor === "floor" || wNeibor === "wall") &&
			eNeibor === "cealing" &&
			seNeibor === "wall"
		)
			return { col: 4, row: 1 };
		if (
			(eNeibor === "floor" || eNeibor === "wall") &&
			(wNeibor === "cealing" || wNeibor === "wall")
		)
			return { col: 1, row: 1 };
		if (
			(nNeibor === "wall" || nNeibor === "cealing") &&
			sNeibor === "wall" &&
			eNeibor === "cealing" &&
			(wNeibor === "floor" || wNeibor === "wall")
		)
			return { col: 3, row: 1 };
		if (
			nNeibor === "floor" &&
			wNeibor === "floor" &&
			eNeibor === "floor" &&
			sNeibor === "wall"
		)
			return { col: 6, row: 0 };

		if (
			nNeibor === "floor" &&
			wNeibor === "floor" &&
			eNeibor === "wall" &&
			sNeibor === "floor"
		)
			return { col: 6, row: 1 };

		return { col: 1, row: 3 };
	}

	if (currentTile === "cealing") {
		if (sNeibor === "wall" && swNeibor === "cealing")
			return { col: 1, row: 0 };

		if (sNeibor === "wall" && seNeibor === "cealing")
			return { col: 3, row: 0 };
		if (
			sNeibor === "wall" &&
			(eNeibor === "cealing" || eNeibor === "wall") &&
			(wNeibor === "cealing" || wNeibor === "wall")
		)
			return { col: 2, row: 0 };

		return { col: 0, row: 0 };
	}

	return { col: 0, row: 0 };
};

export const ObjectsDraw = (
	ctx: CanvasRenderingContext2D,
	tileSize: number,
	tileset: HTMLImageElement,
	objectType: string,
	px: number,
	py: number,
	offsetX: number,
	offsetY: number,
) => {
	if (!ctx || !tileset || !objectType) return;

	const screenX = px * tileSize - offsetX;
	const screenY = py * tileSize - offsetY;

	let col = 0;
	let row = 0;
	switch (objectType) {
		case "entrance":
			col = 9;
			row = 0;
			break;
		case "trap":
			col = 5;
			row = 3;
			break;
		case "chest":
			col = 5;
			row = 7;
			break;
		case "enemy_spawn":
			col = 0;
			row = 9;
			break;
		default:
			col = 0;
			row = 5;
			break;
	}

	DrawTile(ctx, tileset, col, row, screenX, screenY);
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
		case "Cyclop":
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
		case "Mimic":
			col = 8;
			row = 7;
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
				wCol = 5;
				wRow = 10;
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
			default:
				sCol = 5;
				sRow = 10;
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

export interface Explosion {
	x: number;
	y: number;
	life: number;
	maxLife: number;
}

export const DrawExplosions = (
	ctx: CanvasRenderingContext2D,
	explosions: Explosion[],
	setExplosions: (value: React.SetStateAction<Explosion[]>) => void,
	tileSize: number,
	offsetX: number,
	offsetY: number,
) => {
	ctx.save();
	explosions.forEach((exp: Explosion, index: number) => {
		DrawExplosion(ctx, exp, tileSize, offsetX, offsetY);

		exp.life -= 1;

		if (exp.life <= 0) {
			setExplosions((prev) => prev.filter((_, i) => i !== index));
		}
	});
	ctx.restore();
};

const DrawExplosion = (
	ctx: CanvasRenderingContext2D,
	explosion: Explosion,
	tileSize: number,
	offsetX: number,
	offsetY: number,
) => {
	const screenX = explosion.x * tileSize - offsetX + tileSize / 2;
	const screenY = explosion.y * tileSize - offsetY + tileSize / 2;

	const alpha = explosion.life / explosion.maxLife; // se desvanece

	// Círculo principal (explosión)
	ctx.beginPath();
	ctx.arc(screenX, screenY, 38 * alpha, 0, Math.PI * 2);
	ctx.fillStyle = `rgba(255, 120, 0, ${alpha * 0.9})`;
	ctx.fill();

	// Círculo secundario más pequeño (núcleo)
	ctx.beginPath();
	ctx.arc(screenX, screenY, 24 * alpha, 0, Math.PI * 2);
	ctx.fillStyle = `rgba(255, 220, 50, ${alpha})`;
	ctx.fill();
};
