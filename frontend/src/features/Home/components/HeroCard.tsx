import styles from "./HeroCard.module.css";
import Sprite from "../../../shared/components/Sprite_for_pages";
import type { Character } from "../../../shared/models/models copy";

type HeroCardProps = {
  character: Character;
  selected: boolean;
  tileset: HTMLImageElement;
  onSelect: (character: Character)  => void;
  onEdit: (character: Character) => void;
  onDelete: () => void;
};

export default function HeroCard({
  character,
  selected,
  tileset,
  onSelect,
  onEdit,
  onDelete,
}: HeroCardProps) {

  return (
    <div
      className={`${styles.card} ${ selected ? styles.active : ""}`}
      onClick={() => onSelect(character)}
    >
      <div className={styles.avatarCircle}>
        <Sprite
          tileset={tileset}
          size={70}
          itemName={character.spriteKey}
        />
      </div>
     
      <h3 className={styles.heroName}>
        {character.name}
      </h3>

      <span className={styles.level}>
        Level {character.level ?? 1}
      </span>
     
      <div className={styles.statsGrid}>
        <div>❤️ {character.health}</div>
        <div>⚔️ {character.attack}</div>
        <div>🛡️ {character.defense}</div>
        <div>👟 {character.speed}</div>
      </div>

      <div className={styles.actions}>
        <div className={styles.iconActions}>
          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(character);
            }}
            title="Edit"
          >
            ✏️
          </button>

          <button
            className={styles.iconBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      <button className={styles.selectBtn} 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(character);
        }}>
          SELECT
      </button>
    </div>
  );
}