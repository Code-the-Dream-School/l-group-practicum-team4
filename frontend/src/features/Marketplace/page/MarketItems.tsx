import styles from './MarketItems.module.css'
import Sprite from '../../../shared/components/Sprite'

interface MarketItemType{
  name:string,
  price:number
}

interface Props{
  tileset: HTMLImageElement | null;
  items: MarketItemType[];
}

const MarketItems = ({tileset, items}: Props) => {
  return (
    <>
    <div className={styles.marketItems}>  
      {items.map((item) => (
        <div key = {item.name} className={styles.marketItem}>  
          <Sprite tileset={tileset}
            size={32}
            itemType={item.name}/>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.price}>Price: {item.price}</div>
        </div>
      ))}     
    </div>
  </>
  )
}

export default MarketItems