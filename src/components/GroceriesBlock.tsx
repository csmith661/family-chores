import { useGetGroceriesBank } from "@/hook/useGetGroceriesBank";
import { useGroceryOperations } from "@/hook/useGroceryListOperations";
import { CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import { useCallback, useState } from "react";



export function GroceriesBlock() {
  const [modalOpen, setModalOpen] = useState(false);

  const groceryOperations = useGroceryOperations()

  const groceriesQuery = useGetGroceriesBank() 

  const [groceryItem, setGroceryItem] = useState<string | null>(null);
  const handleAddNewGroceryItem = useCallback(() => {

    
    if(groceryItem){
      groceryOperations({operation: 'add', grocery_name: groceryItem})
    }

    setModalOpen(false)
  }, [groceryItem, groceryOperations]);

  const handleCloseModal = useCallback(()=>{
    setModalOpen(false)
    setGroceryItem(null)
  }, [])

  const [editing, setEditing] = useState(false);




  return (
    <div className="h-full w-1/4">
      <div className="relative h-full rounded-md border border border-neutral-300 bg-white shadow">
        <h3 className="pt-2 text-center text-xl font-bold">Grocery List</h3>
        <div className="absolute right-2 top-2">
          <Modal
            open={modalOpen}
            onCancel={handleCloseModal}
            footer={[
              <Button
                type="default"
                key="cancel"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>,
              <Button onClick={handleAddNewGroceryItem} className="bg-neutral-700" type="primary" key="ok">
                Submit
              </Button>,
            ]}
          >
            <div className="grid h-48 w-full grid-cols-3 pt-12  ">
              <div>Grocery Name:</div>
              <div className="col-span-2">
                <Input
                  onChange={(event) =>
                    setGroceryItem(event.currentTarget.value)
                  }
                />
              </div>
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
          {groceriesQuery.data?.map((item) => (
            <GroceryItem
              key={item.id}
              id={item.id}
              item={item.name}
              editing={editing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GroceryItem(props: { id: number; item: string; editing: boolean }) {
  const groceryOperations = useGroceryOperations()

  const { id, item, editing } = props;
  const handleDeleteItem = useCallback(()=>{
    groceryOperations(({operation: 'delete', grocery_id: id}))
  }, [groceryOperations, id])

  return (
    <div className=" flex h-full w-full items-center justify-center border p-1">
      <div className="flex w-full items-center justify-center">{item}</div>
      {editing && (
        <div className="flex w-1/4 items-center">
          <Button type="text" icon={<CloseOutlined />} danger onClick={handleDeleteItem}/>
        </div>
      )}
    </div>
  );
}
