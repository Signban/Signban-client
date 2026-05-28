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
// import { normalizeBoard } from "../utils/boardNormalizer";

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
					userId: currentUser.id,
				});
			}

			if (data?.type === "list") {
				socket.emit("list:drag-start", {
					boardId,
					listId: data.list.id,
					userName,
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

			if (!over || !board) return;

			try {
				if (activeData?.type === "list") {
					const activeListId = Number(String(active.id).replace("list-", ""));
					const overListId = Number(String(over.id).replace("list-", ""));

					if (activeListId === overListId) return;

					const oldIndex = lists.findIndex((list) => list.id === activeListId);
					const newIndex = lists.findIndex((list) => list.id === overListId);

					const nextLists = arrayMove(lists, oldIndex, newIndex);

					setBoard((prevBoard) => ({
						...prevBoard,
						lists: nextLists,
					}));

					startSoftLoading();

					await BoardService.moveList(boardId, activeListId, {
						newPosition: newIndex,
					});

					// setBoard(normalizeBoard(response.board));

					socket.emit("list:drag-end", {
						boardId,
						listId: activeListId,
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

					// setBoard(normalizeBoard(response.board));

					socket.emit("card:drag-end", {
						boardId,
						cardId: activeCardId,
					});

					stopSoftLoading();
				}
			} catch (error) {
				stopSoftLoading();
				console.log(error);
				toast.error(getErrorMessage(error));
			}
		},
		[board, boardId, lists, setBoard, startSoftLoading, stopSoftLoading],
	);

	return {
		sensors,
		activeItem,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
	};
}
