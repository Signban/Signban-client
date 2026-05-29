import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import BoardService from "../services/BoardService";
import { getErrorMessage } from "../utils/boardHelpers";
import { normalizeBoard, normalizeMember } from "../utils/boardNormalizer";

export default function useBoardDetail(boardId) {
	const softLoadingTimerRef = useRef(null);

	const [board, setBoard] = useState(null);
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [softLoading, setSoftLoading] = useState(false);

	const startSoftLoading = useCallback(() => {
		window.clearTimeout(softLoadingTimerRef.current);

		softLoadingTimerRef.current = window.setTimeout(() => {
			setSoftLoading(true);
		}, 450);
	}, []);

	const stopSoftLoading = useCallback(() => {
		window.clearTimeout(softLoadingTimerRef.current);
		setSoftLoading(false);
	}, []);

	const fetchBoardDetail = useCallback(
		async (options = {}) => {
			const { showLoading = true } = options;

			if (!boardId) {
				setLoading(false);
				return;
			}

			try {
				if (showLoading) {
					setLoading(true);
				} else {
					startSoftLoading();
				}

				const [boardResponse, membersResponse] = await Promise.all([
					BoardService.getBoardDetail(boardId),
					BoardService.getMembers(boardId),
				]);

				const memberList =
					membersResponse.resMembers || membersResponse.members || [];

				setBoard(normalizeBoard(boardResponse.board));
				setMembers(memberList.map(normalizeMember).filter(Boolean));
			} catch (error) {
				console.log(error);
				toast.error(getErrorMessage(error));
			} finally {
				if (showLoading) {
					setLoading(false);
				} else {
					stopSoftLoading();
				}
			}
		},
		[boardId, startSoftLoading, stopSoftLoading],
	);

	const handleAddList = useCallback(async () => {
		const name = prompt("List name");

		if (!name) return;

		try {
			startSoftLoading();

			const response = await BoardService.createList(boardId, {
				name,
			});

			setBoard(normalizeBoard(response.board));
			toast.success(response.message || "List created successfully");
		} catch (error) {
			console.log(error);
			toast.error(getErrorMessage(error));
		} finally {
			stopSoftLoading();
		}
	}, [boardId, startSoftLoading, stopSoftLoading]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		fetchBoardDetail({ showLoading: true });
	}, [fetchBoardDetail]);

	useEffect(() => {
		return () => {
			window.clearTimeout(softLoadingTimerRef.current);
		};
	}, []);

	return {
		board,
		setBoard,
		members,
		loading,
		softLoading,
		startSoftLoading,
		stopSoftLoading,
		fetchBoardDetail,
		handleAddList,
	};
}
