import api from "./api";

class AuthService {
	static async login(payload) {
		const { data } = await api.post("/login", payload);
		return data;
	}
	static async currentUser() {
		const { data } = await api.get("/current-user");
		return data;
	}
}

export default AuthService;
