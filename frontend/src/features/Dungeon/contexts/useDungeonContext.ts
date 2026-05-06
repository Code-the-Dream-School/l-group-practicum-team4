import { useContext } from "react";
import { DungeonContext } from "./dungeonContext";

export function useDungeonContext() {
	const context = useContext(DungeonContext);

	if (context === undefined) {
		throw new Error(
			"useDungeonContext must be used within a DungeonProvider",
		);
	}

	return context;
}
