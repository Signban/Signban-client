import { Navigate, Outlet, useLocation } from "react-router";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useAuth } from "../contexts/AuthContext";

export default function MainLayout() {
	const location = useLocation();
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return (
		<div className="flex min-h-screen flex-col bg-base-200">
			<Navbar />

			<main className="grow">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
}
