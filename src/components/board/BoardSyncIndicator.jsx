export default function BoardSyncIndicator({ visible }) {
	return (
		<div
			className={`pointer-events-none fixed bottom-5 right-5 z-50 transition-all duration-300 ${
				visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
			}`}
		>
			<div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100/95 px-4 py-3 text-sm font-bold text-base-content shadow-xl backdrop-blur">
				<span className="loading loading-dots loading-sm text-primary"></span>
				<span>Syncing board...</span>
			</div>
		</div>
	);
}
