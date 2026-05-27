import { Navigate, Outlet } from "react-router";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function MainLayout() {
	if (!localStorage.getItem("access_token")) {
		return <Navigate to="/login" />;
	}
	return (
		<>
			<div className="bg-base-200 flex flex-col min-h-screen">
				<Navbar />
				<main className="grow w-full">
					<Outlet />
				</main>

				<Footer />
			</div>
		</>
	);
}
