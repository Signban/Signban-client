import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../../services/AuthService";

export default function ForgotPasswordModal({ defaultEmail = "", onClose }) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      await AuthService.forgotPassword({ email: email.trim() });
      toast.success("Reset password link has been sent to your email");
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset password link";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md rounded-3xl p-8">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
        >
          ✕
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-base-content">
            Reset your password
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-base-content/60">
            Enter your Signban account email. We'll send you a link to create a
            new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="form-control">
            <div className="label">
              <span className="label-text font-medium">Email</span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="example@mail.com"
              className="input input-bordered w-full"
            />
          </label>

          <div className="alert alert-info mt-4">
            <span className="text-sm">
              A reset password link will be sent to your email. Open the link to
              set a new password.
            </span>
          </div>

          <div className="modal-action mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn btn-ghost"
            >
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={handleClose}>
        <button type="button">close</button>
      </div>
    </div>
  );
}
