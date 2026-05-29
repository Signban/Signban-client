import { useEffect, useState } from "react";
import socket from "../services/Socket";
import { normalizeBoard } from "../utils/boardNormalizer";

export default function useBoardSocket({ boardId, setBoard }) {
	const [draggingCards, setDraggingCards] = useState({});
	const [draggingLists, setDraggingLists] = useState({});

	useEffect(() => {
		if (!boardId) return;

		if (!socket.connected) {
			socket.connect();
		}

		socket.emit("board:join", boardId);

		const syncBoardFromSocket = (payload) => {
			if (!payload?.board) return;
			setBoard(normalizeBoard(payload.board));
		};

		const handleCardDragStart = ({ cardId, userName }) => {
			setDraggingCards((prev) => ({
				...prev,
				[cardId]: { userName },
			}));
		};

		const handleCardDragEnd = ({ cardId }) => {
			setDraggingCards((prev) => {
				const next = { ...prev };
				delete next[cardId];
				return next;
			});
		};

		const handleListDragStart = ({ listId, userName }) => {
			setDraggingLists((prev) => ({
				...prev,
				[listId]: { userName },
			}));
		};

		const handleListDragEnd = ({ listId }) => {
			setDraggingLists((prev) => {
				const next = { ...prev };
				delete next[listId];
				return next;
			});
		};

		const handleConnect = () => {
			socket.emit("board:join", boardId);
		};

		const boardSyncEvents = [
			"board:updated",
			"board:member-added",
			"board:member-removed",
			"list:created",
			"list:updated",
			"list:moved",
			"list:deleted",
			"card:created",
			"card:updated",
			"card:moved",
			"card:deleted",
			"card:assigned",
			"card:unassigned",
			"comment:created",
			"checklist:created",
			"checklist:updated",
			"checklist:deleted",
		];

		socket.on("connect", handleConnect);
		boardSyncEvents.forEach((eventName) => {
			socket.on(eventName, syncBoardFromSocket);
		});

		socket.on("card:drag-start", handleCardDragStart);
		socket.on("card:drag-end", handleCardDragEnd);
		socket.on("list:drag-start", handleListDragStart);
		socket.on("list:drag-end", handleListDragEnd);

		return () => {
			socket.emit("board:leave", boardId);
			socket.off("connect", handleConnect);
			boardSyncEvents.forEach((eventName) => {
				socket.off(eventName, syncBoardFromSocket);
			});
			socket.off("card:drag-start", handleCardDragStart);
			socket.off("card:drag-end", handleCardDragEnd);
			socket.off("list:drag-start", handleListDragStart);
			socket.off("list:drag-end", handleListDragEnd);
		};
	}, [boardId, setBoard]);

	return {
		draggingCards,
		draggingLists,
	};
}
