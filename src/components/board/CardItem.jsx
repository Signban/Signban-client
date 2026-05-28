import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getPriorityClass } from "../../utils/boardHelpers";
import AvatarGroup from "./AvatarGroup";

export default function CardItem({ card, draggingCards = {}, onOpenCardDetail }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: card.dndId,
		data: {
			type: "card",
			card,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const dragInfo = draggingCards[card.id];

	return (
		<article
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={() => onOpenCardDetail(card.id)}
			className={`cursor-grab rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-base-200 active:cursor-grabbing ${
				isDragging ? "opacity-40" : ""
			} ${dragInfo ? "ring-2 ring-primary/30" : ""}`}
		>
			{dragInfo ? (
				<p className="mb-3 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
					{dragInfo.userName} is moving this card
				</p>
			) : null}

			<div className="mb-3 flex items-center justify-between gap-2">
				<span
					className={`rounded-full px-2.5 py-1 text-xs font-bold ${getPriorityClass(
						card.priorityLabel,
					)}`}
				>
					{card.priorityLabel}
				</span>

				<span className="shrink-0 text-xs text-base-content/40">
					{card.dueDateLabel}
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
					<span>
						☑ {card.checklistDone}/{card.checklistTotal}
					</span>
					<span>💬 {card.commentTotal}</span>
				</div>
			</div>
		</article>
	);
}
