import { QueryKey, useQueryClient } from "react-query";

const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    // onSuccess: () => queryClient.invalidateQueries("projects"),
    onSuccess: () => queryClient.invalidateQueries(queryKey[0] as string),
    onMutate: (target: any) => {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        console.log({ old });
        return callback(target, old || []);
      });
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      console.log({ error, newItem, context });
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};
export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old: any) =>
      old?.filter((item: any) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old: any) =>
    old?.map((item: any) =>
      item.id === target.id ? { ...item, ...target } : item
    )
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old: any) => [...old, target]);
