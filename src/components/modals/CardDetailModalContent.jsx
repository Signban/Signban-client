import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import api from "../../services/api";
import BoardService from "../../services/BoardService";
import { CardPriority } from "../../constants/enums";

const priorityStyle = {
  [CardPriority.low]: "bg-success/10 text-success",
  [CardPriority.medium]: "bg-primary/10 text-primary",
  [CardPriority.high]: "bg-warning/10 text-warning",
  [CardPriority.urgent]: "bg-error/10 text-error",
};

function MemberAvatar({ member, size = "md" }) {
  const sizeClass = size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm";
  const initial = member?.name?.charAt(0)?.toUpperCase() || "?";
  const colorClass = member?.colorClass || "bg-primary";

  return (
    <div
      title={member.name}
      className={`${sizeClass} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-base-100 ${colorClass} font-black text-white`}
    >
      {member.avatarUrl ? (
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="block leading-none">{initial}</span>
      )}
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-base-content/40">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function CardDetailModalContent({ boardId, cardId, onClose }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [savedDescription, setSavedDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [checklists, setChecklists] = useState([]);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [boardMembers, setBoardMembers] = useState([]);
  const [addingAssignee, setAddingAssignee] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    async function fetchCard() {
      try {
        setLoading(true);
        const { data } = await api.get(`/boards/${boardId}/cards/${cardId}`);
        setCard(data.card);
        setDescription(data.card.description || "");
        setSavedDescription(data.card.description || "");
        setPriority(data.card.priority || CardPriority.medium);
        setDueDate(data.card.dueDate ? data.card.dueDate.slice(0, 10) : "");
        setComments(data.card.Comments || []);
        setChecklists(data.card.Checklists || []);
        setAssignees(data.card.CardAssignees || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load card");
      } finally {
        setLoading(false);
      }
    }

    fetchCard();
  }, [boardId, cardId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm font-medium text-error">{error}</p>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-sm mt-4"
        >
          Close
        </button>
      </div>
    );
  }

  const completedChecklists = checklists.filter((c) => c.isCompleted).length;
  const totalChecklists = checklists.length;

  async function handlePriorityChange(e) {
    const newPriority = e.target.value;
    setPriority(newPriority);
    await BoardService.updateCard(boardId, cardId, { priority: newPriority });
  }

  async function handleDueDateChange(e) {
    const newDate = e.target.value;
    setDueDate(newDate);
    await BoardService.updateCard(boardId, cardId, {
      dueDate: newDate || null,
    });
  }

  async function handleSaveDescription() {
    setSaving(true);
    try {
      await BoardService.updateCard(boardId, cardId, { description });
      setSavedDescription(description);
    } finally {
      setSaving(false);
    }
  }

  async function handlePostComment(e) {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setPostingComment(true);
    try {
      const data = await BoardService.createComment(boardId, cardId, {
        content: trimmed,
      });
      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
    } finally {
      setPostingComment(false);
    }
  }

  async function handleChecklistToggle(item) {
    const updated = { isCompleted: !item.isCompleted };
    setChecklists((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, ...updated } : c)),
    );
    try {
      await BoardService.updateChecklist(boardId, cardId, item.id, updated);
    } catch {
      // revert on failure
      setChecklists((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, isCompleted: item.isCompleted } : c,
        ),
      );
    }
  }

  async function handleChecklistTitleBlur(item, newTitle) {
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === item.title) return;
    setChecklists((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, title: trimmed } : c)),
    );
    try {
      await BoardService.updateChecklist(boardId, cardId, item.id, {
        title: trimmed,
      });
    } catch {
      setChecklists((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, title: item.title } : c)),
      );
    }
  }

  async function handleDeleteChecklist(item) {
    setChecklists((prev) => prev.filter((c) => c.id !== item.id));
    try {
      await BoardService.deleteChecklist(boardId, cardId, item.id);
    } catch {
      setChecklists((prev) => [...prev, item]);
    }
  }

  async function handleOpenAssigneePicker() {
    setShowAssigneePicker((prev) => !prev);
    if (boardMembers.length === 0) {
      const data = await BoardService.getMembers(boardId);
      setBoardMembers(data.resMembers || []);
    }
  }

  async function handleAddAssignee(member) {
    setAddingAssignee(true);
    try {
      await BoardService.addAssignee(boardId, cardId, member.UserId);
      const { data } = await api.get(`/boards/${boardId}/cards/${cardId}`);
      setAssignees(data.card.CardAssignees || []);
      setShowAssigneePicker(false);
    } finally {
      setAddingAssignee(false);
    }
  }

  async function handleRemoveAssignee(userId) {
    try {
      await BoardService.removeAssignee(boardId, cardId, userId);
      setAssignees((prev) =>
        prev.filter((a) => a.UserId !== userId && a.User?.id !== userId),
      );
    } catch {
      // silently ignore
    }
  }

  async function handleDeleteCard() {
    const result = await Swal.fire({
      title: "Delete this card?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });
    if (!result.isConfirmed) return;
    setDeleting(true);
    try {
      await BoardService.deleteCard(boardId, cardId);
      onClose?.();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to delete card";
      toast.error(msg);
      setDeleting(false);
    }
  }

  async function handleGenerateWithAI() {
    setGeneratingAI(true);
    try {
      const data = await BoardService.generateChecklistWithAI(boardId, cardId);
      setChecklists(data.checklists || []);
      if (data.checklists?.[0]?.Card?.priority) {
        setPriority(data.checklists[0].Card.priority);
      }
      // Re-fetch card to get updated priority and checklists
      const { data: refreshed } = await api.get(`/boards/${boardId}/cards/${cardId}`);
      setChecklists(refreshed.card.Checklists || []);
      setPriority(refreshed.card.priority || priority);
      toast.success("Checklist has been generated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate checklist");
    } finally {
      setGeneratingAI(false);
    }
  }

  async function handleAddChecklist(e) {
    e.preventDefault();
    const trimmed = newChecklistTitle.trim();
    if (!trimmed) return;
    setAddingChecklist(true);
    try {
      await BoardService.createChecklist(boardId, cardId, { title: trimmed });
      const { data } = await api.get(`/boards/${boardId}/cards/${cardId}`);
      setChecklists(data.card.Checklists || []);
      setNewChecklistTitle("");
      setShowChecklistForm(false);
    } finally {
      setAddingChecklist(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleDeleteCard}
        disabled={deleting}
        className="btn btn-circle btn-ghost absolute right-18 top-2 text-error hover:bg-error/10"
        title="Delete card"
      >
        {deleting ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        )}
      </button>

      {/* Cover */}
      {card.coverUrl && (
        <div className="-mx-6 -mt-6 mb-2 overflow-hidden rounded-t-3xl">
          <img
            src={card.coverUrl}
            alt="Card cover"
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      {/* Title + Generate Checklist — inline */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={priority}
              onChange={handlePriorityChange}
              className={`rounded-full border-0 px-2.5 py-1 text-xs font-bold capitalize outline-none ${
                priorityStyle[priority] || "bg-base-200 text-base-content"
              }`}
            >
              {Object.values(CardPriority).map((p) => (
                <option
                  key={p}
                  value={p}
                  className="bg-base-100 text-base-content normal-case"
                >
                  {p}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 rounded-full bg-base-200 px-2.5 py-1">
              <span className="text-xs font-medium text-base-content/40">
                Due
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={handleDueDateChange}
                className="bg-transparent text-xs font-medium text-base-content/60 outline-none"
              />
            </label>
          </div>

          <h2 className="text-xl font-black leading-snug text-base-content">
            {card.title}
          </h2>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm shrink-0"
          onClick={handleGenerateWithAI}
          disabled={generatingAI}
        >
          {generatingAI ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            "✦ Generate Checklist"
          )}
        </button>
      </div>

      {/* 2-column body */}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-[2fr_1px_1fr]">
        {/* Left column */}
        <div className="space-y-5 md:pr-6">
          {/* Creator */}
          {card.User && (
            <Section label="Created by">
              <div className="flex items-center gap-2">
                <MemberAvatar member={card.User} size="sm" />
                <span className="text-sm font-medium text-base-content">
                  {card.User.name}
                </span>
              </div>
            </Section>
          )}

          {/* Assignees */}
          <Section label="Assignees">
            <div className="flex flex-wrap items-center gap-2">
              {assignees.map((a) => (
                <div key={a.id} className="group flex items-center gap-1.5">
                  <MemberAvatar member={a.User} size="sm" />
                  <span className="text-sm font-medium text-base-content">
                    {a.User.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(a.User.id)}
                    className="hidden text-xs text-base-content/30 hover:text-error group-hover:inline"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="relative">
                <button
                  type="button"
                  onClick={handleOpenAssigneePicker}
                  className="btn btn-outline btn-xs rounded-full"
                >
                  + Add Assignee
                </button>

                {showAssigneePicker && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-52 rounded-2xl border border-base-300 bg-base-100 py-2 shadow-lg">
                    {boardMembers.filter(
                      (m) => !assignees.some((a) => a.User?.id === m.UserId),
                    ).length === 0 ? (
                      <p className="px-4 py-2 text-xs text-base-content/40">
                        All members assigned
                      </p>
                    ) : (
                      boardMembers
                        .filter(
                          (m) =>
                            !assignees.some((a) => a.User?.id === m.UserId),
                        )
                        .map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            disabled={addingAssignee}
                            onClick={() => handleAddAssignee(m)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-base-200"
                          >
                            <MemberAvatar member={m.User} size="sm" />
                            <span className="font-medium">{m.User.name}</span>
                          </button>
                        ))
                    )}
                    <div className="mt-1 border-t border-base-300 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAssigneePicker(false)}
                        className="w-full px-4 py-1.5 text-left text-xs text-base-content/40 hover:bg-base-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Description */}
          <Section label="Description">
            <textarea
              className="textarea textarea-bordered w-full text-sm leading-relaxed"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={description === savedDescription || saving}
                onClick={handleSaveDescription}
              >
                {saving ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </Section>

          {/* Checklists */}
          <Section
            label={`Checklist (${completedChecklists}/${totalChecklists})`}
          >
            {checklists.length > 0 && (
              <>
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-base-200">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width:
                        totalChecklists > 0
                          ? `${(completedChecklists / totalChecklists) * 100}%`
                          : "0%",
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  {checklists.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={item.isCompleted}
                        onChange={() => handleChecklistToggle(item)}
                        className="checkbox checkbox-primary checkbox-sm shrink-0"
                      />
                      <input
                        type="text"
                        defaultValue={item.title}
                        onBlur={(e) =>
                          handleChecklistTitleBlur(item, e.target.value)
                        }
                        className={`flex-1 bg-transparent text-sm outline-none focus:border-b focus:border-base-300 ${
                          item.isCompleted
                            ? "line-through text-base-content/40"
                            : "text-base-content"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteChecklist(item)}
                        className="hidden rounded-full border border-error px-2 py-0.5 text-xs font-bold text-error hover:bg-error hover:text-white group-hover:block"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {showChecklistForm ? (
              <form
                onSubmit={handleAddChecklist}
                className="mt-3 flex items-center gap-2"
              >
                <input
                  type="text"
                  autoFocus
                  className="input input-bordered input-sm flex-1 text-sm"
                  placeholder="Checklist item title..."
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!newChecklistTitle.trim() || addingChecklist}
                >
                  {addingChecklist ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Add"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setShowChecklistForm(false);
                    setNewChecklistTitle("");
                  }}
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="mt-3 text-xs font-bold text-primary hover:underline"
                onClick={() => setShowChecklistForm(true)}
              >
                + Add item
              </button>
            )}
          </Section>
        </div>

        {/* Divider */}
        <div className="hidden w-px self-stretch bg-base-300 md:block" />

        {/* Right column — Comments */}
        <div className="flex flex-col gap-4 md:pl-6">
          <Section label={`Comments (${comments.length})`}>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <MemberAvatar member={comment.User} size="sm" />
                  <div className="flex-1 rounded-2xl bg-base-200/60 px-4 py-3">
                    <p className="mb-1 text-xs font-bold text-base-content/60">
                      {comment.User.name}
                    </p>
                    <p className="text-sm leading-relaxed text-base-content">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostComment} className="mt-4 space-y-2">
              <textarea
                className="textarea textarea-bordered w-full text-sm"
                rows={3}
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!commentText.trim() || postingComment}
                >
                  {postingComment ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Post"
                  )}
                </button>
              </div>
            </form>
          </Section>
        </div>
      </div>

      {/* Footer */}
      <div className="modal-action pt-2">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
