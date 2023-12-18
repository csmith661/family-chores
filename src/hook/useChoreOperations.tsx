import { api } from "@/utils/api";

export function useChoreOperations() {
  const utils = api.useContext();
  const mutation = api.chores.updateChore.useMutation({
    onSuccess: async (_data, input) => {
      await utils.chores.getAllAddedChores.invalidate();
    },
  });

  return (input: { chore_id: number; operation: "complete" | "delete" }) => {
    mutation.mutate(input);
  };
}
