import { Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import styles from "./App.module.css";

import { MarketProvider } from "./features/Marketplace/contexts/MarketContext";
import { DungeonProvider } from "./features/Dungeon/contexts/dungeonContext";

import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";

import AboutPage from "./features/About/AboutPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import DungeonPage from "./features/Dungeon/pages/dungeonPage";
import MarketplacePage from "./features/Marketplace/pages/MarketplacePage";

import ProtectedRoute from "./shared/components/ProtectedRoute";

function App() {
	return (
		<DungeonProvider>
			<MarketProvider>
				<div className={styles["app-container"]}>
					<Header title="DUNGEON BATTLE" />
					<div className={styles["route-content"]}>
						<Routes>
							<Route path="/about" element={<AboutPage />} />
							<Route
								path="/register"
								element={<RegisterPage />}
							/>
							<Route path="/login" element={<LoginPage />} />

							<Route
								path="/market"
								element={
									<ProtectedRoute>
										<MarketplacePage />
									</ProtectedRoute>
								}
							/>

							<Route
								path="/dungeon"
								element={
									<ProtectedRoute>
										<DungeonPage />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</div>
					<Footer />
					<Toaster
						toasterId="main"
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
			</MarketProvider>
		</DungeonProvider>
	);
}

export default App;