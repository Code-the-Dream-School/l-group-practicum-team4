import { useState} from "react";
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
    spriteKey: "Knight",
    name: "Knight",
    health: 120,
    attack: 18,
    defense: 20,
    speed: 10,
  },
   { id: "2",
    spriteKey: "Mage",
    name: "Mage",
    health: 80,
    attack: 30,
    defense: 8,
    speed: 10,
  },
  { id: "3", 
    spriteKey: "Horned Warrior",
    name: "Horned Warrior",
    health: 90,
    attack: 22,
    defense: 10,
    speed: 10,
  },
   { id: "4",
    spriteKey: "Helmet Warrior",
    name: "Helmet Warrior",
    health: 100,
    attack: 22,
    defense: 10,
    speed: 10,
  },
   
];


export default function NewHeroForm({ onSubmit, onCancel,  }: Props) {
 
  const [selectedHero, setSelectedHero] = useState<HeroTemplate | null>(null);
  const [name, setName] = useState('')

  const handleSelectHero = (hero: HeroTemplate) => {
    setSelectedHero(hero);
    
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