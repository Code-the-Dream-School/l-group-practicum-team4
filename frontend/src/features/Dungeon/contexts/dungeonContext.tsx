import { createContext, useReducer, useEffect, type ReactNode } from "react";
import { reducer, initialStates, actions } from "../reducer/dungeonReducer";
import { mapGenerator, EnemyGenerator } from "../services/drawService";
import type { Player, Enemy } from "../../../shared/models/models";

interface DungeonContextType {
	state: typeof initialStates;
	isLoading: (value: boolean) => void;
	setTileset: (tileset: HTMLImageElement) => void;
	setMap: (map: number[][]) => void;
	setPlayer: (updates: Partial<Player>) => void;
	setEnemy: (updates: Partial<Enemy> | null) => void;
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

	const setPlayer = (updates: Partial<Player>) => {
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

	useEffect(() => {
		const fetchData = async () => {
			if (!state.seed) return;

			isLoading(true);
			const TILE_SIZE = 32;

			const { map, playerX, playerY } = mapGenerator(state.seed, 50, 35);
			setMap(map);
			setPlayer({
				x: playerX * TILE_SIZE + TILE_SIZE / 2,
				y: playerY * TILE_SIZE + TILE_SIZE / 2,
			});

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

		fetchData();
	}, [state.seed, state.enemies]);

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
