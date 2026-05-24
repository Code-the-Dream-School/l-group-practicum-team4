import { useRef, useEffect, useCallback, useState } from "react";
import styles from "./dungeonCanvas.module.css";
import { useDungeon } from "../hooks/dungeonHook";
import { Enemy } from "../../../shared/models/models";
import {
	gameEvents,
	type GameEvent,
} from "../../../shared/services/gameEvents";
import { useCollision } from "../hooks/collisionHook";
import { type Explosion } from "../services/drawService";

export default function DungeonCanvas() {
	const {
		state: dungeonState,
		setTileset,
		setPlayer,
		setEnemy,
		MapDraw,
		PlayerDraw,
		EnemyDraw,
		getObjectsPosition,
		ObjectsDraw,
		ActivateTrap,
		DrawExplosions,
		ActivateChest,
		PickUpDroppedItem,
	} = useDungeon();

	const { CheckCollisions } = useCollision(dungeonState);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | null>(null);
	const lastTimeRef = useRef<number>(0);
	const keysRef = useRef<Set<string>>(new Set());
	const gameLoopRef = useRef<((timestamp: number) => void) | null>(null);

	const playerSpeed = 220;
	const TILE_SIZE = 32;
	const ORIGINAL_TILE_SIZE = 16;

	const [explosions, setExplosions] = useState<Explosion[]>([]);

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

		getObjectsPosition(dungeonState.map, "entrance").forEach((entrance) => {
			ObjectsDraw(
				ctx,
				TILE_SIZE,
				dungeonState.tileset as HTMLImageElement,
				"entrance",
				entrance.x,
				entrance.y,
				offsetX,
				offsetY,
			);
		});

		//Drawing Chests
		dungeonState.chests?.map((chest) =>
			ObjectsDraw(
				ctx,
				TILE_SIZE,
				dungeonState.tileset as HTMLImageElement,
				"chest",
				chest.x,
				chest.y,
				offsetX,
				offsetY,
			),
		);

		//Drawing dropped items
		dungeonState.droppedItems?.forEach((item) => {
			ObjectsDraw(
				ctx,
				TILE_SIZE,
				dungeonState.tileset as HTMLImageElement,
				"item",
				item.x,
				item.y,
				offsetX,
				offsetY,
			);
		});

		//Drawing enemies
		if (dungeonState?.enemies && dungeonState.tileset) {
			dungeonState.enemies.forEach((enemy: Enemy) => {
				EnemyDraw(
					ctx,
					TILE_SIZE,
					dungeonState.tileset as HTMLImageElement,
					enemy,
					enemy.x * TILE_SIZE - offsetX,
					enemy.y * TILE_SIZE - offsetY,
				);
			});
		}

		//Drawing explosions
		DrawExplosions(
			ctx,
			explosions,
			setExplosions,
			TILE_SIZE,
			offsetX,
			offsetY,
		);

		//Drawing player
		PlayerDraw(ctx, TILE_SIZE, dungeonState.tileset, dungeonState.player);
	}, [
		dungeonState.player,
		dungeonState.map,
		dungeonState.tileset,
		dungeonState.chests,
		dungeonState.droppedItems,
		dungeonState.enemies,
		MapDraw,
		getObjectsPosition,
		DrawExplosions,
		explosions,
		PlayerDraw,
		ObjectsDraw,
		EnemyDraw,
	]);

	const handleObjectActivated = useCallback(
		(event: GameEvent) => {
			switch (event.objectType) {
				case "Enemy":
					setEnemy(event.object);
					break;
				case "Trap": {
					ActivateTrap(event.object);
					const newExplosion: Explosion = {
						x: event.object.x,
						y: event.object.y,
						life: 150,
						maxLife: 150,
					};
					setExplosions((prev) => [...prev, newExplosion]);
					break;
				}
				case "Chest":
					ActivateChest(event.object);
					break;
				case "DroppedItem": {
					PickUpDroppedItem(event.object);
					break;
				}
			}
		},
		[ActivateChest, ActivateTrap, PickUpDroppedItem, setEnemy],
	);

	useEffect(() => {
		gameEvents.on("ObjectActivated", handleObjectActivated);
		return () => {
			gameEvents.off("ObjectActivated", handleObjectActivated);
		};
	}, [handleObjectActivated]);

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

				// Walls collisions
				const tileX = Math.floor(newX / TILE_SIZE);
				const tileY = Math.floor(newY / TILE_SIZE);

				const collision = CheckCollisions(newX, newY, TILE_SIZE);
				if (!collision) {
					if (dungeonState.map?.[tileY]?.[tileX].passable) {
						//Move player
						setPlayer({
							x: newX,
							y: newY,
							facing:
								vx > 0
									? "Right"
									: vx < 0
										? "Left"
										: dungeonState.player.facing,
						});
					}

					if (dungeonState.enemy) setEnemy(null);
				}
			}

			draw();
			animationRef.current = requestAnimationFrame(gameLoopRef.current!);
		},
		[
			dungeonState.map,
			dungeonState.player,
			dungeonState.enemy,
			draw,
			CheckCollisions,
			setEnemy,
			setPlayer,
		],
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
