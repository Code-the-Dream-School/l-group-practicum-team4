import axios from "axios";
import { Character } from "../../../shared/models/models";

const BASE_URL = "http://localhost:8080/api/character";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No auth token found');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export const getAllCharacters = async():Promise <Character[]> => {
  try {
    const {data} = await axios.get(BASE_URL, {headers: getAuthHeaders()});
    
  return data.characters.map((character: any) =>
    new Character({
      name: character.name,
      health: character.health,
      attack: character.attack,
      defense: character.defense,
      speed: character.speed,
    })
);
  } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch characters";
    throw new Error (message)
  }
  };


export const createCharacter = async (
  newCharacter: Partial<Character>
): Promise<Character> => {
  try {
    const { data } = await axios.post(
      BASE_URL,
      newCharacter,
      {
        headers: getAuthHeaders(),
      }
    );

    return new Character({
      // id: data.char._id,
      name: data.char.name,
      health: data.char.health,
      attack: data.char.attack,
      defense: data.char.defense,
      speed: data.char.speed,
    });
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Failed to create a character";

    throw new Error(message);
  }
};

export const updateCharacter = async (
  id: string,
  updatedCharacter: Partial<Character>
): Promise<Character> => {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/${id}`,
      updatedCharacter,
      {
        headers: getAuthHeaders(),
      }
    );

    return new Character({
      // id: data.char._id,
      name: data.char.name,
      health: data.char.health,
      attack: data.char.attack,
      defense: data.char.defense,
      speed: data.char.speed,
    });
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Failed to update character";

    throw new Error(message);
  }
};


export const deleteCharacter = async (
  id: string
): Promise<string> => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return data.message;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Failed to delete character";

    throw new Error(message);
  }
};




