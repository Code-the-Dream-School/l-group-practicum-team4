export interface Player {
	x: number;
	y: number;
	facing: string;
	health: number;
	attack: number;
	defense: number;
	speed: number;
	gear: {
		helmet?: { type: string };
		armor?: { type: string };
		weapon?: { type: string };
		shield?: { type: string };
	};
	inventory: { index: number; type: string }[];
}

export interface Enemy {
	x: number;
	y: number;
	name: string;
	facing: string;
	health: number;
	attack: number;
	defense: number;
	speed: number;
	gear: {
		helmet?: { type: string };
		armor?: { type: string };
		weapon?: { type: string };
		shield?: { type: string };
	};
	inventory: { index: number; type: string }[];
}
