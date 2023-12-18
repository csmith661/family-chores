import { api } from "@/utils/api";

export function useAddActiveChores() {
  const utils = api.useContext();
  const mutation = api.chores.addChoreToDay.useMutation({
    onSuccess: async (_data, input) => {
      await utils.chores.getAllAddedChores.invalidate();
    },
  });

  return (input: { chore_id: number; dayOfTheWeekInt: number }) => {
    mutation.mutate(input);
  };
}
