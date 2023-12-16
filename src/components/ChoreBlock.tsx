"use-client";
import { useDraggable } from "@dnd-kit/core";
import { type ReactNode, useMemo } from "react";
import clsx from "clsx";
import { DraggableChore } from "@/pages";

export function DraggableChoreBlock(props: {
  id: number;
  children: ReactNode;
}) {
  const { id } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
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
      )}
    >
      <h3>{chore_name}</h3>
    </div>
  );
}

export function ListedChore(props: {
  draggableChore: DraggableChore;
  handleClose: (id: number, day: number) => void;
  day: number;
}) {
  const { chore_name, assignee, id } = props.draggableChore;

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
        "grid",
        "grid-cols-3",
        assigneeBackgroundColor,
        "relative",
      )}
    >
      <h3 className="text-center">{chore_name}</h3>
      <button
        className={" hover:text-red-300"}
        onClick={() => {
          props.handleClose(id, props.day);
        }}
      >
        X
      </button>

      <button
        className={"hover:text-red-300"}
        onClick={() => {
          props.handleClose(id, props.day);
        }}
      >
        check
      </button>
    </div>
  );
}
