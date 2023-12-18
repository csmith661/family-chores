"use-client";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarBlock,
  DraggableCalendarBlock,
} from "@/components/CalendarBlock";
import { Chore, DraggableChoreBlock } from "@/components/ChoreBlock";
import { Clock } from "@/components/Clock";
import { useChoresBankQuery } from "@/hook/useChoresBank";
import { ChoresBank } from "@/components/ChoresBank";
import { useActiveChoresQuery } from "@/hook/useActiveChores";
import { useAddActiveChores } from "@/hook/useAddActiveChores";
import weekOfYear from "dayjs";

dayjs.extend(weekOfYear);

type Chore = {
  id: number;
  title: string;
  assignee: string;
};

export type DraggableChore = {
  chore_name: string;
  assignee: string;
  id: number;
};

export interface ListedChore extends DraggableChore {
  finished: boolean;
}

function initializeDaysOfTheWeekMap() {
  const daysOfWeek = new Map<string, ListedChore[]>();

  for (let i = 0; i < 7; i++) {
    daysOfWeek.set(i.toString(), []);
  }

  return daysOfWeek;
}

function App() {
  const choresBankQuery = useChoresBankQuery();
  const activeChoresQuery = useActiveChoresQuery();
  const addActiveChores = useAddActiveChores();
  const currentDay = useMemo(() => {
    return dayjs().format("dddd DD/MM");
  }, []);

  const [activeDraggingChore, setActiveDraggingChore] =
    useState<DraggableChore | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [workingDaysOfWeek, setWorkingDaysOfWeek] =
    useState<Map<string, ListedChore[]>>();

  function handleDragStart(dragEvent: DragStartEvent) {
    setActiveDraggingChore(() => {
      const item = choresBankQuery.data?.find(
        (chore) => chore.id === dragEvent.active.id,
      );
      if (!item) throw new Error("chore does not exist");
      return item;
    });
  }

  function handleDragEnd(dragEvent: DragEndEvent) {
    const activeChoreId = dragEvent.active.id;
    const activeChore = choresBankQuery.data?.find(
      (chore) => chore.id === activeChoreId,
    );

    if (!activeChore) throw Error("Chore does not exist");

    if (dragEvent.over) {
      const day = dragEvent.over.id.toString();

      setWorkingDaysOfWeek((daysMap) => {
        if (!daysMap) return;
        const array = daysMap.get(day);
        if (!array) throw Error("Improper Configuration");

        const convertedChoreToListed = {
          finished: false,
          ...activeChore,
        };
        const newArray = [...array, convertedChoreToListed];

        daysMap.set(day, newArray);

        return daysMap;
      });

      addActiveChores({
        chore_id: activeChore.id,
        dayOfTheWeekInt: parseInt(day),
      });
    }

    setActiveDraggingChore(null);
  }

  function handleClose(id: number, day: number) {
    if (!workingDaysOfWeek) return;
    const deepClonedMap = deepCloneMap(workingDaysOfWeek);

    const daysArray = deepClonedMap
      .get(day.toString())
      ?.filter((value) => value.id != id);

    deepClonedMap.set(day.toString(), daysArray ?? []);

    setWorkingDaysOfWeek(deepClonedMap);
  }

  useEffect(() => {
    if (!workingDaysOfWeek && activeChoresQuery.isLoading) {
      const intializedMap = initializeDaysOfTheWeekMap();

      setWorkingDaysOfWeek(intializedMap);
    }
  }, [
    activeChoresQuery.data,
    activeChoresQuery.isLoading,
    activeChoresQuery.isSuccess,
    workingDaysOfWeek,
  ]);

  useEffect(() => {
    if (activeChoresQuery.data) {
      const workingDaysMap = new Map<string, ListedChore[]>();

      const queriedArray = Object.keys(activeChoresQuery.data);

      queriedArray.forEach((key) => {
        if (activeChoresQuery.data[key]) {
          workingDaysMap.set(key, activeChoresQuery.data[key] ?? []);
        }
      });

      setWorkingDaysOfWeek((workingDays) => {
        if (workingDays) {
          const clonedDays = deepCloneMap(workingDays);

          for (let i = 0; i < 7; i++) {
            clonedDays?.set(
              i.toString(),
              workingDaysMap.get(i.toString()) ?? [],
            );
          }

          return clonedDays;
        }
        return workingDays;
      });
    }
  }, [activeChoresQuery.data]);

  console.log(workingDaysOfWeek);

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="">
          <div>
            <div className="px-4">The time is currently:</div>
            <h1 className="px-4 text-2xl font-bold">
              <Clock />
            </h1>
            <div className="flex h-[50vh] items-center justify-center gap-2 p-4">
              {workingDaysOfWeek &&
                Array.from(workingDaysOfWeek.keys()).map((day, index) => {
                  const dateText = dayjs()
                    .day(parseInt(day))
                    .format("dddd - MM/DD");

                  const choresArray = workingDaysOfWeek.get(day);

                  if (!choresArray) return;

                  return (
                    <DraggableCalendarBlock
                      key={(index * 1000).toString()}
                      id={day}
                    >
                      <CalendarBlock
                        dateForCalendar={dateText}
                        choresArray={choresArray}
                        handleClose={handleClose}
                        day={parseInt(day)}
                      />
                    </DraggableCalendarBlock>
                  );
                })}
            </div>

            <div className="flex h-[40vh] gap-2 p-4">
              <ChoresBank />
              <div>
                <DragOverlay dropAnimation={null} className="cursor-grabbing">
                  {activeDraggingChore ? (
                    <div className="h-20 w-72">
                      <Chore DraggableChore={activeDraggingChore} />
                    </div>
                  ) : null}
                </DragOverlay>
                <h3 className="border">Notes</h3>
              </div>
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
}

export default App;

function deepCloneMap(
  inputMap: Map<string, ListedChore[]>,
): Map<string, ListedChore[]> {
  const clonedMap = new Map<string, ListedChore[]>();

  for (const [key, value] of inputMap) {
    // Clone the array of DraggableChore objects
    const clonedValue: ListedChore[] = value.map((item) =>
      deepCloneListedChore(item),
    );
    clonedMap.set(key, clonedValue);
  }

  return clonedMap;
}

function deepCloneListedChore(chore: ListedChore): ListedChore {
  if (!chore) {
    return chore;
  }

  // Create a new DraggableChore object with the same properties
  return {
    chore_name: chore.chore_name,
    assignee: chore.assignee,
    id: chore.id,
    finished: chore.finished,
  };
}
