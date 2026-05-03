import { useEffect, useRef } from "react";

interface SpriteProps {
	tileset: HTMLImageElement | null;
	size?: number;
	itemType?: string;
}

// export default function Sprite({
// 	tileset,
// 	size = 48,
// 	itemType = "",
// }: SpriteProps) {
// 	if (!tileset) return;

// 	const ORIGINAL_SIZE = 16;
// 	const spacing = 1;

// 	const { col, row } = getPosition(itemType);

// 	const sx = col * (ORIGINAL_SIZE + spacing);
// 	const sy = row * (ORIGINAL_SIZE + spacing);

// 	return (
// 		<img
// 			src={tileset.src}
// 			alt="item"
// 			style={{
// 				width: size,
// 				height: size,
// 				imageRendering: "pixelated",
// 				objectFit: "none",
// 				objectPosition: `-${sx}px -${sy}px`,
// 			}}
// 		/>
// 	);
// }

export default function Sprite({
	tileset,
	size = 48,
	itemType = "",
}: SpriteProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !tileset) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const ORIGINAL_SIZE = 16;
		const spacing = 1;

		const { col, row } = getPosition(itemType);

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
	}, [tileset, size, itemType]);

	return <canvas ref={canvasRef} />;
}

function getPosition(type: string) {
	let col = 0;
	let row = 0;

	switch (type) {
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
		default:
			break;
	}

	return { col, row };
}
