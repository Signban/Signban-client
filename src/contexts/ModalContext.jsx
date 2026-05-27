import { createContext, useContext, useMemo, useState } from "react";

const ModalContext = createContext(null);

const modalSizeClass = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-2xl",
	xl: "max-w-4xl",
	"2xl": "max-w-6xl",
	full: "max-w-[95vw]",
};

const initialModal = {
	open: false,
	title: "",
	size: "md",
	content: null,
	actions: null,
	showCloseButton: true,
	closeOnBackdrop: true,
	className: "",
};

export function ModalProvider({ children }) {
	const [modalState, setModalState] = useState(initialModal);

	const close = () => {
		setModalState(initialModal);
	};

	const open = ({
		title = "",
		size = "md",
		content = null,
		actions = null,
		showCloseButton = true,
		closeOnBackdrop = true,
		className = "",
	} = {}) => {
		setModalState({
			open: true,
			title,
			size,
			content,
			actions,
			showCloseButton,
			closeOnBackdrop,
			className,
		});
	};

	const value = useMemo(
		() => ({
			open,
			close,
			isOpen: modalState.open,
		}),
		[modalState.open],
	);

	const modalContent =
		typeof modalState.content === "function"
			? modalState.content({ close })
			: modalState.content;

	const modalActions =
		typeof modalState.actions === "function"
			? modalState.actions({ close })
			: modalState.actions;

	const sizeClass = modalSizeClass[modalState.size] || modalSizeClass.md;

	return (
		<ModalContext.Provider value={value}>
			{children}

			{modalState.open ? (
				<div className="modal modal-open">
					<div
						className={`modal-box w-full ${sizeClass} rounded-3xl ${modalState.className}`}
					>
						{modalState.showCloseButton ? (
							<button
								type="button"
								onClick={close}
								className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
							>
								✕
							</button>
						) : null}

						{modalState.title ? (
							<h3 className="mb-5 pr-8 text-2xl font-black text-base-content">
								{modalState.title}
							</h3>
						) : null}

						{modalContent}

						{modalActions ? <div className="modal-action">{modalActions}</div> : null}
					</div>

					<div
						className="modal-backdrop"
						onClick={modalState.closeOnBackdrop ? close : undefined}
					>
						<button type="button">close</button>
					</div>
				</div>
			) : null}
		</ModalContext.Provider>
	);
}

export function useModal() {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error("useModal must be used inside ModalProvider");
	}

	return context;
}
