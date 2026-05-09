import { createContext, useReducer, ReactNode , Dispatch} from 'react';
import { marketReducer } from "../reducer/MarketReducer"
import type { MarketState} from "../reducer/MarketReducer"
import type { Action } from "../reducer/MarketReducer"
import { Player } from "../../../shared/models/models"
// import type { Item } from "../../../shared/models/models"
// import type { Item } from "../../../shared/models/item"
import { items } from "../pages/items"

const initialState: MarketState = {
  marketItems: items,
  player: new Player({
		name: "Player",
		health: 100,
		attack: 20,
		defense: 10,
		speed: 5,
		inventory: [],
    gear: {},
 }),
  gold: 100,
  activeTab: "buy",
  selectedItem: null,

}

type MarketContextType = {
	state: MarketState;
	dispatch: Dispatch <Action>;
};


export const MarketContext = createContext<MarketContextType | null> (null)

export const MarketProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(marketReducer, initialState);

return (
  <MarketContext.Provider value={{ state, dispatch }}>
    {children}
  </MarketContext.Provider>
  );
}