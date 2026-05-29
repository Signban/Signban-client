import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = "signban_theme";

export const THEME = {
	LIGHT: "light",
	DARK: "dark",
};

function getInitialTheme() {
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

	if (savedTheme === THEME.LIGHT || savedTheme === THEME.DARK) {
		return savedTheme;
	}

	const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
	return prefersDark ? THEME.DARK : THEME.LIGHT;
}

export function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState(getInitialTheme);

	const isDark = theme === THEME.DARK;
	const isLight = theme === THEME.LIGHT;

	const setTheme = (nextTheme) => {
		if (nextTheme !== THEME.LIGHT && nextTheme !== THEME.DARK) return;
		setThemeState(nextTheme);
	};

	const toggleTheme = () => {
		setThemeState((prevTheme) =>
			prevTheme === THEME.DARK ? THEME.LIGHT : THEME.DARK,
		);
	};

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			isDark,
			isLight,
			setTheme,
			toggleTheme,
		}),
		[theme, isDark, isLight],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}

	return context;
}
