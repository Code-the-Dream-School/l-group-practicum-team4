import { createContext, useReducer, ReactNode , Dispatch} from 'react';
import { marketReducer } from "../reducer/MarketReducer"
import type { MarketState} from "../reducer/MarketReducer"
import type { Action } from "../reducer/MarketReducer"
import { Player } from "../../../shared/models/models"
import { items } from "../components/items"

const initialState: MarketState = {
  marketItems: items,

	player: new Player({
		name: "Player",
		health: 100,
		attack: 20,
		defense: 10,
		speed: 5,
		inventory: [
			{
				inventoryId: crypto.randomUUID(),
				id: 1,
				name: "Dagger",
				description: "Dagger",
				type: "weapon",
				stat: "attack",
				value: 1,
				coinCost: 50,
			},
			{
				inventoryId: crypto.randomUUID(),
				id: 2,
				name: "Sword",
				description: "Sword",
				type: "weapon",
				stat: "attack",
				value: 2,
				coinCost: 100,
			},
			{
				inventoryId: crypto.randomUUID(),
				id: 3,
				name: "Wooden Shield",
				description: "Wooden Shield",
				type: "shield",
				stat: "defense",
				value: 5,
				coinCost: 50,
			},
			{
				inventoryId: crypto.randomUUID(),
				id: 8,
				name: "Blue Potion",
				description: "Blue Potion",
				type: "potion",
				stat: "defense",
				value: 20,
				coinCost: 30,
			},
		],
		gear: {
			helmet: {
				inventoryId: crypto.randomUUID(),
				id: 4,
				name: "Plate Helmet",
				description: "Plate Helmet",
				type: "helmet",
				stat: "defense",
				value: 5,
				coinCost: 80,
			},
			armor: {
				inventoryId: crypto.randomUUID(),
				id: 5,
				name: "Plate Armor",
				description: "Plate Armor",
				type: "armor",
				stat: "defense",
				value: 5,
				coinCost: 100,
			},
			weapon: {
				inventoryId: crypto.randomUUID(),
				id: 6,
				name: "BroadSword",
				description: "BroadSword",
				type: "weapon",
				stat: "attack",
				value: 5,
				coinCost: 80,
			},
			shield: {
				inventoryId: crypto.randomUUID(),
				id: 7,
				name: "Plate Shield",
				description: "Plate Shield",
				type: "shield",
				stat: "defense",
				value: 10,
				coinCost: 100,
			},
		},
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