import React from 'react'

import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Dungeon Game</div>

      <div className={styles.links}>
        <a href="/">Home</a>
        <a href="/dungeons">Dungeons</a>
        <a href="/inventory">Inventory</a>
        <a href="/market">Market</a>
      </div>

      <div className={styles.user}>
        <span>Coins: 1200</span>
        <span>Level: 5</span>
      </div>
    </nav>
  );
};

export default Navbar;

