export interface Dungeon {
	_id: string;
	user: string;
	seed: number;
	width: number;
	height: number;
	level: number;
	tiles: MapTile[][];
	enemies: DungeonEnemy[];
	traps: Trap[];
	chests: Chest[];
}

export class MapTile {
	x: number;
	y: number;
	type: string;
	passable: boolean;
	object: string | null;

	constructor(data: Partial<MapTile>) {
		this.x = data.x || 0;
		this.y = data.y || 0;
		this.type = data.type || "wall";
		this.passable = data.passable || false;
		this.object = data.object || null;
	}
}

interface DungeonEnemy {
	enemy: Enemy;
	status: string;
}

export type ApiResponse<T> = T & {
	_id?: string;
};

export class Character {
	id: string;
	x: number;
	y: number;
	name: string;
	spriteKey: string;
	facing: string;
	health: number;
	attack: number;
	defense: number;
	speed: number;
	gear: CharacterGear;
	inventory: Item[];
	coins!: number;
	timeBonuses: TimeBonus[] = [];

	private onBonusesChanged?: () => void;

	constructor(data: ApiResponse<Partial<Character>>) {
		this.id = data._id ?? data.id ?? "";
		this.x = data.x ?? 0;
		this.y = data.y ?? 0;
		this.name = data.name ?? "";
		this.spriteKey = data.spriteKey ?? "";
		this.facing = data.facing ?? "Right";
		this.health = data.health ?? 0;
		this.attack = data.attack ?? 0;
		this.defense = data.defense ?? 0;
		this.speed = data.speed ?? 0;
		this.gear = data.gear ?? {};
		this.inventory = data.inventory ?? [];
		this.coins = data.coins ?? 0;
		this.timeBonuses = data.timeBonuses ?? [];
	}

	get healthPlus() {
		return this.getGearBonus("health") + this.getTemporaryBonus("health");
	}

	get healthTotal() {
		return this.health + this.healthPlus;
	}

	get attackPlus() {
		return this.getGearBonus("attack") + this.getTemporaryBonus("attack");
	}

	get attackTotal() {
		return this.attack + this.attackPlus;
	}

	get defensePlus() {
		return this.getGearBonus("defense") + this.getTemporaryBonus("defense");
	}

	get defenseTotal() {
		return this.defense + this.defensePlus;
	}

	get speedPlus() {
		return this.getGearBonus("speed") + this.getTemporaryBonus("speed");
	}

	get speedTotal() {
		return this.speed + this.speedPlus;
	}

	get healthBonus() {
		return this.timeBonuses.find((b) => b.stat === "health");
	}

	get attackBonus() {
		return this.timeBonuses.find((b) => b.stat === "attack");
	}

	get defenseBonus() {
		return this.timeBonuses.find((b) => b.stat === "defense");
	}

	get speedBonus() {
		return this.timeBonuses.find((b) => b.stat === "speed");
	}

	private getGearBonus(stat: string): number {
		let bonus = 0;
		const items = [
			this.gear.helmet,
			this.gear.armor,
			this.gear.weapon,
			this.gear.shield,
		];

		for (const item of items) {
			if (item?.stat === stat) {
				bonus += item.value;
			}
		}
		return bonus;
	}

	applyTemporaryBonus(stat: string, value: number, durationMs: number) {
		const bonus: TimeBonus = {
			stat: stat.toLowerCase(),
			value,
			expiresAt: Date.now() + durationMs,
			id: Math.random().toString(36).substring(7),
		};

		this.timeBonuses.push(bonus);

		setTimeout(() => {
			this.removeExpiredBonuses();
		}, durationMs);
	}

	setOnBonusesChanged(callback: () => void) {
		this.onBonusesChanged = callback;
	}

	private removeExpiredBonuses() {
		const beforeCount = this.timeBonuses.length;

		this.timeBonuses = this.timeBonuses.filter(
			(bonus) => bonus.expiresAt > Date.now(),
		);

		if (this.timeBonuses.length !== beforeCount) {
			this.onBonusesChanged?.();
		}
	}

	private getTemporaryBonus(stat: string): number {
		this.removeExpiredBonuses();

		return this.timeBonuses
			.filter((b) => b.stat === stat.toLowerCase())
			.reduce((sum, b) => sum + b.value, 0);
	}
}

export interface TimeBonus {
	id: string;
	stat: string;
	value: number;
	expiresAt: number;
}

export class Player extends Character {}

export class Enemy extends Character {
	index: number;
	status: string;

	constructor(data: Partial<Enemy>) {
		super(data);
		this.index = data.index ?? -1;
		this.status = data.status ?? "active";
	}
}

export interface CharacterGear {
	helmet?: Item;
	armor?: Item;
	weapon?: Item;
	shield?: Item;
}

export interface Item {
	id: string;
	name: string;
	description: string;
	type: string;
	stat: string;
	value: number;
	coinCost: number;
	inventoryId: string;
}

export class DroppedItem {
	x: number;
	y: number;
	item?: Item;

	constructor(data: Partial<DroppedItem>) {
		this.x = data.x ?? 0;
		this.y = data.y ?? 0;
		this.item = data.item ?? undefined;
	}
}

export class TilePosition {
	x: number;
	y: number;
	constructor(data: Partial<TilePosition>) {
		this.x = data.x ?? 0;
		this.y = data.y ?? 0;
	}
}

export class Entrance extends TilePosition {}

export class Exit extends TilePosition {}

export class Trap extends TilePosition {}

export class Chest extends TilePosition {}
