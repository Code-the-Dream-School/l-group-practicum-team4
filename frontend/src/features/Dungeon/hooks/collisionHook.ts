import { gameEvents } from "../../../shared/services/gameEvents";
import { type State } from "../reducer/dungeonReducer";

export const useCollision = (dungeonState: State) => {
	const CheckCollisions = (newX: number, newY: number, tileSize: number) => {
		const tileX = Math.floor(newX / tileSize);
		const tileY = Math.floor(newY / tileSize);

		//Check for enemies
		if (dungeonState.enemies) {
			const enemy = dungeonState.enemies.find(
				(enemy) => enemy.x == tileX && enemy.y == tileY,
			);
			if (enemy) {
				gameEvents.emit("ObjectActivated", enemy, "Enemy");
				return true;
			}
		}

		//Check for traps
		if (dungeonState.traps) {
			const trap = dungeonState.traps.find(
				(trap) => trap.x == tileX && trap.y == tileY,
			);
			if (trap) {
				gameEvents.emit("ObjectActivated", trap, "Trap");
				return true;
			}
		}

		//Check for chests
		if (dungeonState.chests) {
			const chest = dungeonState.chests.find(
				(chest) => chest.x == tileX && chest.y == tileY,
			);
			if (chest) {
				gameEvents.emit("ObjectActivated", chest, "Chest");
				return true;
			}
		}

		//Check for droppedItems
		if (dungeonState.droppedItems) {
			const item = dungeonState.droppedItems.find(
				(i) => i.x == tileX && i.y == tileY,
			);
			if (item) {
				gameEvents.emit("ObjectActivated", item, "DroppedItem");
			}
		}

		return false;
	};

	return { CheckCollisions };
};
