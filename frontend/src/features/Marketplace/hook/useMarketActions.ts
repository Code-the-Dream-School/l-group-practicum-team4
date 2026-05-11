import {useMarket} from "../contexts/useMarket";
import toast from "react-hot-toast";
import type { Item } from "../../../shared/models/models"

export const useMarketActions = () => {
  const {state, dispatch} = useMarket();

  const setTab = (tab: "buy" | "sell") => {
    dispatch({
      type: "SET_TAB",
      payload: tab,
    })
  }

  const buyItem = (item: Item) => {
    if (state.gold < item.coinCost) {
      toast.error("Not enough gold!");
      return;
    }
    dispatch({
      type: "BUY_ITEM",
      payload: item,
    })
    toast.success(`Bought ${item.name}`);
  }

  const sellItem = (item: Item) => {
    dispatch({
      type: "SELL_ITEM",
      payload: item,
    })
  toast.success(`Sold ${item.name}`);
  }
  
  return { buyItem, sellItem, setTab };
}