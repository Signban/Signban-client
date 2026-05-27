import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";

const navItems = [
	{
		label: "Dashboard",
		path: "/dashboard",
	},
];

function getAvatarUrl(name) {
	return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

export default function Navbar() {
	const navigate = useNavigate();
	const { currentUser, logout } = useAuth();
	const { theme, isDark, toggleTheme } = useTheme();

	const logo = isDark ? logoDark : logoLight;
	const displayName = currentUser?.name || currentUser?.email || "Signban User";
	const displayEmail = currentUser?.email || "-";
	const avatarUrl = currentUser?.avatarUrl || getAvatarUrl(displayName);

	const handleLogout = () => {
		logout();
		navigate("/login", { replace: true });
	};

	return (
		<div className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100 px-4 shadow-sm sm:px-6">
			<div className="navbar-start w-auto">
				<div className="dropdown lg:hidden">
					<div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h7"
							/>
						</svg>
					</div>

					<ul
						tabIndex={0}
						className="menu dropdown-content z-[60] mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow"
					>
						{navItems.map((item) => (
							<li key={item.path}>
								<Link to={item.path}>{item.label}</Link>
							</li>
						))}
					</ul>
				</div>

				<Link to="/dashboard" className="flex items-center gap-3">
					<img
						src={logo}
						alt="Signban Logo"
						className="h-18 w-auto object-contain"
					/>
				</Link>
			</div>

			<div className="navbar-center ml-6 hidden flex-1 justify-start lg:flex">
				<ul className="menu menu-horizontal px-1">
					{navItems.map((item) => (
						<li key={item.path}>
							<NavLink
								to={item.path}
								className={({ isActive }) => (isActive ? "font-semibold" : "")}
							>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>
			</div>

			<div className="navbar-end ml-auto w-auto flex-none justify-end gap-2">
				<button
					type="button"
					onClick={toggleTheme}
					className="btn btn-ghost btn-circle"
					aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
					title={`Current theme: ${theme}`}
				>
					{isDark ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 3v1m0 16v1m8.66-13.66-.7.7M4.04 19.96l-.7.7M21 12h-1M4 12H3m16.96 7.96-.7-.7M4.04 4.04l-.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
							/>
						</svg>
					)}
				</button>

				<button
					type="button"
					className="btn btn-ghost btn-circle"
					aria-label="Notifications"
					title="Notification endpoint belum dibuat"
				>
					<div className="indicator">
						<span className="indicator-item badge badge-primary badge-xs">
							0
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
					</div>
				</button>

				<div className="dropdown dropdown-end">
					<div
						tabIndex={0}
						role="button"
						className="btn btn-ghost btn-circle avatar btn-sm sm:btn-md"
					>
						<div className="h-8 w-8 rounded-full ring ring-primary ring-offset-1 ring-offset-base-100 sm:h-10 sm:w-10 sm:ring-offset-2">
							<img src={avatarUrl} alt="User Avatar" />
						</div>
					</div>

					<ul
						tabIndex={0}
						className="menu dropdown-content right-0 z-[60] mt-3 w-60 max-w-[calc(100vw-1.5rem)] rounded-box border border-base-300 bg-base-100 p-2 text-left shadow"
					>
						<li className="px-3 py-2">
							<div className="block w-full p-0 text-left">
								<p className="truncate font-semibold">{displayName}</p>
								<p className="truncate text-xs text-base-content/60">
									{displayEmail}
								</p>
							</div>
						</li>

						<div className="divider my-1"></div>

						<li>
							<button type="button" onClick={toggleTheme}>
								Switch to {isDark ? "Light" : "Dark"} Theme
							</button>
						</li>

						<li>
							<Link to="/settings">Settings</Link>
						</li>

						<li>
							<button
								type="button"
								onClick={handleLogout}
								className="text-error"
							>
								Logout
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
