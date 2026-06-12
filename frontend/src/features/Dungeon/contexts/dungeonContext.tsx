import {
	createContext,
	useReducer,
	useEffect,
	useState,
	type ReactNode,
	useCallback,
} from "react";
import { reducer, initialStates, actions } from "../reducer/dungeonReducer";
import { EnemyGenerator } from "../services/drawService";
import {
	getDungeon,
	getDungeons,
	newDungeon,
	updateDungeon,
} from "../services/apiService";
import {
	MapTile,
	type Dungeon,
	type Player,
	Enemy,
	type Trap,
	type Chest,
	type DroppedItem,
} from "../../../shared/models/models";
import { useAuth } from "../../auth/context/useAuth";
import { useCharacter } from "../../Home/hook/useCharacter";

interface DungeonContextType {
	state: typeof initialStates;
	isLoading: (value: boolean) => void;
	setTileset: (tileset: HTMLImageElement) => void;
	setEnemies: (updates: Enemy[] | undefined) => void;
	newEnemy: (updates: Enemy) => void;
	delEnemy: (updates: Enemy) => void;
	setEnemy: (updates: Partial<Enemy> | null) => void;
	createDungeon: () => Promise<void>;
	nextDungeon: () => void;
	previousDungeon: () => void;
	getObjectsPosition: (
		map: MapTile[][],
		objectType: string,
	) => { x: number; y: number }[];
	setTraps: (updates: Trap[] | undefined) => void;
	removeObject: (object: Trap | Chest) => void;
	setChests: (updates: Chest[] | undefined) => void;
	setDroppedItems: (updates: DroppedItem[]) => void;
	addDroppedItem: (updates: DroppedItem) => void;
	delDroppedItem: (updates: DroppedItem) => void;
}
const DungeonContext = createContext<DungeonContextType | undefined>(undefined);

