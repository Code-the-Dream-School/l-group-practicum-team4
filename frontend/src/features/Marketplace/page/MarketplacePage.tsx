import styles from "./MarketPage.module.css";
import MarketPanel from "./MarketPanel";



const MarketplacePage = () => {
  return (
    <div className={styles.page}>
      <MarketPanel/>   
    </div>
  );
};

export default MarketplacePage