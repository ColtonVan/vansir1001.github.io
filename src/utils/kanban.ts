import { QueryKey, useMutation, useQuery } from "react-query";
import { cleanObject } from ".";
import { Kanban } from "../types/kanban";
import { useHttp } from "./http";
import { useAddConfig } from "./use-optimistic-options";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();
  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: cleanObject(param ?? {}) })
  );
};
export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: Partial<Kanban>) => {
    console.log(params);
    return client(`kanbans`, { data: params, method: "POST" });
  }, useAddConfig(queryKey));
};
