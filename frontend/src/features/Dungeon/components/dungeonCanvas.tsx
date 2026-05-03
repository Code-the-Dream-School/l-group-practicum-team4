import { useRef, useEffect, useCallback } from "react";
import styles from "./dungeonCanvas.module.css";
import { useDungeon } from "../hooks/dungeonHook";
import type { Enemy } from "../../../shared/models/models";

export default function DungeonCanvas() {
	const {
		state: dungeonState,
		setTileset,
		setPlayer,
		setEnemy,
		MapDraw,
		PlayerDraw,
		EnemyDraw,
	} = useDungeon();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);
	const keysRef = useRef<Set<string>>(new Set());
	const gameLoopRef = useRef<((timestamp: number) => void) | null>(null);

	const playerSpeed = 220;
	const TILE_SIZE = 32;
	const ORIGINAL_TILE_SIZE = 16;

	//#region Load tileset
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const img = new Image();
		imgRef.current = img;

		img.onload = () => setTileset(img);

		img.src = "src/assets/dungeontileset.png";

		return () => {
			img.onload = null;
			img.onerror = null;
		};
	}, []);

	//#endregion

	// Canvas drawing
	const draw = useCallback(() => {
		//#region Canvas setup
		const canvas = canvasRef.current;
		if (
			!canvas ||
			!dungeonState?.player ||
			!dungeonState?.map ||
			!dungeonState.tileset
		)
			return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#763B36";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const offsetX = dungeonState.player.x - canvas.width / 2;
		const offsetY = dungeonState.player.y - canvas.height / 2;
		//#endregion

		// Drawing map
		MapDraw(
			ctx,
			dungeonState.map,
			TILE_SIZE,
			ORIGINAL_TILE_SIZE,
			offsetX,
			offsetY,
			dungeonState.tileset,
		);

		//Drawing enemies
		if (dungeonState?.enemies && dungeonState.tileset) {
			dungeonState.enemies.forEach((enemy: Enemy) => {
				EnemyDraw(
					ctx,
					TILE_SIZE,
					dungeonState.tileset as HTMLImageElement,
					enemy,
					enemy.x - offsetX - TILE_SIZE / 2,
					enemy.y - offsetY - TILE_SIZE / 2 - 4,
					enemy.x % 2 === 0 ? "left" : "right",
					{},
				);
			});
		}

		//Drawing player
		PlayerDraw(
			ctx,
			TILE_SIZE,
			dungeonState.tileset,
			dungeonState.player.facing,
			dungeonState.player.gear,
		);
	}, [dungeonState, MapDraw, PlayerDraw, EnemyDraw]);

	//#region Collision System
	const checkEnemyCollision = useCallback(
		(newX: number, newY: number) => {
			if (!dungeonState.enemies) return null;

			for (const enemy of dungeonState.enemies) {
				const distance = Math.hypot(newX - enemy.x, newY - enemy.y);

				if (distance < TILE_SIZE * 1.2) {
					return enemy;
				}
			}
			return null;
		},
		[dungeonState.enemies],
	);
	//#endregion

	//#region Game Loop
	const gameLoop = useCallback(
		(timestamp: number) => {
			if (!dungeonState?.map || !dungeonState?.player) {
				animationRef.current = requestAnimationFrame(
					gameLoopRef.current!,
				);
				return;
			}

			const delta = Math.min(
				(timestamp - lastTimeRef.current) / 1000,
				0.1,
			);
			lastTimeRef.current = timestamp;

			let vx = 0,
				vy = 0;

			if (keysRef.current.has("w") || keysRef.current.has("arrowup"))
				vy -= 1;
			if (keysRef.current.has("s") || keysRef.current.has("arrowdown"))
				vy += 1;
			if (keysRef.current.has("a") || keysRef.current.has("arrowleft"))
				vx -= 1;
			if (keysRef.current.has("d") || keysRef.current.has("arrowright"))
				vx += 1;

			if (vx !== 0 || vy !== 0) {
				const len = Math.hypot(vx, vy);
				vx = (vx / len) * playerSpeed * delta;
				vy = (vy / len) * playerSpeed * delta;

				const newX = dungeonState.player.x + vx;
				const newY = dungeonState.player.y + vy;

				// Colisión con mapa
				const tileX = Math.floor(newX / TILE_SIZE);
				const tileY = Math.floor(newY / TILE_SIZE);

				if (dungeonState.map?.[tileY]?.[tileX] === 0) {
					const collidedEnemy = checkEnemyCollision(newX, newY);

					if (collidedEnemy) {
						setEnemy(collidedEnemy);
					} else {
						setEnemy(null);
					}

					setPlayer(
						newX,
						newY,
						vx > 0
							? "Right"
							: vx < 0
								? "Left"
								: dungeonState.player.facing,
					);
				}
			}

			draw();
			animationRef.current = requestAnimationFrame(gameLoopRef.current!);
		},
		[dungeonState, setPlayer, setEnemy, draw, checkEnemyCollision],
	);
	//#endregion

	useEffect(() => {
		gameLoopRef.current = gameLoop;
	}, [gameLoop]);

	//#region Start the Game Loop
	useEffect(() => {
		lastTimeRef.current = performance.now();
		animationRef.current = requestAnimationFrame(gameLoopRef.current!);

		return () => {
			if (animationRef.current)
				cancelAnimationFrame(animationRef.current);
		};
	}, [gameLoop]);
	//#endregion

	//#region Key Handling (Continuously Pressed)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			keysRef.current.add(e.key.toLowerCase());
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			keysRef.current.delete(e.key.toLowerCase());
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	//#endregion

	const resizeCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const container = canvas.parentElement;
		if (!container) return;

		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight;
	}, []);

	useEffect(() => {
		resizeCanvas();

		window.addEventListener("resize", resizeCanvas);
		return () => window.removeEventListener("resize", resizeCanvas);
	}, [resizeCanvas]);

	return (
		<div className={styles.canvasContainer}>
			{<canvas ref={canvasRef} className={styles.canvas} />}
		</div>
	);
}
