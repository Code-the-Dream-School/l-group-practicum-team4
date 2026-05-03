import { useDungeonContext } from "../contexts/useDungeonContext";
import { MapDraw, PlayerDraw, EnemyDraw } from "../services/drawService";

export const useDungeon = () => {
	const { state, setTileset, setPlayer, setEnemy } = useDungeonContext();
	return {
		state,
		setTileset,
		setPlayer,
		setEnemy,
		MapDraw,
		PlayerDraw,
		EnemyDraw,
	};
};
