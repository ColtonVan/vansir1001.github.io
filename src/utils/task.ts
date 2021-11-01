import { Task } from "./../types/task";
import { useQuery } from "react-query";
import { cleanObject } from ".";
import { useHttp } from "./http";

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();
  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: cleanObject(param ?? {}) })
  );
};
