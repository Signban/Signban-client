import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";

export default function SettingsPage() {
  const { currentUser, fetchCurrentUser } = useAuth();

  const [nameForm, setNameForm] = useState({
    name: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [updatingName, setUpdatingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const revealFor = (setter, ms = 2000) => {
    setter(true);
    setTimeout(() => setter(false), ms);
  };

  useEffect(() => {
    setNameForm({
      name: currentUser?.name || "",
    });
  }, [currentUser]);

  const handleNameChange = (event) => {
    const { name, value } = event.target;
    setNameForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleUpdateName = async (event) => {
    event.preventDefault();

    if (!nameForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setUpdatingName(true);
      await AuthService.updateName({ name: nameForm.name.trim() });
      await fetchCurrentUser();
      toast.success("Name updated successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update name";
      toast.error(message);
    } finally {
      setUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.oldPassword) {
      toast.error("Old password is required");
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error("New password is required");
      return;
    }

    if (passwordForm.newPassword.length < 5) {
      toast.error("New password minimum 5 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("Password confirmation does not match");
      return;
    }

    try {
      setUpdatingPassword(true);
      await AuthService.updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      toast.success("Password updated successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update password";
      toast.error(message);
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <section className="min-h-[80vh] bg-base-200 px-4 py-10 md:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          
          <aside className="space-y-4">
            <div className="card bg-base-100 border border-base-300 shadow-md">
              <div className="card-body items-center gap-4 p-6 text-center">
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                    {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-1">
                    Account
                  </p>
                  <h2 className="text-lg font-bold text-base-content">
                    {currentUser?.name || "User"}
                  </h2>
                  <p className="text-sm text-base-content/60 break-all">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            {/* Update Name */}
            <div className="card bg-base-100 border border-base-300 shadow-md">
              <div className="card-body p-0">
                <div className="border-b border-base-300 px-7 py-5 flex items-center gap-4">
                  <div className="bg-primary/10 text-primary rounded-xl p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-base-content">
                      Update Name
                    </h2>
                    <p className="text-sm text-base-content/50 mt-0.5">
                      Change your display name
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleUpdateName}
                  className="px-7 py-6 space-y-5"
                >
                  <label className="form-control">
                    <div className="label pb-1.5">
                      <span className="label-text font-medium">Name</span>
                    </div>
                    <input
                      disabled={updatingName}
                      onChange={handleNameChange}
                      value={nameForm.name}
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      className="input input-bordered w-full"
                    />
                  </label>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={updatingName}
                      className="btn btn-primary px-8"
                    >
                      {updatingName ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            
            <div className="card bg-base-100 border border-base-300 shadow-md">
              <div className="card-body p-0">
                <div className="border-b border-base-300 px-7 py-5 flex items-center gap-4">
                  <div className="bg-primary/10 text-primary rounded-xl p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-base-content">
                      Change Password
                    </h2>
                    <p className="text-sm text-base-content/50 mt-0.5">
                      Update your account password
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleUpdatePassword}
                  className="px-7 py-6 space-y-5"
                >
                  <label className="form-control">
                    <div className="label pb-1.5">
                      <span className="label-text font-medium">Old Password</span>
                    </div>
                    <div className="relative">
                      <input
                        disabled={updatingPassword}
                        onChange={handlePasswordChange}
                        value={passwordForm.oldPassword}
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        placeholder="Enter your old password"
                        className="input input-bordered w-full pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => revealFor(setShowOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                      >
                        {showOldPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="form-control">
                      <div className="label pb-1.5">
                        <span className="label-text font-medium">New Password</span>
                      </div>
                      <div className="relative">
                        <input
                          disabled={updatingPassword}
                          onChange={handlePasswordChange}
                          value={passwordForm.newPassword}
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          placeholder="New password"
                          className="input input-bordered w-full pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => revealFor(setShowNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                        >
                          {showNewPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </label>

                    <label className="form-control">
                      <div className="label pb-1.5">
                        <span className="label-text font-medium">Confirm New Password</span>
                      </div>
                      <div className="relative">
                        <input
                          disabled={updatingPassword}
                          onChange={handlePasswordChange}
                          value={passwordForm.confirmNewPassword}
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmNewPassword"
                          placeholder="Confirm password"
                          className="input input-bordered w-full pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => revealFor(setShowConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                        >
                          {showConfirmPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="btn btn-primary px-8"
                    >
                      {updatingPassword ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
