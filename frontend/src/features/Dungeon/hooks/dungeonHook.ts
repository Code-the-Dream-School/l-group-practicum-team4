import toast from "react-hot-toast";
import { useDungeonContext } from "../contexts/useDungeonContext";
import {
	MapDraw,
	PlayerDraw,
	EnemyDraw,
	ObjectsDraw,
	DrawExplosions,
} from "../services/drawService";
import type { Player, Item, Trap, Chest } from "../../../shared/models/models";
import { DroppedItem } from "../../../shared/models/models";
import { useMarket } from "../../Marketplace/hook/useMarket";

import { useCharacter } from "../../Home/hook/useCharacter";

export const useDungeon = () => {
	const {
		state,
		setTileset,
		setEnemy,
		newEnemy,
		delEnemy,
		setEnemies,
		createDungeon,
		getObjectsPosition,
		removeObject,
		addDroppedItem,
		delDroppedItem,
		previousDungeon,
		nextDungeon,
	} = useDungeonContext();

	const {
		selectedCharacter,
		equipItem,
		unEquipItem,
		setCharacterUpdated,
		updateCharacter,
	} = useCharacter();

	const { state: marketState } = useMarket();

	const EquipItem = async (item: Item) => {
		try {
			if (!selectedCharacter) return;

			const data = await equipItem(selectedCharacter.id, item);

			if (!data) throw new Error("Failed to equip item");

			setCharacterUpdated(true);

			toast.success(`${item.name} was equiped.`, {
				toasterId: "main",
			});
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "Unexpected error.";

			toast.error(errorMessage, {
				toasterId: "main",
			});
			console.error(e);
		}
	};

	const UnequipItem = async (item: Item) => {
		try {
			if (!selectedCharacter) return;

			const data = await unEquipItem(selectedCharacter.id, item);

			if (!data) throw new Error("Failed to unequip item");

			setCharacterUpdated(true);

			toast.success(`${item.name} was unequiped.`, {
				toasterId: "main",
			});
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "Unexpected error";

			toast.error(errorMessage, {
				toasterId: "main",
			});
			console.error(e);
		}
	};

	const ConsumeItem = async (item: Item) => {
		try {
			if (!selectedCharacter) return;

			if (
				!["health", "attack", "defense", "speed"].includes(
					item.stat.toLowerCase(),
				)
			) {
				toast.error(`"${item.stat}" stat is not consumable.`, {
					toasterId: "main",
				});
				return;
			}

			const itemIndex = selectedCharacter.inventory.findIndex(
				(i) => i.id == item.id,
			);
			const newInventory = selectedCharacter.inventory.filter(
				(_, index) => index !== itemIndex,
			);
			// const newInventory = selectedCharacter.inventory.filter(
			// 	(invItem) => invItem.id !== item.id,
			// );

			const playerUpdates: Partial<Player> = { inventory: newInventory };

			if (item.stat.toLowerCase() === "health") {
				playerUpdates.health = selectedCharacter.health + item.value;
			}

			await updateCharacter(selectedCharacter.id, playerUpdates);
			setCharacterUpdated(true);

			if (
				["attack", "defense", "speed"].includes(item.stat.toLowerCase())
			) {
				selectedCharacter.applyTemporaryBonus(
					item.stat,
					item.value,
					120000,
				);
			}

			toast.success(
				`¡${item.name} consumido! (+${item.value} ${item.stat})`,
				{
					toasterId: "main",
				},
			);
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "Unexpected error";

			toast.error(errorMessage, {
				toasterId: "main",
			});
			console.error(e);
		}
	};

	const ActivateTrap = (trap: Trap) => {
		try {
			if (!trap || !selectedCharacter) return;

			//Damage
			const newHealth = selectedCharacter.health - 20;
			updateCharacter(selectedCharacter.id, { health: newHealth });

			//Remove trap
			removeObject(trap);

			toast.error(`You have triggered a trap, taking 20 damage!`, {
				toasterId: "main",
			});
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "Unexpected error";

			toast.error(errorMessage, {
				toasterId: "main",
			});
			console.error(e);
		}
	};

	const ActivateChest = async (chest: Chest) => {
		try {
			if (!chest) return;

			//Remove chest
			removeObject(chest);

			//drop a random item
			const item = marketState.marketItems?.length
				? marketState.marketItems[
						Math.floor(
							Math.random() * marketState.marketItems.length,
						)
					]
				: null;
			if (item) {
				const droppedItem = new DroppedItem({
					x: chest.x,
					y: chest.y,
					item: item,
				});
				addDroppedItem(droppedItem);
			}

			toast.success(`You have opened a chest!`, {
				toasterId: "main",
			});
		} catch (e) {
			const errorMessage =
				e instanceof Error ? e.message : "Unexpected error";

			toast.error(errorMessage, {
				toasterId: "main",
			});
			console.error(e);
		}
	};

	const DropItem = (x: number, y: number, item: Item) => {
		if (!item) return;

		const droppedItem = new DroppedItem({
			x: x,
			y: y,
			item: item,
		});
		addDroppedItem(droppedItem);
	};

	const PickUpDroppedItem = async (droppedItem: DroppedItem) => {
		const newItem = droppedItem.item;
		if (!newItem || !selectedCharacter) return;

		await updateCharacter(selectedCharacter.id, {
			inventory: [...(selectedCharacter.inventory ?? []), newItem],
		});
		setCharacterUpdated(true);

		delDroppedItem(droppedItem);
	};

	return {
		state,
		setTileset,
		setEnemy,
		newEnemy,
		delEnemy,
		setEnemies,
		createDungeon,
		MapDraw,
		PlayerDraw,
		EnemyDraw,
		getObjectsPosition,
		ObjectsDraw,
		EquipItem,
		UnequipItem,
		ConsumeItem,
		ActivateTrap,
		DrawExplosions,
		ActivateChest,
		DropItem,
		PickUpDroppedItem,
		previousDungeon,
		nextDungeon,
	};
};
