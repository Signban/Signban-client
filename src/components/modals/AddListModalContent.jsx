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

export default function AddListModalContent({ boardId, position, onClose, onSuccess }) {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("List name is required");
			return;
		}

		try {
			setLoading(true);

			const response = await BoardService.createList(boardId, {
				name: name.trim(),
				position,
			});

			toast.success(response.message || "List created successfully");
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
					<span className="label-text font-medium">
						Name <span className="text-error">*</span>
					</span>
				</div>
				<input
					type="text"
					disabled={loading}
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="List name..."
					className="input input-bordered w-full"
					autoFocus
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
					disabled={!name.trim() || loading}
					className="btn btn-primary"
				>
					{loading ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						"Add List"
					)}
				</button>
			</div>
		</form>
	);
}
