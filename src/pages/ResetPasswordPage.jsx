import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import AuthService from "../services/AuthService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!newPassword.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);
      await AuthService.resetPassword({ token, newPassword });
      toast.success("Password has been reset successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="mb-4">
            <span className="badge badge-primary">Signban</span>
          </div>

          <h2 className="text-4xl font-bold text-base-content">
            Set New Password
          </h2>

          <p className="mt-3 text-base-content/60">
            Enter your new password below.
          </p>
        </div>

        <div className="card border border-base-300 bg-base-100 shadow-xl">
          <div className="card-body gap-5">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-medium">New Password</span>
                </div>

                <input
                  disabled={loading}
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type="password"
                  placeholder="Enter your new password"
                  className="input input-bordered w-full"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
