import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./features/auth/context/AuthContext.tsx";
import { CharacterProvider } from "./features/Home/context/CharacterContext.tsx";
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>	
			<AuthProvider>
				<CharacterProvider>
					<App />	
				</CharacterProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
