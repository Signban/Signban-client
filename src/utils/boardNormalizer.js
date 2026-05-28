export const colorClasses = [
	"bg-blue-600",
	"bg-emerald-600",
	"bg-violet-600",
	"bg-amber-600",
	"bg-rose-600",
	"bg-cyan-600",
	"bg-fuchsia-600",
	"bg-lime-600",
];

export function getColorClass(id = 0) {
	return colorClasses[Math.abs(Number(id)) % colorClasses.length];
}

export function formatPriority(priority) {
	if (!priority) return "Medium";

	return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
}

export function formatDate(value) {
	if (!value) return "No due date";

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return "No due date";

	return date.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function normalizeMember(member) {
	const user = member?.User || member?.user || member;

	if (!user) return null;

	const name =
		user.name ||
		user.email?.split("@")[0] ||
		`User ${user.id || member.UserId}`;

	return {
		id: user.id || member.UserId || member.id,
		name,
		email: user.email || "",
		avatarUrl: user.avatarUrl || null,
		role: member.role || "member",
		colorClass: getColorClass(user.id || member.UserId || member.id),
	};
}

export function normalizeAssignee(assignee) {
	const user = assignee?.User || assignee?.user || assignee;

	if (!user) return null;

	const name =
		user.name ||
		user.email?.split("@")[0] ||
		`User ${user.id || assignee.UserId}`;

	return {
		id: user.id || assignee.UserId || assignee.id,
		name,
		email: user.email || "",
		avatarUrl: user.avatarUrl || null,
		colorClass: getColorClass(user.id || assignee.UserId || assignee.id),
	};
}

export function normalizeCard(card) {
	const checklists = card.Checklists || card.checklists || [];
	const comments = card.Comments || card.comments || [];
	const assignees = card.CardAssignees || card.assignees || [];

	const checklistDone = checklists.filter(
		(checklist) => checklist.isCompleted,
	).length;

	return {
		...card,
		type: "card",
		dndId: `card-${card.id}`,
		listId: card.ListId,
		priorityLabel: formatPriority(card.priority),
		dueDateLabel: formatDate(card.dueDate),
		assignees: assignees.map(normalizeAssignee).filter(Boolean),
		checklistDone,
		checklistTotal: checklists.length,
		commentTotal: comments.length,
	};
}

export function normalizeList(list) {
	const cards = list.Cards || list.cards || [];

	return {
		...list,
		type: "list",
		dndId: `list-${list.id}`,
		cards: cards
			.map(normalizeCard)
			.sort((a, b) => (a.position || 0) - (b.position || 0)),
	};
}

export function normalizeBoard(board) {
	const rawLists = board?.Lists || board?.lists || [];

	return {
		...board,
		lists: rawLists
			.map(normalizeList)
			.sort((a, b) => (a.position || 0) - (b.position || 0)),
	};
}
