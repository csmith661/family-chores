"use-client";
import { type DraggableChore } from "@/pages";
import { CloseOutlined } from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "antd";
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

export function Chore(props: { DraggableChore: DraggableChore,   isEditing?: boolean;
  handleDeleteItem?: (id: number) => void, bankModifer?: boolean }) {
  const { chore_name, assignee, id } = props.DraggableChore;

  const {isEditing, handleDeleteItem, bankModifer} = props

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

      {isEditing && bankModifer && (
        <div className="flex items-center absolute right-0 top-0">
          <Button type="text" icon={<CloseOutlined />} danger onClick={()=> handleDeleteItem ? handleDeleteItem(id) : null}/>
        </div>
      )}
      
    </div>
  );
}
