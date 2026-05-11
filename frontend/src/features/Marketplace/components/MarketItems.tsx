import styles from './MarketItems.module.css'
import Sprite from '../../../shared/components/Sprite'
import type { Item } from "../../../shared/models/models"

interface Props{
  tileset: HTMLImageElement | null;
  items: Item[];
  onBuy: (item: Item) => void;
  onSell: (item: Item) => void;
  mode: "buy" | "sell";
}

const MarketItems = ({tileset, items, onBuy, onSell, mode}: Props) => {

  return (
    <>
    <div className={styles.marketItems}>  
      {items.map((item) => (
        <div 
          key = {item.inventoryId} 
          className={styles.marketItem}
          onClick={() => (mode === "buy" ? onBuy(item) : onSell(item))}> 

          <Sprite 
            tileset={tileset}
            size={32}
            itemName={item.name}/>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.price}>Price:{item.coinCost} </div>
        </div>
      ))}     
    </div>
  </>
  )
}
 export default MarketItems