import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import AuthService from "../services/AuthService";

export default function LoginPage() {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const [forgotForm, setForgotForm] = useState({
		email: "",
	});

	const [loading, setLoading] = useState(false);
	const [forgotLoading, setForgotLoading] = useState(false);
	const [forgotModalOpen, setForgotModalOpen] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setForm((prevForm) => ({
			...prevForm,
			[name]: value,
		}));
	};

	const handleForgotChange = (event) => {
		const { name, value } = event.target;

		setForgotForm((prevForm) => ({
			...prevForm,
			[name]: value,
		}));
	};

	const handleOpenForgotModal = () => {
		setForgotForm({
			email: form.email || "",
		});

		setForgotModalOpen(true);
	};

	const handleCloseForgotModal = () => {
		if (forgotLoading) return;

		setForgotModalOpen(false);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setLoading(true);

			const response = await AuthService.login(form);

			localStorage.setItem("access_token", response.access_token);

			toast.success("login success");
			navigate("/dashboard", { replace: true });
		} catch (error) {
			console.log(error);

			const message = error.response?.data?.message || "Login failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleSuccess = async (credentialResponse) => {
		try {
			setLoading(true);

			const response = await AuthService.googleLogin(
				credentialResponse.credential,
			);

			localStorage.setItem("access_token", response.access_token);

			toast.success("login with Google success");
			navigate("/dashboard", { replace: true });
		} catch (error) {
			console.log(error);

			const message = error.response?.data?.message || "Google login failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const handleForgotPassword = async (event) => {
		event.preventDefault();

		if (!forgotForm.email.trim()) {
			toast.error("Email is required");
			return;
		}

		try {
			setForgotLoading(true);

			await AuthService.forgotPassword({
				email: forgotForm.email.trim(),
			});

			toast.success("Reset password link has been sent to your email");
			setForgotModalOpen(false);
		} catch (error) {
			console.log(error);

			const message =
				error.response?.data?.message || "Failed to send reset password link";
			toast.error(message);
		} finally {
			setForgotLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-base-200">
			<main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
				<section className="relative hidden overflow-hidden lg:flex">
					<img
						src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop"
						alt="Joburaku Career Assistant"
						className="absolute inset-0 h-full w-full object-cover"
					/>

					<div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-black/70 to-black/80"></div>

					<div className="relative z-10 flex flex-col justify-end p-14 text-white">
						<div className="max-w-lg">
							<div className="badge badge-primary badge-lg mb-5 border-0 text-white">
								Joburaku
							</div>

							<h1 className="mb-5 text-5xl font-bold leading-tight">
								Asisten AI untuk perjalanan kariermu
							</h1>

							<p className="text-lg leading-relaxed text-white/80">
								Kelola lamaran kerja, buat CV ATS-friendly, dan siapkan jawaban
								interview berdasarkan lowongan yang kamu lamar.
							</p>

							<div className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/90">
								<div className="flex items-center gap-3">
									<span className="badge badge-success badge-sm"></span>
									<span>Tracking progress lamaran kerja</span>
								</div>

								<div className="flex items-center gap-3">
									<span className="badge badge-warning badge-sm"></span>
									<span>Generate CV sesuai job description</span>
								</div>

								<div className="flex items-center gap-3">
									<span className="badge badge-info badge-sm"></span>
									<span>Latihan interview dengan bantuan AI</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="flex items-center justify-center px-6 py-12">
					<div className="w-full max-w-md">
						<div className="mb-10">
							<div className="mb-4 flex flex-wrap gap-2">
								<span className="badge badge-primary">Joburaku</span>
								<span className="badge badge-outline">Career Assistant</span>
							</div>

							<h2 className="text-4xl font-bold text-base-content">Sign In</h2>

							<p className="mt-3 text-base-content/60">
								Please enter your email and password to continue
							</p>
						</div>

						<div className="card border border-base-300 bg-base-100 shadow-xl">
							<div className="card-body gap-5">
								<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
											placeholder="Enter your password"
											className="input input-bordered w-full"
										/>
									</label>

									<div className="flex items-center justify-end text-sm">
										<button
											type="button"
											onClick={handleOpenForgotModal}
											className="link link-primary"
										>
											Forgot password?
										</button>
									</div>

									<button
										type="submit"
										disabled={loading}
										className="btn btn-primary mt-2 w-full"
									>
										{loading ? (
											<span className="loading loading-spinner loading-sm"></span>
										) : (
											"Login"
										)}
									</button>
								</form>

								<div className="divider">OR</div>

								<div className="flex justify-center">
									<GoogleLogin
										onSuccess={handleGoogleSuccess}
										onError={() => toast.error("Google login failed")}
										width="360"
									/>
								</div>

								<p className="text-center text-sm text-base-content/70">
									Don't have an account?{" "}
									<Link
										to="/register"
										className="link link-primary font-semibold"
									>
										register
									</Link>
								</p>
							</div>
						</div>
					</div>
				</section>
			</main>

			{forgotModalOpen ? (
				<div className="modal modal-open">
					<div className="modal-box max-w-md rounded-3xl">
						<button
							type="button"
							onClick={handleCloseForgotModal}
							disabled={forgotLoading}
							className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
						>
							✕
						</button>

						<div className="mb-5">
							<div className="mb-3 flex flex-wrap gap-2">
								<span className="badge badge-warning">Forgot Password</span>
								<span className="badge badge-outline">Email Reset</span>
							</div>

							<h3 className="text-2xl font-black text-base-content">
								Reset your password
							</h3>

							<p className="mt-2 text-sm leading-relaxed text-base-content/60">
								Masukkan email akun Joburaku kamu. Kami akan mengirimkan link
								untuk membuat password baru.
							</p>
						</div>

						<form onSubmit={handleForgotPassword} className="space-y-4">
							<label className="form-control">
								<div className="label">
									<span className="label-text font-medium">Email</span>
								</div>

								<input
									type="email"
									name="email"
									value={forgotForm.email}
									onChange={handleForgotChange}
									disabled={forgotLoading}
									placeholder="example@mail.com"
									className="input input-bordered w-full"
								/>
							</label>

							<div className="alert alert-info">
								<span className="text-sm">
									Link reset password akan dikirim ke email. Setelah itu buka
									link tersebut untuk set password baru.
								</span>
							</div>

							<div className="modal-action">
								<button
									type="button"
									onClick={handleCloseForgotModal}
									disabled={forgotLoading}
									className="btn btn-ghost"
								>
									Cancel
								</button>

								<button
									type="submit"
									disabled={forgotLoading}
									className="btn btn-primary"
								>
									{forgotLoading ? (
										<span className="loading loading-spinner loading-sm"></span>
									) : (
										"Send Reset Link"
									)}
								</button>
							</div>
						</form>
					</div>

					<div className="modal-backdrop" onClick={handleCloseForgotModal}>
						<button type="button">close</button>
					</div>
				</div>
			) : null}
		</div>
	);
}
