import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./HomePage.module.css";
import tilesetImg from "../../../assets/dungeontileset.png";
import { defaultHeroes } from "../heroes";
import Modal from "../components/Modal";
import NewHeroForm from "../components/NewHeroForm";
import HeroCard from "../components/HeroCard";

import {
  deleteCharacter,
  createCharacter,
  getAllCharacters,
  updateCharacter,
} from "../api/api";

const tileset = new Image();
tileset.src = tilesetImg;

export default function HomePage() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [editingCharacter, setEditingCharacter] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const allHeroes = [...defaultHeroes, ...characters];

  useEffect(() => {
    getAllCharacters()
      .then((data) => {
        setCharacters(data);

        if (data.length > 0) {
          setSelectedCharacter(data[0]);
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

        setCharacters((prev) =>
          prev.map((c) =>
            (c._id || c.id) === (updated._id || updated.id)
              ? updated
              : c
          )
        );

        setSelectedCharacter(updated);
      } else {
        const created = await createCharacter(formData);

        setCharacters((prev) => [...prev, created]);
        setSelectedCharacter(created);
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
        prev.filter((c) => (c._id || c.id) !== id)
      );

      setSelectedCharacter((prev) =>
        prev && (prev._id || prev.id) === id ? null : prev
      );
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
                    onSelect={() => setSelectedCharacter(character)}
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
              <NewHeroForm
                mode={editingCharacter ? "edit" : "create"}
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