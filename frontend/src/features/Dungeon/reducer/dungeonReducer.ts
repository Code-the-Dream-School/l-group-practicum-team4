import type { Player, Enemy } from "../../../shared/models/models";

interface State {
	isLoading: boolean;
	name: string;
	description: string;
	seed: number | null;
	tileset?: HTMLImageElement | null;
	map?: number[][];
	player?: Player;
	enemies?: Enemy[];
	enemy?: Enemy | null;
}

export const initialStates: State = {
	isLoading: false,
	name: "",
	description: "",
	seed: 12345,
	tileset: null,
	player: {
		x: 0,
		y: 0,
		facing: "Right",
		health: 100,
		attack: 20,
		defense: 10,
		speed: 5,
		inventory: [
			{ index: 1, type: "Dagger" },
			{ index: 2, type: "Sword" },
			{ index: 3, type: "Wooden Shield" },
		],
		gear: {
			helmet: { type: "Plate Helmet" },
			armor: { type: "Plate Armor" },
			weapon: { type: "BroadSword" },
			shield: { type: "Plate Shield" },
		},
	},
	enemies: [
		{
			x: 0,
			y: 0,
			name: "Ciclop",
			facing: "",
			health: 50,
			attack: 10,
			defense: 5,
			speed: 5,
			inventory: [],
			gear: { weapon: { type: "Dagger" } },
		},
		{
			x: 0,
			y: 0,
			name: "Spider",
			facing: "",
			health: 50,
			attack: 10,
			defense: 5,
			speed: 5,
			inventory: [],
			gear: {},
		},
		{
			x: 0,
			y: 0,
			name: "Ghost",
			facing: "",
			health: 50,
			attack: 10,
			defense: 5,
			speed: 5,
			inventory: [{ index: 1, type: "Blue Potion" }],
			gear: {},
		},
	],
	enemy: null,
};

export const actions = {
	IS_LOADING: "is_loading",
	SET_TILESET: "set_tileset",
	SET_MAP: "set_map",
	SET_PLAYER: "set_player",
	SET_ENEMY: "set_enemy",
} as const;

export type Action =
	| { type: typeof actions.IS_LOADING; payload: boolean }
	| { type: typeof actions.SET_TILESET; payload: HTMLImageElement }
	| { type: typeof actions.SET_MAP; payload: number[][] }
	| {
			type: typeof actions.SET_PLAYER;
			payload: Player;
	  }
	| {
			type: typeof actions.SET_ENEMY;
			payload: Enemy | null;
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
				player: {
					x: action.payload.x,
					y: action.payload.y,
					facing:
						action.payload.facing ??
						state.player?.facing ??
						"Right",
					health: action.payload.health ?? state.player?.health,
					attack: action.payload.attack ?? state.player?.attack,
					defense: action.payload.defense ?? state.player?.defense,
					speed: action.payload.speed ?? state.player?.speed,
					inventory:
						action.payload.inventory ?? state.player?.inventory,
					gear: {
						...(state.player?.gear || {}),
						...(action.payload.gear || {}),
					},
				},
			};
		case actions.SET_ENEMY:
			return { ...state, enemy: action.payload };
		default:
			return state;
	}
}
