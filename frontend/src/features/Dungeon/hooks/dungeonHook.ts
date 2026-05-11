import toast from "react-hot-toast";
import { useDungeonContext } from "../contexts/useDungeonContext";
import { MapDraw, PlayerDraw, EnemyDraw } from "../services/drawService";
import type {
	Player,
	Item,
	CharacterGear,
} from "../../../shared/models/models";

export const useDungeon = () => {
	const { state, setTileset, setPlayer, setEnemy, setEnemies } =
		useDungeonContext();

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

	return {
		state,
		setTileset,
		setPlayer,
		setEnemy,
		setEnemies,
		MapDraw,
		PlayerDraw,
		EnemyDraw,
		EquipItem,
		UnequipItem,
		ConsumeItem,
	};
};
