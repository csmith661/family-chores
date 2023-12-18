"use-client";
import { useChoreOperations } from "@/hook/useChoreOperations";
import { type ListedChore } from "@/pages";
import { Button, Popconfirm } from "antd";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";

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
        "grid-cols-6",
        assigneeBackgroundColor,
        finished ? "line-through" : "",
        "relative",
        "place-content-center",
        "px-2",
      )}
    >
      <div className="col-span-4 flex h-full items-center text-sm">
        {chore_name}
      </div>
      <Popconfirm
        title="Are you Sure you want to remove chore?"
        onConfirm={() => {
          handleRemoveChore(id);
        }}
        okButtonProps={{ type: "primary", className: "bg-neutral-700" }}
      >
        <Button
          type="link"
          className={"hover:text-red-300"}
          icon={<DeleteOutlined />}
          danger
        ></Button>
      </Popconfirm>

      <Button
        type="link"
        className={"hover:text-red-300"}
        onClick={() => {
          handleCheckOffChore(id);
        }}
        icon={<CheckOutlined />}
      ></Button>
    </div>
  );
}
