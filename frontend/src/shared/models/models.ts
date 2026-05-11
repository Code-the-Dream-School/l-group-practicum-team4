export class Character {
	x: number;
	y: number;
	name: string;
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

	constructor(data: Partial<Character>) {
		this.x = data.x ?? 0;
		this.y = data.y ?? 0;
		this.name = data.name ?? "";
		this.facing = data.facing ?? "Right";
		this.health = data.health ?? 0;
		this.attack = data.attack ?? 0;
		this.defense = data.defense ?? 0;
		this.speed = data.speed ?? 0;
		this.gear = data.gear ?? {};
		this.inventory = data.inventory ?? [];

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
	id: number;

	constructor(data: Partial<Enemy>) {
		super(data);
		this.id = data.id ?? 0;
	}
}

export interface CharacterGear {
	helmet?: Item;
	armor?: Item;
	weapon?: Item;
	shield?: Item;
}

export interface Item {
	id: number;
	name: string;
	description: string;
	type: string;
	stat: string;
	value: number;
	coinCost: number;
	inventoryId: string; // for not duplication
}
