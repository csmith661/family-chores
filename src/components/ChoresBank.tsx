import { useChoresBankQuery } from "@/hook/useChoresBank";
import { DraggableChoreBlock, Chore } from "./ChoreBlock";
import { Button, Input, Modal, Select } from "antd";
import { useState } from "react";
import { useCallback } from "react";
import { useCreateChoresQuery } from "@/hook/useCreateNewChore";

export function ChoresBank() {
  const choresBankQuery = useChoresBankQuery();

  const addChoresToDatabase = useCreateChoresQuery();

  const [modalOpen, setModalOpen] = useState(false);

  const [choreFormSubmission, setChoreFormSubmission] = useState<{
    chore_name: string;
    assignee: "Connor" | "Jenny";
  }>({ chore_name: "", assignee: "Connor" });

  const handleAddNewChore = useCallback(() => {
    if (choreFormSubmission.chore_name) {
      addChoresToDatabase(choreFormSubmission);
      setModalOpen(false);
    } else return;
  }, [addChoresToDatabase, choreFormSubmission]);

  return (
    <div className="relative h-full w-3/4 rounded-md border border border-neutral-300 bg-white shadow">
      <h3 className="pt-2 text-center text-xl font-bold">Weekly Chores</h3>
      <div className="absolute right-2 top-2">
        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={handleAddNewChore}
          footer={[
            <Button
              type="default"
              key="cancel"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>,
            <Button className="bg-neutral-700" type="primary" key="submit">
              Submit
            </Button>,
          ]}
        >
          <div className="grid h-48 w-full grid-cols-3 pt-12  ">
            <div>Chore Name:</div>
            <div className="col-span-2">
              <Input
                onChange={(event) =>
                  setChoreFormSubmission({
                    ...choreFormSubmission,
                    chore_name: event.currentTarget.value,
                  })
                }
              />
            </div>
            <div>Assignee: </div>
            <div className="col-span-2">
              <Select
                className="w-2/3"
                onSelect={(value: "Connor" | "Jenny") =>
                  setChoreFormSubmission({
                    ...choreFormSubmission,
                    assignee: value,
                  })
                }
                options={[
                  { key: "Connor", value: "Connor" },
                  { key: "Jenny", value: "Jenny" },
                ]}
              />
            </div>
          </div>
        </Modal>
        <Button
          onClick={() => {
            if (!modalOpen) {
              setModalOpen(true);
            }
          }}
          type="primary"
          className="bg-neutral-700"
        >
          Add New Chore
        </Button>
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
