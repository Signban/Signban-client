import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loadingUser } = useAuth();
  const { isDark } = useTheme();

  const logo = isDark ? logoDark : logoLight;

  useEffect(() => {
    if (!loadingUser && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loadingUser, navigate]);

  return (
    <div className="min-h-screen bg-base-100">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 bg-base-100/80 backdrop-blur-md border-b border-base-300/50">
        <Link to="/">
          <img
            src={logo}
            alt="Signban"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white rounded-xl border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            Get Started
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop"
          alt="Team collaboration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-[glow_5s_ease-in-out_infinite]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex gap-2 mb-6 animate-[fadeSlideUp_0.7s_ease_both] [animation-delay:0.1s]">
                <span className="badge badge-primary">Signban</span>
                <span className="badge badge-outline text-white/70 border-white/20">
                  Realtime Kanban
                </span>
              </div>

              <h1 className="text-5xl lg:text-[3.75rem] font-bold text-white leading-tight mb-6 animate-[fadeSlideUp_0.7s_ease_both] [animation-delay:0.25s]">
                Kerja tim lebih{" "}
                <span className="text-primary">terorganisir</span>,
                <br />
                lebih cepat selesai.
              </h1>

              <p className="text-lg text-white/65 mb-10 max-w-lg leading-relaxed animate-[fadeSlideUp_0.7s_ease_both] [animation-delay:0.4s]">
                Signban membantu tim kamu mengelola task secara realtime dengan
                kanban board, drag & drop, dan AI yang otomatis buat checklist
                serta tentukan prioritas.
              </p>

              <div className="flex flex-wrap gap-4 animate-[fadeSlideUp_0.7s_ease_both] [animation-delay:0.55s]">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Mulai Gratis
                </Link>
                <Link
                  to="/login"
                  className="btn btn-lg bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Sign In
                </Link>
              </div>

              <div className="mt-12 flex flex-col gap-3 animate-[fadeSlideUp_0.7s_ease_both] [animation-delay:0.7s]">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="badge badge-success badge-sm"></span>
                  Board collaboration realtime
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="badge badge-warning badge-sm"></span>
                  Drag & drop workflow
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="badge badge-info badge-sm"></span>
                  AI checklist & priority suggestion
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-start justify-end gap-5 animate-[fadeSlideUp_0.7s_ease_both] [animation-delay:0.6s]">
              {/* Column 1 */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-56">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                    In Progress
                  </span>
                </div>

                <div className="bg-white/8 rounded-xl p-3 mb-3 border border-white/10 animate-[float_3.5s_ease-in-out_infinite]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-error badge-xs text-white">
                      Urgent
                    </span>
                    <span className="text-xs text-white/35">3 Jun</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">
                    Deploy API ke production
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
                      S
                    </div>
                  </div>
                </div>

                <div className="bg-white/8 rounded-xl p-3 border border-white/10 animate-[float_3.5s_ease-in-out_infinite] [animation-delay:1s]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-warning badge-xs">High</span>
                    <span className="text-xs text-white/35">5 Jun</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">
                    Build auth flow
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs text-white font-bold">
                      R
                    </div>
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs text-white font-bold">
                      A
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-52 mt-12 animate-[float_4.5s_ease-in-out_infinite] [animation-delay:0.7s]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                    Done
                  </span>
                </div>

                <div className="bg-white/8 rounded-xl p-3 mb-3 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-success badge-xs">Low</span>
                    <span className="text-xs text-white/35">27 May</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">
                    Setup project repo
                  </p>
                </div>

                <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-info badge-xs">Medium</span>
                    <span className="text-xs text-white/35">29 May</span>
                  </div>
                  <p className="text-sm text-white font-medium leading-snug">
                    Design DB schema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            document
              .getElementById("cta")
              .scrollIntoView({ behavior: "smooth" })
          }
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="text-sm font-semibold tracking-[0.25em] text-white/70 uppercase group-hover:text-violet-300 transition-colors duration-300">
            Mulai Sekarang
          </span>
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.9)] animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-violet-400/50 -mt-3 animate-bounce [animation-delay:0.15s]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>
      </section>

      <section id="features" className="bg-base-200 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="badge badge-primary badge-outline mb-4">
              Features
            </span>
            <h2 className="text-4xl font-bold text-base-content mb-3">
              Semua yang tim kamu butuhkan
            </h2>
            <p className="text-base-content/60 max-w-xl leading-relaxed">
              Dari planning sampai delivery, Signban punya semua tools yang
              dibutuhkan untuk kerja tim yang efisien.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-base-100 rounded-3xl p-8 border border-base-300 hover:border-primary/40 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-xs text-success font-medium">Live</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-base-content mb-3">
                Realtime Board Collaboration
              </h3>
              <p className="text-base-content/60 leading-relaxed">
                Semua anggota tim melihat perubahan secara langsung tanpa perlu
                refresh. Drag card, ubah status, tambah komentar — semua
                terupdate otomatis untuk semua orang di saat yang sama.
              </p>
            </div>

            <div className="bg-base-100 rounded-3xl p-8 border border-base-300 hover:border-primary/40 transition-colors duration-300">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="badge badge-primary badge-sm mb-4">
                AI Powered
              </span>
              <h3 className="text-xl font-bold text-base-content mb-3">
                AI Checklist & Priority
              </h3>
              <p className="text-base-content/60 leading-relaxed text-sm">
                AI otomatis generate checklist dan tentukan prioritas
                berdasarkan judul dan deskripsi card kamu.
              </p>
            </div>

            <div className="lg:col-span-3 bg-base-100 rounded-3xl p-8 border border-base-300 hover:border-primary/40 transition-colors duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-base-content mb-1">
                    Drag & Drop Workflow
                  </h3>
                  <p className="text-base-content/60 text-sm">
                    Pindahkan card antar list dengan mudah. Workflow yang
                    intuitif membuat semua anggota tim bisa langsung pakai tanpa
                    perlu training.
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                  <div className="badge badge-outline">Backlog</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-base-content/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div className="badge badge-outline">In Progress</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-base-content/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <div className="badge badge-primary">Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-base-100 to-base-100" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="badge badge-primary badge-outline mb-6">
            Mulai Sekarang
          </span>
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Siap mulai kerja lebih rapi?
          </h2>
          <p className="text-base-content/60 mb-10 leading-relaxed">
            Buat board pertama kamu, ajak tim untuk bergabung, dan mulai kelola
            task secara realtime.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Buat Board Pertama
          </Link>
        </div>
      </section>

      <footer className="bg-base-200 border-t border-base-300 py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={logo} alt="Signban" className="h-8 w-auto object-contain" />
          <p className="text-base-content/40 text-sm">
            © 2026 Signban. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
