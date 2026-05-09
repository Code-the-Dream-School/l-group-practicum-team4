import styles from "./MarketPanel.module.css";
import {useMarket} from "../contexts/useMarket";
import MarketItems from "./MarketItems";
 import tilesetImg from "../../../assets/dungeontileset.png";
// import type { Item } from "../../../shared/models/models"
import type { Item } from "../../../shared/models/item"

const tileset = new Image();
tileset.src = tilesetImg;

const MarketPanel = () => {

  const {state, dispatch} = useMarket();

  const items =
    state.activeTab === "buy"
      ? state.marketItems
      : state.player.inventory;

  const handleTab = (tab: "buy" | "sell") => {
    dispatch({
      type: "SET_TAB",
      payload: tab,
    })
  }

  const handleBuy = (item: Item) => {
    dispatch({
      type: "BUY_ITEM",
      payload: item,
    })
  }

  const handleSell = (item: Item) => {
    dispatch({
      type: "SELL_ITEM",
      payload: item,
    })
  }

console.log(state.marketItems);
console.log("activeTab:", state.activeTab);


  return (
    <div className={styles.marketPanel}>
      <div className={styles.marketHeader}> 
        MARKET
      </div>
      <div className={styles.marketTabs}>
        <button
          className={`${styles.tab} ${state.activeTab === "buy" ? styles.active : ""}`}
          onClick={() => handleTab("buy")}
        > Buy </button> 
    
        <button
          className={`${styles.tab} ${state.activeTab === "sell" ? styles.active : ""}`}
          onClick={() => handleTab("sell")}
        > Sell </button> 
      </div>
    
      <MarketItems 
        tileset={tileset}
        items = {items}
        onBuy ={ handleBuy}
        onSell = {handleSell}
        mode = {state.activeTab}
      />

      <div className={styles.marketGold}> Gold: {state.gold} </div>
    </div>
  );
};

export default MarketPanel