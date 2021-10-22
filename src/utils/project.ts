import { cleanObject } from "./index";
import { useEffect } from "react";
import { useAsync } from "./use-async";
import { useHttp } from "./http";
import { Project } from "./../screens/project-list/list";
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();
  const fetchProjects = () =>
    client("projects", { data: cleanObject(param ?? {}) });
  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
    //eslint-disable-next-line
  }, [param]);
  return result;
};
export const useEditProject = () => {
  const client = useHttp();
  const { run, ...asyncResult } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, { data: params, method: "PATCH" })
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
};
export const useAddProject = () => {
  const client = useHttp();
  const { run, ...asyncResult } = useAsync();
  const mutate = (params: Partial<Project>) => {
    return run(
      client(`projects/${params.id}`, { data: params, method: "POST" })
    );
  };
  return {
    mutate,
    ...asyncResult,
  };
};
