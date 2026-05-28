import { useState } from "react";
import { toast } from "react-toastify";
import BoardService from "../../services/BoardService";

function getErrorMessage(error) {
	return (
		error.response?.data?.message ||
		error.response?.data?.error ||
		error.message ||
		"Something went wrong"
	);
}

export default function CreateCardModalContent({
	boardId,
	list,
	onClose,
	onSuccess,
}) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const payload = {
			title: title.trim(),
			description: description.trim(),
			priority: "medium",
		};

		if (!payload.title) {
			toast.error("Card title is required");
			return;
		}

		if (!payload.description) {
			toast.error("Card description is required");
			return;
		}

		try {
			setLoading(true);

			const response = await BoardService.createCard(boardId, list.id, payload);

			toast.success(response.message || "Card created successfully");
			await onSuccess?.(response);
			onClose?.();
		} catch (error) {
			console.log(error);
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<label className="form-control">
				<div className="label">
					<span className="label-text font-medium">Card Title</span>
					<span className="label-text-alt text-error">Required</span>
				</div>

				<input
					disabled={loading}
					type="text"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="Example: Build login page"
					className="input input-bordered w-full"
				/>
			</label>

			<label className="form-control">
				<div className="label">
					<span className="label-text font-medium">Description</span>
					<span className="label-text-alt text-error">Required</span>
				</div>

				<textarea
					disabled={loading}
					value={description}
					onChange={(event) => setDescription(event.target.value)}
					placeholder="Describe what needs to be done..."
					className="textarea textarea-bordered min-h-28 w-full resize-none"
				/>
			</label>

			<div className="rounded-2xl bg-base-200/70 p-4 text-sm text-base-content/70">
				Card will be added to{" "}
				<span className="font-bold text-base-content">{list?.name}</span>
			</div>

			<div className="modal-action">
				<button
					type="button"
					onClick={onClose}
					disabled={loading}
					className="btn btn-ghost"
				>
					Cancel
				</button>

				<button type="submit" disabled={loading} className="btn btn-primary">
					{loading ? (
						<span className="loading loading-spinner loading-sm"></span>
					) : (
						"Create Card"
					)}
				</button>
			</div>
		</form>
	);
}
