import { useState } from "react";
import styles from "./NewHeroForm.module.css";
import Sprite from "../../../shared/components/Sprite_copy";
import { newHeroes } from "../newHeroes";
import tilesetImg from "../../../assets/dungeontileset.png";

type HeroFormData = {
  name: string;
  attack: number;
  defense: number;
  speed: number;
  health: number;
};

type Props = {
  onSubmit: (data: HeroFormData) => void;
  onCancel: () => void;
};

const tileset = new Image();
tileset.src = tilesetImg;

export default function NewHeroForm({ onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<HeroFormData>({
    name: "",
    attack: 10,
    defense: 10,
    speed: 10,
    health: 100,
  });


  const [selectedHero, setSelectedHero] = useState<any | null>(null);

  const handleSelectHero = (hero: any) => {
    setSelectedHero(hero);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedHero) return;
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Create New Hero</h2>

        <input
        name="name"
        placeholder="Hero name"
        value={form.name}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
      />
     
      <div className={styles.heroGrid}>
        {newHeroes.map((hero) => (
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
              itemName={hero.name}
            />
          </div>
        ))}
      </div>

      <div className={styles.stats}>
        <p>❤️ {form.health}</p>
        <p>⚔️ {form.attack}</p>
        <p>🛡️ {form.defense}</p>
        <p>👟 {form.speed}</p>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" disabled={!form.name || !selectedHero}>
          Create Hero
        </button>
      </div>
    </form>
  );
}