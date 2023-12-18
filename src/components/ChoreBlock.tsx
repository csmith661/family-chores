"use-client";
import { type DraggableChore } from "@/pages";
import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import { useMemo, type ReactNode } from "react";

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
