import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router";
// import { Provider } from "react-redux";
import App from "./App.jsx";
// import store from "./store";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* <Provider store={store}> */}
		{googleClientId ? (
			<GoogleOAuthProvider clientId={googleClientId}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</GoogleOAuthProvider>
		) : (
			<BrowserRouter>
				<App />
			</BrowserRouter>
		)}
		{/* </Provider> */}
	</StrictMode>,
);
