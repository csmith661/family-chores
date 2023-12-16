import { api } from "@/utils/api";

export function useCreateChoresQuery() {
  const utils = api.useContext();
  const mutation = api.chores.addChoreToBank.useMutation({
    onSuccess: async (_data, input) => {
      await utils.chores.getChoresBank.invalidate();
    },
  });

  return (input: { chore_name: string; assignee: string }) => {
    mutation.mutate(input);
  };
}
