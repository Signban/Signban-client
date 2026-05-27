import { Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/mainlayout";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	return (
		<>
			<Routes>
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />} />
				</Route>

				<Route element={<MainLayout />}>
					<Route path="/" element={<BoardPage />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
			<ToastContainer
				position="bottom-left"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnHover
			/>
		</>
	);
}

export default App;
