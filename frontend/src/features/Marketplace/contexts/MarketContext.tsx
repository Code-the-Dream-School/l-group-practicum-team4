import { useEffect } from "react";
import { createContext, useReducer, ReactNode, Dispatch } from "react";
import { initialState, marketReducer } from "../reducer/MarketReducer";
import type { MarketState } from "../reducer/MarketReducer";
import type { Action } from "../reducer/MarketReducer";
import { getItems } from "../api/itemsApi";
import { useAuth } from "../../auth/context/useAuth";

type MarketContextType = {
	state: MarketState;
	dispatch: Dispatch<Action>;
};

export const MarketContext = createContext<MarketContextType | null>(null);

export const MarketProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(marketReducer, initialState);

	const { state: authState } = useAuth();

	useEffect(() => {
		const loadItems = async () => {
			try {
				if (!authState.isAuthenticated || !authState.token) return;

				const items = await getItems();
				dispatch({
					type: "SET_ITEMS",
					payload: items,
				});
			} catch (error) {
				console.error("Failed to load items", error);
			}
		};
		loadItems();
	}, [authState.isAuthenticated, authState.token, dispatch]);

	return (
		<MarketContext.Provider value={{ state, dispatch }}>
			{children}
		</MarketContext.Provider>
	);
};
