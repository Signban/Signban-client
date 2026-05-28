import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import BoardCanvas from "../components/board/BoardCanvas";
import BoardHeader from "../components/board/BoardHeader";
import BoardPageLoader from "../components/board/BoardPageLoader";
import BoardSyncIndicator from "../components/board/BoardSyncIndicator";
import AddBoardMemberModalContent from "../components/modals/AddBoardMemberModalContent";
import CardDetailModalContent from "../components/modals/CardDetailModalContent";
import { useAuth } from "../contexts/AuthContext";
import { useModal } from "../contexts/ModalContext";
import useBoardDetail from "../hooks/useBoardDetail";
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
		handleAddList,
		handleAddCard,
	} = useBoardDetail(boardId);

	const lists = useMemo(() => board?.lists || [], [board]);

	const { draggingCards } = useBoardSocket({
		boardId,
		setBoard,
	});

	const {
		sensors,
		activeItem,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
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

	const openAddMemberModal = useCallback(() => {
		if (!boardId) return;

		modal.open({
			title: "Add Member",
			size: "md",
			content: ({ close }) => (
				<AddBoardMemberModalContent
					boardId={boardId}
					onClose={close}
					onSuccess={() => fetchBoardDetail({ showLoading: false })}
				/>
			),
		});
	}, [boardId, fetchBoardDetail, modal]);

	const openCardDetailModal = useCallback(
		(cardId) => {
			if (!boardId || !cardId) return;

			modal.open({
				title: "Card Detail",
				size: "2xl",
				onClose: () => fetchBoardDetail({ showLoading: false }),
				content: ({ close }) => (
					<CardDetailModalContent
						boardId={boardId}
						onClose={close}
						cardId={cardId}
					/>
				),
			});
		},
		[boardId, fetchBoardDetail, modal],
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
				onAddList={handleAddList}
			/>

			<BoardCanvas
				lists={lists}
				sensors={sensors}
				activeItem={activeItem}
				draggingCards={draggingCards}
				onAddList={handleAddList}
				onAddCard={handleAddCard}
				onOpenCardDetail={openCardDetailModal}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			/>
		</section>
	);
}
