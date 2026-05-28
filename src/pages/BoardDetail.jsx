import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useModal } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import BoardService from "../services/BoardService";
import socket from "../services/socket";
import AddBoardMemberModalContent from "../components/modals/AddBoardMemberModalContent";
import CardDetailModalContent from "../components/modals/CardDetailModalContent";

const colorClasses = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-amber-600",
  "bg-rose-600",
  "bg-cyan-600",
  "bg-fuchsia-600",
  "bg-lime-600",
];

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong"
  );
}

function getColorClass(id = 0) {
  return colorClasses[Math.abs(Number(id)) % colorClasses.length];
}

function formatPriority(priority) {
  if (!priority) return "Medium";

  return priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
}

function formatDate(value) {
  if (!value) return "No due date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No due date";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeMember(member) {
  const user = member?.User || member?.user || member;

  if (!user) return null;

  const name =
    user.name ||
    user.email?.split("@")[0] ||
    `User ${user.id || member.UserId}`;

  return {
    id: user.id || member.UserId || member.id,
    name,
    email: user.email || "",
    avatarUrl: user.avatarUrl || null,
    role: member.role || "member",
    colorClass: getColorClass(user.id || member.UserId || member.id),
  };
}

function normalizeAssignee(assignee) {
  const user = assignee?.User || assignee?.user || assignee;

  if (!user) return null;

  const name =
    user.name ||
    user.email?.split("@")[0] ||
    `User ${user.id || assignee.UserId}`;

  return {
    id: user.id || assignee.UserId || assignee.id,
    name,
    email: user.email || "",
    avatarUrl: user.avatarUrl || null,
    colorClass: getColorClass(user.id || assignee.UserId || assignee.id),
  };
}

function normalizeCard(card) {
  const checklists = card.Checklists || card.checklists || [];
  const comments = card.Comments || card.comments || [];
  const assignees = card.CardAssignees || card.assignees || [];

  const checklistDone = checklists.filter(
    (checklist) => checklist.isCompleted,
  ).length;

  return {
    ...card,
    type: "card",
    dndId: `card-${card.id}`,
    listId: card.ListId,
    priorityLabel: formatPriority(card.priority),
    dueDateLabel: formatDate(card.dueDate),
    assignees: assignees.map(normalizeAssignee).filter(Boolean),
    checklistDone,
    checklistTotal: checklists.length,
    commentTotal: comments.length,
  };
}

function normalizeList(list) {
  const cards = list.Cards || list.cards || [];

  return {
    ...list,
    type: "list",
    dndId: `list-${list.id}`,
    cards: cards
      .map(normalizeCard)
      .sort((a, b) => (a.position || 0) - (b.position || 0)),
  };
}

function normalizeBoard(board) {
  const rawLists = board?.Lists || board?.lists || [];

  return {
    ...board,
    lists: rawLists
      .map(normalizeList)
      .sort((a, b) => (a.position || 0) - (b.position || 0)),
  };
}

function findListByCardId(lists, cardId) {
  return lists.find((list) => list.cards.some((card) => card.id === cardId));
}

function findListByDndId(lists, dndId) {
  if (!dndId) return null;

  if (String(dndId).startsWith("list-")) {
    const listId = Number(String(dndId).replace("list-", ""));
    return lists.find((list) => list.id === listId);
  }

  if (String(dndId).startsWith("card-")) {
    const cardId = Number(String(dndId).replace("card-", ""));
    return findListByCardId(lists, cardId);
  }

  return null;
}

function MemberAvatar({
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

function AvatarGroup({
  members = [],
  size = "md",
  borderClass = "border-base-100",
}) {
  const visibleMembers = members.slice(0, 4);
  const remainingMembers = members.length - visibleMembers.length;

  return (
    <div className="flex -space-x-3">
      {visibleMembers.map((member) => (
        <MemberAvatar
          key={member.id}
          member={member}
          size={size}
          borderClass={borderClass}
        />
      ))}

      {remainingMembers > 0 ? (
        <div
          className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 ${borderClass} bg-neutral font-black leading-none text-neutral-content shadow-sm ${
            size === "sm" ? "h-7 w-7 text-[11px]" : "h-9 w-9 text-sm"
          }`}
        >
          +{remainingMembers}
        </div>
      ) : null}
    </div>
  );
}

function getPriorityClass(priority) {
  if (priority === "Urgent") {
    return "bg-error/10 text-error";
  }

  if (priority === "High") {
    return "bg-warning/10 text-warning";
  }

  return "bg-primary/10 text-primary";
}

function CardItem({ card, draggingCards = {}, onOpenCardDetail }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.dndId,
    data: {
      type: "card",
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragInfo = draggingCards[card.id];

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenCardDetail(card.id)}
      className={`cursor-grab rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-base-200 active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      } ${dragInfo ? "ring-2 ring-primary/30" : ""}`}
    >
      {dragInfo ? (
        <p className="mb-3 rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
          {dragInfo.userName} is moving this card
        </p>
      ) : null}

      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${getPriorityClass(
            card.priorityLabel,
          )}`}
        >
          {card.priorityLabel}
        </span>

        <span className="shrink-0 text-xs text-base-content/40">
          {card.dueDateLabel}
        </span>
      </div>

      <h3 className="text-sm font-bold leading-6 text-base-content">
        {card.title}
      </h3>

      <div className="mt-4 flex items-center justify-between gap-3">
        <AvatarGroup
          members={card.assignees}
          size="sm"
          borderClass="border-base-200"
        />

        <div className="flex items-center gap-3 text-xs font-medium text-base-content/40">
          <span>
            ☑ {card.checklistDone}/{card.checklistTotal}
          </span>
          <span>💬 {card.commentTotal}</span>
        </div>
      </div>
    </article>
  );
}

function ListColumn({ list, draggingCards, onAddCard, onOpenCardDetail }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.dndId,
    data: {
      type: "list",
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab border-b border-base-300 px-4 py-4 active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate font-black text-base-content">
              {list.name}
            </h2>

            <p className="mt-1 text-xs font-medium text-base-content/40">
              {list.cards.length} cards
            </p>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-xs rounded-xl text-base-content/50"
            onClick={(event) => event.stopPropagation()}
          >
            •••
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <SortableContext
          items={list.cards.map((card) => card.dndId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {list.cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                draggingCards={draggingCards}
                onOpenCardDetail={onOpenCardDetail}
              />
            ))}

            <button
              type="button"
              onClick={() => onAddCard(list)}
              className="w-full rounded-2xl border border-dashed border-base-300 bg-base-100 py-3 text-sm font-bold text-base-content/50 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              + Add Card
            </button>
          </div>
        </SortableContext>
      </div>
    </section>
  );
}

export default function BoardDetailPage() {
  const modal = useModal();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();

  const boardId = id;

  const [board, setBoard] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [draggingCards, setDraggingCards] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const lists = useMemo(() => board?.lists || [], [board]);

  const fetchBoardDetail = useCallback(async () => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [boardResponse, membersResponse] = await Promise.all([
        BoardService.getBoardDetail(boardId),
        BoardService.getMembers(boardId),
      ]);

      const memberList =
        membersResponse.resMembers || membersResponse.members || [];

      setBoard(normalizeBoard(boardResponse.board));
      setMembers(memberList.map(normalizeMember).filter(Boolean));
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const openAddMemberModal = () => {
    if (!boardId) return;

    modal.open({
      title: "Add Member",
      size: "md",
      content: ({ close }) => (
        <AddBoardMemberModalContent
          boardId={boardId}
          onClose={close}
          onSuccess={fetchBoardDetail}
        />
      ),
    });
  };

  const openCardDetailModal = (cardId) => {
    if (!boardId || !cardId) return;

    modal.open({
      title: "Card Detail",
      size: "2xl",
      content: ({ close }) => (
        <CardDetailModalContent
          boardId={boardId}
          onClose={close}
          cardId={cardId}
        />
      ),
    });
  };

  const handleAddList = async () => {
    const name = prompt("List name");

    if (!name) return;

    try {
      const response = await BoardService.createList(boardId, {
        name,
      });

      setBoard(normalizeBoard(response.board));
      toast.success(response.message || "List created successfully");
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleAddCard = async (list) => {
    const title = prompt("Card title");

    if (!title) return;

    try {
      const response = await BoardService.createCard(boardId, list.id, {
        title,
        priority: "medium",
      });

      setBoard(normalizeBoard(response.board));
      toast.success(response.message || "Card created successfully");
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleDragStart = (event) => {
    const data = event.active.data.current;
    setActiveItem(data);

    const userName =
      currentUser?.name || currentUser?.email?.split("@")[0] || "Someone";

    if (data?.type === "card") {
      socket.emit("card:drag-start", {
        boardId,
        cardId: data.card.id,
        userName,
      });
    }

    if (data?.type === "list") {
      socket.emit("list:drag-start", {
        boardId,
        listId: data.list.id,
        userName,
      });
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over || !board) return;

    const activeData = active.data.current;

    if (activeData?.type !== "card") return;

    const activeCardId = Number(String(active.id).replace("card-", ""));
    const sourceList = findListByCardId(lists, activeCardId);
    const destinationList = findListByDndId(lists, over.id);

    if (
      !sourceList ||
      !destinationList ||
      sourceList.id === destinationList.id
    ) {
      return;
    }

    setBoard((prevBoard) => {
      const nextLists = prevBoard.lists.map((list) => ({
        ...list,
        cards: [...list.cards],
      }));

      const fromList = nextLists.find((list) => list.id === sourceList.id);
      const toList = nextLists.find((list) => list.id === destinationList.id);

      const movingCardIndex = fromList.cards.findIndex(
        (card) => card.id === activeCardId,
      );

      if (movingCardIndex === -1) return prevBoard;

      const [movingCard] = fromList.cards.splice(movingCardIndex, 1);

      const overCardId = String(over.id).startsWith("card-")
        ? Number(String(over.id).replace("card-", ""))
        : null;

      const insertIndex = overCardId
        ? toList.cards.findIndex((card) => card.id === overCardId)
        : toList.cards.length;

      toList.cards.splice(
        insertIndex >= 0 ? insertIndex : toList.cards.length,
        0,
        {
          ...movingCard,
          ListId: toList.id,
          listId: toList.id,
        },
      );

      return {
        ...prevBoard,
        lists: nextLists,
      };
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    const activeData = active.data.current;

    setActiveItem(null);

    if (!over || !board) return;

    try {
      if (activeData?.type === "list") {
        const activeListId = Number(String(active.id).replace("list-", ""));
        const overListId = Number(String(over.id).replace("list-", ""));

        if (activeListId === overListId) return;

        const oldIndex = lists.findIndex((list) => list.id === activeListId);
        const newIndex = lists.findIndex((list) => list.id === overListId);

        const nextLists = arrayMove(lists, oldIndex, newIndex);

        setBoard((prevBoard) => ({
          ...prevBoard,
          lists: nextLists,
        }));

        const response = await BoardService.moveList(boardId, activeListId, {
          newPosition: newIndex,
        });

        setBoard(normalizeBoard(response.board));

        socket.emit("list:drag-end", {
          boardId,
          listId: activeListId,
        });

        return;
      }

      if (activeData?.type === "card") {
        const activeCardId = Number(String(active.id).replace("card-", ""));
        const destinationList = findListByDndId(lists, over.id);

        if (!destinationList) return;

        const sourceListId = activeData.card.ListId || activeData.card.listId;
        const newPosition = destinationList.cards.findIndex(
          (card) => card.id === activeCardId,
        );

        const response = await BoardService.moveCard(boardId, activeCardId, {
          sourceListId,
          destinationListId: destinationList.id,
          newPosition:
            newPosition < 0 ? destinationList.cards.length : newPosition,
        });

        setBoard(normalizeBoard(response.board));

        socket.emit("card:drag-end", {
          boardId,
          cardId: activeCardId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error));
      fetchBoardDetail();
    }
  };

  useEffect(() => {
    document.title = board?.name
      ? `${board.name} | Signban`
      : "Board | Signban";
  }, [board?.name]);

  useEffect(() => {
    fetchBoardDetail();
  }, [fetchBoardDetail]);

  useEffect(() => {
    if (!boardId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("board:join", boardId);

    const handleBoardUpdated = (payload) => {
      if (payload?.board) {
        setBoard(normalizeBoard(payload.board));
      } else {
        fetchBoardDetail();
      }
    };

    const handleCardMoved = (payload) => {
      if (payload?.board) {
        setBoard(normalizeBoard(payload.board));
      } else {
        fetchBoardDetail();
      }
    };

    const handleListMoved = (payload) => {
      if (payload?.board) {
        setBoard(normalizeBoard(payload.board));
      } else {
        fetchBoardDetail();
      }
    };

    const handleCardDragStart = ({ cardId, userName }) => {
      setDraggingCards((prev) => ({
        ...prev,
        [cardId]: { userName },
      }));
    };

    const handleCardDragEnd = ({ cardId }) => {
      setDraggingCards((prev) => {
        const next = { ...prev };
        delete next[cardId];
        return next;
      });
    };

    socket.on("board:updated", handleBoardUpdated);
    socket.on("card:moved", handleCardMoved);
    socket.on("list:moved", handleListMoved);
    socket.on("card:drag-start", handleCardDragStart);
    socket.on("card:drag-end", handleCardDragEnd);

    return () => {
      socket.emit("board:leave", boardId);
      socket.off("board:updated", handleBoardUpdated);
      socket.off("card:moved", handleCardMoved);
      socket.off("list:moved", handleListMoved);
      socket.off("card:drag-start", handleCardDragStart);
      socket.off("card:drag-end", handleCardDragEnd);
    };
  }, [boardId, fetchBoardDetail]);

  if (loading) {
    return (
      <section className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-base-200/50">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </section>
    );
  }

  return (
    <section className="flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-base-200/50">
      <header className="shrink-0 border-b border-base-300 bg-base-100/90 px-4 py-5 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mb-2 text-xs font-bold text-base-content/40 transition hover:text-primary"
            >
              ← Back to Dashboard
            </button>

            <h1 className="truncate text-2xl font-black tracking-tight text-base-content">
              {board?.name || "Untitled Board"}
            </h1>

            <p className="mt-1 line-clamp-1 text-sm text-base-content/50">
              {board?.description || "No description"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AvatarGroup members={members} />

            <button
              type="button"
              onClick={openAddMemberModal}
              className="btn btn-primary btn-sm"
            >
              Add Member
            </button>

            <button
              type="button"
              onClick={handleAddList}
              className="btn btn-outline btn-sm"
            >
              Add List
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full overflow-x-auto overflow-y-hidden px-4 py-6 sm:px-6 lg:px-8">
            <SortableContext
              items={lists.map((list) => list.dndId)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="mx-auto flex h-full w-max min-w-full max-w-7xl gap-4">
                {lists.map((list) => (
                  <ListColumn
                    key={list.id}
                    list={list}
                    draggingCards={draggingCards}
                    onAddCard={handleAddCard}
                    onOpenCardDetail={openCardDetailModal}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleAddList}
                  className="h-fit w-80 shrink-0 rounded-3xl border border-dashed border-base-300 bg-base-100/80 p-4 text-left text-sm font-bold text-base-content/50 transition hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  + Add another list
                </button>
              </div>
            </SortableContext>
          </div>

          <DragOverlay>
            {activeItem?.type === "card" ? (
              <div className="w-72 rotate-2 rounded-2xl border border-primary/40 bg-base-100 p-4 shadow-2xl">
                <p className="text-sm font-black">{activeItem.card.title}</p>
              </div>
            ) : null}

            {activeItem?.type === "list" ? (
              <div className="w-80 rotate-1 rounded-3xl border border-primary/40 bg-base-100 p-4 shadow-2xl">
                <p className="font-black">{activeItem.list.name}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </section>
  );
}
