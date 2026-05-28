import { Navigate, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import BoardPage from "./pages/BoardPage";
import NotFoundPage from "./pages/NotFoundPage";
import BoardDetailPage from "./pages/BoardDetail";
import RegisterPage from "./pages/RegisterPage";
import CardDetailModalContent from "./components/modals/CardDetailModalContent";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<BoardPage />} />
          <Route path="/dashboard/detail" element={<BoardDetailPage />} />
          <Route path="/dashboard/:id" element={<BoardDetailPage />} />
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
