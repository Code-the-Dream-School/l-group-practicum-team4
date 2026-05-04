

import { useState } from "react";
import styles from "./AboutPage1.module.css";
import avatar from "../../assets/public/WARRIOR_big.png";
import sword from "../../assets/public/sword2.png";
import energydrink from "../../assets/public/icon_32.png";
import loot from "../../assets/public/icon_15.png";
import enemy from "../../assets/public/icon_91.png";

export default function AboutPage() {
  const [tab, setTab] = useState("story");

  const getText = () => {
    switch (tab) {
      case "story":
        return "Deep beneath the ancient lands lies a dungeon filled with enemies, treasure, and secrets. Only brave adventurers can survive its depths.";

      case "gameplay":
        return "Explore dangerous rooms, defeat enemies, and survive deeper floors of the dungeon.";

      case "features":
        return "Unlock abilities, collect loot, and upgrade your hero as you progress.";

      case "credits":
        return "Dungeon Mini Game is inspired by classic retro RPG adventures.";
    }
  };

  return (
  
      <div className={styles.frame}>
        {/* LEFT MENU */}
        <aside className={styles.sidebar}>
          <button
            className={tab === "story" ? styles.active : ""}
            onClick={() => setTab("story")}
          >
            ► STORY
          </button>

          <button
            className={tab === "gameplay" ? styles.active : ""}
            onClick={() => setTab("gameplay")}
          >
            GAMEPLAY
          </button>

          <button
            className={tab === "features" ? styles.active : ""}
            onClick={() => setTab("features")}
          >
            FEATURES
          </button>

          <button
            className={tab === "credits" ? styles.active : ""}
            onClick={() => setTab("credits")}
          >
            CREDITS
          </button>

          <div className={styles.door} />
        </aside>

        {/* MAIN PANEL */}
        <main className={styles.main}>
          <header className={styles.header}>ABOUT</header>

          <div className={styles.content}>
            <h2 className={styles.title}>WELCOME TO DUNGEON!</h2>

            <div className={styles.heroRow}>
              <img src={avatar} alt="hero" className={styles.hero} />

              <p className={styles.text}>{getText()}</p>
            </div>

          {/* <p>about the game </p> */}
          
            <div className={styles.featureBar}>
            
              <div><img src={sword} alt="sword" /> <p>EXPLORE DUNGEONS</p></div>
              <div><img src={enemy} alt="enemy" /> <p>BATTLE ENEMIES</p></div>
              <div><img src={loot} alt="loot" /><p>FIND LOOT</p></div>
              <div><img src={energydrink} alt="energy" /> <p>UPGRADE HERO</p></div>
            </div>
          </div>

          <div className={styles.aboutBox}>
            Dungeon is a retro RPG adventure inspired by classic games.
            <br />
            Thank you for playing!
          </div>
        </main>
      </div>
 
  );
}

