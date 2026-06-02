import styles from "./MarketPage.module.css";
import MarketPanel from "../components/NewMarketPanel";


const MarketplacePage = () => {
  return (
    <div className={styles.page}>
      <MarketPanel/>   
    </div>
  );
};

export default MarketplacePage