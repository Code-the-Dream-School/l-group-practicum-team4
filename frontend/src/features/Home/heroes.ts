import  { Character } from "../../shared/models/models copy"

  export const defaultHeroes: Character[] = [
  new Character({
    id: "1",
    name: "Knight",
    spriteKey: "Knight",
    health: 120,
    attack: 18,
    defense: 20,
    speed: 8
  }),
  new Character({
    id: "2",
    name: "Mage",
    spriteKey: "Mage",
    health: 80,
    attack: 30,
    defense: 8,
    speed: 10
  }),
  new Character({
    id: "3",
    name: "Helmet Warrior",
    spriteKey: "Helmet Warrior",
    health: 100,
    attack: 22,
    defense: 10,
    speed: 18
  }),
  new Character({
    id: "4",
    name: "Horned Warrior",
    spriteKey: "Horned Warrior",
    health: 90,
    attack: 22,
    defense: 10,
    speed: 18
  }),

];