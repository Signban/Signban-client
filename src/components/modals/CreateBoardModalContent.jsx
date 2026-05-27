import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateBoardModalContent({ onClose }) {
	const [form, setForm] = useState({
		name: "",
		description: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;

		setForm((prevForm) => ({
			...prevForm,
			[name]: value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (!form.name.trim()) {
			toast.error("Board name is required");
			return;
		}

		toast.info("Endpoint create board belum dibuat di API");
		onClose?.();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<label className="form-control">
				<div className="label">
					<span className="label-text font-medium">Board Name</span>
				</div>

				<input
					type="text"
					name="name"
					value={form.name}
					onChange={handleChange}
					placeholder="Final Project"
					className="input input-bordered w-full"
				/>
			</label>

			<label className="form-control">
				<div className="label">
					<span className="label-text font-medium">Description</span>
				</div>

				<textarea
					name="description"
					value={form.description}
					onChange={handleChange}
					placeholder="Board untuk tracking task final project"
					className="textarea textarea-bordered min-h-28 w-full"
				/>
			</label>

			<div className="modal-action">
				<button type="button" onClick={onClose} className="btn btn-ghost">
					Cancel
				</button>

				<button type="submit" className="btn btn-primary">
					Create Board
				</button>
			</div>
		</form>
	);
}