export function DungeonProvider({ children }: { children: ReactNode }) {
	const [dungeonsUpdated, setDungeonsUpdated] = useState(false);
	const [dungeonUpdated, setDungeonUpdated] = useState(false);
	const [dungeonCreating, setDungeonCreating] = useState(false);

	const { selectedCharacter, moveCharacter } = useCharacter();

	const { state: authState } = useAuth();

	const [state, dispatch] = useReducer(reducer, initialStates);

	const TILE_SIZE = 32;

	//#region Exported functions
	const isLoading = (value: boolean) => {
		dispatch({
			type: actions.IS_LOADING,
			payload: value,
		});
	};

	const setTileset = (tileset: HTMLImageElement) => {
		dispatch({
			type: actions.SET_TILESET,
			payload: tileset,
		});
	};

	const setDungeons = (dungeons: Dungeon[]) => {
		dispatch({
			type: actions.SET_DUNGEONS,
			payload: dungeons,
		});
	};

	const setDungeon = (dungeon: Dungeon) => {
		dispatch({
			type: actions.SET_DUNGEON,
			payload: dungeon,
		});
	};

	const setEnemies = (updates: Enemy[] | undefined) => {
		dispatch({ type: actions.SET_ENEMIES, payload: updates });
	};

	const newEnemy = (enemy: Enemy) => {
		if (!state.dungeon) return;

		const tile = new MapTile(state.dungeon.tiles[enemy.y][enemy.x]);
		if (!tile) return;

		tile.object = "enemy_spawn";

		dispatch({ type: actions.NEW_ENEMY, payload: enemy });
		dispatch({ type: actions.SET_TILE, payload: tile });
		setDungeonUpdated(true);
	};

	const delEnemy = (udpates: Enemy) => {
		dispatch({ type: actions.DEL_ENEMY, payload: udpates });
		setDungeonUpdated(true);
	};

	const setEnemy = (updates: Partial<Enemy> | null) => {
		dispatch({
			type: actions.SET_ENEMY,
			payload: updates,
		});
	};

	const setTraps = (updates: Trap[] | undefined) => {
		dispatch({ type: actions.SET_TRAPS, payload: updates });
	};

	const removeObject = (object: Trap | Chest) => {
		if (!state.dungeon) return;

		const tile = new MapTile(state.dungeon.tiles[object.y][object.x]);
		if (!tile) return;

		tile.object = null;

		dispatch({ type: actions.SET_TILE, payload: tile });

		setDungeonUpdated(true);
	};

	const setChests = (updates: Chest[] | undefined) => {
		dispatch({ type: actions.SET_CHESTS, payload: updates });
	};

	const setDroppedItems = (updates: DroppedItem[]) => {
		dispatch({ type: actions.SET_DROPPEDITEMS, payload: updates });
	};

	const addDroppedItem = (updates: DroppedItem) => {
		dispatch({ type: actions.ADDDROPPEDITEM, payload: updates });
	};

	const delDroppedItem = (updates: DroppedItem) => {
		dispatch({ type: actions.DELDROPPEDITEM, payload: updates });
	};
	//#endregion

	const getObjectsPosition = (
		map: MapTile[][],
		objectType: string,
	): { x: number; y: number }[] => {
		const positions: { x: number; y: number }[] = [];
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				if (map[y][x].object === objectType) {
					positions.push({
						x,
						y,
					});
					break;
				}
			}
		}
		return positions;
	};

	const createDungeon = async () => {
		if (!authState.isAuthenticated || !authState.token) return;

		const getRandomSize = (min: number, max: number): number => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		isLoading(true);

		const level = (state.dungeons?.length ?? 0) + 1;
		const width = getRandomSize(10, 30);
		const height = getRandomSize(10, 30);

		if (!state.dungeons?.find((d) => d.level === level)) {
			//Create dungeon
			const newDungeonData = await newDungeon(width, height, level);

			//Load new dungeon
			if (newDungeonData) {
				setDungeonsUpdated(true);
			}
		}

		isLoading(false);
	};

	const previousDungeon = () => {
		if (
			!state.dungeon ||
			state.dungeon.level === 1 ||
			!state.dungeons ||
			state.dungeons.length <= 1
		)
			return;

		const dungeon = state.dungeons?.find(
			(d) => d.level === state.dungeon.level - 1,
		);

		if (!dungeon) return;

		fetchDungeon(dungeon._id);
	};

	const nextDungeon = () => {
		if (dungeonCreating) return;
		if (!state.dungeon || !state.dungeons || state.dungeons.length === 0)
			return;

		//New dungeon
		if (state.dungeons.every((d) => d.level <= state.dungeon.level)) {
			setDungeonCreating(true);
			createDungeon();
		}

		//next dungeon
		const dungeon = state.dungeons?.find(
			(d) => d.level === state.dungeon.level + 1,
		);

		if (!dungeon) return;

		fetchDungeon(dungeon._id);
	};

	const LoadDungeonData = useCallback(() => {
		if (!state.dungeon) return;

		//Enemies
		const enemyList = state.dungeon?.enemies.map((e) => {
			const enemy = new Enemy(e.enemy);
			enemy.status = e.status;
			return enemy;
		});
		if (enemyList && enemyList.length > 0) {
			EnemyGenerator(state.dungeon.tiles, enemyList);

			setEnemies(enemyList);
		}

		//Traps
		const traps = getObjectsPosition(state.dungeon.tiles, "trap");
		setTraps(traps);

		//Chests
		const chests = getObjectsPosition(state.dungeon.tiles, "chest");
		setChests(chests);

		setDungeonCreating(false);
	}, [state.dungeon]);

	useEffect(() => {
		if (!dungeonUpdated || !state.dungeon) return;

		updateDungeon(state.dungeon);

		LoadDungeonData();

		setDungeonUpdated(false);
	}, [dungeonUpdated, LoadDungeonData, state.dungeon]);

	useEffect(() => {
		if (!state.dungeon) return;

		//Player
		const entrancePos = getObjectsPosition(state.dungeon.tiles, "entrance");

		if (selectedCharacter && entrancePos.length > 0) {
			const entranceX = entrancePos[0].x;
			const entranceY = entrancePos[0].y;
			let playerPos = { x: entrancePos[0].x, y: entrancePos[0].y };

			if (state.dungeon.tiles[entranceY][entranceX + 1]?.passable)
				playerPos = { x: entranceX + 1, y: entranceY };
			else if (state.dungeon.tiles[entranceY + 1][entranceX]?.passable)
				playerPos = { x: entranceX, y: entranceY + 1 };
			else if (state.dungeon.tiles[entranceY][entranceX - 1]?.passable)
				playerPos = { x: entranceX - 1, y: entranceY };
			else if (state.dungeon.tiles[entranceY - 1][entranceX]?.passable)
				playerPos = { x: entranceX, y: entranceY - 1 };

			moveCharacter(
				playerPos.x * TILE_SIZE + TILE_SIZE / 2,
				playerPos.y * TILE_SIZE + TILE_SIZE / 2,
				selectedCharacter.facing,
			);
		}

		LoadDungeonData();
	}, [LoadDungeonData, moveCharacter, selectedCharacter, state.dungeon]);

	const fetchDungeon = useCallback(async (dungeonId: string) => {
		const dungeon = await getDungeon(dungeonId);
		if (dungeon) {
			setDungeon(dungeon);
		}
	}, []);

	useEffect(() => {
		if (state.dungeons && state.dungeons.length > 0) {
			const lastDungeon = state.dungeons[state.dungeons.length - 1];
			fetchDungeon(lastDungeon._id);
		}
	}, [state.dungeons, fetchDungeon]);

	useEffect(() => {
		const fetchData = async () => {
			if (!authState.isAuthenticated || !authState.token) return;

			//Fetch and load dungeons data
			const dungeonsData = await getDungeons();
			if (dungeonsData.dungeons) {
				setDungeons(dungeonsData.dungeons);
			}
		};

		fetchData();
	}, [authState.isAuthenticated, authState.token, dungeonsUpdated]);

	return (
		<DungeonContext.Provider
			value={{
				state,
				isLoading,
				setTileset,
				setEnemies,
				newEnemy,
				delEnemy,
				setEnemy,
				setTraps,
				removeObject,
				setChests,
				createDungeon,
				getObjectsPosition,
				setDroppedItems,
				addDroppedItem,
				delDroppedItem,
				previousDungeon,
				nextDungeon,
			}}
		>
			{children}
		</DungeonContext.Provider>
	);
}

export { DungeonContext };
