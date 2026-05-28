import MemberAvatar from "./MemberAvatar";

export default function AvatarGroup({
	members = [],
	size = "md",
	borderClass = "border-base-100",
}) {
	const visibleMembers = members.slice(0, 4);
	const remainingMembers = members.length - visibleMembers.length;

	return (
		<div className="flex -space-x-3">
			{visibleMembers.map((member) => (
				<MemberAvatar
					key={member.id}
					member={member}
					size={size}
					borderClass={borderClass}
				/>
			))}

			{remainingMembers > 0 ? (
				<div
					className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 ${borderClass} bg-neutral font-black leading-none text-neutral-content shadow-sm ${
						size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm"
					}`}
				>
					+{remainingMembers}
				</div>
			) : null}
		</div>
	);
}
