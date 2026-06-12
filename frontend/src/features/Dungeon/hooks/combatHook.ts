import toast from "react-hot-toast";
import { useState, useEffect, useCallback, useRef } from "react";
import { Player, Enemy } from "../../../shared/models/models";
import { useDungeon } from "./dungeonHook";
import { useCharacter } from "../../Home/hook/useCharacter";
import {
	combatActionHandler,
	actionTypes,
	type ActionType,
} from "./combatActions";
import { updateCharacter } from "../../Home/api/CharacterApi";

export const useCombat = () => {
	const [autoCombat, setAutoCombat] = useState(false);
	const [playerNAT, setPlayerNAT] = useState(0);
	const [playerActionReady, setPlayerActionReady] = useState(false);
	const [playerBaseTime, setPlayerBaseTime] = useState(0);
	const [enemyNAT, setEnemyNAT] = useState(0);
	const [enemyBaseTime, setEnemyBaseTime] = useState(0);

	const {
		state: dungeonState,
		setEnemy,
		delEnemy,
		setEnemies,
		DropItem,
	} = useDungeon();

	const { selectedCharacter, selectCharacter } = useCharacter();

	const timerRef = useRef<number | null>(null);
	const playerRef = useRef(selectedCharacter);
	const enemyRef = useRef(dungeonState.enemy);

	useEffect(() => {
		playerRef.current = selectedCharacter;
		enemyRef.current = dungeonState.enemy;
	}, [selectedCharacter, dungeonState.enemy]);

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
			delEnemy(enemy);

			//Unselect enemy
			setEnemy(null);

			//Drop enemy items
			DropItems(enemy);

			toast.success(`¡${enemy.name} was defeated!`, {
				toasterId: "main",
			});
		},
		[DropItems, delEnemy, dungeonState.enemies, setEnemy],
	);

	const playerDeath = useCallback((player: Player) => {
		if (!player) return;

		//Unselect player
		//selectCharacter(null);

		//Drop player items
		//DropItems(player);

		//UpdatePlayer
		updateCharacter(player.id, { health: 0 });

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

				if (selectedCharacter)
					selectedCharacter.health = playerRef.current.health;
			}

			// Verify results
			if (enemyRef.current.health <= 0) {
				enemyDeath(enemyRef.current);
			}
			if (playerRef.current.health <= 0) {
				playerDeath(playerRef.current);
			}
		};

		if (selectedCharacter && selectedCharacter.health > 0)
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
		selectCharacter,
		selectedCharacter,
		setEnemies,
		setEnemy,
	]);

	useEffect(() => {
		if (playerRef && enemyRef && playerRef.current && enemyRef.current) {
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
			if (!enemyRef.current || !playerRef.current) return;
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
