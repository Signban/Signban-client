// import logo from "../assets/logo.webp";

export default function Footer() {
	return (
		<footer className="mt-auto footer footer-center bg-base-100 text-base-content p-6 mt-10 bottom-0 z-50 border-t border-base-300">
			<aside>
				<div className="flex items-center justify-center gap-3">
					{/* <img
						src={logo}
						alt="Joburaku Logo"
						className="w-7 h-7 rounded-lg object-cover"
					/> */}

					<p className="text-sm text-base-content/50">
						Copyright © {new Date().getFullYear()} - All rights reserved
					</p>
				</div>
			</aside>
		</footer>
	);
}
