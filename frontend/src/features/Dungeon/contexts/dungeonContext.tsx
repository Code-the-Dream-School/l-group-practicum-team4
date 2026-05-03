import { createContext, useReducer, useEffect, type ReactNode } from "react";
import { reducer, initialStates, actions } from "../reducer/dungeonReducer";
import { mapGenerator, EnemyGenerator } from "../services/drawService";
import type { CharacterGear } from "../services/drawService";
import type { Enemy } from "../../../shared/models/models";

interface DungeonContextType {
	state: typeof initialStates;
	isLoading: (value: boolean) => void;
	setTileset: (tileset: HTMLImageElement) => void;
	setMap: (map: number[][]) => void;
	setPlayer: (
		x: number,
		y: number,
		facing: string,
		gear?: Partial<CharacterGear>,
	) => void;
	setEnemy: (enemy: Enemy) => void;
}
const DungeonContext = createContext<DungeonContextType | undefined>(undefined);

export function DungeonProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialStates);

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

	const setMap = (map: number[][]) => {
		dispatch({
			type: actions.SET_MAP,
			payload: map,
		});
	};

	const setPlayer = (
		x: number,
		y: number,
		facing: string = "Right",
		gear?: Partial<CharacterGear>,
	) => {
		dispatch({
			type: actions.SET_PLAYER,
			payload: { x, y, facing, gear: gear ?? {} },
		});
	};

	const setEnemy = (enemy?: Enemy) => {
		dispatch({
			type: actions.SET_ENEMY,
			payload: enemy || null,
		});
	};

	const fetchData = async () => {
		if (!state.seed) return;

		isLoading(true);
		const TILE_SIZE = 32;

		const { map, playerX, playerY } = mapGenerator(state.seed, 50, 35);
		setMap(map);
		setPlayer(
			playerX * TILE_SIZE + TILE_SIZE / 2,
			playerY * TILE_SIZE + TILE_SIZE / 2,
		);

		if (state.enemies && state.enemies.length > 0) {
			const placedEnemies = EnemyGenerator(
				map,
				state.seed,
				state.enemies,
			);
			placedEnemies.forEach((placedEnemy) => {
				state.enemies?.map((enemy) => {
					if (enemy.name == placedEnemy.name) {
						enemy.x = placedEnemy.x;
						enemy.y = placedEnemy.y;
					}
				});
			});
		}

		isLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [state.seed]);

	return (
		<DungeonContext.Provider
			value={{
				state,
				isLoading,
				setTileset,
				setMap,
				setPlayer,
				setEnemy,
			}}
		>
			{children}
		</DungeonContext.Provider>
	);
}

export { DungeonContext };
