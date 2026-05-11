import styles from "./CombatPanel.module.css";
import type { Player, Enemy } from "../models/models";
import { useCombat } from "../../features/Dungeon/hooks/combatHook";
import { actionTypes } from "../../features/Dungeon/hooks/combatActions";
import ActionTimeBar from "./ActionTimeBar";

function CharacterPanel({
	player,
	enemy,
	tileset,
}: {
	player: Player;
	enemy: Enemy;
	tileset: HTMLImageElement;
}) {
	const {
		playerAction,
		autoCombat,
		setAutoCombat,
		playerNAT,
		playerBaseTime,
		enemyNAT,
		enemyBaseTime,
		playerActionReady,
	} = useCombat();

	return (
		<div className={styles["panel-container"]}>
			<div className={styles["player-avatar"]}>
				{player?.name && <></>}
			</div>
			<div className={styles["enemy-avatar"]}>{enemy?.name && <></>}</div>
			<div className={styles["container"]}>
				<div className={styles["header"]}>
					<div>
						<h2>{player.name}</h2>
						<ActionTimeBar
							actionTime={playerNAT}
							baseTime={playerBaseTime}
						/>
					</div>
					<h1>VS</h1>
					<div>
						<h2>{enemy.name}</h2>
						<ActionTimeBar
							actionTime={enemyNAT}
							baseTime={enemyBaseTime}
						/>
					</div>
				</div>
				<div className={styles["actions"]}>
					<div className={styles["actions-player"]}>
						<button
							disabled={!playerActionReady}
							onClick={() => playerAction(actionTypes.ATTACK)}
						>
							Attack
						</button>
						<div className={styles["checkbox"]}>
							<label>
								<span>Auto</span>
								<input
									type="checkbox"
									checked={autoCombat}
									onChange={(e) =>
										setAutoCombat(e.target.checked)
									}
								/>
								<span className={styles["slider"]}></span>
							</label>
						</div>
						{/* <button>Flee</button> */}
					</div>
					<div className={styles["actions-enemy"]}>
						<button>Attack</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CharacterPanel;
