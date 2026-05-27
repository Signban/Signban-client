import { Link, useNavigate } from "react-router";

export default function Navbar() {
	const navigate = useNavigate();
	const handleOnLogout = () => {
		localStorage.removeItem("access_token");
		navigate("/login");
	};

	return (
		<div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-6">
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
						className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow border border-base-300"
					>
						<li>
							<Link to="/">Home</Link>
						</li>
					</ul>
				</div>

				<Link className="btn btn-ghost text-xl text-primary" to="/">
					Apps
				</Link>
			</div>

			<div className="navbar-center hidden lg:flex flex-1 justify-start ml-6">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link to="/">Home</Link>
					</li>
				</ul>
			</div>

			<div className="navbar-end gap-2">
				<button
					className="btn btn-outline btn-error btn-sm"
					onClick={handleOnLogout}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
