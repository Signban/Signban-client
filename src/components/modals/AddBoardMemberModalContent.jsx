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

export default function AddBoardMemberModalContent({
	boardId,
	onClose,
	onSuccess,
}) {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const payload = {
			email: email.trim(),
		};

		if (!payload.email) {
			toast.error("Email is required");
			return;
		}

		try {
			setLoading(true);

			const response = await BoardService.addMember(boardId, payload);

			toast.success(response.message || "Member added successfully");
			await onSuccess?.();
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
					<span className="label-text font-medium">Member Email</span>
				</div>

				<input
					disabled={loading}
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					placeholder="member@signban.com"
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

				<button type="submit" disabled={loading} className="btn btn-primary">
					{loading ? (
						<span className="loading loading-spinner loading-sm"></span>
					) : (
						"Add Member"
					)}
				</button>
			</div>
		</form>
	);
}
