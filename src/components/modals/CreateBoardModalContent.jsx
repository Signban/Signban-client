import { useState } from "react";
import { toast } from "react-toastify";
import BoardService from "../../services/BoardService";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Failed to create board"
  );
}

export default function CreateBoardModalContent({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    generatedListWithAi: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      generatedListWithAi: form.generatedListWithAi,
    };

    if (!payload.name) {
      toast.error("Board name is required");
      return;
    }

    try {
      setLoading(true);
      const response = await BoardService.createBoard(payload);

      toast.success(response.message || "Board created successfully");
      await onCreated?.(response.board);
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
          <span className="label-text font-medium">Board Name</span>
        </div>

        <input
          disabled={loading}
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
          disabled={loading}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Board untuk tracking task final project"
          className="textarea textarea-bordered min-h-28 w-full"
        />
      </label>

      <label className="flex cursor-pointer items-center gap-2 mt-5">
        <input
          type="checkbox"
          className="checkbox checkbox-primary checkbox-sm"
          checked={form.generatedListWithAi}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              generatedListWithAi: e.target.checked,
            }))
          }
        />
        <span className="text-sm font-medium text-base-content/60">
          Generate with AI
        </span>
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
            "Create Board"
          )}
        </button>
      </div>
    </form>
  );
}
