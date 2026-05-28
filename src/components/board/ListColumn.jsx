import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardItem from "./CardItem";

export default function ListColumn({
	list,
	draggingCards,
	onAddCard,
	onOpenCardDetail,
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: list.dndId,
		data: {
			type: "list",
			list,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<section
			ref={setNodeRef}
			style={style}
			className={`flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm ${
				isDragging ? "opacity-50" : ""
			}`}
		>
			<div
				{...attributes}
				{...listeners}
				className="shrink-0 cursor-grab border-b border-base-300 px-4 py-4 active:cursor-grabbing"
			>
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
						onClick={(event) => event.stopPropagation()}
					>
						•••
					</button>
				</div>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
				<SortableContext
					items={list.cards.map((card) => card.dndId)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-3">
						{list.cards.map((card) => (
							<CardItem
								key={card.id}
								card={card}
								draggingCards={draggingCards}
								onOpenCardDetail={onOpenCardDetail}
							/>
						))}

						<button
							type="button"
							onClick={() => onAddCard(list)}
							className="w-full rounded-2xl border border-dashed border-base-300 bg-base-100 py-3 text-sm font-bold text-base-content/50 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
						>
							+ Add Card
						</button>
					</div>
				</SortableContext>
			</div>
		</section>
	);
}
