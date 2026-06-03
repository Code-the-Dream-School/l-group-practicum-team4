import { useContext } from "react";
import { CharacterContext } from "../context/CharacterContext";

export const useCharacter = () => {
  const context = useContext(CharacterContext);

  if (!context) {
    throw new Error("useCharacter must be used within CharacterProvider");
  }

  return context;
};