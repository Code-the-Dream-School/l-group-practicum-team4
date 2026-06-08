import { Character } from "../../../shared/models/models copy";
import {api} from "../../../shared/services/api"


export const getAllCharacters = async(userId: string):Promise <Character[]> => {
 try {
const { data } = await api.get("/character", {
	params: userId ? { uid: userId } : undefined,
});

    return data.chars.map((character: any) => 
        
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
        id: item._id 
      }))
    }));

  } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch characters";
    throw new Error (message)
  }
};


export const createCharacter = async (newCharacter: Partial<Character>): Promise<Character> => {
  try {
    const payload = {
      ...newCharacter,
      coins: newCharacter.coins ?? 0,
      inventory: newCharacter.inventory ?? [],
    };
    const { data } = await api.post("/character", payload);
 
    return new Character({
      id: data.char._id,
      name: data.char.name,
      health: data.char.health,
      attack: data.char.attack,
      defense: data.char.defense,
      speed: data.char.speed,
      spriteKey: data.char.spriteKey,
      coins: data.char.coins,
      inventory: data.char.inventory,
    });

  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to create a character";
    throw new Error(message);
  }};


export const updateCharacter = async (id: string, updatedCharacter: Partial<Character>): Promise<Character> => {
  try {
    const { data } = await api.patch(`/character/${id}`, updatedCharacter);
  
    return new Character({
      id: data.char._id,
      name: data.char.name,
      health: data.char.health,
      attack: data.char.attack,
      defense: data.char.defense,
      speed: data.char.speed,
      spriteKey: data.char.spriteKey,
      coins: data.char.coins,
      inventory: data.char.inventory,
    });
  
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to update character";
    throw new Error(message);
  }
};


export const deleteCharacter = async (id: string): Promise<string> => {
  try {
    const { data } = await api.delete(`/character/${id}`);
    return data.message;
  
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to delete character";
    throw new Error(message);
  }
};


