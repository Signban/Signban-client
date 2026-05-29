import { useState } from "react";
import AvatarGroup from "./AvatarGroup";
import MemberAvatar from "./MemberAvatar";

export default function BoardHeader({
	board,
	members,
	onBack,
	onAddMember,
	onAddList,
	onRemoveMember,
}) {
	const [showMemberList, setShowMemberList] = useState(false);

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
					<div className="relative">
						<button
							type="button"
							onClick={() => setShowMemberList((prev) => !prev)}
							className="rounded-full transition hover:opacity-80"
							title="View members"
						>
							<AvatarGroup members={members} />
						</button>

						{showMemberList && (
							<>
								<div
									className="fixed inset-0 z-10"
									onClick={() => setShowMemberList(false)}
								/>
								<div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-2xl border border-base-300 bg-base-100 py-2 shadow-xl">
									<p className="px-4 pb-1 pt-1 text-xs font-bold uppercase tracking-widest text-base-content/40">
										Members ({members.length})
									</p>
									{members.map((member) => (
										<div
											key={member.id}
											className="group flex items-center gap-2 px-4 py-2 hover:bg-base-200"
										>
											<MemberAvatar member={member} size="sm" />
											<span className="flex-1 truncate text-sm font-medium text-base-content">
												{member.name}
											</span>
											<button
												type="button"
												onClick={() => onRemoveMember?.(member.id)}
												className="hidden rounded-full border border-error px-2 py-0.5 text-xs font-bold text-error hover:bg-error hover:text-white group-hover:block"
											>
												Remove
											</button>
										</div>
									))}
								</div>
							</>
						)}
					</div>

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
