import type { Character } from "../../shared/models/models"

export const defaultHeroes: Character[] = [
  {
    "_id": "hero_knight",
    "name": "Knight",
    "type": "player",
    "role": "tank",
    "hp": 120,
    "attack": 18,
    "defense": 20,
    "speed": 8
  },
  {
    "_id": "hero_mage",
    "name": "Mage",
    "type": "player",
    "role": "magic",
    "hp": 80,
    "attack": 30,
    "defense": 8,
    "speed": 10
  },
  {
    "_id": "helmet_warrior",
    "name": "Helmet Warrior",
    "type": "player",
    "role": "agile",
    "hp": 90,
    "attack": 22,
    "defense": 10,
    "speed": 18
  },
  {
    "_id": "Horned_warrior",
    "name": "Horned Warrior",
    "type": "player",
    "role": "agile",
    "hp": 90,
    "attack": 22,
    "defense": 10,
    "speed": 18
  }
 
  ]