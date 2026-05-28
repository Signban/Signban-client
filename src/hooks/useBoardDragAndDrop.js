import { useCallback, useState } from "react";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import BoardService from "../services/BoardService";
import socket from "../services/Socket";
import {
	findListByCardId,
	findListByDndId,
	getErrorMessage,
} from "../utils/boardHelpers";

export default function useBoardDragAndDrop({
	boardId,
	board,
	lists,
	currentUser,
	setBoard,
	startSoftLoading,
	stopSoftLoading,
}) {
	const [activeItem, setActiveItem] = useState(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const emitDragEnd = useCallback(
		(activeData) => {
			if (activeData?.type === "list") {
				socket.emit("list:drag-end", {
					boardId,
					listId: activeData.list.id,
				});
			}

			if (activeData?.type === "card") {
				socket.emit("card:drag-end", {
					boardId,
					cardId: activeData.card.id,
				});
			}
		},
		[boardId],
	);

	const handleDragStart = useCallback(
		(event) => {
			const data = event.active.data.current;
			setActiveItem(data);

			const userName =
				currentUser?.name || currentUser?.email?.split("@")[0] || "Someone";

			if (data?.type === "card") {
				socket.emit("card:drag-start", {
					boardId,
					cardId: data.card.id,
					userName,
					userId: currentUser?.id,
				});
			}

			if (data?.type === "list") {
				socket.emit("list:drag-start", {
					boardId,
					listId: data.list.id,
					userName,
					userId: currentUser?.id,
				});
			}
		},
		[boardId, currentUser],
	);

	const handleDragOver = useCallback(
		(event) => {
			const { active, over } = event;

			if (!over || !board) return;

			const activeData = active.data.current;

			// Untuk list, jangan reorder manual di dragOver.
			// Bayangan tuker posisi sudah di-handle oleh SortableContext.
			if (activeData?.type === "list") return;

			if (activeData?.type !== "card") return;

			const activeCardId = Number(String(active.id).replace("card-", ""));
			const sourceList = findListByCardId(lists, activeCardId);
			const destinationList = findListByDndId(lists, over.id);

			if (
				!sourceList ||
				!destinationList ||
				sourceList.id === destinationList.id
			) {
				return;
			}

			setBoard((prevBoard) => {
				const nextLists = prevBoard.lists.map((list) => ({
					...list,
					cards: [...list.cards],
				}));

				const fromList = nextLists.find((list) => list.id === sourceList.id);
				const toList = nextLists.find((list) => list.id === destinationList.id);

				const movingCardIndex = fromList.cards.findIndex(
					(card) => card.id === activeCardId,
				);

				if (movingCardIndex === -1) return prevBoard;

				const [movingCard] = fromList.cards.splice(movingCardIndex, 1);

				const overCardId = String(over.id).startsWith("card-")
					? Number(String(over.id).replace("card-", ""))
					: null;

				const insertIndex = overCardId
					? toList.cards.findIndex((card) => card.id === overCardId)
					: toList.cards.length;

				toList.cards.splice(
					insertIndex >= 0 ? insertIndex : toList.cards.length,
					0,
					{
						...movingCard,
						ListId: toList.id,
						listId: toList.id,
					},
				);

				return {
					...prevBoard,
					lists: nextLists,
				};
			});
		},
		[board, lists, setBoard],
	);

	const handleDragEnd = useCallback(
		async (event) => {
			const { active, over } = event;
			const activeData = active.data.current;

			setActiveItem(null);

			// Penting:
			// Harus dikirim di awal supaya user lain clear disabled/notif,
			// walaupun drop batal, posisi sama, atau validasi return.
			emitDragEnd(activeData);

			if (!over || !board) return;

			try {
				if (activeData?.type === "list") {
					const activeListId = Number(String(active.id).replace("list-", ""));
					const overList = findListByDndId(lists, over.id);

					if (!overList) return;

					const overListId = overList.id;

					// Posisi tidak berubah.
					// Tidak perlu hit API, karena drag-end sudah dikirim di atas.
					if (activeListId === overListId) return;

					const oldIndex = lists.findIndex((list) => list.id === activeListId);
					const newIndex = lists.findIndex((list) => list.id === overListId);

					if (oldIndex < 0 || newIndex < 0) return;

					const nextLists = arrayMove(lists, oldIndex, newIndex);

					setBoard((prevBoard) => ({
						...prevBoard,
						lists: nextLists,
					}));

					startSoftLoading();

					await BoardService.moveList(boardId, activeListId, {
						newPosition: newIndex,
					});

					stopSoftLoading();
					return;
				}

				if (activeData?.type === "card") {
					const activeCardId = Number(String(active.id).replace("card-", ""));
					const currentLists = board?.lists || [];
					const destinationList = findListByDndId(currentLists, over.id);

					if (!destinationList) return;

					const sourceListId = activeData.card.ListId || activeData.card.listId;

					const newPosition = destinationList.cards.findIndex(
						(card) => card.id === activeCardId,
					);

					startSoftLoading();

					await BoardService.moveCard(boardId, activeCardId, {
						sourceListId,
						destinationListId: destinationList.id,
						newPosition:
							newPosition < 0 ? destinationList.cards.length : newPosition,
					});

					stopSoftLoading();
				}
			} catch (error) {
				stopSoftLoading();
				console.log(error);
				toast.error(getErrorMessage(error));
			}
		},
		[
			board,
			boardId,
			lists,
			setBoard,
			startSoftLoading,
			stopSoftLoading,
			emitDragEnd,
		],
	);

	const handleDragCancel = useCallback(
		(event) => {
			const activeData = event.active?.data?.current;

			setActiveItem(null);
			emitDragEnd(activeData);
		},
		[emitDragEnd],
	);

	return {
		sensors,
		activeItem,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleDragCancel,
	};
}
