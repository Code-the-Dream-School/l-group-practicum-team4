import styles from "./MarketplacePage.module.css";

const MarketplacePage = () => {
  return (
    <div className={styles.page}>
      <h1>Marketplace</h1>

      <div className={styles.container}>
        {/* LEFT: ITEMS */}
        <div className={styles.itemsGrid}>
          <div className={styles.itemCard}>
            <p className={styles.itemName}>Sword</p>
            <p className={styles.itemStat}>Attack +10</p>
            <p className={styles.itemPrice}>50 coins</p>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className={styles.details}>
          <h2>Selected Item</h2>
          <p>Name: Sword</p>
          <p>Price: 50 coins</p>

          <div className={styles.buttonGroup}>
            <button className={styles.button}>Buy</button>
            <button className={`${styles.button} ${styles.sellButton}`}>
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage