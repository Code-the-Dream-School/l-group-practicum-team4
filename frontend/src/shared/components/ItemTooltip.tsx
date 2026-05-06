import { useState, useEffect, useRef } from "react";
import styles from "./ItemTooltip.module.css";
import type { Item } from "../models/models";

interface ItemTooltipProps {
	item: Item;
	children: React.ReactNode;
	delay?: number;
}

export default function ItemTooltip({
	item,
	children,
	delay = 300,
}: ItemTooltipProps) {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const timeoutRef = useRef<number | null>(null);

	const handleMouseEnter = (e: React.MouseEvent) => {
		timeoutRef.current = setTimeout(() => {
			setPosition({ x: e.clientX + 15, y: e.clientY + 15 });
			setVisible(true);
		}, delay);
	};

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setVisible(false);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return (
		<div
			className={styles.tooltipWrapper}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}

			{visible && (
				<div
					className={styles.tooltip}
					style={{
						left: position.x,
						top: position.y,
					}}
				>
					<div className={styles["tooltip-header"]}>
						<h4>{item.name}</h4>
						<p>{item.type}</p>
					</div>
					<div className={styles["tooltip-content"]}>
						<p className={styles["description"]}>
							{item.description}
						</p>
						<div className={styles["stat"]}>
							<p>
								<b>{`${item.stat}:  `}</b>
								{`+${item.value}`}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
