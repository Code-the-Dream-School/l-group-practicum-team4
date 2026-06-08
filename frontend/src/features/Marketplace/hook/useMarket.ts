import { useContext } from "react";
import { MarketContext } from "../contexts/MarketContext";

export const useMarket = () => {
  const context = useContext(MarketContext)
  
  if (!context) {
    throw new Error('useMarket must be used within MarketProvider')
  }
 return context
}