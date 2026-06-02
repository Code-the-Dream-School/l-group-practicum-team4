import { useState, useEffect} from "react";
import styles from "./NewHeroForm.module.css";
import Sprite from "../../../shared/components/Sprite_for_pages";
import tilesetImg from "../../../assets/dungeontileset.png";

type HeroTemplate = {
  id: string,
  spriteKey: string,
  name: string;
  attack: number;
  defense: number;
  speed: number;
  health: number;
};

type HeroFormData = {
  name: string;
  spriteKey: string,
  health: number;
  attack: number;
  defense: number;
  speed: number;
};

type Props = {
  onSubmit: (data: HeroFormData) => void;
  onCancel: () => void;
 
};

const tileset = new Image();
tileset.src = tilesetImg;

const initialHeroes = [
  {
    id: "1",
    spriteKey: "Sportman",
    name: "Sportman",
    health: 120,
    attack: 18,
    defense: 20,
    speed: 8,
  },
  { id: "2",
    spriteKey: "Purple Girl",
    name: "Purple Girl",
    health: 80,
    attack: 30,
    defense: 8,
    speed: 10,
  },
  { id: "3", 
    spriteKey: "Grey Hair Girl",
    name: "Grey Hair Girl",
    health: 90,
    attack: 22,
    defense: 10,
    speed: 18,
  },
   { id: "4",
    spriteKey: "Brown Mage",
    name: "Brown Mage",
    health: 90,
    attack: 22,
    defense: 10,
    speed: 18,
  },
];


export default function NewHeroForm({ onSubmit, onCancel,  }: Props) {
 
  const [selectedHero, setSelectedHero] = useState<HeroTemplate | null>(null);
  const [name, setName] = useState('')
console.log("🔥 NewHeroForm is mounted");
  const handleSelectHero = (hero: HeroTemplate) => {
    setSelectedHero(hero);
    console.log("clicked hero:", hero);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHero || !name) return;
   
    onSubmit({
      name,
      spriteKey: selectedHero.spriteKey, 
      health: selectedHero.health,
      attack: selectedHero.attack,
      defense: selectedHero.defense,
      speed: selectedHero.speed,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}> Create a hero</h2>

        <input
          name="name"
          placeholder="Hero name"
          value={name}
          onChange={(e) => setName (e.target.value)}
        />
     
      <div className={styles.heroGrid}>
        {initialHeroes.map((hero) => (
          <div
            key={hero.id}
            className={`${styles.avatarCircle} ${
              selectedHero?.id === hero.id ? styles.selected : ""
            }`}
            onClick={() => handleSelectHero(hero)}             
          >
            <Sprite
              tileset={tileset}
              size={70}
              itemName={hero.spriteKey}
            />
           
         </div>
        ))}
      </div>

      <div className={styles.stats}>
        <p>❤️ {selectedHero?.health ?? "-"}</p>
        <p>⚔️ {selectedHero?.attack ?? "-"}</p>
        <p>🛡️ {selectedHero?.defense ?? "-"}</p>
        <p>👟 {selectedHero?.speed ?? "-"}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" disabled={!name || !selectedHero}>
          Create Hero
        </button>
      </div>
    </form>
  );
}