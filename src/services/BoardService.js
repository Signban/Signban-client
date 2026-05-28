import api from "./api";

class BoardService {
	static async getBoards() {
		const { data } = await api.get("/boards");
		return data;
	}

	static async createBoard(payload) {
		const { data } = await api.post("/boards", payload);
		return data;
	}

	static async getBoardDetail(boardId) {
		const { data } = await api.get(`/boards/${boardId}`);
		return data;
	}

	static async updateBoard(boardId, payload) {
		const { data } = await api.patch(`/boards/${boardId}`, payload);
		return data;
	}

	static async getMembers(boardId) {
		const { data } = await api.get(`/boards/${boardId}/members`);
		return data;
	}

	static async addMember(boardId, payload) {
		const { data } = await api.post(`/boards/${boardId}/members`, payload);
		return data;
	}

	static async removeMember(boardId, userId) {
		const { data } = await api.delete(`/boards/${boardId}/members/${userId}`);
		return data;
	}

	static async createList(boardId, payload) {
		const { data } = await api.post(`/boards/${boardId}/lists`, payload);
		return data;
	}

	static async moveList(boardId, listId, payload) {
		const { data } = await api.patch(
			`/boards/${boardId}/lists/${listId}/move`,
			payload,
		);
		return data;
	}

	static async createCard(boardId, listId, payload) {
		const { data } = await api.post(
			`/boards/${boardId}/lists/${listId}/cards`,
			payload,
		);
		return data;
	}

	static async updateCard(boardId, cardId, payload) {
		const { data } = await api.put(`/boards/${boardId}/cards/${cardId}`, payload);
		return data;
	}

	static async deleteCard(boardId, cardId) {
		const { data } = await api.delete(`/boards/${boardId}/cards/${cardId}`);
		return data;
	}

	static async addAssignee(boardId, cardId, userId) {
		const { data } = await api.post(`/boards/${boardId}/cards/${cardId}/assignees`, { userId });
		return data;
	}

	static async removeAssignee(boardId, cardId, userId) {
		const { data } = await api.delete(`/boards/${boardId}/cards/${cardId}/assignees/${userId}`);
		return data;
	}

	static async createChecklist(boardId, cardId, payload) {
		const { data } = await api.post(
			`/boards/${boardId}/cards/${cardId}/checklists`,
			payload,
		);
		return data;
	}

	static async createComment(boardId, cardId, payload) {
		const { data } = await api.post(`/boards/${boardId}/cards/${cardId}/comments`, payload);
		return data;
	}

	static async deleteChecklist(boardId, cardId, checklistId) {
		const { data } = await api.delete(
			`/boards/${boardId}/cards/${cardId}/checklists/${checklistId}`,
		);
		return data;
	}

	static async updateChecklist(boardId, cardId, checklistId, payload) {
		const { data } = await api.patch(
			`/boards/${boardId}/cards/${cardId}/checklists/${checklistId}`,
			payload,
		);
		return data;
	}

	static async moveCard(boardId, cardId, payload) {
		const { data } = await api.patch(
			`/boards/${boardId}/cards/${cardId}/move`,
			payload,
		);
		return data;
	}

	static async generateChecklistWithAI(boardId, cardId) {
		const { data } = await api.post(
			`/boards/${boardId}/cards/${cardId}/checklists/ai-generate`,
		);
		return data;
	}
}

export default BoardService;
