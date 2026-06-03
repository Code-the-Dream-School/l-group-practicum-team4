import { useEffect } from "react";
import styles from "./NewMarketPanel.module.css";
import {useMarket} from "../contexts/useMarket";
import MarketItems from "./MarketItems";
import tilesetImg from "../../../assets/dungeontileset.png";
import { getItems } from "../api/itemsApi";
import {useMarketActions } from "../hook/useMarketActions"


const tileset = new Image();
tileset.src = tilesetImg;

const MarketPanel = () => {

  const {state, dispatch} = useMarket();
  const { sellItem, buyItem} = useMarketActions()

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


  return (
    <div className={styles.marketPanel}>
      <div className={styles.marketHeader}> MARKET </div>
      <div className={styles.marketContent}>
        <div className={styles.marketSection}>
          <h2 className={`${styles.sectionTitle} ${styles.buy}`}>Buy</h2>
          <MarketItems
            tileset={tileset}
            items={state.marketItems}
            onBuy={buyItem}
            mode="buy"
            className={styles.buyItems}
          />
        </div>

        <div className={styles.marketDivider}></div>

        <div className={styles.marketSection}>
          <h2  className={`${styles.sectionTitle} ${styles.sell}`}>Sell</h2>
          <MarketItems
            tileset={tileset}
            items={sellItems}
            onSell={sellItem}
            mode="sell"
            className = {styles.sellItems}
          />
        </div>
      </div>

      <div className={styles.marketGold}> Gold: {state.gold} </div>
    </div>
  );
};

export default MarketPanel