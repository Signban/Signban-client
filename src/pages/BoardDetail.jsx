import { useEffect } from "react";

const boardMembers = [
	{
		id: 1,
		name: "Brahmantio",
		avatarUrl: null,
		colorClass: "bg-blue-600",
	},
	{
		id: 2,
		name: "Aldi",
		avatarUrl: null,
		colorClass: "bg-emerald-600",
	},
	{
		id: 3,
		name: "Dina",
		avatarUrl: null,
		colorClass: "bg-violet-600",
	},
];

const lists = [
	{
		id: 1,
		name: "Backlog",
		cards: [
			{
				id: 1,
				title: "Setup project frontend",
				priority: "High",
				dueDate: "27 Mei 2026",
				assignees: [boardMembers[0], boardMembers[1]],
			},
			{
				id: 2,
				title: "Buat layout dashboard board",
				priority: "Medium",
				dueDate: "28 Mei 2026",
				assignees: [boardMembers[1]],
			},
		],
	},
	{
		id: 2,
		name: "Todo",
		cards: [
			{
				id: 3,
				title: "Integrasi auth context",
				priority: "High",
				dueDate: "29 Mei 2026",
				assignees: [boardMembers[0], boardMembers[2]],
			},
		],
	},
	{
		id: 3,
		name: "In Progress",
		cards: [
			{
				id: 4,
				title: "Socket.IO board room",
				priority: "Urgent",
				dueDate: "30 Mei 2026",
				assignees: [boardMembers[0]],
			},
		],
	},
	{
		id: 4,
		name: "Review",
		cards: [],
	},
	{
		id: 5,
		name: "Done",
		cards: [],
	},
];

function MemberAvatar({
	member,
	size = "md",
	borderClass = "border-base-100",
}) {
	const initial = member?.name?.charAt(0)?.toUpperCase() || "?";

	const sizeClass = {
		sm: "h-7 w-7 text-[11px]",
		md: "h-9 w-9 text-sm",
	}[size];

	return (
		<div
			title={member.name}
			className={`${sizeClass} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${borderClass} ${member.colorClass} font-black leading-none text-white shadow-sm`}
		>
			{member.avatarUrl ? (
				<img
					src={member.avatarUrl}
					alt={member.name}
					className="h-full w-full object-cover"
				/>
			) : (
				<span className="block translate-y-[0.5px] leading-none">
					{initial}
				</span>
			)}
		</div>
	);
}

function AvatarGroup({
	members = [],
	size = "md",
	borderClass = "border-base-100",
}) {
	return (
		<div className="flex -space-x-3">
			{members.map((member) => (
				<MemberAvatar
					key={member.id}
					member={member}
					size={size}
					borderClass={borderClass}
				/>
			))}
		</div>
	);
}

function getPriorityClass(priority) {
	if (priority === "Urgent") {
		return "bg-error/10 text-error";
	}

	if (priority === "High") {
		return "bg-warning/10 text-warning";
	}

	return "bg-primary/10 text-primary";
}

export default function BoardDetailPage() {
	useEffect(() => {
		document.title = "Final Project Signban | Signban";
	}, []);

	return (
		<section className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-base-200/50">
			<header className="shrink-0 border-b border-base-300 bg-base-100/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="min-w-0">
						<h1 className="truncate text-2xl font-black tracking-tight text-base-content">
							Final Project Signban
						</h1>

						<p className="mt-1 line-clamp-1 text-sm text-base-content/50">
							Realtime Kanban Assistant untuk tracking task team
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<AvatarGroup members={boardMembers} />

						<button type="button" className="btn btn-primary btn-sm">
							Add Member
						</button>

						<button type="button" className="btn btn-outline btn-sm">
							Add List
						</button>
					</div>
				</div>
			</header>

			<main className="min-h-0 flex-1 overflow-hidden">
				<div className="h-full overflow-x-auto overflow-y-hidden px-4 py-6 sm:px-6 lg:px-8">
					<div className="mx-auto flex h-full w-max min-w-full max-w-7xl gap-4">
						{lists.map((list) => (
							<section
								key={list.id}
								className="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm"
							>
								<div className="shrink-0 border-b border-base-300 px-4 py-4">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<h2 className="truncate font-black text-base-content">
												{list.name}
											</h2>

											<p className="mt-1 text-xs font-medium text-base-content/40">
												{list.cards.length} cards
											</p>
										</div>

										<button
											type="button"
											className="btn btn-ghost btn-xs rounded-xl text-base-content/50"
										>
											•••
										</button>
									</div>
								</div>

								<div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
									<div className="space-y-3">
										{list.cards.map((card) => (
											<article
												key={card.id}
												className="cursor-pointer rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-base-200"
											>
												<div className="mb-3 flex items-center justify-between gap-2">
													<span
														className={`rounded-full px-2.5 py-1 text-xs font-bold ${getPriorityClass(
															card.priority,
														)}`}
													>
														{card.priority}
													</span>

													<span className="shrink-0 text-xs text-base-content/40">
														{card.dueDate}
													</span>
												</div>

												<h3 className="text-sm font-bold leading-6 text-base-content">
													{card.title}
												</h3>

												<div className="mt-4 flex items-center justify-between gap-3">
													<AvatarGroup
														members={card.assignees}
														size="sm"
														borderClass="border-base-200"
													/>

													<div className="flex items-center gap-3 text-xs font-medium text-base-content/40">
														<span>☑ 3/5</span>
														<span>💬 2</span>
													</div>
												</div>
											</article>
										))}

										<button
											type="button"
											className="w-full rounded-2xl border border-dashed border-base-300 bg-base-100 py-3 text-sm font-bold text-base-content/50 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
										>
											+ Add Card
										</button>
									</div>
								</div>
							</section>
						))}

						<button
							type="button"
							className="h-fit w-80 shrink-0 rounded-3xl border border-dashed border-base-300 bg-base-100/80 p-4 text-left text-sm font-bold text-base-content/50 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
						>
							+ Add another list
						</button>
					</div>
				</div>
			</main>
		</section>
	);
}
