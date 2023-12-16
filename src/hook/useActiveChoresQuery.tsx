import { api } from "@/utils/api";

export function useActiveChoresQuery() {
  const query = api.chores.getChoresBank.useQuery(undefined, {
    refetchInterval: 6000000,
  });

  return query;
}
