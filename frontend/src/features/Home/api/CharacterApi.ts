import axios from "axios";
import { Character } from "../../../shared/models/models copy";

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
    
    return data.chars.map((character: any) =>
      new Character({
        id: character._id,
        name: character.name,
        health: character.health,
        attack: character.attack,
        defense: character.defense,
        speed: character.speed,
        spriteKey: character.spriteKey,
      }));

  } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to fetch characters";
    throw new Error (message)
  }
};


export const createCharacter = async (newCharacter: Partial<Character>): Promise<Character> => {
  try {
    const { data } = await axios.post(
      BASE_URL,
      newCharacter,
      {headers: getAuthHeaders(),}
    );

    return new Character({
      id: data.char._id,
      name: data.char.name,
      health: data.char.health,
      attack: data.char.attack,
      defense: data.char.defense,
      speed: data.char.speed,
      spriteKey: data.char.spriteKey,
    });

  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to create a character";
    throw new Error(message);
  }};


export const updateCharacter = async (id: string, updatedCharacter: Partial<Character>): Promise<Character> => {
  try {
    const { data } = await axios.patch(
      `${BASE_URL}/${id}`,
      updatedCharacter,
      {headers: getAuthHeaders(),}
    );
    return new Character({
      id: data.char._id,
      name: data.char.name,
      health: data.char.health,
      attack: data.char.attack,
      defense: data.char.defense,
      speed: data.char.speed,
      spriteKey: data.char.spriteKey,
    });
  
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to update character";
    throw new Error(message);
  }
};


export const deleteCharacter = async (id: string): Promise<string> => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/${id}`,
      {headers: getAuthHeaders(),}
    );

    return data.message;
  
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to delete character";
    throw new Error(message);
  }
};


// export const buySellItem = async (
//   cid: string,
//   iid: string,
//   buy: boolean
// ): Promise<Character> => {
//   try {
//     const { data } = await axios.post(
//       `${BASE_URL}/buy-sell`,
//       null,
//       {
//         params: {
//           cid,
//           iid,
//           buy: buy.toString()
//         },
//         headers: getAuthHeaders()
//       }
//     );

//     return new Character({
//       id: data.updatedChar._id,
//       name: data.updatedChar.name,
//       health: data.updatedChar.health,
//       attack: data.updatedChar.attack,
//       defense: data.updatedChar.defense,
//       speed: data.updatedChar.speed,
//       spriteKey: data.updatedChar.spriteKey,
//     });
//   } catch (error: any) {
//     throw new Error(
//       error?.response?.data?.message || "Failed buy/sell item"
//     );
//   }
// };


// export const equipItem = async (
//   cid: string,
//   item: any
// ): Promise<Character> => {
//   try {
//     const { data } = await axios.post(
//       `${BASE_URL}/equip`,
//       { item },
//       {
//         params: { cid },
//         headers: getAuthHeaders()
//       }
//     );

//     return new Character({
//       id: data.updatedChar._id,
//       name: data.updatedChar.name,
//       health: data.updatedChar.health,
//       attack: data.updatedChar.attack,
//       defense: data.updatedChar.defense,
//       speed: data.updatedChar.speed,
//       spriteKey: data.updatedChar.spriteKey,
//     });
//   } catch (error: any) {
//     throw new Error(
//       error?.response?.data?.message || "Failed to equip item"
//     );
//   }
// };


// export const unequipItem = async (
//   cid: string,
//   slot: string
// ): Promise<Character> => {
//   try {
//     const { data } = await axios.post(
//       `${BASE_URL}/unequip`,
//       null,
//       {
//         params: { cid, slot },
//         headers: getAuthHeaders()
//       }
//     );

//     return new Character({
//       id: data.updatedChar._id,
//       name: data.updatedChar.name,
//       health: data.updatedChar.health,
//       attack: data.updatedChar.attack,
//       defense: data.updatedChar.defense,
//       speed: data.updatedChar.speed,
//       spriteKey: data.updatedChar.spriteKey,
//     });
//   } catch (error: any) {
//     throw new Error(
//       error?.response?.data?.message || "Failed to unequip item"
//     );
//   }
// };

