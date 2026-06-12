import { useEffect, useRef } from "react";

export default function Sprite({
	tileset,
	size = 48,
	itemName = "",
}: {
	tileset?: HTMLImageElement | null;
	size?: number;
	itemName?: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas || !tileset) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const ORIGINAL_SIZE = 16;
		const spacing = 1;

		const { col, row } = getPosition(itemName);

		const sx = col * (ORIGINAL_SIZE + spacing);
		const sy = row * (ORIGINAL_SIZE + spacing);

		canvas.width = size;
		canvas.height = size;

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(
			tileset,
			sx,
			sy,
			ORIGINAL_SIZE,
			ORIGINAL_SIZE, // origen en el tileset
			0,
			0,
			size,
			size, // destino (escalado)
		);
	}, [tileset, size, itemName]);

	return <canvas ref={canvasRef} />;
}

function getPosition(name: string) {
	let col = 0;
	let row = 0;

	switch (name) {
		case "Dagger":
			col = 7;
			row = 8;
			break;
		case "Sword":
			col = 8;
			row = 8;
			break;
		case "BroadSword":
			col = 10;
			row = 8;
			break;
		case "Mace":
			col = 9;
			row = 9;
			break;
		case "Axe":
			col = 11;
			row = 9;
			break;
		case "Double Axe":
			col = 10;
			row = 9;
			break;
		case "Spear":
			col = 11;
			row = 10;
			break;
		case "Wooden Shield":
			col = 5;
			row = 8;
			break;
		case "Plate Shield":
			col = 6;
			row = 8;
			break;
		case "Plate Armor":
			col = 6;
			row = 6;
			break;
		case "Iron Helmet":
			col = 5;
			row = 6;
			break;
		case "Plate Helmet":
			col = 4;
			row = 6;
			break;
		case "Emerald Potion":
			col = 6;
			row = 9;
			break;
		case "Crimson Potion":
			col = 7;
			row = 9;
			break;
		case "Silver Potion":
			col = 5;
			row = 9;
			break;
		case "Cobalt Potion":
			col = 8;
			row = 9;
			break;
		case "Dungeon":
			col = 7;
			row = 1;
			break;
		case "Knight":
			col = 1;
			row = 8;
			break;
		case "Horned Warrior":
			col = 3;
			row = 7;
			break;
		case "Mage":
			col = 0;
			row = 7;
			break;
		case "Helmet Warrior":
			col = 0;
			row = 8;
			break;
		default:
			col = 0;
			row = 5;
			break;
	}

	return { col, row };
}
