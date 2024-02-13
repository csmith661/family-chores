import { api } from "@/utils/api";

export function useGroceryOperations() {
  const utils = api.useUtils();
  const mutation = api.groceries.updateGroceries.useMutation({
    onSuccess: async (_data, input) => {
      await utils.groceries.getGroceriesBank.invalidate();
    },
  });

  return (input: { grocery_name?: string, grocery_id?: number; operation: "add" | "delete" }) => {
    mutation.mutate(input);
  };
}
