import axios from "axios";
import type { Item } from "../../../shared/models/models";
import { allItems } from "../allItems";

const BASE_URL = "http://localhost:8080/api/item";

export const getItems = async (): Promise<Item[]> => {
  try {
    const { data } = await axios.get(BASE_URL);
    const items = data.items;
      
    if (!items || items.length === 0) {
      return allItems;
    }
    return items;
  } catch (err) {
    return allItems;
  }
};

export const buySellItem = async (
  characterId: string,
  itemId: string,
  buy: boolean
) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(
    `http://localhost:8080/api/character/market`,
    {},
    {
      params: {
        cid: characterId,
        iid: itemId,
        buy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data.updatedChar;
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
