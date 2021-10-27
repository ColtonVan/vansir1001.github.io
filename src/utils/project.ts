import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";
import { cleanObject } from "./index";
import { useHttp } from "./http";
import { Project } from "./../screens/project-list/list";
import {
  QueryKey,
  useMutation,
  useQuery,
  // , useQueryClient
} from "react-query";
// import {
//   useProjectQueryKey,
//   useProjectSearchParams,
// } from "../screens/project-list/util";
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: cleanObject(param ?? {}) })
  );
};
export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();
  // const queryClient = useQueryClient();
  // const [searchParams] = useProjectSearchParams();
  // const queryKey = ["projects", searchParams];
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, { data: params, method: "PATCH" }),
    useEditConfig(queryKey)
    // {
    //   onSuccess: () => queryClient.invalidateQueries("projects"),
    //   onMutate: (target) => {
    //     const previousItems = queryClient.getQueryData(queryKey);
    //     queryClient.setQueryData(
    //       queryKey,
    //       (old?: Project[]) =>
    //         old?.map((item) =>
    //           item.id === target.id ? { ...item, ...target } : item
    //         ) || []
    //     );
    //     return { previousItems };
    //   },
    //   onError(error, newItem, context: any) {
    //     queryClient.setQueryData(queryKey, context.previousItems);
    //   },
    // }
  );
};
export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();
  // const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, { data: params, method: "POST" }),
    useAddConfig(queryKey)
    // {
    //   onSuccess: () => queryClient.invalidateQueries("projects"),
    // }
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id }: { id: number }) => client(`projects/${id}`, { method: "DELETE" }),
    useDeleteConfig(queryKey)
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(["project", id], () => client(`projects/${id}`), {
    enabled: Boolean(id),
  });
};
