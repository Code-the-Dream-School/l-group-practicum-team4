import { useEffect, useRef } from "react";

interface SpriteProps {
	tileset: HTMLImageElement | null;
	size?: number;
	itemName?: string;
}

export default function Sprite({
	tileset,
	size = 48,
	itemName = "",
}: SpriteProps) {
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
		case "Blue Potion":
			col = 8;
			row = 9;
			break;
		case "Mage":
			col = 0;
			row = 7;
			break;
		case "Knight":
			col = 1;
			row = 8;
			break;
		case "Horned Warrior":
			col = 3;
			row = 7;
			break;
		case "Helmet Warrior":
			col = 0;
			row = 8;
			break;
		case "Sportman":
			col = 4;
			row = 9;
			break;
		case "Spider":
			col = 2;
			row = 10;
			break;
		case "Ghost":
			col = 1;
			row = 10;
			break;
		case "Purple Girl":
			col = 3;
			row = 8;
			break;
		case "Grey Hair Girl":
			col = 4;
			row = 8;
			break;
		case "Brown Mage":
			col = 3;
			row = 9;
			break;
		case "Chest":
			col = 6;
			row = 7;
			break;
		default:
			break;
	}

	return { col, row };
}
