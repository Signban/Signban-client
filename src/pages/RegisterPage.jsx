import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import AuthService from "../services/AuthService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await AuthService.register(form);
      toast.success("Account created successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-base-200">
        <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
          <section className="relative hidden overflow-hidden lg:flex">
            <img
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1600&auto=format&fit=crop"
              alt="Signban realtime kanban board"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-black/70 to-black/80"></div>

            <div className="relative z-10 flex flex-col justify-end p-14 text-white">
              <div className="max-w-lg">
                <div className="badge badge-primary badge-lg mb-5 border-0 text-white">
                  Signban
                </div>

                <h1 className="mb-5 text-5xl font-bold leading-tight">
                  Realtime Kanban for better team collaboration
                </h1>

                <p className="text-lg leading-relaxed text-white/80">
                  Manage boards, lists, cards, checklists, comments, and team
                  activity in real time — all in one workspace.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/90">
                  <div className="flex items-center gap-3">
                    <span className="badge badge-success badge-sm"></span>
                    <span>Real-time board collaboration</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge badge-warning badge-sm"></span>
                    <span>Drag & drop workflow</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="badge badge-info badge-sm"></span>
                    <span>AI checklist and priority suggestions</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
              <div className="mb-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="badge badge-primary">Signban</span>
                  <span className="badge badge-outline">Realtime Kanban</span>
                </div>

                <h2 className="text-4xl font-bold text-base-content">
                  Create Account
                </h2>

                <p className="mt-3 text-base-content/60">
                  Create a new account to get started with Signban.
                </p>
              </div>

              <div className="card border border-base-300 bg-base-100 shadow-xl">
                <div className="card-body gap-5">
                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text font-medium">Name</span>
                      </div>

                      <input
                        disabled={loading}
                        onChange={handleChange}
                        value={form.name}
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        className="input input-bordered w-full"
                      />
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="label-text font-medium">Email</span>
                      </div>

                      <input
                        disabled={loading}
                        onChange={handleChange}
                        value={form.email}
                        type="email"
                        name="email"
                        placeholder="example@mail.com"
                        className="input input-bordered w-full"
                      />
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="label-text font-medium">Password</span>
                      </div>

                      <input
                        disabled={loading}
                        onChange={handleChange}
                        value={form.password}
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        className="input input-bordered w-full"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary mt-2 w-full"
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Create Account"
                      )}
                    </button>
                  </form>

                  <p className="text-center text-sm text-base-content/70">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="link link-primary font-semibold"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
