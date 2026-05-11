import styles from "./MarketPage.module.css";
import MarketPanel from "../components/MarketPanel";


const MarketplacePage = () => {
  return (
    <div className={styles.page}>
      <MarketPanel/>   
    </div>
  );
};

export default MarketplacePage