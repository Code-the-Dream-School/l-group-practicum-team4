import React from "react";
import styles from "./CharacterPage.module.css";
import Navbar from "../../../shared/components/Navbar"

const CharacterPage = () => {
  return (
   
    <div className={styles.page}>
      <Navbar/>
      <h1>Character</h1>

      <section className={styles.profile}>
        {/* <img src="/avatar.png" alt="avatar" /> */}
        <div>
          <h2>Hero Name</h2>
          <p>Level: 1</p>
          <p>Coins: 100</p>
        </div>
      </section>

      <section className={styles.stats}>
        <p>HP: 100</p>
        <p>Attack: 20</p>
        <p>Defense: 15</p>
      </section>

      <section className={styles.equipment}>
        <h3>Equipped</h3>
        <p>Weapon: Sword</p>
        <p>Armor: Leather</p>
      </section>

      <section className={styles.inventory}>
        <h3>Inventory</h3>
        <div className={styles.grid}>
          {/* map items here */}
        </div>
      </section>
    </div>
  );
};

export default CharacterPage;