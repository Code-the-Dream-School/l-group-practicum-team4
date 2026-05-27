import { api } from "../../../shared/services/api";
import { AxiosError } from "axios";

export const getDungeon = async (dungeonId: string) => {
	try {
		const { data } = await api.get(`/dungeon/${dungeonId}`);

		return data;
	} catch (error) {
		const err = error as AxiosError<{ message?: string }>;

		if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
			console.log("Petición cancelada (esperado en StrictMode dev)");
			return null;
		}

		const errorMessage =
			err.response?.data?.message || "Error al conectar con el servidor";
		throw new Error(errorMessage);
	}
};
