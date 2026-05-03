import styles from "./CharacterPanel.module.css";
import { useState } from "react";
import Sprite from "./Sprite";

function CharacterPanel({
	character,
	tileset,
}: {
	character: {
		x: number;
		y: number;
		name: string;
		health: number;
		attack: number;
		defense: number;
		speed: number;
		gear: {
			helmet?: { type: string };
			armor?: { type: string };
			weapon?: { type: string };
			shield?: { type: string };
		};
		inventory: { index: number; type: string }[];
	};
	tileset: HTMLImageElement;
}) {
	const [activeTab, setActiveTab] = useState<"stats" | "inventory">("stats");

	return (
		<div className={styles["panel-container"]}>
			<div className={styles["avatar"]}>
				{character?.name && <h2>{character.name}</h2>}
			</div>
			<div className={styles["container"]}>
				<div className={styles["header-container"]}>
					<div className={styles["header"]}>
						<button
							className={`${styles.tab} ${activeTab === "stats" ? styles.active : styles.tab}`}
							onClick={() => setActiveTab("stats")}
						>
							Stats
						</button>
						<button
							className={`${styles.tab} ${activeTab === "inventory" ? styles.active : styles.tab}`}
							onClick={() => setActiveTab("inventory")}
						>
							Inventory
						</button>
					</div>
				</div>
				<div className={styles["gear-container"]}>
					<div className={styles["gear"]}>
						{character.gear.helmet ? (
							<Sprite
								tileset={tileset}
								size={48}
								itemType={character.gear.helmet.type}
							/>
						) : (
							<></>
						)}
					</div>
					<div className={styles["center-gear-container"]}>
						<div className={styles["gear"]}>
							{character.gear.shield ? (
								<Sprite
									tileset={tileset}
									size={48}
									itemType={character.gear.shield.type}
								/>
							) : (
								<></>
							)}
						</div>
						<div className={styles["gear"]}>
							{character.gear.armor ? (
								<Sprite
									tileset={tileset}
									size={48}
									itemType={character.gear.armor.type}
								/>
							) : (
								<></>
							)}
						</div>
						<div className={styles["gear"]}>
							{character.gear.weapon ? (
								<Sprite
									tileset={tileset}
									size={48}
									itemType={character.gear.weapon.type}
								/>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
				{activeTab === "stats" && (
					<div className={styles["stats-container"]}>
						<div className={styles["stat"]}>
							<label>Health:</label>
							<p>{character.health}</p>
						</div>
						<div className={styles["stat"]}>
							<label>Attack:</label>
							<p>{character.attack}</p>
						</div>
						<div className={styles["stat"]}>
							<label>Defense:</label>
							<p>{character.defense}</p>
						</div>
						<div className={styles["stat"]}>
							<label>Speed:</label>
							<p>{character.speed}</p>
						</div>
					</div>
				)}
				{activeTab === "inventory" && (
					<div className={styles["inventory-container"]}>
						{character.inventory.map((item) => (
							<div key={item.index} className={styles["item"]}>
								<Sprite
									tileset={tileset}
									size={40}
									itemType={item.type}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default CharacterPanel;
