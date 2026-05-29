import { useEffect, useRef, useState } from "react";
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
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleResetSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateAvatar = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      toast.error("Please choose an image first");
      return;
    }

    try {
      setUpdatingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", selectedImage);
      await AuthService.updateAvatar(formData);
      await fetchCurrentUser();
      handleResetSelectedImage();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update profile picture";
      toast.error(message);
    } finally {
      setUpdatingAvatar(false);
    }
  };

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
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-base-content">Account Settings</h1>
          <p className="mt-1 text-base-content/50">Manage your profile and security preferences</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="card bg-base-100 border border-base-300 shadow-md">
              <div className="card-body items-center gap-3 p-6 text-center">
                <div
                  className="relative cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-28 w-28 rounded-full object-cover ring-4 ring-base-content/10 shadow-lg" />
                  ) : currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="h-28 w-28 rounded-full object-cover ring-4 ring-base-content/10 shadow-lg" />
                  ) : (
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-content ring-4 ring-base-content/10 shadow-lg">
                      {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-base-content">{currentUser?.name || "User"}</h2>
                  <p className="text-sm text-base-content/50 break-all">{currentUser?.email}</p>
                </div>

                <div className="divider my-0"></div>

                <form onSubmit={handleUpdateAvatar} className="w-full space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 text-left">Change Profile Picture</p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={updatingAvatar}
                    className="btn btn-outline btn-sm w-full"
                  >
                    Choose Photo
                  </button>

                  {imagePreview && (
                    <p className="text-xs text-base-content/50 text-left truncate">{selectedImage?.name}</p>
                  )}

                  <p className="text-xs text-base-content/40 text-left">JPG, PNG, GIF. Max 2MB.</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={updatingAvatar}
                    className="hidden"
                  />

                  {selectedImage && (
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleResetSelectedImage}
                        disabled={updatingAvatar}
                        className="btn btn-ghost btn-sm flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updatingAvatar}
                        className="btn btn-primary btn-sm flex-1"
                      >
                        {updatingAvatar ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Upload"
                        )}
                      </button>
                    </div>
                  )}
                </form>
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

                  <div className="flex justify-end pt-6">
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

                  <div className="flex justify-end pt-3">
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
