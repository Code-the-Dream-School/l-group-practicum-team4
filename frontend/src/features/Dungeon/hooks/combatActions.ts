import { Character } from "../../../shared/models/models";

export const actionTypes = {
	ATTACK: "attack",
	CONSUME: "comsume",
} as const;

export type ActionType = (typeof actionTypes)[keyof typeof actionTypes];

export const combatActionHandler = (
	attackChar: Character,
	defendChar: Character,
	action: ActionType,
) => {
	switch (action) {
		case actionTypes.ATTACK: {
			const damage = Math.max(
				1,
				attackChar.attackTotal - defendChar.defenseTotal / 2,
			);
			defendChar.health =
				damage <= defendChar.health ? defendChar.health - damage : 0;
		}
	}
};
