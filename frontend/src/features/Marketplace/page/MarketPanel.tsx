import styles from "./MarketPanel.module.css";
import {useState} from "react";
import MarketItems from "./MarketItems";
import tilesetImg from "../../../assets/dungeontileset.png";
import {items} from "./items"

const MarketPanel = () => {

  const [activeTab, setActiveTab] = useState<"buy"|"sell">("buy");

// const items = [
//   { name: "Sword", price: 100 },
//   { name: "BroadSword", price: 80 },
//   { name: "Dagger" , price: 50 },
//   { name: "Axe" , price: 70 },
//   { name: "Double Axe" , price: 90 },
//   { name: "Spear" , price: 100 },
//   { name: "Wooden Shield" , price: 50 },
//   { name: "Plate Shield" , price: 100 },
//   { name: "Plate Armor" , price: 100 },
//   { name: "Iron Helmet" , price: 100 },
//   { name: "Plate Helmet" , price: 80 },
//   { name: "Blue Potion" , price: 30 },
// ];

const tileset = new Image();
tileset.src = tilesetImg;

  return (
   
<div className={styles.marketPanel}>
  <div className={styles.marketHeader}> 
    MARKET
  </div>
  <div className={styles.marketTabs}>
   <button
    className={`${styles.tab} ${activeTab === "buy" ? styles.active : ""}`}
    onClick={() => setActiveTab("buy")}
  >
    Buy
  </button>
    <button
    className={`${styles.tab} ${activeTab === "sell" ? styles.active : ""}`}
    onClick={() => setActiveTab("sell")}
  >
    Sell
  </button>
  </div>
  <MarketItems tileset={tileset} items={items} />
  <div className={styles.marketGold}> Gold: 120 </div>
</div>


  );
};

export default MarketPanel