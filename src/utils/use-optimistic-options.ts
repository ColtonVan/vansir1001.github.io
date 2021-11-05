import { Task } from "types/task";
import { useKanbansSearchParams } from "./../screens/Kanban/util";
import { useKanbans } from "./kanban";
import { Kanban } from "./../types/kanban";
import { QueryKey, useQueryClient } from "react-query";
import { findIndexsFromListById } from "utils";

const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey[0] as string),
    onMutate: (target: any) => {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) => {
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

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old: any) => {
    const findIndexsFromListById = (targetId: number): number[] => {
      return old
        .map((item: Kanban, index: number) => ({ id: item.id, index }))
        .filter((item: { id: number; index: number }) => item.id === targetId)
        .map((item: { id: number; index: number }) => item.index);
    };
    let sourceItem = { ...old[findIndexsFromListById(target.fromId)[0]] };
    let toIndex = findIndexsFromListById(target.referenceId)[0];
    if (target.type === "before") {
      old.splice(toIndex, 0, sourceItem);
      old.splice(findIndexsFromListById(target.fromId)[1], 1);
    } else if (target.type === "after") {
      old.splice(toIndex + 1, 0, sourceItem);
      old.splice(findIndexsFromListById(target.fromId)[0], 1);
    }
    return old;
  });

export const useReorderTaskConfig = (queryKey: QueryKey) => {
  const { data: kanbans } = useKanbans(useKanbansSearchParams());
  return useConfig(queryKey, (target, old: any) => {
    const { fromKanbanId, toKanbanId, referenceId, fromId } = target;
    if (fromKanbanId === toKanbanId) {
      let sourceItem = { ...old[findIndexsFromListById(old, fromId)[0]] };
      const destinationIndex = findIndexsFromListById(old, referenceId)[0];
      //往下拖-after：插入到destinationItem的下面
      //往上拖-before：插入到destinationItem的上面
      let insertingIndex;
      if (target.type === "after") {
        insertingIndex = destinationIndex + 1;
      } else if (target.type === "before") {
        insertingIndex = destinationIndex;
      }
      //在插入位置插入sourceItem
      old.splice(insertingIndex, 0, sourceItem);
      //往下拖-after：插入后要删第0个sourceItem
      //往上拖-before：插入后要删除第1个sourceItem
      if (target.type === "after") {
        old.splice(findIndexsFromListById(old, fromId)[0], 1);
      } else if (target.type === "before") {
        old.splice(findIndexsFromListById(old, fromId)[1], 1);
      }
      return old;
    } else {
      //按看板排序的任务数组
      let orderingTasks =
        kanbans?.reduce<Task[]>(
          (prev: Kanban[], kanban: Kanban) => [
            ...prev,
            ...old.filter((oldItem: Task) => oldItem.kanbanId === kanban.id),
          ],
          []
        ) || [];
      const preTasks = (() => {
        let canPush = true;
        return orderingTasks.reduce((prev: Task[], item: Task) => {
          if (
            prev.length &&
            prev[prev.length - 1].kanbanId === toKanbanId &&
            item.kanbanId !== toKanbanId
          )
            canPush = false;
          if (canPush) return [...prev, item];
          return [...prev];
        }, []);
      })();
      const destinationIndex =
        referenceId === undefined
          ? preTasks.length - 1
          : findIndexsFromListById(orderingTasks, referenceId)[0];
      const sourceItem = {
        ...orderingTasks[findIndexsFromListById(orderingTasks, fromId)[0]],
        kanbanId: toKanbanId,
      };
      //控制插入位置在之前还是之后
      let dragType = referenceId === undefined ? "after" : "before";
      const kanbanSortIndexs =
        kanbans?.map((item, index) => ({
          ...item,
          index,
        })) || [];
      let toKanbanIndex =
        kanbanSortIndexs.find((item) => item.id === toKanbanId)?.index || 0;
      let fromKanbanIndex =
        kanbanSortIndexs.find((item) => item.id === fromKanbanId)?.index || 0;
      //控制删除位置是第0个还是第1个
      let deleteType = toKanbanIndex > fromKanbanIndex ? "after" : "before";
      if (dragType === "before") {
        orderingTasks?.splice(destinationIndex, 0, sourceItem);
      } else if (dragType === "after") {
        orderingTasks?.splice(destinationIndex + 1, 0, sourceItem);
      }
      if (deleteType === "before") {
        orderingTasks?.splice(
          findIndexsFromListById(orderingTasks, fromId)[1],
          1
        );
      } else if (deleteType === "after") {
        orderingTasks?.splice(
          findIndexsFromListById(orderingTasks, fromId)[0],
          1
        );
      }
      return orderingTasks;
    }
  });
};
