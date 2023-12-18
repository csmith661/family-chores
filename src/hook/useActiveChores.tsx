import { api } from "@/utils/api";

export function useActiveChoresQuery() {
  const query = api.chores.getAllAddedChores.useQuery(undefined, {
    refetchInterval: 6000000,
  });

  return query;
}
