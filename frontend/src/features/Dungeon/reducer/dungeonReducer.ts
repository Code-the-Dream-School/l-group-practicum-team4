import { Player, Enemy } from "../../../shared/models/models";

interface State {
	isLoading: boolean;
	name: string;
	description: string;
	seed: number | null;
	tileset?: HTMLImageElement | null;
	map?: number[][];
	player: Player;
	enemies?: Enemy[];
	enemy?: Enemy | null;
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
				id: 1,
				name: "Dagger",
				description: "Dagger",
				type: "weapon",
				stat: "attack",
				value: 1,
			},
			{
				id: 2,
				name: "Sword",
				description: "Sword",
				type: "weapon",
				stat: "attack",
				value: 2,
			},
			{
				id: 3,
				name: "Wooden Shield",
				description: "Wooden Shield",
				type: "shield",
				stat: "defense",
				value: 5,
			},
			{
				id: 8,
				name: "Blue Potion",
				description: "Blue Potion",
				type: "potion",
				stat: "defense",
				value: 20,
			},
		],
		gear: {
			helmet: {
				id: 4,
				name: "Plate Helmet",
				description: "Plate Helmet",
				type: "helmet",
				stat: "defense",
				value: 5,
			},
			armor: {
				id: 5,
				name: "Plate Armor",
				description: "Plate Armor",
				type: "armor",
				stat: "defense",
				value: 5,
			},
			weapon: {
				id: 6,
				name: "BroadSword",
				description: "BroadSword",
				type: "weapon",
				stat: "attack",
				value: 5,
			},
			shield: {
				id: 7,
				name: "Plate Shield",
				description: "Plate Shield",
				type: "shield",
				stat: "defense",
				value: 10,
			},
		},
	}),
	enemies: [
		new Enemy({
			x: 0,
			y: 0,
			name: "Ciclop",
			facing: "",
			health: 50,
			attack: 10,
			defense: 5,
			speed: 5,
			inventory: [],
			gear: {
				weapon: {
					id: 1,
					name: "Dagger",
					description: "Dagger",
					type: "weapon",
					stat: "attack",
					value: 1,
				},
			},
		}),
		new Enemy({
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
		}),
		new Enemy({
			x: 0,
			y: 0,
			name: "Ghost",
			facing: "",
			health: 50,
			attack: 10,
			defense: 5,
			speed: 5,
			inventory: [
				{
					id: 8,
					name: "Blue Potion",
					description: "Blue Potion",
					type: "potion",
					stat: "defense",
					value: 20,
				},
			],
			gear: {},
		}),
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
			payload: Partial<Player>;
	  }
	| {
			type: typeof actions.SET_ENEMY;
			payload: Partial<Enemy> | null;
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
		default:
			return state;
	}
}
