import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useModal } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import CreateBoardModalContent from "../components/modals/CreateBoardModalContent";
import BoardService from "../services/BoardService";

function getErrorMessage(error) {
	return (
		error.response?.data?.message ||
		error.response?.data?.error ||
		error.message ||
		"Something went wrong"
	);
}

function normalizeMember(member) {
	const user = member?.User || member?.user || member;

	if (!user) return null;

	const name =
		user.name ||
		user.email?.split("@")[0] ||
		`User ${user.id || member.UserId}`;

	return {
		id: user.id || member.UserId || member.id,
		name,
		email: user.email || "",
		avatarUrl: user.avatarUrl || null,
		role: member.role || user.role || "member",
	};
}

function getInitial(name) {
	return name?.charAt(0)?.toUpperCase() || "?";
}

function BoardMemberAvatars({ members = [] }) {
	const visibleMembers = members.slice(0, 4);
	const remainingMembers = members.length - visibleMembers.length;

	return (
		<div className="flex items-center gap-3">
			<div className="avatar-group -space-x-3">
				{visibleMembers.map((member) => (
					<div
						key={member.id}
						className="avatar border-2 border-base-100"
						title={member.name}
					>
						<div className="w-9 rounded-full">
							{member.avatarUrl ? (
								<img src={member.avatarUrl} alt={member.name} />
							) : (
								<div className="flex h-full w-full items-center justify-center bg-primary text-xs font-black text-primary-content">
									{getInitial(member.name)}
								</div>
							)}
						</div>
					</div>
				))}

				{remainingMembers > 0 && (
					<div className="avatar placeholder border-2 border-base-100">
						<div className="w-9 rounded-full bg-neutral text-neutral-content">
							<span className="text-xs font-bold">+{remainingMembers}</span>
						</div>
					</div>
				)}
			</div>

			<p className="line-clamp-1 text-xs text-base-content/50">
				{members.length > 0
					? members.map((member) => member.name).join(", ")
					: "No members"}
			</p>
		</div>
	);
}

