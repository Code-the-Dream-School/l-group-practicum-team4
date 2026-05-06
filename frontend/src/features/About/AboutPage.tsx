import { useState } from "react";
import styles from "./AboutPage.module.css";
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
        return "This is a mini dungeon adventure game where players explore dark corridors, fight enemies, collect items, and survive as long as possible.Each level becomes more dangerous as you go deeper. You will need strategy, timing, and courage to progress through the dungeon. Can you make it out alive?";

      case "gameplay":
        return "Enter dungeons filled with enemies and fight through them automatically using your character’s stats like health, attack, and defense. Each dungeon is made of multiple battles you must win to progress. After clearing a dungeon, you earn loot that can be used to heal or upgrade your hero, making you stronger for the next challenge.";

      case "features":
        return "Character progression system with upgradeable stats like health, attack, and defense. Collect loot after each dungeon and equip gear or use consumables to strengthen your hero. Automated combat system that focuses on strategy through stats rather than manual controls. Multiple dungeons with increasing difficulty and rewarding progression.";

      case "credits":
        return "Dungeon Mini Game is a small project inspired by retro RPG dungeon games. It focuses on basic gameplay systems such as combat, loot, and character progression.";
    }
  };

  return (
  
      <div className={styles.frame}>
       
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

         
        </aside>

        <main className={styles.main}>
          <header className={styles.header}>ABOUT THE GAME</header>

          <div className={styles.content}>
            <h2 className={styles.title}>WELCOME TO DUNGEON!</h2>

            <div className={styles.heroRow}>
              <img src={avatar} alt="hero" className={styles.hero} />

              <p className={styles.text}>{getText()}</p>
            </div>
          
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

