import styles from "./dungeonsBar.module.css";
import { CardList, type Item } from "../../../shared/components/CardList";
import type { Dungeon } from "../../../shared/models/models";

export default function DungeonsBar({
	tileset,
	dungeons,
	selectedDungeonId,
	newDungeon,
}: {
	tileset?: HTMLImageElement | null;
	dungeons?: Dungeon[] | null;
	selectedDungeonId?: string | null;
	newDungeon?: () => void;
}) {
	const items: Item[] =
		dungeons === null || dungeons === undefined || dungeons.length === 0
			? [
					{
						key: "new",
						avatar: "Dungeon",
						title: "Enter Dungeon",
						callBack: newDungeon,
					},
				]
			: dungeons.map((dungeon) => ({
					key: dungeon._id,
					avatar: "Dungeon",
					title: `Dungeon`,
					description: `Level ${dungeon.level}`,
					active: selectedDungeonId === dungeon._id,
				}));

	return (
		<div className={styles["container"]}>
			<CardList tileset={tileset} items={items} />
		</div>
	);
}
