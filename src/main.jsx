import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ModalProvider } from "./contexts/ModalContext.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<ThemeProvider>
				<AuthProvider>
					<ModalProvider>
						<App />
					</ModalProvider>
				</AuthProvider>
			</ThemeProvider>
		</BrowserRouter>
	</StrictMode>,
);
