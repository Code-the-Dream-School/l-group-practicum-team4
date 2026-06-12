import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import styles from "./dungeonPage.module.css";
import dungeonTileset from "../../../assets/dungeontileset.png";

import DungeonCanvas from "../components/dungeonCanvas";
import CharacterPanel from "../../../shared/components/CharacterPanel";
import CombatPanel from "../../../shared/components/CombatPanel";
import DungeonsBar from "./dungeonsBar";

import { useDungeon } from "../hooks/dungeonHook";
import { useCharacter } from "../../Home/hook/useCharacter";

export default function DungeonPage() {
	const {
		state: dungeonState,
		setTileset,
		createDungeon,
		EquipItem,
		UnequipItem,
		ConsumeItem,
	} = useDungeon();

	const { selectedCharacter } = useCharacter();

	//#region Load tileset
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const img = new Image();
		imgRef.current = img;

		img.onload = () => setTileset(img);

		img.src = dungeonTileset;

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, []);

	//#endregion

	useEffect(() => {
		if (selectedCharacter) {
			selectedCharacter.setOnBonusesChanged(() => {
				//selectCharacter();
			});
		}
	}, [selectedCharacter]);

	return (
		<div className={styles["dungeon-container"]}>
			{dungeonState.dungeon ? <DungeonCanvas /> : <></>}
			<div className={styles["dungeon-UI"]}>
				{selectedCharacter && dungeonState.tileset && (
					<div className={styles["panelLeft"]}>
						<CharacterPanel
							character={selectedCharacter}
							tileset={dungeonState.tileset}
							equipItem={EquipItem}
							unequipItem={UnequipItem}
							consumeItem={ConsumeItem}
						/>
					</div>
				)}
				<>
					<DungeonsBar
						tileset={dungeonState.tileset}
						dungeons={dungeonState.dungeons}
						selectedDungeonId={dungeonState.dungeon?._id}
						newDungeon={createDungeon}
					/>
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
							{selectedCharacter &&
							dungeonState.enemy &&
							dungeonState.tileset ? (
								<CombatPanel
									player={selectedCharacter}
									enemy={dungeonState.enemy}
									tileset={dungeonState.tileset}
								/>
							) : (
								<></>
							)}
						</div>
					)}
				</>
				{dungeonState.enemy && (
					<div className={styles["panelRight"]}>
						{dungeonState.enemy && dungeonState.tileset ? (
							<CharacterPanel
								character={dungeonState.enemy}
								isPlayer={false}
								tileset={dungeonState.tileset}
							/>
						) : (
							<></>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
