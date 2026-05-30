import {
	Player,
	Enemy,
	type MapTile,
	type Trap,
	type Chest,
	type DroppedItem,
} from "../../../shared/models/models";

export interface State {
	isLoading: boolean;
	name: string;
	description: string;
	seed: number | null;
	tileset?: HTMLImageElement | null;
	map?: MapTile[][];
	player: Player;
	enemies?: Enemy[];
	enemy?: Enemy | null;
	traps?: Trap[];
	chests?: Chest[];
	droppedItems: DroppedItem[];
}

export const initialStates: State = {
	isLoading: false,
	name: "",
	description: "",
	seed: 12345,
	tileset: null,
	player: new Player({
		name: "Player",
		health: 100,
		attack: 20,
		defense: 10,
		speed: 5,
		inventory: [
			{
				id: "1",
				name: "Dagger",
				description: "Dagger",
				type: "weapon",
				stat: "attack",
				value: 1,
				coinCost: 20,
				inventoryId: "",
			},
			{
				id: "2",
				name: "Sword",
				description: "Sword",
				type: "weapon",
				stat: "attack",
				value: 2,
				coinCost: 20,
				inventoryId: "",
			},
			{
				id: "3",
				name: "Wooden Shield",
				description: "Wooden Shield",
				type: "shield",
				stat: "defense",
				value: 5,
				coinCost: 20,
				inventoryId: "",
			},
			{
				id: "8",
				name: "Blue Potion",
				description: "Blue Potion",
				type: "potion",
				stat: "defense",
				value: 20,
				coinCost: 20,
				inventoryId: "",
			},
		],
		gear: {
			helmet: {
				id: "4",
				name: "Plate Helmet",
				description: "Plate Helmet",
				type: "helmet",
				stat: "defense",
				value: 5,
				coinCost: 20,
				inventoryId: "",
			},
			armor: {
				id: "5",
				name: "Plate Armor",
				description: "Plate Armor",
				type: "armor",
				stat: "defense",
				value: 5,
				coinCost: 20,
				inventoryId: "",
			},
			weapon: {
				id: "6",
				name: "BroadSword",
				description: "BroadSword",
				type: "weapon",
				stat: "attack",
				value: 5,
				coinCost: 20,
				inventoryId: "",
			},
			shield: {
				id: "7",
				name: "Plate Shield",
				description: "Plate Shield",
				type: "shield",
				stat: "defense",
				value: 10,
				coinCost: 20,
				inventoryId: "",
			},
		},
	}),
	enemies: [
		new Enemy({
			id: 1,
			x: 0,
			y: 0,
			name: "Slime",
			facing: "Left",
			health: 25,
			attack: 8,
			defense: 12,
			speed: 10,
			gear: {},
			inventory: [],
		}),
		new Enemy({
			id: 2,
			x: 0,
			y: 0,
			name: "Cyclop",
			facing: "Right",
			health: 65,
			attack: 18,
			defense: 25,
			speed: 7,
			gear: {
				helmet: {
					id: "6a02418e37f12861fcf56aa4",
					name: "Cracked Eye Patch",
					description:
						"A worn leather patch that partially covers a single eye.",
					type: "helmet",
					stat: "defense",
					value: 5,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [
				{
					id: "6a0241cc37f12861fcf56aa5",
					name: "Large Club",
					description: "A heavy wooden club used for smashing.",
					type: "weapon",
					stat: "attack",
					value: 7,
					coinCost: 20,
					inventoryId: "",
				},
			],
		}),
		new Enemy({
			id: 3,
			x: 0,
			y: 0,
			name: "Scorpion",
			facing: "Left",
			health: 40,
			attack: 15,
			defense: 18,
			speed: 14,
			gear: {
				weapon: {
					id: "6a0241db37f12861fcf56aa6",
					name: "Venom Stinger",
					description: "Sharp tail stinger dripping with poison.",
					type: "weapon",
					stat: "attack",
					value: 6,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 4,
			x: 0,
			y: 0,
			name: "Mage",
			facing: "Right",
			health: 35,
			attack: 20,
			defense: 10,
			speed: 12,
			gear: {
				weapon: {
					id: "6a0241e737f12861fcf56aa7",
					name: "Arcane Staff",
					description:
						"A gnarled wooden staff pulsing with magical energy.",
					type: "weapon",
					stat: "attack",
					value: 9,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 5,
			x: 0,
			y: 0,
			name: "Bat",
			facing: "Left",
			health: 20,
			attack: 10,
			defense: 5,
			speed: 18,
			gear: {},
			inventory: [],
		}),
		new Enemy({
			id: 6,
			x: 0,
			y: 0,
			name: "Ghost",
			facing: "Right",
			health: 30,
			attack: 12,
			defense: 8,
			speed: 15,
			gear: {},
			inventory: [
				{
					id: "6a0241f237f12861fcf56aa8",
					name: "Ectoplasm Residue",
					description: "Glowing substance that enhances speed.",
					type: "potion",
					stat: "speed",
					value: 4,
					coinCost: 20,
					inventoryId: "",
				},
			],
		}),
		new Enemy({
			id: 7,
			x: 0,
			y: 0,
			name: "Spider",
			facing: "Left",
			health: 28,
			attack: 14,
			defense: 15,
			speed: 13,
			gear: {},
			inventory: [],
		}),
		new Enemy({
			id: 8,
			x: 0,
			y: 0,
			name: "Rat",
			facing: "Right",
			health: 18,
			attack: 9,
			defense: 6,
			speed: 16,
			gear: {},
			inventory: [],
		}),
		new Enemy({
			id: 9,
			x: 0,
			y: 0,
			name: "Slime",
			facing: "Left",
			health: 45,
			attack: 12,
			defense: 20,
			speed: 8,
			gear: {
				armor: {
					id: "6a02420037f12861fcf56aa9",
					name: "Gelatinous Hide",
					description: "Thick slime layer that absorbs impacts.",
					type: "armor",
					stat: "defense",
					value: 8,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [
				{
					id: "6a02420637f12861fcf56aaa",
					name: "Sticky Goo",
					description: "Adhesive substance that slows enemies.",
					type: "poison",
					stat: "speed",
					value: -3,
					coinCost: 20,
					inventoryId: "",
				},
			],
		}),
		new Enemy({
			id: 10,
			x: 0,
			y: 0,
			name: "Cyclop",
			facing: "Right",
			health: 80,
			attack: 22,
			defense: 30,
			speed: 6,
			gear: {
				helmet: {
					id: "6a02421a37f12861fcf56aab",
					name: "Plate Crown",
					description: "Heavy plate crown that increases durability.",
					type: "helmet",
					stat: "defense",
					value: 10,
					coinCost: 20,
					inventoryId: "",
				},
				weapon: {
					id: "6a02422837f12861fcf56aac",
					name: "Boulder Fist",
					description: "Massive stone-covered fist.",
					type: "weapon",
					stat: "attack",
					value: 12,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 11,
			x: 0,
			y: 0,
			name: "Scorpion",
			facing: "Left",
			health: 55,
			attack: 19,
			defense: 22,
			speed: 12,
			gear: {
				shield: {
					id: "6a02423137f12861fcf56aad",
					name: "Chitin Plate",
					description: "Hard exoskeleton fragment used as shield.",
					type: "shield",
					stat: "defense",
					value: 7,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 12,
			x: 0,
			y: 0,
			name: "Mage",
			facing: "Right",
			health: 50,
			attack: 23,
			defense: 15,
			speed: 11,
			gear: {
				helmet: {
					id: "6a02423f37f12861fcf56aae",
					name: "Wizard Hat",
					description: "Pointed hat that channels mana.",
					type: "helmet",
					stat: "attack",
					value: 5,
					coinCost: 20,
					inventoryId: "",
				},
				armor: {
					id: "6a02424737f12861fcf56aaf",
					name: "Mystic Robes",
					description: "Flowing robes that reduce physical damage.",
					type: "armor",
					stat: "defense",
					value: 6,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [
				{
					id: "6a02424d37f12861fcf56ab0",
					name: "Sharp Crystal",
					description: "Glowing crystal that boosts attack power.",
					type: "potion",
					stat: "attack",
					value: 8,
					coinCost: 20,
					inventoryId: "",
				},
			],
		}),
		new Enemy({
			id: 13,
			x: 0,
			y: 0,
			name: "Bat",
			facing: "Left",
			health: 32,
			attack: 13,
			defense: 9,
			speed: 19,
			gear: {},
			inventory: [
				{
					id: "6a02425d37f12861fcf56ab1",
					name: "Leathery Wing",
					description: "Torn wing membrane that improves agility.",
					type: "potion",
					stat: "speed",
					value: 5,
					coinCost: 20,
					inventoryId: "",
				},
			],
		}),
		new Enemy({
			id: 14,
			x: 0,
			y: 0,
			name: "Ghost",
			facing: "Right",
			health: 42,
			attack: 16,
			defense: 12,
			speed: 17,
			gear: {},
			inventory: [],
		}),
		new Enemy({
			id: 15,
			x: 0,
			y: 0,
			name: "Spider",
			facing: "Left",
			health: 38,
			attack: 17,
			defense: 14,
			speed: 14,
			gear: {
				weapon: {
					id: "6a02426637f12861fcf56ab2",
					name: "Venom Fangs",
					description: "Sharp fangs coated in deadly toxin.",
					type: "weapon",
					stat: "attack",
					value: 8,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 16,
			x: 0,
			y: 0,
			name: "Rat",
			facing: "Right",
			health: 25,
			attack: 11,
			defense: 8,
			speed: 15,
			gear: {
				weapon: {
					id: "6a02426f37f12861fcf56ab3",
					name: "Sharp Teeth",
					description: "Gnawed incisors that pierce armor.",
					type: "weapon",
					stat: "attack",
					value: 4,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 17,
			x: 0,
			y: 0,
			name: "Slime",
			facing: "Left",
			health: 60,
			attack: 14,
			defense: 28,
			speed: 9,
			gear: {
				armor: {
					id: "6a02427737f12861fcf56ab4",
					name: "Acidic Membrane",
					description: "Corrosive outer layer that burns attackers.",
					type: "armor",
					stat: "defense",
					value: 12,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 18,
			x: 0,
			y: 0,
			name: "Cyclop",
			facing: "Right",
			health: 70,
			attack: 21,
			defense: 27,
			speed: 8,
			gear: {
				helmet: {
					id: "6a02427f37f12861fcf56ab5",
					name: "One-Eyed Monocle",
					description:
						"Strange lens that slightly improves accuracy.",
					type: "helmet",
					stat: "attack",
					value: 3,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 19,
			x: 0,
			y: 0,
			name: "Mage",
			facing: "Left",
			health: 48,
			attack: 24,
			defense: 13,
			speed: 10,
			gear: {
				weapon: {
					id: "6a02428837f12861fcf56ab6",
					name: "Fire Wand",
					description: "Wand that shoots small fireballs.",
					type: "weapon",
					stat: "attack",
					value: 10,
					coinCost: 20,
					inventoryId: "",
				},
			},
			inventory: [],
		}),
		new Enemy({
			id: 20,
			x: 0,
			y: 0,
			name: "Spider",
			facing: "Right",
			health: 33,
			attack: 16,
			defense: 17,
			speed: 16,
			gear: {},
			inventory: [
				{
					id: "6a02429037f12861fcf56ab7",
					name: "Silk Web",
					description: "Strong web that can trap foes.",
					type: "poison",
					stat: "speed",
					value: -6,
					coinCost: 20,
					inventoryId: "",
				},
			],
		}),
	],
	enemy: null,
	droppedItems: [],
};

export const actions = {
	IS_LOADING: "is_loading",
	SET_TILESET: "set_tileset",
	SET_MAP: "set_map",
	SET_PLAYER: "set_player",
	SET_ENEMY: "set_enemy",
	SET_ENEMIES: "set_enemies",
	SET_TRAPS: "set_traps",
	SET_CHESTS: "set_chests",
	SET_DROPPEDITEMS: "set_droppeditems",
	ADDDROPPEDITEM: "add_droppeditem",
	DELDROPPEDITEM: "delete_droppeditem",
} as const;

export type Action =
	| { type: typeof actions.IS_LOADING; payload: boolean }
	| { type: typeof actions.SET_TILESET; payload: HTMLImageElement }
	| { type: typeof actions.SET_MAP; payload: MapTile[][] }
	| {
			type: typeof actions.SET_PLAYER;
			payload: Partial<Player> | null;
	  }
	| {
			type: typeof actions.SET_ENEMY;
			payload: Partial<Enemy> | null;
	  }
	| {
			type: typeof actions.SET_ENEMIES;
			payload: Enemy[] | undefined;
	  }
	| {
			type: typeof actions.SET_TRAPS;
			payload: Trap[] | undefined;
	  }
	| {
			type: typeof actions.SET_CHESTS;
			payload: Chest[] | undefined;
	  }
	| {
			type: typeof actions.SET_DROPPEDITEMS;
			payload: DroppedItem[];
	  }
	| {
			type: typeof actions.ADDDROPPEDITEM;
			payload: DroppedItem;
	  }
	| {
			type: typeof actions.DELDROPPEDITEM;
			payload: DroppedItem;
	  };

export function reducer(state: State = initialStates, action: Action): State {
	switch (action.type) {
		case actions.IS_LOADING:
			return { ...state, isLoading: action.payload };
		case actions.SET_TILESET:
			return { ...state, tileset: action.payload };
		case actions.SET_MAP:
			return { ...state, map: action.payload };

		case actions.SET_PLAYER:
			return {
				...state,
				player: new Player({
					...state.player,
					...action.payload,
					timeBonuses: state.player?.timeBonuses,
				}),
			};
		case actions.SET_ENEMY:
			return {
				...state,
				enemy: action.payload
					? new Enemy({
							...state.enemy,
							...action.payload,
						})
					: null,
			};
		case actions.SET_ENEMIES:
			return { ...state, enemies: action.payload };
		case actions.SET_TRAPS:
			return { ...state, traps: action.payload };
		case actions.SET_CHESTS:
			return { ...state, chests: action.payload };
		case actions.SET_DROPPEDITEMS:
			return { ...state, droppedItems: action.payload };
		case actions.ADDDROPPEDITEM:
			return {
				...state,
				droppedItems: [...state.droppedItems, action.payload],
			};
		case actions.DELDROPPEDITEM:
			return {
				...state,
				droppedItems: state.droppedItems.filter(
					(item) => item.item?.id !== action.payload.item?.id,
				),
			};
		default:
			return state;
	}
}
