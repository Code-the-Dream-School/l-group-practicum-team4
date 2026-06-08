import toast from "react-hot-toast";
import { useDungeonContext } from "../contexts/useDungeonContext";
import {
	MapDraw,
	PlayerDraw,
	EnemyDraw,
	ObjectsDraw,
	DrawExplosions,
} from "../services/drawService";
import type {
	Player,
	Item,
	CharacterGear,
	Trap,
	Chest,
} from "../../../shared/models/models";
import { Enemy, DroppedItem } from "../../../shared/models/models";
import { useMarket } from "../../Marketplace/contexts/useMarket";

export const useDungeon = () => {
	const {
		state,
		setTileset,
		setPlayer,
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

	const { state: marketState } = useMarket();

	const EquipItem = async (item: Item) => {
		try {
			//POST call to API through dungeonService

			const newGear: CharacterGear = { ...state.player.gear };
			let newInventory = [...state.player.inventory];

			//Assign the item to the corresponding slot
			switch (item.type.toLowerCase()) {
				case "helmet":
					if (newGear.helmet) newInventory.push(newGear.helmet);
					newGear.helmet = item;
					break;
				case "armor":
					if (newGear.armor) newInventory.push(newGear.armor);
					newGear.armor = item;
					break;
				case "shield":
					if (newGear.shield) newInventory.push(newGear.shield);
					newGear.shield = item;
					break;
				case "weapon":
					if (newGear.weapon) newInventory.push(newGear.weapon);
					newGear.weapon = item;
					break;
				default:
					toast.error("Item type no equipable.", {
						toasterId: "main",
					});
					return;
			}

			//Removing item from inventory
			newInventory = newInventory.filter(
				(invItem) => invItem.id !== item.id,
			);

			//Update Player
			setPlayer({
				gear: newGear,
				inventory: newInventory,
			});

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
			//POST call to API through dungeonService

			const newGear: CharacterGear = { ...state.player.gear };
			switch (item.type.toLowerCase()) {
				case "helmet":
					newGear.helmet = undefined;
					break;
				case "armor":
					newGear.armor = undefined;
					break;
				case "shield":
					newGear.shield = undefined;
					break;
				case "weapon":
					newGear.weapon = undefined;
					break;
				default:
					toast.error("Unrecognized item type.", {
						toasterId: "main",
					});
					return;
			}

			//Adding item to inventory
			setPlayer({
				gear: newGear,
				inventory: [...state.player.inventory, item],
			});

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
			//POST call to API through dungeonService

			const newInventory = state.player.inventory.filter(
				(invItem) => invItem.id !== item.id,
			);

			const playerUpdates: Partial<Player> = {};

			if (item.stat.toLowerCase() === "health") {
				playerUpdates.health = state.player.health + item.value;
			} else if (
				["attack", "defense", "speed"].includes(item.stat.toLowerCase())
			) {
				state.player.applyTemporaryBonus(item.stat, item.value, 120000);
			} else {
				toast.error(`"${item.stat}" stat is not consumable.`, {
					toasterId: "main",
				});
				return;
			}

			setPlayer({
				...playerUpdates,
				inventory: newInventory,
			});

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
			if (!trap) return;

			//Damage
			const newHealth = state.player.health - 20;
			setPlayer({ health: newHealth });

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

			if (Math.random() < 0) {
				//Activate Mimic
				const mimic = new Enemy({
					id: 21,
					x: chest.x,
					y: chest.y,
					name: "Mimic",
					facing: "Right",
					health: 50,
					attack: 30,
					defense: 20,
					speed: 8,
					gear: {},
					inventory: [
						{
							id: "6a02429037f12861fcf56ab8",
							name: "Helpful Mimic blood",
							description: "Health potion.",
							type: "potion",
							stat: "health",
							value: 20,
							coinCost: 20,
							inventoryId: "",
						},
					],
				});
				// setEnemies([...(state.enemies ?? []), mimic]);
				newEnemy(mimic);

				toast.error(`You have found a mimic!`, {
					toasterId: "main",
				});
				return;
			} else {
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
			}
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
		if (!newItem) return;

		setPlayer({
			inventory: [...(state.player?.inventory ?? []), newItem],
		});

		delDroppedItem(droppedItem);
	};

	return {
		state,
		setTileset,
		setPlayer,
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
