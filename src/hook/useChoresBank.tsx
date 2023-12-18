import { api } from "@/utils/api";

export function useChoresBankQuery() {
  const query = api.chores.getChoresBank.useQuery(undefined, {
    refetchInterval: 6000000,
  });

  return query;
}
