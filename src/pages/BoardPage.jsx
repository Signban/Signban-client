import { useEffect } from "react";
import { useModal } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import CreateBoardModalContent from "../components/modals/CreateBoardModalContent";

const dummyBoards = [
	{
		id: 1,
		name: "Final Project",
		description: "Board untuk tracking task final project",
		members: [
			{
				id: 1,
				name: "Brahmantio",
				avatarUrl: "https://i.pravatar.cc/100?img=11",
			},
			{
				id: 2,
				name: "Aldi",
				avatarUrl: "https://i.pravatar.cc/100?img=12",
			},
			{
				id: 3,
				name: "Nadia",
				avatarUrl: "https://i.pravatar.cc/100?img=13",
			},
		],
	},
	{
		id: 2,
		name: "Signban Development",
		description: "Realtime Kanban + AI checklist",
		members: [
			{
				id: 1,
				name: "Brahmantio",
				avatarUrl: "https://i.pravatar.cc/100?img=14",
			},
			{
				id: 4,
				name: "Raka",
				avatarUrl: "https://i.pravatar.cc/100?img=15",
			},
		],
	},
];

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
							<img src={member.avatarUrl} alt={member.name} />
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
				{members.map((member) => member.name).join(", ")}
			</p>
		</div>
	);
}

export default function BoardPage() {
	const modal = useModal();
	const { currentUser } = useAuth();

	const displayName =
		currentUser?.name || currentUser?.email?.split("@")[0] || "there";

	const openCreateBoardModal = () => {
		modal.open({
			title: "Create Board",
			size: "lg",
			content: ({ close }) => <CreateBoardModalContent onClose={close} />,
		});
	};

	useEffect(() => {
		document.title = "Dashboard | Signban";
	}, []);

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
					<input type="text" className="grow" placeholder="Search board..." />
				</label>
			</div>

			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
				{dummyBoards.map((board) => (
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
										{board.description}
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
											<button type="button">Edit</button>
										</li>
										<li>
											<button type="button" className="text-error">
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
								<button type="button" className="btn btn-primary btn-sm">
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
		</section>
	);
}
