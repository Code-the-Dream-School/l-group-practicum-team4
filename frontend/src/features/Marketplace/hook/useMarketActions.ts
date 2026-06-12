import { useMarket } from "./useMarket";
import { useCharacter } from "../../Home/hook/useCharacter";
import type { Item } from "../../../shared/models/models";
import { buySellItem, getItems } from "../api/itemsApi";

export const useMarketActions = () => {
	const { dispatch } = useMarket();
	const { selectedCharacter, selectCharacter, setCharacterUpdated } =
		useCharacter();

	const setTab = (tab: "buy" | "sell") => {
		dispatch({
			type: "SET_TAB",
			payload: tab,
		});
	};

	const getCharId = () => selectedCharacter?._id ?? selectedCharacter?.id;

	const getItemId = (item: Item) => item._id ?? (item as any).id;

	const buyItem = async (item: Item) => {
		try {
			const charId = getCharId();

			if (!charId) {
				console.error("Missing character ID", selectedCharacter);
				return;
			}

			if (!item) {
				console.error("Missing item", item);
				return;
			}

			//   if (selectedCharacter.coins < item.coinCost) {
			//     console.warn("Not enough coins");
			//     return;
			//  }

			const updatedChar = await buySellItem(
				charId,
				getItemId(item),
				true,
			);

			//selectCharacter(updatedChar);
			setCharacterUpdated(true);

			const items = await getItems();
			dispatch({ type: "SET_ITEMS", payload: items });
		} catch (error) {
			console.error("Buy failed:", error);
		}
	};

	const sellItem = async (item: Item) => {
		try {
			const charId = getCharId();

			if (!charId) {
				console.error("Missing character ID", selectedCharacter);
				return;
			}

			if (!item) {
				console.error("Missing item", item);
				return;
			}

			const updatedChar = await buySellItem(
				charId,
				getItemId(item),
				false,
			);

			//selectCharacter(updatedChar);
			setCharacterUpdated(true);
		} catch (err) {
			console.error("Sell failed:", err);
		}
	};

	return {
		buyItem,
		sellItem,
		setTab,
	};
};
