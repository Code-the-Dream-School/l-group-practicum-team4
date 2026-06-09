import styles from "./CardList.module.css";
import CardItem, { type BulletPoint } from "./CardItem";

export interface Item {
	key: string;
	avatar?: string;
	title: string;
	description?: string;
	bulletPoints?: BulletPoint[];
	active?: boolean;
	callBack?: () => void;
}

export const CardList = ({
	tileset,
	items,
	align,
}: {
	tileset?: HTMLImageElement | null;
	items: Item[];
	align?: "horizontal" | "vertical";
}) => {
	return (
		<div
			className={`${styles["container"]} ${align ? styles["align-" + align] : ""}`}
		>
			{items ? (
				items.map((item) => (
					<CardItem
						tileset={tileset}
						avatar={item.avatar}
						id={item.key}
						key={item.key}
						callBack={item.callBack}
						title={item.title}
						description={item.description}
						bulletPoints={item.bulletPoints}
						active={item.active}
					/>
				))
			) : (
				<></>
			)}
		</div>
	);
};
