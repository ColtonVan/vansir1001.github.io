import { cleanObject } from "./index";
import { useEffect } from "react";
import { useAsync } from "./use-async";
import { useHttp } from "./http";
import { Project } from "./../screens/project-list/list";
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  useEffect(() => {
    run(client("projects", { data: cleanObject(param ?? {}) }));
    //eslint-disable-next-line
  }, [param]);
  return result;
};
