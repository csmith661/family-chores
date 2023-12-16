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
import { useMemo, useState } from "react";
import {
  CalendarBlock,
  DraggableCalendarBlock,
} from "@/components/CalendarBlock";
import { Chore, DraggableChoreBlock } from "@/components/ChoreBlock";
import { Clock } from "@/components/Clock";
import { useActiveChoresQuery } from "@/hook/useActiveChoresQuery";
import { ChoresBank } from "@/components/ChoresBank";

// const stockChores = [
//   { id: 12, title: "Kitty Litter", assignee: "Connor" },
//   { id: 123, title: "Mop", assignee: "Jenny" },
//   { id: 1234, title: "Vacuum", assignee: "Jenny" },
//   { id: 12345, title: "Wipe the Counters", assignee: "Connor" },
// ];

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

function initializeDaysOfTheWeekMap() {
  const daysOfWeek = new Map<string, DraggableChore[]>();

  for (let i = 0; i < 7; i++) {
    daysOfWeek.set(i.toString(), []);
  }

  return daysOfWeek;
}

function App() {
  const choresBankQuery = useActiveChoresQuery();
  const currentDay = useMemo(() => {
    return dayjs().format("dddd DD/MM");
  }, []);

  const [activeDraggingChore, setActiveDraggingChore] =
    useState<DraggableChore | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [workingDaysOfWeek, setWorkingDaysOfWeek] = useState(
    initializeDaysOfTheWeekMap(),
  );

  // const daysOfTheWeekArray = useMemo(() => {
  //   const datesArray: string[] = new Array(7);

  //   const currentDaysIndex = dayjs().day();

  //   datesArray[currentDaysIndex] = currentDay;

  //   for (let i = 0; i < datesArray.length; i++) {
  //     if (datesArray[i]) {
  //       continue;
  //     }
  //     datesArray[i] = dayjs()
  //       .subtract(currentDaysIndex - i, "day")
  //       .format("dddd DD/MM");
  //   }

  //   return datesArray;
  // }, [currentDay]);

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
        const array = daysMap.get(day);
        if (!array) throw Error("Improper Configuration");
        const newArray = [...array, activeChore];

        daysMap.set(day, newArray);

        return daysMap;
      });
    }

    setActiveDraggingChore(null);
  }

  function handleClose(id: number, day: number) {
    console.log(id, day);
    const deepClonedMap = deepCloneMap(workingDaysOfWeek);

    const daysArray = deepClonedMap
      .get(day.toString())
      ?.filter((value) => value.id != id);

    deepClonedMap.set(day.toString(), daysArray ?? []);

    setWorkingDaysOfWeek(deepClonedMap);
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-slate-200">
          <div>
            <div className="px-4">The time is currently:</div>
            <h1 className="px-4 text-2xl font-bold">
              <Clock />
            </h1>
            <div className="flex h-[50vh] items-center justify-center gap-2 p-4">
              {Array.from(workingDaysOfWeek.keys()).map((day, index) => {
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
                    <div className="h-20 w-48">
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
  inputMap: Map<string, DraggableChore[]>,
): Map<string, DraggableChore[]> {
  const clonedMap = new Map<string, DraggableChore[]>();

  for (const [key, value] of inputMap) {
    // Clone the array of DraggableChore objects
    const clonedValue: DraggableChore[] = value.map((item) =>
      deepCloneDraggableChore(item),
    );
    clonedMap.set(key, clonedValue);
  }

  return clonedMap;
}

function deepCloneDraggableChore(chore: DraggableChore): DraggableChore {
  if (!chore) {
    return chore;
  }

  // Create a new DraggableChore object with the same properties
  return {
    chore_name: chore.chore_name,
    assignee: chore.assignee,
    id: chore.id,
  };
}
