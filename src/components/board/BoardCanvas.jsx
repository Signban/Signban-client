import { useCallback } from "react";
import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import {
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import ListColumn from "./ListColumn";

export default function BoardCanvas({
	lists,
	sensors,
	activeItem,
	draggingCards,
	onAddList,
	onAddCard,
	onOpenCardDetail,
	onDragStart,
	onDragOver,
	onDragEnd,
}) {
	const collisionDetection = useCallback((args) => {
		const activeType = args.active?.data?.current?.type;

		if (activeType === "list") {
			return closestCorners({
				...args,
				droppableContainers: args.droppableContainers.filter(
					(container) => container.data?.current?.type === "list",
				),
			});
		}

		return closestCorners(args);
	}, []);

	return (
		<main className="min-h-0 flex-1 overflow-hidden">
			<DndContext
				sensors={sensors}
				collisionDetection={collisionDetection}
				onDragStart={onDragStart}
				onDragOver={onDragOver}
				onDragEnd={onDragEnd}
			>
				<div className="h-full overflow-x-auto overflow-y-hidden px-4 py-6 sm:px-6 lg:px-8">
					<SortableContext
						items={lists.map((list) => list.dndId)}
						strategy={horizontalListSortingStrategy}
					>
						<div className="mx-auto flex h-full w-max min-w-full max-w-7xl gap-4">
							{lists.map((list) => (
								<ListColumn
									key={list.id}
									list={list}
									draggingCards={draggingCards}
									onAddCard={onAddCard}
									onOpenCardDetail={onOpenCardDetail}
								/>
							))}

							<button
								type="button"
								onClick={onAddList}
								className="h-fit w-80 shrink-0 rounded-3xl border border-dashed border-base-300 bg-base-100/80 p-4 text-left text-sm font-bold text-base-content/50 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
							>
								+ Add another list
							</button>
						</div>
					</SortableContext>
				</div>

				<DragOverlay>
					{activeItem?.type === "card" ? (
						<div className="w-72 rotate-2 rounded-2xl border border-primary/40 bg-base-100 p-4 shadow-2xl">
							<p className="text-sm font-black">{activeItem.card.title}</p>
						</div>
					) : null}

					{activeItem?.type === "list" ? (
						<div className="w-80 rotate-1 rounded-3xl border border-primary/40 bg-base-100 p-4 shadow-2xl">
							<p className="font-black">{activeItem.list.name}</p>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</main>
	);
}
