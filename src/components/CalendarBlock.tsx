"use-client";
import { useDroppable } from "@dnd-kit/core";
import { type ReactNode } from "react";
import { ListedChore, type DraggableChore } from "../pages/index";
import { ListedChoreComponent } from "./ChoreBlock";
import dayjs from "dayjs";

export function DraggableCalendarBlock(props: {
  children: ReactNode;
  id: string;
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
      className="h-full w-full rounded border border-neutral-300 shadow"
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
      <div className="border-r-neutral-200/1000 z-40 rounded border  border-b-neutral-200  border-l-neutral-200/100 border-t-white/100 p-2">
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
