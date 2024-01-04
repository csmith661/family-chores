import { useChoresBankQuery } from "@/hook/useChoresBank";
import { DraggableChoreBlock, Chore } from "./ChoreBlock";
import { Button, Input, Modal, Select } from "antd";
import { useMemo, useState } from "react";
import { useCallback } from "react";
import { useCreateChoresQuery } from "@/hook/useCreateNewChore";
import { CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

type GroceryListType = {
  id: number;
  item: string;
};

const Groceries: GroceryListType[] = [
  { id: 1, item: "Peanut Butter" },
  { id: 2, item: "Ham" },
];

export function NotesBlock() {
  const [modalOpen, setModalOpen] = useState(false);

  const [groceryItem, setGroceryItem] = useState<string | null>(null);
  const handleAddNewGroceryItem = useCallback(() => {
    return null;
  }, []);

  const [editing, setEditing] = useState(false);
  const groceryListSnapshot = useMemo(() => {
    if (editing) {
      return structuredClone(Groceries);
    }
    if (!editing) {
      return null;
    }
  }, [editing]);

  console.log(groceryListSnapshot);

  return (
    <div className="h-full w-1/4">
      <div className="relative h-full rounded-md border border border-neutral-300 bg-white shadow">
        <h3 className="pt-2 text-center text-xl font-bold">Grocery List</h3>
        <div className="absolute right-2 top-2">
          <Modal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            onOk={handleAddNewGroceryItem}
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
                    setGroceryItem(event.currentTarget.value)
                  }
                />
              </div>
              <div>Assignee: </div>
              <div className="col-span-2"></div>
            </div>
          </Modal>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (!modalOpen) {
                  setModalOpen(true);
                }
              }}
              type="primary"
              className="bg-neutral-700"
              icon={<PlusOutlined />}
            />
            <Button
              onClick={() => {
                if (editing) setEditing(false);
                if (!editing) setEditing(true);
              }}
              type="primary"
              className="bg-neutral-700"
              icon={<EditOutlined />}
            />
          </div>
        </div>
        <div className="grid h-[90%] grid-cols-2 grid-rows-6 flex-col gap-2 p-2">
          {Groceries.map((item) => (
            <GroceryItem
              key={item.id}
              id={item.id}
              item={item.item}
              editing={editing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GroceryItem(props: { id: number; item: string; editing: boolean }) {
  const { id, item, editing } = props;
  return (
    <div className=" flex h-full w-full items-center justify-center border p-1">
      <div className="flex w-full items-center justify-center">{item}</div>
      {editing && (
        <div className="flex w-1/4 items-center">
          <Button type="text" icon={<CloseOutlined />} danger />
        </div>
      )}
    </div>
  );
}
