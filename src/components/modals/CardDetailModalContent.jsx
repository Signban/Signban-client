import { useEffect, useState } from "react";
import api from "../../services/api";
import { CardPriority } from "../../constants/enums";

const priorityStyle = {
	[CardPriority.low]: "bg-success/10 text-success",
	[CardPriority.medium]: "bg-primary/10 text-primary",
	[CardPriority.high]: "bg-warning/10 text-warning",
	[CardPriority.urgent]: "bg-error/10 text-error",
};

function MemberAvatar({ member, size = "md" }) {
	const sizeClass = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm";
	const initial = member?.name?.charAt(0)?.toUpperCase() || "?";
	const colorClass = member?.colorClass || "bg-primary";

	return (
		<div
			title={member.name}
			className={`${sizeClass} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-base-100 ${colorClass} font-black text-white`}
		>
			{member.avatarUrl ? (
				<img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
			) : (
				<span className="block leading-none">{initial}</span>
			)}
		</div>
	);
}

function Section({ label, children }) {
	return (
		<div>
			<p className="mb-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
				{label}
			</p>
			{children}
		</div>
	);
}

export default function CardDetailModalContent({ boardId, cardId, onClose }) {
	const [card, setCard] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchCard() {
			try {
				setLoading(true);
				const { data } = await api.get(`/boards/${boardId}/cards/${cardId}`);
				setCard(data.card);
			} catch (err) {
				setError(err.response?.data?.message || "Failed to load card");
			} finally {
				setLoading(false);
			}
		}

		fetchCard();
	}, [boardId, cardId]);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<span className="loading loading-spinner loading-lg text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-10 text-center">
				<p className="text-sm font-medium text-error">{error}</p>
				<button type="button" onClick={onClose} className="btn btn-ghost btn-sm mt-4">
					Close
				</button>
			</div>
		);
	}

	const completedChecklists = card.Checklists?.filter((c) => c.isCompleted).length ?? 0;
	const totalChecklists = card.Checklists?.length ?? 0;
	const dueDateFormatted = card.dueDate
		? new Date(card.dueDate).toLocaleDateString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric",
		  })
		: null;

	return (
		<div className="space-y-6">
			{/* Cover */}
			{card.coverUrl && (
				<div className="-mx-6 -mt-6 mb-2 overflow-hidden rounded-t-3xl">
					<img
						src={card.coverUrl}
						alt="Card cover"
						className="h-48 w-full object-cover"
					/>
				</div>
			)}

			{/* Title + Priority + Due Date */}
			<div className="space-y-2">
				<div className="flex flex-wrap items-center gap-2">
					<span
						className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
							priorityStyle[card.priority] || "bg-base-200 text-base-content"
						}`}
					>
						{card.priority}
					</span>

					{dueDateFormatted && (
						<span className="rounded-full bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/60">
							Due {dueDateFormatted}
						</span>
					)}
				</div>

				<h2 className="text-xl font-black leading-snug text-base-content">{card.title}</h2>
			</div>

			{/* Creator */}
			{card.User && (
				<Section label="Created by">
					<div className="flex items-center gap-2">
						<MemberAvatar member={card.User} size="sm" />
						<span className="text-sm font-medium text-base-content">{card.User.name}</span>
					</div>
				</Section>
			)}

			{/* Assignees */}
			{card.CardAssignees?.length > 0 && (
				<Section label="Assignees">
					<div className="flex flex-wrap items-center gap-2">
						{card.CardAssignees.map((a) => (
							<div key={a.id} className="flex items-center gap-1.5">
								<MemberAvatar member={a.User} size="sm" />
								<span className="text-sm font-medium text-base-content">{a.User.name}</span>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* Description */}
			{card.description && (
				<Section label="Description">
					<p className="whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">
						{card.description}
					</p>
				</Section>
			)}

			{/* Checklists */}
			{card.Checklists?.length > 0 && (
				<Section label={`Checklist (${completedChecklists}/${totalChecklists})`}>
					<div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-base-200">
						<div
							className="h-full rounded-full bg-primary transition-all"
							style={{
								width: totalChecklists > 0 ? `${(completedChecklists / totalChecklists) * 100}%` : "0%",
							}}
						/>
					</div>

					<div className="space-y-1.5">
						{card.Checklists.map((item) => (
							<div key={item.id} className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={item.isCompleted}
									readOnly
									className="checkbox checkbox-primary checkbox-sm"
								/>
								<span
									className={`text-sm ${
										item.isCompleted
											? "line-through text-base-content/40"
											: "text-base-content"
									}`}
								>
									{item.title}
								</span>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* Comments */}
			{card.Comments?.length > 0 && (
				<Section label={`Comments (${card.Comments.length})`}>
					<div className="space-y-3">
						{card.Comments.map((comment) => (
							<div key={comment.id} className="flex gap-3">
								<MemberAvatar member={comment.User} size="sm" />
								<div className="flex-1 rounded-2xl bg-base-200/60 px-4 py-3">
									<p className="mb-1 text-xs font-bold text-base-content/60">
										{comment.User.name}
									</p>
									<p className="text-sm leading-relaxed text-base-content">
										{comment.content}
									</p>
								</div>
							</div>
						))}
					</div>
				</Section>
			)}

			{/* Footer */}
			<div className="modal-action pt-2">
				<button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
					Close
				</button>
			</div>
		</div>
	);
}
