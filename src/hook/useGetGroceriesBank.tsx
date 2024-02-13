import { api } from "@/utils/api";

export function useGetGroceriesBank() {
  const query = api.groceries.getGroceriesBank.useQuery(undefined, {
    refetchInterval: 6000000,
  });

  return query;
}
