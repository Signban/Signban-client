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

export default function AddCardModalContent({ boardId, listId, onClose, onSuccess }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title.trim()) {
			toast.error("Title is required");
			return;
		}

		try {
			setLoading(true);

			const payload = {
				title: title.trim(),
				priority: "medium",
				...(description.trim() && { description: description.trim() }),
				...(dueDate && { dueDate }),
			};

			const response = await BoardService.createCard(boardId, listId, payload);

			toast.success(response.message || "Card created successfully");
			await onSuccess?.(response);
		} catch (error) {
			toast.error(getErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<label className="form-control">
				<div className="label">
					<span className="label-text font-medium">Title <span className="text-error">*</span></span>
				</div>
				<input
					type="text"
					disabled={loading}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Card title..."
					className="input input-bordered w-full"
					autoFocus
				/>
			</label>

			<label className="form-control">
				<div className="label">
					<span className="label-text font-medium">Description</span>
				</div>
				<textarea
					disabled={loading}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Add a description..."
					className="textarea textarea-bordered w-full"
					rows={3}
				/>
			</label>

			<label className="form-control">
				<div className="label">
					<span className="label-text font-medium">Due Date</span>
				</div>
				<input
					type="date"
					disabled={loading}
					value={dueDate}
					onChange={(e) => setDueDate(e.target.value)}
					className="input input-bordered w-full"
				/>
			</label>

			<div className="modal-action">
				<button
					type="button"
					onClick={onClose}
					disabled={loading}
					className="btn btn-ghost"
				>
					Cancel
				</button>

				<button
					type="submit"
					disabled={!title.trim() || loading}
					className="btn btn-primary"
				>
					{loading ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						"Add Card"
					)}
				</button>
			</div>
		</form>
	);
}
