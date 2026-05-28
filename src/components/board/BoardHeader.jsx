import AvatarGroup from "./AvatarGroup";

export default function BoardHeader({
	board,
	members,
	onBack,
	onAddMember,
	onAddList,
}) {
	return (
		<header className="shrink-0 border-b border-base-300 bg-base-100/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="min-w-0">
					<button
						type="button"
						onClick={onBack}
						className="mb-2 text-xs font-bold text-base-content/40 transition hover:text-primary"
					>
						← Back to Dashboard
					</button>

					<h1 className="truncate text-2xl font-black tracking-tight text-base-content">
						{board?.name || "Untitled Board"}
					</h1>

					<p className="mt-1 line-clamp-1 text-sm text-base-content/50">
						{board?.description || "No description"}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<AvatarGroup members={members} />

					<button
						type="button"
						onClick={onAddMember}
						className="btn btn-primary btn-sm"
					>
						Add Member
					</button>

					<button
						type="button"
						onClick={onAddList}
						className="btn btn-outline btn-sm"
					>
						Add List
					</button>
				</div>
			</div>
		</header>
	);
}