export default function BoardPage() {
	const modal = useModal();
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	const [boards, setBoards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	const displayName =
		currentUser?.name || currentUser?.email?.split("@")[0] || "there";

	const fetchBoardMembers = async (boardId) => {
		const response = await BoardService.getMembers(boardId);
		const members = response.resMembers || response.members || [];

		return members.map(normalizeMember).filter(Boolean);
	};

	const fetchBoards = useCallback(async () => {
		try {
			setLoading(true);

			const response = await BoardService.getBoards();
			const boardList = Array.isArray(response.boards) ? response.boards : [];

			const boardsWithMembers = await Promise.all(
				boardList.map(async (board) => {
					try {
						const members = await fetchBoardMembers(board.id);

						return {
							...board,
							members,
						};
					} catch (error) {
						console.log(error);

						return {
							...board,
							members: [],
						};
					}
				}),
			);

			setBoards(boardsWithMembers);
		} catch (error) {
			console.log(error);
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	}, []);

	const filteredBoards = useMemo(() => {
		const keyword = search.trim().toLowerCase();

		if (!keyword) return boards;

		return boards.filter((board) => {
			const memberNames = board.members
				.map((member) => member.name)
				.join(" ")
				.toLowerCase();

			return (
				board.name?.toLowerCase().includes(keyword) ||
				board.description?.toLowerCase().includes(keyword) ||
				memberNames.includes(keyword)
			);
		});
	}, [boards, search]);

	const openCreateBoardModal = () => {
		modal.open({
			title: "Create Board",
			size: "lg",
			content: ({ close }) => (
				<CreateBoardModalContent onClose={close} onCreated={fetchBoards} />
			),
		});
	};

	const openEditBoardModal = (board) => {
		modal.open({
			title: "Edit Board",
			size: "lg",
			content: ({ close }) => (
				<CreateBoardModalContent
					onClose={close}
					onUpdated={fetchBoards}
					board={board}
				/>
			),
		});
	};

	const handleOpenBoard = (board) => {
		navigate(`/dashboard/${board.id}`);
	};

	const handleDeleteBoard = () => {
		toast.info("Endpoint delete board belum ada di API");
	};

	useEffect(() => {
		document.title = "Dashboard | Signban";
		fetchBoards();
	}, [fetchBoards]);

	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
				<div>
					<p className="text-sm font-semibold text-primary">Dashboard</p>

					<h1 className="mt-2 text-4xl font-black tracking-tight text-base-content">
						Welcome back,{" "}
						<span className="capitalize text-primary">{displayName}</span>
					</h1>

					<p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-content/60">
						Pilih board untuk lanjut kerja bareng tim kamu secara realtime.
					</p>
				</div>

				<button
					type="button"
					onClick={openCreateBoardModal}
					className="btn btn-primary"
				>
					<span className="text-lg">＋</span>
					Create Board
				</button>
			</div>

			<div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
				<h2 className="text-2xl font-black">Your Boards</h2>

				<label className="input input-bordered flex w-full items-center gap-2 md:max-w-sm">
					<span className="text-base-content/40">⌕</span>
					<input
						type="text"
						className="grow"
						placeholder="Search board..."
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>
				</label>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm"
						>
							<div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

							<div className="card-body">
								<div className="skeleton h-8 w-3/4"></div>
								<div className="skeleton mt-3 h-4 w-full"></div>
								<div className="skeleton h-4 w-2/3"></div>
								<div className="mt-6 flex items-center gap-3">
									<div className="skeleton h-9 w-9 rounded-full"></div>
									<div className="skeleton h-3 w-32"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
					{filteredBoards.map((board) => (
						<article
							key={board.id}
							className="group card overflow-hidden border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
						>
							<div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

							<div className="card-body">
								<div className="flex items-start justify-between gap-4">
									<div className="min-w-0">
										<h3 className="line-clamp-1 text-2xl font-black transition group-hover:text-primary">
											{board.name}
										</h3>

										<p className="mt-3 min-h-12 text-sm leading-relaxed text-base-content/60">
											{board.description || "No description"}
										</p>
									</div>

									<div className="dropdown dropdown-end">
										<button
											type="button"
											tabIndex={0}
											className="btn btn-circle btn-ghost btn-sm"
										>
											⋯
										</button>

										<ul
											tabIndex={0}
											className="menu dropdown-content z-10 mt-2 w-40 rounded-box bg-base-100 p-2 shadow-xl"
										>
											<li>
												<button
													type="button"
													onClick={() => openEditBoardModal(board)}
												>
													Edit
												</button>
											</li>
											<li>
												<button
													type="button"
													onClick={handleDeleteBoard}
													className="text-error"
												>
													Delete
												</button>
											</li>
										</ul>
									</div>
								</div>

								<div className="mt-6">
									<BoardMemberAvatars members={board.members} />
								</div>

								<div className="card-actions mt-6 justify-end">
									<button
										type="button"
										onClick={() => handleOpenBoard(board)}
										className="btn btn-primary btn-sm"
									>
										Open Board
										<span>→</span>
									</button>
								</div>
							</div>
						</article>
					))}

					<button
						type="button"
						onClick={openCreateBoardModal}
						className="group min-h-56 rounded-[1.5rem] border-2 border-dashed border-base-300 bg-base-100 p-6 text-left transition hover:border-primary hover:bg-primary/5"
					>
						<div className="flex h-full flex-col items-center justify-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl text-primary transition group-hover:scale-110">
								＋
							</div>

							<h3 className="text-xl font-black">Create new board</h3>

							<p className="mt-2 max-w-xs text-sm leading-relaxed text-base-content/50">
								Buat workspace baru untuk project, sprint, atau task tim kamu.
							</p>
						</div>
					</button>
				</div>
			)}
		</section>
	);
}
