import { api } from "@/utils/api";

export function useDeleteChore() {
  const utils = api.useUtils();
  const mutation = api.chores.deleteChoreFromBank.useMutation({
    onSuccess: async (_data, input) => {
      await utils.chores.getChoresBank.invalidate();
      await utils.chores.getAllAddedChores.invalidate()
    },
  });

  return (input: { chore_id: number; }) => {
    mutation.mutate(input);
  };
}
