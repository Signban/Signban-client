import { useEffect, useState } from "react";
import socket from "../services/Socket";
import { normalizeBoard } from "../utils/boardNormalizer";

export default function useBoardSocket({ boardId, setBoard }) {
	const [draggingCards, setDraggingCards] = useState({});

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

		const handleConnect = () => {
			socket.emit("board:join", boardId);
		};

		socket.on("connect", handleConnect);

		socket.on("board:updated", syncBoardFromSocket);
		socket.on("card:moved", syncBoardFromSocket);
		socket.on("list:moved", syncBoardFromSocket);
		socket.on("card:created", syncBoardFromSocket);
		socket.on("list:created", syncBoardFromSocket);
		socket.on("card:updated", syncBoardFromSocket);
		socket.on("card:deleted", syncBoardFromSocket);

		socket.on("card:drag-start", handleCardDragStart);
		socket.on("card:drag-end", handleCardDragEnd);

		return () => {
			socket.emit("board:leave", boardId);

			socket.off("connect", handleConnect);

			socket.off("board:updated", syncBoardFromSocket);
			socket.off("card:moved", syncBoardFromSocket);
			socket.off("list:moved", syncBoardFromSocket);
			socket.off("card:created", syncBoardFromSocket);
			socket.off("list:created", syncBoardFromSocket);
			socket.off("card:updated", syncBoardFromSocket);
			socket.off("card:deleted", syncBoardFromSocket);

			socket.off("card:drag-start", handleCardDragStart);
			socket.off("card:drag-end", handleCardDragEnd);
		};
	}, [boardId, setBoard]);

	return {
		draggingCards,
	};
}
