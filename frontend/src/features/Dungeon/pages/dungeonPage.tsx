import { useEffect } from "react";
import styles from "./dungeonPage.module.css";
import DungeonCanvas from "../components/dungeonCanvas";
import CharacterPanel from "../../../shared/components/CharacterPanel";

import { useDungeon } from "../hooks/dungeonHook";

export default function DungeonPage() {
	const {
		state: dungeonState,
		setPlayer,
		EquipItem,
		UnequipItem,
		ConsumeItem,
	} = useDungeon();

	useEffect(() => {
		if (dungeonState.player) {
			dungeonState.player.setOnBonusesChanged(() => {
				setPlayer({});
			});
		}
	}, [dungeonState.player, setPlayer]);

	return (
		<div className={styles["container"]}>
			<DungeonCanvas />
			<div className={styles["panelLeft"]}>
				{dungeonState.player && dungeonState.tileset && (
					<CharacterPanel
						character={dungeonState.player}
						tileset={dungeonState.tileset}
						equipItem={EquipItem}
						unequipItem={UnequipItem}
						consumeItem={ConsumeItem}
					/>
				)}
			</div>
			{dungeonState.enemy && (
				<div className={styles["panelRight"]}>
					{dungeonState.enemy && dungeonState.tileset ? (
						<CharacterPanel
							character={dungeonState.enemy}
							tileset={dungeonState.tileset}
						/>
					) : (
						<></>
					)}
				</div>
			)}
		</div>
	);
}
