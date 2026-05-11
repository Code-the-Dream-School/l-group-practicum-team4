import { useEffect } from "react";
import styles from "./MarketPanel.module.css";
import {useMarket} from "../contexts/useMarket";
import MarketItems from "./MarketItems";
import tilesetImg from "../../../assets/dungeontileset.png";
import { getItems } from "../api/itemsApi";
import {useMarketActions } from "../hook/useMarketActions"


const tileset = new Image();
tileset.src = tilesetImg;

const MarketPanel = () => {

  const {state, dispatch} = useMarket();
  const { sellItem, buyItem, setTab} = useMarketActions()

  useEffect(()=>{
    const loadItems = async() => {
      try {
        const items = await getItems();
        dispatch ({
          type:'SET_ITEMS',
          payload: items,
        })
      } catch (error) {
        console.error('Failed to load items', error);
      }
    }
    loadItems()
  }, [dispatch])

  const sellItems = [
    ...state.player.inventory,
    ...Object.values(state.player.gear).filter(Boolean), // (item): item is Item => item !== undefined && item !== null
  ];

  const items =
    state.activeTab === "buy"
      ? state.marketItems
      : sellItems;

  return (
    <div className={styles.marketPanel}>
      <div className={styles.marketHeader}> 
        MARKET
      </div>
      <div className={styles.marketTabs}>
        <button
          className={`${styles.tab} ${state.activeTab === "buy" ? styles.active : ""}`}
          onClick={() => setTab("buy")}
        > Buy </button> 
    
        <button
          className={`${styles.tab} ${state.activeTab === "sell" ? styles.active : ""}`}
          onClick={() => setTab("sell")}
        > Sell </button> 
      </div>
    
      <MarketItems 
        tileset={tileset}
        items = {items}
        onBuy ={ buyItem}
        onSell = {sellItem}
        mode = {state.activeTab}
      />

      <div className={styles.marketGold}> Gold: {state.gold} </div>
    </div>
  );
};

export default MarketPanel