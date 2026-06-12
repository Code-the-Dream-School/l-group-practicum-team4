import { useState } from "react";
import { Entrance, Exit } from "../../../shared/models/models";
import { gameEvents } from "../../../shared/services/gameEvents";
import { type State } from "../reducer/dungeonReducer";

export const useCollision = (dungeonState: State) => {
	const [colissionTile, setCollisionTile] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });

	const CheckCollisions = (newX: number, newY: number, tileSize: number) => {
		const tileX = Math.floor(newX / tileSize);
		const tileY = Math.floor(newY / tileSize);

		if (
			colissionTile &&
			colissionTile.x == tileX &&
			colissionTile.y == tileY
		)
			return true;

		//Check for enemies
		if (dungeonState.enemies) {
			const enemy = dungeonState.enemies.find(
				(enemy) =>
					enemy.x == tileX &&
					enemy.y == tileY &&
					enemy.status == "active",
			);
			if (enemy) {
				setCollisionTile({ x: tileX, y: tileY });
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
				setCollisionTile({ x: tileX, y: tileY });
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
				setCollisionTile({ x: tileX, y: tileY });
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
				setCollisionTile({ x: tileX, y: tileY });
				gameEvents.emit("ObjectActivated", item, "DroppedItem");
				return true;
			}
		}

		//Check for entrance
		if (dungeonState.dungeon) {
			if (
				dungeonState.dungeon.tiles[tileY][tileX].object === "entrance"
			) {
				const entrance: Entrance = { x: tileX, y: tileY };
				setCollisionTile({ x: tileX, y: tileY });
				gameEvents.emit("ObjectActivated", entrance, "Entrance");
				return true;
			}
		}

		//Check for exit
		if (dungeonState.dungeon) {
			if (dungeonState.dungeon.tiles[tileY][tileX].object === "exit") {
				const exit: Exit = { x: tileX, y: tileY };
				setCollisionTile({ x: tileX, y: tileY });
				gameEvents.emit("ObjectActivated", exit, "Exit");
				return true;
			}
		}

		setCollisionTile({ x: 0, y: 0 });
		return false;
	};

	return { CheckCollisions };
};
