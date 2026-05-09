import {Player} from "../../../shared/models/models"
// import type { Item } from "../../../shared/models/models"
import type { Item } from "../../../shared/models/item"
import { items } from "../pages/items"

export type MarketState = {
  marketItems: Item[]
  player: Player,
  gold: number,
  activeTab: "buy" | "sell",
  selectedItem: Item | null,
}


// export const initialMarketState: MarketState = {
//   marketItems: items,   
//   player: new Player({
//     name: "Player",
//     health: 100,
//     attack: 10,
//     defense: 10,
//     speed: 10,
//     inventory: [],
//   }),
//   gold: 200,
//   activeTab: "buy",
//   selectedItem: null,
// };

export type Action =
  | { type: "SET_TAB"; payload: "buy" | "sell" }
  | { type: "BUY_ITEM"; payload: Item }
  | { type: "SELL_ITEM"; payload: Item }
  | { type: "SELECT_ITEM"; payload: Item | null };


export const marketReducer = (state: MarketState, action: Action): MarketState => {
  switch(action.type){
    case'SET_TAB':
    return {...state, activeTab: action.payload};

    case'BUY_ITEM':{
      if (state.gold < action.payload.value){
      return state;
    }
    
    return {
      ...state,
      gold: state.gold -  action.payload.value,
      player: new Player({
        ...state.player,
        inventory: [...state.player.inventory, action.payload],
        // timeBonuses: state.player.timeBonuses,
    })
  }
  };
  
    case'SELL_ITEM':
    return {
      ...state,
      gold: state.gold + action.payload.value,
      
      player: new Player({
        ...state.player,
        inventory: state.player.inventory.filter((i) => i.id !== action.payload.id),
        // timeBonuses: state.player.timeBonuses,
      })
    };

    case'SELECT_ITEM':
    return {
      ...state,
      selectedItem: action.payload,
    }; 
    default:
      return state;
  }
}