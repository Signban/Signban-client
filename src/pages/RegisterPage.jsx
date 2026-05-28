// export default function RegisterPage() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <>
//       <div className="min-h-screen bg-base-200">
//         <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
//           <section className="relative hidden overflow-hidden lg:flex">
//             <img
//               src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1600&auto=format&fit=crop"
//               alt="Signban realtime kanban board"
//               className="absolute inset-0 h-full w-full object-cover"
//             />

//             <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-black/70 to-black/80"></div>

//             <div className="relative z-10 flex flex-col justify-end p-14 text-white">
//               <div className="max-w-lg">
//                 <div className="badge badge-primary badge-lg mb-5 border-0 text-white">
//                   Signban
//                 </div>

//                 <h1 className="mb-5 text-5xl font-bold leading-tight">
//                   Realtime Kanban untuk kerja tim yang lebih rapi
//                 </h1>

//                 <p className="text-lg leading-relaxed text-white/80">
//                   Kelola board, list, card, checklist, komentar, dan aktivitas
//                   tim secara realtime dalam satu workspace.
//                 </p>

//                 <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/90">
//                   <div className="flex items-center gap-3">
//                     <span className="badge badge-success badge-sm"></span>
//                     <span>Board collaboration realtime</span>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span className="badge badge-warning badge-sm"></span>
//                     <span>Drag & drop workflow</span>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span className="badge badge-info badge-sm"></span>
//                     <span>AI checklist dan priority suggestion</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <section className="flex items-center justify-center px-6 py-12">
//             <div className="w-full max-w-md">
//               <div className="mb-10">
//                 <div className="mb-4 flex flex-wrap gap-2">
//                   <span className="badge badge-primary">Signban</span>
//                   <span className="badge badge-outline">Realtime Kanban</span>
//                 </div>

//                 <h2 className="text-4xl font-bold text-base-content">
//                   Sign In
//                 </h2>

//                 <p className="mt-3 text-base-content/60">
//                   Masuk menggunakan akun yang sudah ada di database Signban.
//                 </p>
//               </div>

//               <div className="card border border-base-300 bg-base-100 shadow-xl">
//                 <div className="card-body gap-5">
//                   <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
//                     <label className="form-control">
//                       <div className="label">
//                         <span className="label-text font-medium">Email</span>
//                       </div>

//                       <input
//                         disabled={loading}
//                         onChange={handleChange}
//                         value={form.email}
//                         type="email"
//                         name="email"
//                         placeholder="example@mail.com"
//                         className="input input-bordered w-full"
//                       />
//                     </label>

//                     <label className="form-control">
//                       <div className="label">
//                         <span className="label-text font-medium">Password</span>
//                       </div>

//                       <input
//                         disabled={loading}
//                         onChange={handleChange}
//                         value={form.password}
//                         name="password"
//                         type="password"
//                         placeholder="Enter your password"
//                         className="input input-bordered w-full"
//                       />
//                     </label>

//                     <button
//                       type="submit"
//                       disabled={loading}
//                       className="btn btn-primary mt-2 w-full"
//                     >
//                       {loading ? (
//                         <span className="loading loading-spinner loading-sm"></span>
//                       ) : (
//                         "Login"
//                       )}
//                     </button>
//                   </form>

//                   <div className="alert alert-info text-sm">
//                     <span>
//                       Untuk sekarang frontend hanya mengarah ke route API yang
//                       sudah ada:
//                       <strong>POST /login</strong>.
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </>
//   );
// }
