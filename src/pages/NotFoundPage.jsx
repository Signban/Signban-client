import { Link } from "react-router";

export default function NotFoundPage() {
	return (
		<section className="min-h-screen bg-base-200 flex items-center justify-center px-6">
			<div className="max-w-2xl text-center">
				<div className="text-9xl font-black text-primary mb-4">404</div>

				<h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>

				<p className="text-base-content/70 text-lg mb-8">
					Sorry, the page you are looking for does not exist or has been moved.
				</p>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link to="/" className="btn btn-primary">
						Back to Home
					</Link>
				</div>
			</div>
		</section>
	);
}
