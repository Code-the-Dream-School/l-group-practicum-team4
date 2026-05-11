import axios from "axios";
import type { Item } from "../../../shared/models/models";

const BASE_URL = "http://localhost:8080/api/item";

export const getItems = async():Promise <Item[]> => {
  const {data} = await axios.get(BASE_URL);
  return data.items;
}