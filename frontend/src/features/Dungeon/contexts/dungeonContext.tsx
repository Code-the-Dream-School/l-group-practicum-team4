import {
	createContext,
	useReducer,
	useEffect,
	useRef,
	type ReactNode,
} from "react";
import { reducer, initialStates, actions } from "../reducer/dungeonReducer";
import { getDungeon } from "../services/apiService";
import { EnemyGenerator } from "../services/drawService";
import type {
	Player,
	Enemy,
	MapTile,
	Trap,
	Chest,
	DroppedItem,
} from "../../../shared/models/models";
import { useAuth } from "../../auth/context/useAuth";

interface DungeonContextType {
	state: typeof initialStates;
	isLoading: (value: boolean) => void;
	setTileset: (tileset: HTMLImageElement) => void;
	setMap: (map: MapTile[][]) => void;
	setPlayer: (updates: Partial<Player> | null) => void;
	setEnemy: (updates: Partial<Enemy> | null) => void;
	setEnemies: (updates: Enemy[] | undefined) => void;
	getObjectsPosition: (
		map: MapTile[][],
		objectType: string,
	) => { x: number; y: number }[];
	setTraps: (updates: Trap[] | undefined) => void;
	setChests: (updates: Chest[] | undefined) => void;
	setDroppedItems: (updates: DroppedItem[]) => void;
	addDroppedItem: (updates: DroppedItem) => void;
	delDroppedItem: (updates: DroppedItem) => void;
}
const DungeonContext = createContext<DungeonContextType | undefined>(undefined);

export function DungeonProvider({ children }: { children: ReactNode }) {
	const { state: authState } = useAuth();

	const [state, dispatch] = useReducer(reducer, initialStates);

	const enemiesRef = useRef(state.enemies);

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

	const setMap = (map: MapTile[][]) => {
		dispatch({
			type: actions.SET_MAP,
			payload: map,
		});
	};

	const setPlayer = (updates: Partial<Player> | null) => {
		dispatch({
			type: actions.SET_PLAYER,
			payload: updates,
		});
	};

	const setEnemy = (updates: Partial<Enemy> | null) => {
		dispatch({
			type: actions.SET_ENEMY,
			payload: updates,
		});
	};

	const setEnemies = (updates: Enemy[] | undefined) => {
		dispatch({ type: actions.SET_ENEMIES, payload: updates });
	};

	const setTraps = (updates: Trap[] | undefined) => {
		dispatch({ type: actions.SET_TRAPS, payload: updates });
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

	useEffect(() => {
		const fetchData = async () => {
			if (!authState.token) return;

			if (!state.seed) return;

			isLoading(true);
			const TILE_SIZE = 32;

			const data = await getDungeon("6a07ace480aeb4e0c56763e0");
			const dungeon = data.dungeon;

			//Map
			setMap(dungeon.tiles);

			//Player
			const entrancePos = getObjectsPosition(dungeon.tiles, "entrance");
			if (entrancePos.length > 0) {
				setPlayer({
					x: entrancePos[0].x * TILE_SIZE + TILE_SIZE / 2,
					y: entrancePos[0].y * TILE_SIZE + TILE_SIZE / 2,
				});
			}

			//Enemies
			if (enemiesRef.current && enemiesRef.current.length > 0) {
				const placedEnemies = EnemyGenerator(
					dungeon.tiles,
					state.seed,
					enemiesRef.current,
				);
				placedEnemies.forEach((placedEnemy) => {
					enemiesRef.current?.map((enemy) => {
						if (enemy.id == placedEnemy.id) {
							enemy.x = placedEnemy.x;
							enemy.y = placedEnemy.y;
						}
					});
				});
				const newEnemies = enemiesRef.current?.filter(
					(item) => !(item.x == 0 && item.y == 0),
				);
				setEnemies(newEnemies);
			}

			//Traps
			const traps = getObjectsPosition(dungeon.tiles, "trap");
			if (traps.length > 0) setTraps(traps);

			//Chests
			const chests = getObjectsPosition(dungeon.tiles, "chest");
			if (chests.length > 0) setChests(chests);

			isLoading(false);
		};

		fetchData();
	}, [state.seed, enemiesRef, authState.token]);

	return (
		<DungeonContext.Provider
			value={{
				state,
				isLoading,
				setTileset,
				setMap,
				setPlayer,
				setEnemy,
				setEnemies,
				getObjectsPosition,
				setTraps,
				setChests,
				setDroppedItems,
				addDroppedItem,
				delDroppedItem,
			}}
		>
			{children}
		</DungeonContext.Provider>
	);
}

export { DungeonContext };
