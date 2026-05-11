import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./dungeonPage.module.css";
import DungeonCanvas from "../components/dungeonCanvas";
import CharacterPanel from "../../../shared/components/CharacterPanel";
import CombatPanel from "../../../shared/components/CombatPanel";

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
			{dungeonState.enemy && (
				<div className={styles["panelCombat"]}>
					<Toaster
						toasterId="playerTurn"
						toastOptions={{
							duration: 2000,
							position: "bottom-left",
							style: {
								position: "relative",
								bottom: 180,
								marginLeft: 70,
								background: "#333",
								color: "#fff",
								borderRadius: "10px",
								padding: "12px 20px",
								fontSize: "16px",
								maxWidth: "400px",
							},
							error: {
								style: {
									background: "#ef4444",
									color: "white",
								},
								iconTheme: {
									primary: "white",
									secondary: "#ef4444",
								},
							},
						}}
					/>
					<Toaster
						toasterId="enemyTurn"
						toastOptions={{
							duration: 2000,
							position: "bottom-right",
							style: {
								position: "relative",
								bottom: 180,
								marginRight: 70,
								background: "#333",
								color: "#fff",
								borderRadius: "10px",
								padding: "12px 20px",
								fontSize: "16px",
								maxWidth: "400px",
							},
							error: {
								style: {
									background: "#ef4444",
									color: "white",
								},
								iconTheme: {
									primary: "white",
									secondary: "#ef4444",
								},
							},
						}}
					/>
					{dungeonState.player &&
					dungeonState.enemy &&
					dungeonState.tileset ? (
						<CombatPanel
							player={dungeonState.player}
							enemy={dungeonState.enemy}
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
