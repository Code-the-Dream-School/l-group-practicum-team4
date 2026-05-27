import styles from "./CharacterPanel.module.css";
import { useState, useEffect } from "react";
import type { Item, Character, TimeBonus } from "../models/models";
import Sprite from "./Sprite";
import ItemTooltip from "./ItemTooltip";

function CharacterPanel({
	character,
	tileset,
	equipItem,
	unequipItem,
	consumeItem,
}: {
	character: Character;
	tileset: HTMLImageElement;
	equipItem?: (item: Item) => void;
	unequipItem?: (item: Item) => void;
	consumeItem?: (item: Item) => void;
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

				<GearContainer
					character={character}
					tileset={tileset}
					{...(unequipItem && { unequipItem })}
				/>

				{activeTab === "stats" && (
					<StatContainer character={character} />
				)}

				{activeTab === "inventory" && (
					<InventoryContainer
						character={character}
						tileset={tileset}
						{...(equipItem && { equipItem })}
						{...(consumeItem && { consumeItem })}
					/>
				)}
			</div>
		</div>
	);
}

function GearContainer({
	character,
	tileset,
	unequipItem,
}: {
	character: Character;
	tileset: HTMLImageElement;
	unequipItem?: (item: Item) => void;
}) {
	return (
		<div className={styles["gear-container"]}>
			<div className={styles["gear"]}>
				{character.gear.helmet ? (
					<button
						onClick={() => unequipItem?.(character.gear.helmet!)}
					>
						<ItemTooltip item={character.gear.helmet}>
							<Sprite
								tileset={tileset}
								size={48}
								itemName={character.gear.helmet.name}
							/>
						</ItemTooltip>
					</button>
				) : (
					<></>
				)}
			</div>
			<div className={styles["center-gear-container"]}>
				<div className={styles["gear"]}>
					{character.gear.shield ? (
						<button
							onClick={() =>
								unequipItem?.(character.gear.shield!)
							}
						>
							<ItemTooltip item={character.gear.shield}>
								<Sprite
									tileset={tileset}
									size={48}
									itemName={character.gear.shield.name}
								/>
							</ItemTooltip>
						</button>
					) : (
						<></>
					)}
				</div>
				<div className={styles["gear"]}>
					{character.gear.armor ? (
						<button
							onClick={() => unequipItem?.(character.gear.armor!)}
						>
							<ItemTooltip item={character.gear.armor}>
								<Sprite
									tileset={tileset}
									size={48}
									itemName={character.gear.armor.name}
								/>
							</ItemTooltip>
						</button>
					) : (
						<></>
					)}
				</div>
				<div className={styles["gear"]}>
					{character.gear.weapon ? (
						<button
							onClick={() =>
								unequipItem?.(character.gear.weapon!)
							}
						>
							<ItemTooltip item={character.gear.weapon}>
								<Sprite
									tileset={tileset}
									size={48}
									itemName={character.gear.weapon.name}
								/>
							</ItemTooltip>
						</button>
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
				bonus={character.healthBonus}
			/>
			<Stat
				label="Attack"
				value={character.attack}
				plusValue={character.attackPlus}
				bonus={character.attackBonus}
			/>
			<Stat
				label="Defense"
				value={character.defense}
				plusValue={character.defensePlus}
				bonus={character.defenseBonus}
			/>
			<Stat
				label="Speed"
				value={character.speed}
				plusValue={character.speedPlus}
				bonus={character.speedBonus}
			/>
		</div>
	);
}

function InventoryContainer({
	character,
	tileset,
	equipItem,
	consumeItem,
}: {
	character: Character;
	tileset: HTMLImageElement;
	equipItem?: (item: Item) => void;
	consumeItem?: (item: Item) => void;
}) {
	return (
		<div className={styles["inventory-container"]}>
			{character.inventory.map((item, index) => (
				<div
					key={index}
					className={`${styles["item"]} ${item.type == "helmet" || item.type == "armor" || item.type == "shield" || item.type == "weapon" ? styles.wearables : ""} ${item.type == "potion" ? styles.consumables : ""}`}
				>
					<button
						onClick={() => {
							if (
								item.type == "helmet" ||
								item.type == "armor" ||
								item.type == "shield" ||
								item.type == "weapon"
							)
								equipItem?.(item);
							if (item.type == "potion") consumeItem?.(item);
						}}
					>
						<ItemTooltip item={item}>
							<Sprite
								tileset={tileset}
								size={40}
								itemName={item.name}
							/>
						</ItemTooltip>
					</button>
				</div>
			))}
		</div>
	);
}

function Stat({
	label,
	value,
	plusValue,
	bonus,
}: {
	label: string;
	value: number;
	plusValue: number;
	bonus?: TimeBonus;
}) {
	const [timeLefts, setTimeLefts] = useState<string>();

	useEffect(() => {
		const interval = setInterval(() => {
			if (!bonus) return;

			const now = Date.now();
			const remaining = Math.max(
				0,
				Math.ceil((bonus.expiresAt - now) / 1000),
			);

			const min = Math.floor(remaining / 60);
			const sec = remaining % 60;
			setTimeLefts(
				`${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`,
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [bonus]);

	return (
		<div>
			<div className={styles["stat"]}>
				<label>{`${label}:`}</label>
				<div>
					<p>{value}</p>
					{plusValue ? <b>{`+${plusValue}`}</b> : <></>}
				</div>
			</div>
			{bonus ? (
				<div
					className={styles["stat-bonus"]}
				>{`+${bonus.value}  (${timeLefts})`}</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default CharacterPanel;
