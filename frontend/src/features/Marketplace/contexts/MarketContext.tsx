import { createContext, useReducer, ReactNode , Dispatch} from 'react';
import { initialState, marketReducer } from "../reducer/MarketReducer"
import type { MarketState} from "../reducer/MarketReducer"
import type { Action } from "../reducer/MarketReducer"


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