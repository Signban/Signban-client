import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import BoardCanvas from "../components/board/BoardCanvas";
import BoardHeader from "../components/board/BoardHeader";
import BoardService from "../services/BoardService";
import BoardPageLoader from "../components/board/BoardPageLoader";
import BoardSyncIndicator from "../components/board/BoardSyncIndicator";
import AddBoardMemberModalContent from "../components/modals/AddBoardMemberModalContent";
import AddCardModalContent from "../components/modals/AddCardModalContent";
import AddListModalContent from "../components/modals/AddListModalContent";
import CardDetailModalContent from "../components/modals/CardDetailModalContent";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import useBoardDetail from "../hooks/useBoardDetail";
import { normalizeBoard } from "../utils/boardNormalizer";
import useBoardDragAndDrop from "../hooks/useBoardDragAndDrop";
import useBoardSocket from "../hooks/useBoardSocket";

export default function BoardDetailPage() {
	const modal = useModal();
	const navigate = useNavigate();
	const { id } = useParams();
	const { currentUser } = useAuth();

	const boardId = id;

	const {
		board,
		setBoard,
		members,
		loading,
		softLoading,
		startSoftLoading,
		stopSoftLoading,
		fetchBoardDetail,
	} = useBoardDetail(boardId);

	const lists = useMemo(() => board?.lists || [], [board]);

	const { draggingCards, draggingLists } = useBoardSocket({
		boardId,
		setBoard,
	});

	const {
		sensors,
		activeItem,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleDragCancel,
	} = useBoardDragAndDrop({
		boardId,
		board,
		lists,
		currentUser,
		setBoard,
		startSoftLoading,
		stopSoftLoading,
		fetchBoardDetail,
	});

	const onBack = useCallback(() => {
		navigate("/dashboard");
	}, [navigate]);

	const syncBoardFromResponse = useCallback(
		(response) => {
			if (!response?.board) return;
			setBoard(normalizeBoard(response.board));
		},
		[setBoard],
	);

	const openAddListModal = useCallback(() => {
		if (!boardId) return;

		const position = (board?.lists?.length ?? 0) + 1;

		modal.open({
			title: "Add List",
			size: "md",
			content: ({ close }) => (
				<AddListModalContent
					boardId={boardId}
					position={position}
					onClose={close}
					onSuccess={(response) => {
						syncBoardFromResponse(response);
						close();
					}}
				/>
			),
		});
	}, [boardId, board?.lists?.length, modal, syncBoardFromResponse]);

	const handleRemoveMember = useCallback(async (userId) => {
		try {
			await BoardService.removeMember(boardId, userId);
			fetchBoardDetail({ showLoading: false });
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to remove member");
		}
	}, [boardId, fetchBoardDetail]);

	const openAddMemberModal = useCallback(() => {
		if (!boardId) return;

		modal.open({
			title: "Add Member",
			size: "md",
			content: ({ close }) => (
				<AddBoardMemberModalContent
					boardId={boardId}
					onClose={close}
					onSuccess={(response) => {
						syncBoardFromResponse(response);
						close();
					}}
				/>
			),
		});
	}, [boardId, modal, syncBoardFromResponse]);

	const openCardDetailModal = useCallback(
		(cardId) => {
			if (!boardId || !cardId) return;

			modal.open({
				title: "Card Detail",
				size: "2xl",
				content: ({ close }) => (
					<CardDetailModalContent
						boardId={boardId}
						onClose={close}
						cardId={cardId}
						onCardUpdated={syncBoardFromResponse}
					/>
				),
			});
		},
		[boardId, modal, syncBoardFromResponse],
	);

	const openAddCardModal = useCallback(
		(list) => {
			if (!boardId || !list?.id) return;

			modal.open({
				title: "Add Card",
				size: "md",
				content: ({ close }) => (
					<AddCardModalContent
						boardId={boardId}
						listId={list.id}
						onClose={close}
						onSuccess={(response) => {
							syncBoardFromResponse(response);
							close();
						}}
					/>
				),
			});
		},
		[boardId, modal, syncBoardFromResponse],
	);

	useEffect(() => {
		document.title = board?.name
			? `${board.name} | Signban`
			: "Board | Signban";
	}, [board?.name]);

	if (loading && !board) {
		return <BoardPageLoader />;
	}

	return (
		<section className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-base-200/50">
			<BoardSyncIndicator visible={softLoading} />

			<BoardHeader
				board={board}
				members={members}
				onBack={onBack}
				onAddMember={openAddMemberModal}
				onAddList={openAddListModal}
				onRemoveMember={handleRemoveMember}
			/>

			<BoardCanvas
				lists={lists}
				sensors={sensors}
				activeItem={activeItem}
				draggingCards={draggingCards}
				draggingLists={draggingLists}
				onAddList={openAddListModal}
				onAddCard={openAddCardModal}
				onOpenCardDetail={openCardDetailModal}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
			/>
		</section>
	);
}
