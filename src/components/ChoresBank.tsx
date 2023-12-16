import { useActiveChoresQuery } from "@/hook/useActiveChoresQuery";
import { DraggableChoreBlock, Chore } from "./ChoreBlock";

export function ChoresBank() {
  const choresBankQuery = useActiveChoresQuery();

  return (
    <div className="relative h-full w-3/4 border border-white">
      <h3 className="pt-2 text-center text-xl font-bold">Weekly Chores</h3>
      <div className="absolute right-2 top-2">
        <button className=" h-8 w-48 border border-solid border-slate-900">
          Add New Chore
        </button>
      </div>
      <div className="no-scrollbar flex h-full flex-wrap justify-center overflow-y-scroll">
        {choresBankQuery.data?.map((chore) => {
          return (
            <DraggableChoreBlock key={chore.id} id={chore.id}>
              <Chore DraggableChore={chore} />
            </DraggableChoreBlock>
          );
        })}
      </div>
    </div>
  );
}
