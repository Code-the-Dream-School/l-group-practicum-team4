import { type Dungeon } from "../../../shared/models/models";
import { api } from "../../../shared/services/api";
import { AxiosError } from "axios";

export const getDungeons = async () => {
	try {
		const { data } = await api.get(`/dungeon`);

		return data;
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

export const getDungeon = async (
	dungeonId: string,
): Promise<Dungeon | null> => {
	try {
		const { data } = await api.get(`/dungeon/${dungeonId}`);

		if (!data || !data.success)
			throw new Error("Failed to get the dungeon");

		return (data.dungeon as Dungeon) || null;
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

export const newDungeon = async (
	width: number,
	height: number,
	level: number,
): Promise<Dungeon | null> => {
	try {
		const { data } = await api.get(
			`/dungeon/generate?width=${width}&height=${height}&level=${level ?? "1"}`,
		);
		if (!data || !data.success)
			throw new Error("Failed to generate dungeon");

		return (data.dungeon as Dungeon) || null;
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

export const updateDungeon = async (
	dungeon: Dungeon,
): Promise<Dungeon | null> => {
	try {
		const { data } = await api.patch(`/dungeon/${dungeon._id}`, dungeon);
		if (!data || !data.success) throw new Error("Failed to update dungeon");

		return (data.dungeon as Dungeon) || null;
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
