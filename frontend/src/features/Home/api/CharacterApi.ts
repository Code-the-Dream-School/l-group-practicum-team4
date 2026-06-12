import { Character, type Item } from "../../../shared/models/models";
import { api } from "../../../shared/services/api";
import { AxiosError } from "axios";
import { registerUser } from "../../auth/api/authApi";

export const getAllCharacters = async (
	userId: string,
): Promise<Character[]> => {
	try {
		const { data } = await api.get("/character", {
			params: userId ? { uid: userId } : undefined,
		});

		return data.chars.map(
			(character: any) =>
				new Character({
					id: character._id,
					name: character.name,
					health: character.health,
					attack: character.attack,
					defense: character.defense,
					speed: character.speed,
					spriteKey: character.spriteKey,
					coins: character.coins,
					inventory: character.inventory.map((item: any) => ({
						...item,
						id: item._id,
					})),
					gear: character.gear,
				}),
		);
	} catch (error: any) {
		const message =
			error?.response?.data?.message || "Failed to fetch characters";
		throw new Error(message);
	}
};

export const getCharacter = async (characterId: string) => {
	try {
		const { data } = await api.get(`/character/${characterId}`);
		if (!data || !data.char) throw new Error("Failed to get the character");

		return new Character(data.char);
	} catch (error) {
		const err = error as AxiosError<{ message?: string }>;

		if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
			console.log("Call canceled (waiting in StrictMode dev)");
			return null;
		}

		const errorMessage =
			err.response?.data?.message || "Error connecting to the server";
		throw new Error(errorMessage);
	}
};

export const createCharacter = async (
	newCharacter: Partial<Character>,
): Promise<Character> => {
	try {
		const payload = {
			...newCharacter,
			coins: newCharacter.coins ?? 0,
			inventory: newCharacter.inventory ?? [],
		};
		const { data } = await api.post("/character", payload);

		return new Character(data.char);
	} catch (error: any) {
		const message =
			error?.response?.data?.message || "Failed to create a character";
		throw new Error(message);
	}
};

export const updateCharacter = async (
	id: string,
	updatedCharacter: Partial<Character>,
): Promise<Character> => {
	try {
		const { data } = await api.patch(`/character/${id}`, updatedCharacter);

		return new Character(data.char);
	} catch (error: any) {
		const message =
			error?.response?.data?.message || "Failed to update character";
		throw new Error(message);
	}
};

export const deleteCharacter = async (id: string): Promise<string> => {
	try {
		const { data } = await api.delete(`/character/${id}`);
		return data.message;
	} catch (error: any) {
		const message =
			error?.response?.data?.message || "Failed to delete character";
		throw new Error(message);
	}
};

export const equipItem = async (characterId: string, item: Item) => {
	try {
		const body = { item: item };
		const { data } = await api.patch(
			`/character/equip?cid=${characterId}`,
			body,
		);
		if (!data || !data.updatedChar) throw new Error("Failed to equip item");

		return (data.updatedChar as Character) || null;
	} catch (error) {
		const err = error as AxiosError<{ message?: string }>;

		if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
			console.log("Call canceled (waiting in StrictMode dev)");
			return null;
		}

		const errorMessage =
			err.response?.data?.message || "Error connecting to the server";
		throw new Error(errorMessage);
	}
};

export const unEquipItem = async (characterId: string, item: Item) => {
	try {
		const body = { item: item };
		const { data } = await api.patch(
			`/character/unequip?cid=${characterId}&slot=${item.type}`,
			body,
		);
		if (!data || !data.updatedChar)
			throw new Error("Failed to unequip item");

		return (data.updatedChar as Character) || null;
	} catch (error) {
		const err = error as AxiosError<{ message?: string }>;

		if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
			console.log("Call canceled (waiting in StrictMode dev)");
			return null;
		}

		const errorMessage =
			err.response?.data?.message || "Error connecting to the server";
		throw new Error(errorMessage);
	}
};
