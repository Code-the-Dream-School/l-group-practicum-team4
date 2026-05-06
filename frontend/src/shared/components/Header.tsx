import { NavLink } from "react-router";
import styles from "./Header.module.css";

function Header({ title }: { title: string }) {
	return (
		<header className={styles["header"]}>
			<h1>{title}</h1>
			<nav>
				<NavLink
					to="/"
					className={({ isActive }) => {
						return isActive
							? styles["navlink-active"]
							: styles["navlink"];
					}}
				>
					HOME
				</NavLink>
				<NavLink
					to="/dungeon"
					className={({ isActive }) => {
						return isActive
							? styles["navlink-active"]
							: styles["navlink"];
					}}
				>
					DUNGEON
				</NavLink>
				<NavLink
					to="/market"
					className={({ isActive }) => {
						return isActive
							? styles["navlink-active"]
							: styles["navlink"];
					}}
				>
					MARKET
				</NavLink>
				<NavLink
					to="/about"
					className={({ isActive }) => {
						return isActive
							? styles["navlink-active"]
							: styles["navlink"];
					}}
				>
					ABOUT
				</NavLink>
			</nav>
		</header>
	);
}

export default Header;
