import type { Character } from "../../shared/models/models"

export const defaultHeroes: Character[] = [
  {
    "_id": "1",
    "name": "Knight",
    "spriteKey": "Knight",
    "type": "player",
    "role": "tank",
    "hp": 120,
    "attack": 18,
    "defense": 20,
    "speed": 8
  },
  {
    "_id": "2",
    "name": "Mage",
    "spriteKey": "Mage",
    "type": "player",
    "role": "magic",
    "hp": 80,
    "attack": 30,
    "defense": 8,
    "speed": 10
  },
  {
    "_id": "3",
    "name": "Helmet Warrior",
    "spriteKey": "Helmet Warrior",
    "type": "player",
    "role": "agile",
    "hp": 90,
    "attack": 22,
    "defense": 10,
    "speed": 18
  },
  {
    "_id": "4",
    "name": "Horned Warrior",
    "spriteKey": "Horned Warrior",
    "type": "player",
    "role": "agile",
    "hp": 90,
    "attack": 22,
    "defense": 10,
    "speed": 18
  }
 
  ]