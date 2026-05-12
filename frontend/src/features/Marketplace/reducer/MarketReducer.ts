import {Player} from "../../../shared/models/models"
import type { Item } from "../../../shared/models/models"


export type MarketState = {
  marketItems: Item[]
  player: Player,
  gold: number,
  activeTab: "buy" | "sell",
  selectedItem: Item | null,
}

export type Action =
  | { type: "SET_TAB"; payload: "buy" | "sell" }
  | { type: "BUY_ITEM"; payload: Item }
  | { type: "SELL_ITEM"; payload: Item }
  | { type: "SELECT_ITEM"; payload: Item | null }
  | { type: "SET_ITEMS"; payload: Item[]}


export const marketReducer = (state: MarketState, action: Action): MarketState => {
  switch(action.type){
    case'SET_TAB':
    return {...state, activeTab: action.payload};

    case'SET_ITEMS':
    return {...state, marketItems: action.payload};

    case'BUY_ITEM':{
      if (state.gold < action.payload.coinCost){
        return state;
    }
    
    return {
      ...state,
      gold: state.gold -  action.payload.coinCost,

      //  marketItems: state.marketItems.filter( // remove bought item from the market? 
      //   (item) => item.id !== action.payload.id
      // ),

      player: new Player({
        ...state.player,
        inventory: [...state.player.inventory, action.payload],
      })
    };
  }

  case'SELL_ITEM': {

    const item = action.payload;

    const updatedGear = { ...state.player.gear };

    // remove item from gear (if equipped)
    for (const key in updatedGear) {
      const slot = key as keyof typeof updatedGear;

      if (updatedGear[slot]?.inventoryId === item.inventoryId){
        delete updatedGear[slot];
      }
    }

    return {
      ...state,
      gold: state.gold + item.coinCost,    
      selectedItem: null,

      player: new Player({
        ...state.player,
        inventory: state.player.inventory.filter(
          (i) => i.id !== item.id
          // (i) => i.inventoryId !== item.inventoryId
        ),
        gear: updatedGear,
      }),
    };
  }
  
    case'SELECT_ITEM':
    return {
      ...state,
      selectedItem: action.payload,
    }; 
    default:
      return state;
  }

}