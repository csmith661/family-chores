"use-client";
import { useDroppable } from "@dnd-kit/core";
import { type ReactNode } from "react";
import { ListedChore } from "../pages/index";
import { ListedChoreComponent } from "./ListedChoreComponent";
import clsx from "clsx";
import dayjs from "dayjs";

export function DraggableCalendarBlock(props: {
  children: ReactNode;
  id: string;
  day: number;
}) {
  //go and fetch sample items for chores

  const { isOver, setNodeRef } = useDroppable({ id: props.id });

  const style = {
    backgroundColor: isOver ? "#b1faee" : undefined,
    opacity: isOver ? "0.5" : "1",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "z-10 h-full w-full rounded border border-neutral-300 bg-white",
      )}
    >
      {props.children}
    </div>
  );
}

export function CalendarBlock(props: {
  dateForCalendar: string;
  choresArray: ListedChore[];
  handleClose: (id: number, day: number) => void;
  day: number;
}) {
  return (
    <>
      <div
        className={clsx(
          "border-r-neutral-200/1000 z-40 rounded-md border border-b-neutral-200  border-l-neutral-200/100  border-t-white/100 bg-blue-50 p-2",
        )}
      >
        <h2 className="text-center font-bold">{`${props.dateForCalendar}`}</h2>
      </div>
      <div className="no-scrollbar h-[90%] overflow-y-scroll">
        {props.choresArray.map((chore, index) => {
          return (
            <div key={index} className="h-1/6 p-2">
              <ListedChoreComponent
                listedChore={chore}
                handleClose={props.handleClose}
                day={props.day}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
