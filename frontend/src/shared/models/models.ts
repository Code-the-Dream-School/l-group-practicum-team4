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
	}

	get healthPlus() {
		return this.getGearBonus("health");
	}

	get attackPlus() {
		return this.getGearBonus("attack");
	}

	get defensePlus() {
		return this.getGearBonus("defense");
	}

	get speedPlus() {
		return this.getGearBonus("speed");
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
}

export class Player extends Character {}

export class Enemy extends Character {}

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
}
