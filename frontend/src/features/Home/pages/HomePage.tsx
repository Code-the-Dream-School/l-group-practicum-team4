import { useState } from "react";
import { useCharacter } from "../hook/useCharacter";
import { useNavigate } from "react-router";
import { defaultHeroes } from "../heroes";
import tilesetImg from "../../../assets/dungeontileset.png";

import HomePageView from "./HomePageView";

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

  const normalizedCharacters = characters.map((c: any) => ({
    ...c,
    id: c._id || c.id,
  }));

  const allHeroes = [...defaultHeroes, ...normalizedCharacters];

  const handleCreate = () => {
    setEditingCharacter(null);
    setShowForm(true);
  };

  const handleEdit = (character: any) => {
    setEditingCharacter({
      ...character,
      id: character._id || character.id,
    });
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingCharacter(null);
  };

  const handleSubmit = async (formData: any) => {
    if (editingCharacter) {
      await updateCharacter(
        editingCharacter._id || editingCharacter.id,
        formData
      );
    } else {
      await createCharacter(formData);
    }

    setShowForm(false);
    setEditingCharacter(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCharacter(id);
  };


  return (
    <HomePageView
      loading={loading}
      allHeroes={allHeroes}
      selectedCharacter={selectedCharacter}
      tileset={tileset}
      showForm={showForm}
      editingCharacter={editingCharacter}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onSelect={selectCharacter}
      onCloseModal={handleCloseModal}
      onSubmit={handleSubmit}
      navigate={navigate}
    />
  );
}