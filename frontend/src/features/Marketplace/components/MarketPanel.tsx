import styles from "./MarketPanel.module.css";
import { useMarket } from "../hook/useMarket";
import MarketItems from "./MarketItems";
import tilesetImg from "../../../assets/dungeontileset.png";
import { useMarketActions } from "../hook/useMarketActions";
import { useCharacter } from "../../Home/hook/useCharacter";

const tileset = new Image();
tileset.src = tilesetImg;

const MarketPanel = () => {
	const { selectedCharacter } = useCharacter();
	const { state } = useMarket();
	const { sellItem, buyItem } = useMarketActions();

	const sellItems = selectedCharacter?.inventory ?? [];

	return (
		<div className={styles.marketPanel}>
			<div className={styles.marketHeader}> MARKET </div>
			<div className={styles.marketContent}>
				<div className={styles.marketSection}>
					<h2 className={`${styles.sectionTitle} ${styles.buy}`}>
						Buy
					</h2>
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
					<h2 className={`${styles.sectionTitle} ${styles.sell}`}>
						Sell
					</h2>
					<MarketItems
						tileset={tileset}
						items={sellItems}
						onSell={sellItem}
						mode="sell"
						className={styles.sellItems}
					/>
				</div>
			</div>

			<div className={styles.marketGold}>
				{" "}
				Gold: {selectedCharacter?.coins}{" "}
			</div>
		</div>
	);
};

export default MarketPanel;
