import type { Item } from "../../../shared/models/models"


export type MarketState = {
  marketItems: Item[]
  activeTab: "buy" | "sell",
  selectedItem: Item | null,
}

export type Action =
  | { type: "SET_TAB"; payload: "buy" | "sell" }
  | { type: "SELECT_ITEM"; payload: Item | null }
  | { type: "SET_ITEMS"; payload: Item[]}

export const initialState: MarketState = {
  marketItems: [],
  activeTab: "buy",
  selectedItem: null,
};

export const marketReducer = ( state: MarketState, action: Action): MarketState => {
  switch (action.type) {
    case "SET_TAB":
      return {
        ...state,
        activeTab: action.payload,
      };

    case "SET_ITEMS":
      return {
        ...state,
        marketItems: action.payload,
      };

    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem: action.payload,
      };
  
    default:
      return state;
  }
};

