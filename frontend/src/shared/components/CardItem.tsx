import styles from "./CardItem.module.css";
import Sprite from "./Sprite";

export interface BulletPoint {
	key: string;
	icon: string;
	text: string;
}

export default function CardItem({
	id,
	tileset,
	avatar,
	title,
	description,
	bulletPoints,
	callBack,
	active = false,
}: {
	id: string;
	tileset?: HTMLImageElement | null;
	avatar?: string;
	title: string;
	description?: string;
	bulletPoints?: BulletPoint[];
	active?: boolean;
	callBack?: () => void;
}) {
	return (
		<button
			className={`${styles["container"]} ${active ? styles["active"] : ""} ${id === "new" ? styles["dotted-border"] : ""}`}
			onClick={callBack}
		>
			<div className={styles.avatarCircle}>
				<Sprite tileset={tileset} size={70} itemName={avatar || ""} />
			</div>
			<h3>{title}</h3>
			<span>{description}</span>
			<div className={styles["bullets"]}>
				{bulletPoints?.map((bp) => (
					<div key={bp.key}>
						{bp.icon} {bp.text}
					</div>
				))}
			</div>
		</button>
	);
}
