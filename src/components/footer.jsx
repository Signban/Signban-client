export default function Footer() {
	return (
		<footer className="footer footer-center mt-auto border-t border-base-300 bg-base-100 p-6 text-base-content">
			<aside>
				<p className="text-sm text-base-content/50">
					Copyright © {new Date().getFullYear()} Signban - All rights reserved
				</p>
			</aside>
		</footer>
	);
}
