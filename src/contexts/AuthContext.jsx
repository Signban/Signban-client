import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext(null);

async function getCurrentUser() {
	const response = await AuthService.currentUser();
	return response;
}

export function AuthProvider({ children }) {
	const [accessToken, setAccessToken] = useState(() =>
		localStorage.getItem("access_token"),
	);
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingUser, setLoadingUser] = useState(true);

	const isAuthenticated = Boolean(accessToken);

	const clearSession = () => {
		localStorage.removeItem("access_token");
		setAccessToken(null);
		setCurrentUser(null);
	};

	const fetchCurrentUser = async () => {
		try {
			setLoadingUser(true);

			if (!localStorage.getItem("access_token")) {
				setCurrentUser(null);
				return;
			}

			const user = await getCurrentUser();
			setCurrentUser(user);
		} catch (error) {
			console.log(error);
			clearSession();
		} finally {
			setLoadingUser(false);
		}
	};

	const saveSession = async (token) => {
		localStorage.setItem("access_token", token);
		setAccessToken(token);

		const user = await getCurrentUser();
		setCurrentUser(user);
	};

	const login = async (payload) => {
		try {
			setLoading(true);
			const response = await AuthService.login(payload);

			await saveSession(response.access_token);

			return response;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		clearSession();
	};

	useEffect(() => {
		fetchCurrentUser();
	}, []);

	useEffect(() => {
		const handleUnauthorized = () => clearSession();
		window.addEventListener("auth:unauthorized", handleUnauthorized);

		return () => {
			window.removeEventListener("auth:unauthorized", handleUnauthorized);
		};
	}, []);

	const value = useMemo(
		() => ({
			accessToken,
			currentUser,
			isAuthenticated,
			loading,
			loadingUser,
			login,
			logout,
			fetchCurrentUser,
		}),
		[accessToken, currentUser, isAuthenticated, loading, loadingUser],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error("useAuth must be used inside AuthProvider");
	}

	return context;
}
