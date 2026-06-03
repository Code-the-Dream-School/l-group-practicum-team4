import { useEffect, useState, createContext, useContext } from "react";

import type { Character } from "../../../shared/models/models";
import {
  createCharacter as apiCreateCharacter,
  updateCharacter as apiUpdateCharacter,
  deleteCharacter as apiDeleteCharacter,
  getAllCharacters,
} from "../api/CharacterApi";


type CharacterContextType = {
  characters: Character[];
  selectedCharacter: Character | null;
  loading: boolean;

  fetchCharacters: () => Promise<void>;
  createCharacter: (data: any) => Promise<void>;
  updateCharacter: (id: string, data: any) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  selectCharacter: (character: Character) => void;
};

export const CharacterContext = createContext<CharacterContextType | undefined>( undefined);

export const CharacterProvider = ({ children,}:{ children: React.ReactNode; }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCharacters = async () => {
    try {
      setLoading(true);

      const data = await getAllCharacters();

      setCharacters(data);

      if (data.length > 0 && !selectedCharacter) {
        setSelectedCharacter(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const selectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };


  const createCharacterFn = async (data: any) => {
    try {
      const created = await apiCreateCharacter(data);

      setCharacters((prev) => [...prev, created]);
      setSelectedCharacter(created);
    } catch (err) {
      console.error(err);
    }
  };


  const updateCharacterFn = async (id: string, data: any) => {
    try {
      const updated = await apiUpdateCharacter(id, data);
      setCharacters(prev => {const next = prev.map(c => c.id === updated.id ? updated : c);

      return next;
      });

      setSelectedCharacter(updated);
    } catch (err) {
      console.error(err);
    }
  };
  
  const deleteCharacterFn = async (id: string) => {
    try {
      await apiDeleteCharacter(id);

      setCharacters((prev) =>
        prev.filter((c) => (c.id !== id))
      );

      setSelectedCharacter((prev) =>
        prev && (prev.id === id ? null : prev));
    } catch (err) {
      console.error(err);
    }
  };


useEffect(() => {
  fetchCharacters();
}, []);


  return (
    <CharacterContext.Provider value={{
      characters,
      selectedCharacter,
      loading,

      fetchCharacters,
      createCharacter: createCharacterFn,
      updateCharacter: updateCharacterFn,
      deleteCharacter: deleteCharacterFn,

      selectCharacter,
    }}>
      {children}
    </CharacterContext.Provider>
  );
};