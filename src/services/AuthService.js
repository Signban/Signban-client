import api from "./api";

class AuthService {
	static async register(payload) {
		const { data } = await api.post("/register", payload);
		return data;
	}

	static async login(payload) {
		const { data } = await api.post("/login", payload);
		return data;
	}

	static async currentUser() {
		const { data } = await api.get("/current-user");
		return data;
	}

	static async googleLogin(googleToken) {
		const { data } = await api.get("/google-login", {
			headers: {
				accessgoogle: googleToken,
			},
		});

		return data;
	}

	static async updateName(payload) {
		const { data } = await api.patch("/account/name", payload);
		return data;
	}

	static async updatePassword(payload) {
		const { data } = await api.patch("/account/password", payload);
		return data;
	}

	static async forgotPassword(payload) {
		const { data } = await api.post("/forgot-password", payload);
		return data;
	}

	static async resetPassword(payload) {
		const { data } = await api.post("/reset-password", payload);
		return data;
	}

	static async checkResetPasswordToken(payload) {
		const { data } = await api.post("/check-reset-password-token", payload);
		return data;
	}
}

export default AuthService;
