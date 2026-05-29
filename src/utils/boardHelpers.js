export function getErrorMessage(error) {
	return (
		error.response?.data?.message ||
		error.response?.data?.error ||
		error.message ||
		"Something went wrong"
	);
}

export function getPriorityClass(priority) {
	if (priority === "Urgent") {
		return "bg-error/10 text-error";
	}

	if (priority === "High") {
		return "bg-warning/10 text-warning";
	}

	return "bg-primary/10 text-primary";
}

export function findListByCardId(lists, cardId) {
	return lists.find((list) => list.cards.some((card) => card.id === cardId));
}

export function findListByDndId(lists, dndId) {
	if (!dndId) return null;

	if (String(dndId).startsWith("list-")) {
		const listId = Number(String(dndId).replace("list-", ""));
		return lists.find((list) => list.id === listId);
	}

	if (String(dndId).startsWith("card-")) {
		const cardId = Number(String(dndId).replace("card-", ""));
		return findListByCardId(lists, cardId);
	}

	return null;
}
