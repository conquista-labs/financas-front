import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { DAY_TIME } from "@/app.definitions";
import type { GetTagsModel } from "@/domain/usecases";
import { makeGetTagsFactory } from "@/main/factories/usecases";

/** Lista as tags com contagem de uso (gestão em Cadastros). */
export const useGetTags = (): UseQueryResult<GetTagsModel, unknown> => {
  const getTags = makeGetTagsFactory();

  return useQuery({
    queryKey: ["get-tags"],
    queryFn: () => getTags.get(),
    staleTime: DAY_TIME,
    gcTime: DAY_TIME,
  });
};
