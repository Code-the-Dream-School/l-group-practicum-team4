import { useState, useEffect } from "react";
import styles from "./NewHeroForm.module.css";
import Sprite from "../../../shared/components/Sprite_for_pages";
import tilesetImg from "../../../assets/dungeontileset.png";

type HeroTemplate = {
  id: string;
  spriteKey: string;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  health: number;
};

type HeroFormData = {
  name: string;
};

type Props = {
  hero: HeroTemplate;
  onSubmit: (data: HeroFormData) => void;
  onCancel: () => void;
};

const tileset = new Image();
tileset.src = tilesetImg;

export default function EditHeroForm({ hero, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(hero.name);

  useEffect(() => {
    setName(hero.name);
  }, [hero]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Edit Hero</h2>

        <div className={styles.preview}>
        <Sprite
          tileset={tileset}
          size={90}
          itemName={hero.spriteKey}
        />
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Hero name"
      />

      <div className={styles.actions}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit">
          Update Hero
        </button>
      </div>
    </form>
  );
}