import { useState } from "react";
import { useCharacter } from "../hook/useCharacter";
import { useNavigate } from "react-router";
import styles from "./HomePage.module.css";
import tilesetImg from "../../../assets/dungeontileset.png";
import { defaultHeroes } from "../heroes";
import Modal from "../components/Modal";
import NewHeroForm from "../components/NewHeroForm";
import EditHeroForm from "../components/EditHeroFormNew";
import HeroCard from "../components/HeroCard";


const tileset = new Image();
tileset.src = tilesetImg;

export default function HomePage() {

  const {
  characters,
  selectedCharacter,
  loading,
  selectCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} = useCharacter();

  const [editingCharacter, setEditingCharacter] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const allHeroes = [...defaultHeroes, ...characters];

  const handleCreate = () => {  
    setEditingCharacter(null);
    setShowForm(true);
  };

  const handleEdit = (character: any) => {
    setEditingCharacter({
    _id: character._id || character.id,
    name: character.name,
    spriteKey: character.spriteKey,
    health: character.health,
    attack: character.attack,
    defense: character.defense,
    speed: character.speed
  });
  setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingCharacter(null);
  };

  const handleSubmit = async (formData: any) => {   
    try {
      if (editingCharacter) {
       
       await updateCharacter(
          editingCharacter._id,
          formData
        );
       } else {
        await createCharacter(formData)
      }   
    } catch (err) {
      console.error(err);
    } finally {
      setShowForm(false);
      setEditingCharacter(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCharacter(id);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>WELCOME, ADVENTURER!</h2>

        <p className={styles.subtitle}>
          Choose your hero and continue your adventure.
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className={styles.heroGrid}>
              {allHeroes.filter(Boolean).map((character) => {
                const uid = character._id || character.id;

                return (
                  <HeroCard
                    key={uid}
                    character={character}
                    selected={
                      (selectedCharacter?._id || selectedCharacter?.id) ===
                      uid
                    }
                    tileset={tileset}
                    onSelect={() => selectCharacter(character)}
                    onEdit={() => handleEdit(character)}
                    onDelete={() => handleDelete(uid)}
                  />
                );
              })}

              <div className={styles.createCard}>
                <div className={styles.plus}>+</div>

                <h3>Create New Hero</h3>

                <p>
                  Build your own custom adventurer for the dungeon.
                </p>

                <button className={styles.createBtn} onClick={handleCreate}>
                  CREATE HERO
                </button>
              </div>
            </div>

            <Modal isOpen={showForm} onClose={handleCloseModal}>
              {editingCharacter ? (
  <EditHeroForm
    hero={editingCharacter}
    onSubmit={handleSubmit}
    onCancel={handleCloseModal}
  />
) : (
  <NewHeroForm
    onSubmit={handleSubmit}
    onCancel={handleCloseModal}
  />
)}
           
            </Modal>

            <div className={styles.bottomSection}>
              <div className={styles.adventureCard}>
                <h3>CONTINUE ADVENTURE</h3>
                <p>Forgotten Dungeons</p>
                <span>Level 3</span>

                <button className={styles.startBtn} onClick={() => navigate("/dungeon")}>
                  CONTINUE
                </button>
              </div>

              <div className={styles.statsCard}>
                <h3>YOUR ADVENTURE</h3>

                <div className={styles.gameStats}>
                  <div>
                    <strong>12</strong>
                    <span>Dungeons</span>
                  </div>

                  <div>
                    <strong>456</strong>
                    <span>Enemies</span>
                  </div>

                  <div>
                    <strong>12,340</strong>
                    <span>Gold</span>
                  </div>

                  <div>
                    <strong>18h</strong>
                    <span>Play Time</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}