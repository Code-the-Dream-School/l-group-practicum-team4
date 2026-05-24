import toast from "react-hot-toast";
import { useState, useEffect, useCallback, useRef } from "react";
import { Player, Enemy } from "../../../shared/models/models";
import { useDungeon } from "./dungeonHook";
import {
	combatActionHandler,
	actionTypes,
	type ActionType,
} from "./combatActions";

export const useCombat = () => {
	const [autoCombat, setAutoCombat] = useState(false);
	const [playerNAT, setPlayerNAT] = useState(0);
	const [playerActionReady, setPlayerActionReady] = useState(false);
	const [playerBaseTime, setPlayerBaseTime] = useState(0);
	const [enemyNAT, setEnemyNAT] = useState(0);
	const [enemyBaseTime, setEnemyBaseTime] = useState(0);

	const {
		state: dungeonState,
		setPlayer,
		setEnemy,
		setEnemies,
		DropItem,
	} = useDungeon();

	const timerRef = useRef<number | null>(null);
	const playerRef = useRef(dungeonState.player);
	const enemyRef = useRef(dungeonState.enemy);

	useEffect(() => {
		playerRef.current = dungeonState.player;
		enemyRef.current = dungeonState.enemy;
	}, [dungeonState.player, dungeonState.enemy]);

	const calculateNextActionTime = useCallback(
		(speed: number): { nextTime: number; baseTime: number } => {
			const baseTime = 4000 / (speed / 5);
			const nextTime = Date.now() + Math.max(800, baseTime);
			return { nextTime, baseTime };
		},
		[],
	);

	const action = useCallback(
		(
			attackChar: Player | Enemy,
			defendChar: Player | Enemy,
			action: ActionType,
		) => {
			try {
				if (!attackChar || !defendChar) return;

				combatActionHandler(attackChar, defendChar, action);

				if (
					attackChar instanceof Player &&
					defendChar instanceof Enemy
				) {
					toast.success(
						`${attackChar.name} ${action} ${defendChar.name}!`,
						{
							toasterId: "playerTurn",
						},
					);

					const actionTime = calculateNextActionTime(
						attackChar.speed,
					);
					setPlayerNAT(actionTime.nextTime);
					setPlayerBaseTime(actionTime.baseTime);
				} else if (
					attackChar instanceof Enemy &&
					defendChar instanceof Player
				) {
					toast.success(
						`${attackChar.name} ${action} ${defendChar.name}!`,
						{
							toasterId: "enemyTurn",
						},
					);
					const actionTime = calculateNextActionTime(
						attackChar.speed,
					);
					setEnemyNAT(actionTime.nextTime);
					setEnemyBaseTime(actionTime.baseTime);
				}
			} catch (e) {
				const errorMessage =
					e instanceof Error ? e.message : "Unexpected error.";

				toast.error(errorMessage, {
					toasterId: "main",
				});
				console.error(e);
			}
		},
		[calculateNextActionTime],
	);

	const DropItems = useCallback(
		(character: Player | Enemy) => {
			if (!character) return;

			for (const item of character.inventory) {
				DropItem(character.x, character.y, item);
			}
			if (character.gear?.weapon)
				DropItem(character.x, character.y, character.gear.weapon);
			if (character.gear?.shield)
				DropItem(character.x, character.y, character.gear.shield);
			if (character.gear?.armor)
				DropItem(character.x, character.y, character.gear.armor);
			if (character.gear?.helmet)
				DropItem(character.x, character.y, character.gear.helmet);
		},
		[DropItem],
	);

	const enemyDeath = useCallback(
		(enemy: Enemy) => {
			if (!enemy || !dungeonState.enemies) return;

			//Remove enemy from list
			const newEnemies = dungeonState.enemies.filter(
				(e: Enemy) => e.id !== enemy.id,
			);
			setEnemies(newEnemies);

			//Unselect enemy
			setEnemy(null);

			//Drop enemy items
			DropItems(enemy);

			toast.success(`¡${enemy.name} was defeated!`, {
				toasterId: "main",
			});
		},
		[DropItems, dungeonState.enemies, setEnemies, setEnemy],
	);

	const playerDeath = useCallback((player: Player) => {
		if (!player) return;

		//Unselect enemy
		//setPlayer(null);

		//Drop player items
		//DropItems(player);

		toast.error(`¡${player.name} was defeated!`, {
			toasterId: "main",
		});
	}, []);

	useEffect(() => {
		const autoCombatLoop = () => {
			if (!playerRef.current || !enemyRef.current) return;

			const now = Date.now();

			//Player action
			const isPlayerReadyNow = now >= playerNAT;

			setPlayerActionReady(isPlayerReadyNow);

			if (autoCombat && isPlayerReadyNow) {
				action(playerRef.current, enemyRef.current, actionTypes.ATTACK);
				setEnemy(enemyRef.current);
				return;
			}

			//Enemy action
			if (now >= enemyNAT && now < playerNAT) {
				action(enemyRef.current, playerRef.current, actionTypes.ATTACK);
				setPlayer(playerRef.current);
			}

			// Verify results
			if (enemyRef.current.health <= 0) {
				enemyDeath(enemyRef.current);
			}
			if (playerRef.current.health <= 0) {
				playerDeath(playerRef.current);
			}
		};

		timerRef.current = setInterval(autoCombatLoop, 200);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [
		action,
		autoCombat,
		dungeonState.enemies,
		enemyDeath,
		enemyNAT,
		playerDeath,
		playerNAT,
		setEnemies,
		setEnemy,
		setPlayer,
	]);

	useEffect(() => {
		if (playerRef && enemyRef && enemyRef.current) {
			const playerActionTime = calculateNextActionTime(
				playerRef.current.speed,
			);
			const enemyActionTime = calculateNextActionTime(
				enemyRef.current.speed,
			);

			setPlayerNAT(playerActionTime.nextTime);
			setPlayerBaseTime(playerActionTime.baseTime);
			setEnemyNAT(enemyActionTime.nextTime);
			setEnemyBaseTime(enemyActionTime.baseTime);
		}
	}, [calculateNextActionTime]);

	const playerAction = useCallback(
		(playerAction: ActionType) => {
			if (!enemyRef.current) return;
			action(playerRef.current, enemyRef.current, playerAction);
			setEnemy(enemyRef.current);
		},
		[action, setEnemy],
	);

	return {
		playerAction,
		autoCombat,
		setAutoCombat,
		playerNAT,
		playerBaseTime,
		enemyNAT,
		enemyBaseTime,
		playerActionReady,
	};
};
