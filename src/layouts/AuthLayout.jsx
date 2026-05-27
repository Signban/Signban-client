import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function AuthLayout() {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return <Outlet />;
}
