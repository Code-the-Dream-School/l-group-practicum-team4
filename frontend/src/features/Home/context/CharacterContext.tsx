import {
	useEffect,
	useState,
	createContext,
	type Dispatch,
	type SetStateAction,
} from "react";
import { Player } from "../../../shared/models/models";
import type { Character, Item } from "../../../shared/models/models";
import {
	createCharacter as apiCreateCharacter,
	updateCharacter as apiUpdateCharacter,
	deleteCharacter as apiDeleteCharacter,
	getAllCharacters,
	getCharacter,
	equipItem,
	unEquipItem,
} from "../api/CharacterApi";

type CharacterContextType = {
	characters: Character[];
	selectedCharacter: Player | null;
	loading: boolean;
	setCharacterUpdated: Dispatch<SetStateAction<boolean>>;

	fetchCharacters: () => Promise<void>;
	getCharacter: (characterId: string) => Promise<Character | null>;
	createCharacter: (data: any) => Promise<void>;
	updateCharacter: (id: string, data: any) => Promise<void>;
	deleteCharacter: (id: string) => Promise<void>;
	selectCharacter: (character: Character | null) => void;
	equipItem: (characterId: string, item: Item) => Promise<Character | null>;
	unEquipItem: (characterId: string, item: Item) => Promise<Character | null>;
	moveCharacter: (x: number, y: number, facing: string) => void;
};

export const CharacterContext = createContext<CharacterContextType | undefined>(
	undefined,
);

export const CharacterProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedCharacter, setSelectedCharacter] = useState<Player | null>(
		null,
	);
	const [characterUpdated, setCharacterUpdated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token"),
	);

	useEffect(() => {
		const syncToken = () => {
			setToken(localStorage.getItem("token"));
		};

		window.addEventListener("storage", syncToken);

		return () => window.removeEventListener("storage", syncToken);
	}, []);

	const getUserIdFromToken = (): string | null => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return null;

			const decoded = JSON.parse(atob(token.split(".")[1]));
			return decoded?.userId || decoded?.id || decoded?.sub || null;
		} catch (err) {
			console.error("Failed to decode token:", err);
			return null;
		}
	};

	const fetchCharacters = async () => {
		try {
			setLoading(true);

			const userId = getUserIdFromToken();

			if (!userId) {
				console.warn("No userId found");
				return;
			}
			const data = await getAllCharacters(userId);

			setCharacters(data);

			if (data.length <= 0) return;

			const char = new Player(data[0]);

			setSelectedCharacter(char);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const selectCharacter = (character: Player | null) => {
		setSelectedCharacter(character);
		setCharacterUpdated(true);
	};

	const createCharacterFn = async (data: any) => {
		try {
			const created = await apiCreateCharacter(data);

			setCharacters((prev) => [...prev, created]);
			setSelectedCharacter(new Player(created));
		} catch (err) {
			console.error(err);
		}
	};

	const updateCharacterFn = async (id: string, data: any) => {
		try {
			const updated = await apiUpdateCharacter(id, data);
			setCharacters((prev) => {
				const next = prev.map((c) =>
					c.id === updated.id ? updated : c,
				);

				return next;
			});

			setSelectedCharacter(new Player(updated));
		} catch (err) {
			console.error(err);
		}
	};

	const deleteCharacterFn = async (id: string) => {
		try {
			await apiDeleteCharacter(id);

			setCharacters((prev) => prev.filter((c) => c.id !== id));

			setSelectedCharacter(
				(prev) => prev && (prev.id === id ? null : prev),
			);
		} catch (err) {
			console.error(err);
		}
	};

	const moveCharacter = (x: number, y: number, facing: string) => {
		if (!selectedCharacter) return;

		selectedCharacter.x = x;
		selectedCharacter.y = y;
		selectedCharacter.facing = facing;
	};

	useEffect(() => {
		if (!characterUpdated || !selectedCharacter?.id) return;

		const fetchCharacter = async () => {
			const character = await getCharacter(selectedCharacter.id);

			if (!character) return;

			setSelectedCharacter(new Player(character));
		};

		fetchCharacter();
		setCharacterUpdated(false);
	}, [characterUpdated, selectedCharacter?.id]);

	useEffect(() => {
		fetchCharacters();
	}, []);

	return (
		<CharacterContext.Provider
			value={{
				characters,
				selectedCharacter,
				loading,
				setCharacterUpdated,

				fetchCharacters,
				getCharacter,
				createCharacter: createCharacterFn,
				updateCharacter: updateCharacterFn,
				deleteCharacter: deleteCharacterFn,

				selectCharacter,
				equipItem,
				unEquipItem,
				moveCharacter,
			}}
		>
			{children}
		</CharacterContext.Provider>
	);
};
