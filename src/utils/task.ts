import { Task } from "./../types/task";
import { QueryKey, useMutation, useQuery } from "react-query";
import { cleanObject } from ".";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";

interface NewTask extends Task {
  processor: number;
}
export const useTasks = (param?: Partial<NewTask>) => {
  const client = useHttp();
  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: cleanObject(param ?? {}) })
  );
};
export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation((params: Partial<Task>) => {
    console.log(params);
    return client(`tasks`, { data: params, method: "POST" });
  }, useAddConfig(queryKey));
};
export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Task>(["task", id], () => client(`tasks/${id}`), {
    enabled: Boolean(id),
  });
};
export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, { data: params, method: "PATCH" }),
    useEditConfig(queryKey)
  );
};
export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) => client(`tasks/${id}`, { method: "DELETE" }),
    useDeleteConfig(queryKey)
  );
};
