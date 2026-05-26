import styles from "./HeroCard.module.css";
import Sprite from "../../../shared/components/Sprite_copy";

type HeroCardProps = {
  character: any;
  selected: boolean;
  tileset: HTMLImageElement;

  onSelect: () => void;
  onEdit: () => void;
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
      className={`${styles.card} ${
        selected ? styles.active : ""
      }`}
      onClick={onSelect}
    >
     
      <div className={styles.avatarCircle}>
        <Sprite
          tileset={tileset}
          size={70}
          itemName={character.name}
        />
      </div>
     
      <h3 className={styles.heroName}>
        {character.name}
      </h3>

      <span className={styles.level}>
        Level {character.level || 1}
      </span>
     
      <div className={styles.statsGrid}>
        <div>❤️ {character.hp}</div>
        <div>⚔️ {character.attack}</div>
        <div>🛡️ {character.defense}</div>
        <div>👟 {character.speed}</div>
      </div>

      <div className={styles.actions}>
        <button className={styles.selectBtn}>
          SELECT
        </button>

        {character.isDefault && (
          <div className={styles.iconActions}>
            <button
              className={styles.iconBtn}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
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
        )}
      </div>
    </div>
  );
}