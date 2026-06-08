import type { Item } from "../../../shared/models/models";
import { api } from "../../../shared/services/api";

export const getItems = async (): Promise<Item[]> => {
  try {
    const { data } = await api.get("/item");
    const items = data.items;

    if (!items) return [];

    return items.map((item: any) => ({
      ...item,
      
    }));
  } catch {
    return [];
  }
};


export const getItem = async (id: string) => {
  const { data } = await api.get(`/item/${id}`);
  return data.item;
};


export const createItem = async (data: any) => {
  const res = await api.post("/item", data);
  return res.data.item;
};


export const updateItem = async (id: string, data: any) => {
  const res = await api.put(`/item/${id}`, data);
  return res.data.item;
};


export const deleteItem = async (id: string) => {
  const res = await api.delete(`/item/${id}`);
  return res.data.message;
};



export const buySellItem = async (
  charId: string,
  item: Item,
  buy: boolean
) => {
   
  if (!item) {
    throw new Error("Item missing id");
  }

  const { data } = await api.patch(
    `/character/buysell?cid=${charId}&iid=${item}&buy=${buy}`
  );

  return data.updatedChar;
};


export const equipItem = async (charId: string, item: Item) => {
  const { data } = await api.patch(`/character/equip?cid=${charId}`, {
    item,
  });

  return data;
};

export const unequipItem = async (
  charId: string,
  slot: "weapon" | "armor" | "helmet" | "shield",
  item: Item
) => {
  const { data } = await api.patch(
    `/character/unequip?cid=${charId}&slot=${slot}`,
    {
      item: {
        name: item.name,
        type: item.type,
      },
    }
  );

  return data;
};