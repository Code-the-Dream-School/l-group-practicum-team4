import {
	Player,
	Enemy,
	type Trap,
	type Chest,
	type Dungeon,
	type DroppedItem,
	type MapTile,
} from "../../../shared/models/models";

export interface State {
	isLoading: boolean;
	tileset?: HTMLImageElement | null;
	dungeons?: Dungeon[] | null;
	dungeon?: Dungeon | null;
	player: Player;
	enemies?: Enemy[];
	enemy?: Enemy | null;
	traps?: Trap[];
	chests?: Chest[];
	droppedItems: DroppedItem[];
}

export const initialStates: State = {
	isLoading: false,
	tileset: null,
	dungeons: null,
	dungeon: null,
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
	enemies: [],
	enemy: null,
	droppedItems: [],
};

export const actions = {
	IS_LOADING: "is_loading",
	SET_TILESET: "set_tileset",
	SET_DUNGEONS: "set_dungeons",
	SET_DUNGEON: "set_dungeon",
	SET_TILE: "set_tile",
	SET_MAP: "set_map",
	SET_PLAYER: "set_player",
	SET_ENEMY: "set_enemy",
	SET_ENEMIES: "set_enemies",
	NEW_ENEMY: "new_enemy",
	DEL_ENEMY: "del_enemy",
	SET_TRAPS: "set_traps",
	SET_CHESTS: "set_chests",
	SET_DROPPEDITEMS: "set_droppeditems",
	ADDDROPPEDITEM: "add_droppeditem",
	DELDROPPEDITEM: "delete_droppeditem",
} as const;

export type Action =
	| { type: typeof actions.IS_LOADING; payload: boolean }
	| { type: typeof actions.SET_TILESET; payload: HTMLImageElement }
	| { type: typeof actions.SET_DUNGEONS; payload: Dungeon[] | null }
	| { type: typeof actions.SET_DUNGEON; payload: Dungeon | null }
	| { type: typeof actions.SET_TILE; payload: MapTile | null }
	| {
			type: typeof actions.SET_PLAYER;
			payload: Partial<Player> | null;
	  }
	| {
			type: typeof actions.SET_ENEMIES;
			payload: Enemy[] | undefined;
	  }
	| {
			type: typeof actions.NEW_ENEMY;
			payload: Enemy;
	  }
	| {
			type: typeof actions.DEL_ENEMY;
			payload: Enemy;
	  }
	| {
			type: typeof actions.SET_ENEMY;
			payload: Partial<Enemy> | null;
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
		case actions.SET_DUNGEONS:
			return { ...state, dungeons: action.payload };
		case actions.SET_DUNGEON:
			return { ...state, dungeon: action.payload };
		case actions.SET_TILE: {
			const newTile = action.payload;
			if (!state.dungeon || !newTile) return { ...state };

			state.dungeon.tiles[newTile.y][newTile.x] = newTile;

			return { ...state };
		}
		case actions.SET_PLAYER:
			return {
				...state,
				player: new Player({
					...state.player,
					...action.payload,
					timeBonuses: state.player?.timeBonuses,
				}),
			};
		case actions.SET_ENEMIES:
			return { ...state, enemies: action.payload };
		case actions.NEW_ENEMY: {
			const enemy = action.payload;
			if (!state.dungeon || !enemy) return { ...state };

			state.dungeon.enemies = [
				...state.dungeon.enemies,
				{ enemy: enemy, status: "active" },
			];

			return { ...state };
		}
		case actions.DEL_ENEMY: {
			const enemy = action.payload;
			if (!state.dungeon || !enemy) return { ...state };

			if (!state.dungeon.enemies || state.dungeon.enemies.length <= 0)
				return { ...state };

			const dungeonEnemy = state.dungeon.enemies[enemy.index];

			dungeonEnemy.status = "defeated";

			return { ...state };
		}
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
