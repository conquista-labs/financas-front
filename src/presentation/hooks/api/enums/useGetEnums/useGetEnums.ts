import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { GetEnumsModel } from "@/domain/usecases";
import { makeGetEnumsFactory } from "@/main/factories/usecases";

import type { UseGetEnumsOptions } from "./useGetEnums.types";

export const useGetEnums = (
  options?: UseGetEnumsOptions,
): UseQueryResult<GetEnumsModel, unknown> => {
  const getEnums = makeGetEnumsFactory();

  return useQuery({
    queryKey: ["get-enums"],
    queryFn: async () => {
      try {
        return await getEnums.get();
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
