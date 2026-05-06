import styles from "./CharacterPanel.module.css";
import { useState } from "react";
import type { Character } from "../models/models";
import Sprite from "./Sprite";

function CharacterPanel({
	character,
	tileset,
}: {
	character: Character;
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

				<GearContainer character={character} tileset={tileset} />

				{activeTab === "stats" && (
					<StatContainer character={character} />
				)}

				{activeTab === "inventory" && (
					<InventoryContainer
						character={character}
						tileset={tileset}
					/>
				)}
			</div>
		</div>
	);
}

function GearContainer({
	character,
	tileset,
}: {
	character: Character;
	tileset: HTMLImageElement;
}) {
	return (
		<div className={styles["gear-container"]}>
			<div className={styles["gear"]}>
				{character.gear.helmet ? (
					<Sprite
						tileset={tileset}
						size={48}
						itemName={character.gear.helmet.name}
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
							itemName={character.gear.shield.name}
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
							itemName={character.gear.armor.name}
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
							itemName={character.gear.weapon.name}
						/>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
}

function StatContainer({ character }: { character: Character }) {
	return (
		<div className={styles["stats-container"]}>
			<Stat
				label="Health"
				value={character.health}
				plusValue={character.healthPlus}
			/>
			<Stat
				label="Attack"
				value={character.attack}
				plusValue={character.attackPlus}
			/>
			<Stat
				label="Defense"
				value={character.defense}
				plusValue={character.defensePlus}
			/>
			<Stat
				label="Speed"
				value={character.speed}
				plusValue={character.speedPlus}
			/>
		</div>
	);
}

function InventoryContainer({
	character,
	tileset,
}: {
	character: Character;
	tileset: HTMLImageElement;
}) {
	return (
		<div className={styles["inventory-container"]}>
			{character.inventory.map((item) => (
				<div key={item.id} className={styles["item"]}>
					<Sprite tileset={tileset} size={40} itemName={item.name} />
				</div>
			))}
		</div>
	);
}

function Stat({
	label,
	value,
	plusValue,
}: {
	label: string;
	value: number;
	plusValue: number;
}) {
	return (
		<div className={styles["stat"]}>
			<label>{`${label}:`}</label>
			<div>
				<p>{value}</p>
				{plusValue ? <b>{`+${plusValue}`}</b> : <></>}
			</div>
		</div>
	);
}

export default CharacterPanel;
