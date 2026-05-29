export default function MemberAvatar({
	member,
	size = "md",
	borderClass = "border-base-100",
}) {
	const initial = member?.name?.charAt(0)?.toUpperCase() || "?";

	const sizeClass = {
		sm: "h-7 w-7 text-[11px]",
		md: "h-9 w-9 text-sm",
	}[size];

	return (
		<div
			title={member.name}
			className={`${sizeClass} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 ${borderClass} ${member.colorClass} font-black leading-none text-white shadow-sm`}
		>
			{member.avatarUrl ? (
				<img
					src={member.avatarUrl}
					alt={member.name}
					className="h-full w-full object-cover"
				/>
			) : (
				<span className="block translate-y-[0.5px] leading-none">
					{initial}
				</span>
			)}
		</div>
	);
}
