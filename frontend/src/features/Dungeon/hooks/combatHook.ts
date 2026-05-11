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
				if (dungeonState.enemies && enemyRef.current)
					setEnemies(
						dungeonState.enemies.filter(
							(enemy: Enemy) => enemy.id !== enemyRef.current.id,
						),
					);

				setEnemy(null);

				toast.success(`¡${enemyRef.current.name} was defeated!`, {
					toasterId: "main",
				});
			}

			if (playerRef.current.health <= 0) {
				// manejar muerte del jugador
			}
		};

		// if (timerRef.current) clearInterval(timerRef.current);

		timerRef.current = setInterval(autoCombatLoop, 200);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [action, autoCombat, enemyNAT, playerNAT, setEnemy, setPlayer]);

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
