"use-client";
import { useDraggable } from "@dnd-kit/core";
import { type ReactNode, useMemo, useCallback } from "react";
import clsx from "clsx";
import { ListedChore, type DraggableChore } from "@/pages";
import { useChoreOperations } from "@/hook/useChoreOperations";

export function DraggableChoreBlock(props: {
  id: number;
  children: ReactNode;
}) {
  const { id } = props;
  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    {
      id,
    },
  );

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: active ? "0" : "1",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-1/4 w-1/6 p-2"
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  );
}

export function Chore(props: { DraggableChore: DraggableChore }) {
  const { chore_name, assignee } = props.DraggableChore;

  const assigneeBackgroundColor = useMemo(() => {
    switch (assignee) {
      case "Connor":
        return "bg-cyan-200";
      case "Jenny":
        return "bg-pink-200";
      default:
        return "bg-slate-200";
    }
  }, [assignee]);

  return (
    <div
      className={clsx(
        "h-full",
        "w-full",
        "border",
        "border-white",
        "rounded-lg",
        "flex",
        "items-center",
        "justify-center",
        "flex-col",
        assigneeBackgroundColor,
        "relative",
        "shadow",
      )}
    >
      <h3>{chore_name}</h3>
    </div>
  );
}

export function ListedChoreComponent(props: {
  listedChore: ListedChore;
  handleClose: (id: number, day: number) => void;
  day: number;
}) {
  const { chore_name, assignee, id, finished } = props.listedChore;

  const choreUpdate = useChoreOperations();

  const assigneeBackgroundColor = useMemo(() => {
    switch (assignee) {
      case "Connor":
        return "bg-cyan-200";
      case "Jenny":
        return "bg-pink-200";
      default:
        return "bg-slate-200";
    }
  }, [assignee]);

  const handleCheckOffChore = useCallback(
    (chore_id: number) => {
      choreUpdate({ chore_id, operation: "complete" });
    },
    [choreUpdate],
  );

  const handleRemoveChore = useCallback(
    (chore_id: number) => {
      choreUpdate({ chore_id, operation: "delete" });
    },
    [choreUpdate],
  );

  return (
    <div
      className={clsx(
        "h-full",
        "w-full",
        "border",
        "border-white",
        "rounded-lg",
        "grid",
        "grid-cols-3",
        assigneeBackgroundColor,
        finished ? "line-through" : "",
        "relative",
      )}
    >
      <h3 className="text-center">{chore_name}</h3>
      <button
        className={" hover:text-red-300"}
        onClick={() => {
          handleRemoveChore(id);
        }}
      >
        X
      </button>

      <button
        className={"hover:text-red-300"}
        onClick={() => {
          handleCheckOffChore(id);
        }}
      >
        check
      </button>
    </div>
  );
}
