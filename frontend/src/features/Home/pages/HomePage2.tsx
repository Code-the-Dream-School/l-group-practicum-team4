import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./HomePage.module.css";
import tilesetImg from "../../../assets/dungeontileset.png";
import { defaultHeroes } from "../heroes";
import Modal from "../components/Modal";
import NewHeroForm from "../components/NewHeroForm";
import HeroCard from "../components/HeroCard";

import { deleteCharacter, createCharacter, getAllCharacters, updateCharacter} from "../api/api";

const tileset = new Image();
tileset.src = tilesetImg;

const normalizeHero = (hero: any) => ({
  ...hero,
  uid: hero._id || hero.id,
});

export default function HomePage() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [editingCharacter, setEditingCharacter] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const allHeroes = [
    ...defaultHeroes.map(normalizeHero),
    ...characters.map(normalizeHero),
  ];

// console.log("defaultHeroes:", defaultHeroes);
// console.log("characters:", characters);
// console.log("allHeroes:", allHeroes);

  useEffect(() => {
    getAllCharacters()
      .then((data) => {
        const normalized = data.map(normalizeHero);

        setCharacters(normalized);

        if (normalized.length > 0) {
          setSelectedCharacter(normalized[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = () => {
    setEditingCharacter(null);
    setShowForm(true);
  };

  const handleEdit = (character: any) => {
    setEditingCharacter(character);
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingCharacter(null);
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingCharacter) {
        const updated = await updateCharacter(
          editingCharacter._id,
          formData
        );

        const normalized = normalizeHero(updated);

        setCharacters((prev) =>
          prev.map((c) =>
            c.uid === normalized.uid ? normalized : c
          )
        );

        setSelectedCharacter(normalized);
      } else {
        const created = await createCharacter(formData);
        const normalized = normalizeHero(created);

        setCharacters((prev) => [...prev, normalized]);
        setSelectedCharacter(normalized);
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

      setCharacters((prev) =>
        prev.filter((c) => c.uid !== id)
      );

      setSelectedCharacter((prev) =>
        prev && prev.uid === id ? null : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          WELCOME, ADVENTURER!
        </h2>

        <p className={styles.subtitle}>
          Choose your hero and continue your adventure.
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className={styles.heroGrid}>
              {allHeroes
                .filter(Boolean)
                .map((character) => (
                  <HeroCard
                    key={character.uid}
                    character={character}
                    selected={
                      selectedCharacter?.uid ===
                      character.uid
                    }
                    tileset={tileset}
                    onSelect={() =>
                      setSelectedCharacter(character)
                    }
                    onEdit={() =>
                      handleEdit(character)
                    }
                    onDelete={() =>
                      handleDelete(character.uid)
                    }
                  />
                ))}

              <div className={styles.createCard}>
                <div className={styles.plus}>+</div>

                <h3>Create New Hero</h3>

                <p>
                  Build your own custom adventurer for
                  the dungeon.
                </p>

                <button
                  className={styles.createBtn}
                  onClick={handleCreate}
                >
                  CREATE HERO
                </button>
              </div>
            </div>

            <Modal
              isOpen={showForm}
              onClose={handleCloseModal}
            >
              <NewHeroForm
                mode={
                  editingCharacter ? "edit" : "create"
                }
                initialData={editingCharacter}
                onSubmit={handleSubmit}
                onCancel={handleCloseModal}
              />
            </Modal>

            <div className={styles.bottomSection}>
              <div className={styles.adventureCard}>
                <h3>CONTINUE ADVENTURE</h3>

                <p>Forgotten Dungeons</p>

                <span>Level 3</span>

                <button
                  className={styles.startBtn}
                  onClick={() =>
                    navigate("/dungeon")
                  }
                >
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