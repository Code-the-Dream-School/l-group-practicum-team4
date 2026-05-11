import { useContext } from "react";
import { MarketContext } from "./MarketContext";

export const useMarket = () => {
  const context = useContext(MarketContext)
  
  if (!context) {
    throw new Error('useMarket must be used within MarketProvider')
  }
 return context
}