import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import styles from "./App.module.css";

import { DungeonProvider } from "./features/Dungeon/contexts/dungeonContext";

import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";
import CharacterPage from "./features/Character/page/CharacterPage";
import MarketplacePage from "./features/Marketplace/page/MarketplacePage";
import DungeonPage from "./features/Dungeon/pages/dungeonPage";

function App() {
	return (
		<DungeonProvider>
			<div className={styles["app-container"]}>
				<Header title="DUNGEON BATTLE" />
				<div className={styles["route-content"]}>
					<Routes>
						<Route path="/character" element={<CharacterPage />} />
						<Route path="/dungeon" element={<DungeonPage />} />
						<Route path="/market" element={<MarketplacePage />} />
					</Routes>
				</div>
				<Footer />
				<Toaster
					position="bottom-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: "#333",
							color: "#fff",
							borderRadius: "10px",
							padding: "12px 20px",
							fontSize: "16px",
							maxWidth: "400px",
						},
						error: {
							style: {
								background: "#ef4444",
								color: "white",
							},
							iconTheme: {
								primary: "white",
								secondary: "#ef4444",
							},
						},
					}}
				/>
			</div>
		</DungeonProvider>
	);
}

export default App;
