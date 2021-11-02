import { useDebounce } from "./../../utils/index";
import { useTask } from "./../../utils/task";
import { useCallback, useMemo } from "react";
import { useUrlQueryParam } from "./../../utils/url";
import { useLocation } from "react-router";
import { useProject } from "../../utils/project";

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation();
  const id = pathname.match(/projects\/(\d+)/)?.[1];
  return Number(id);
};

export const useProjectInUrl = () => useProject(useProjectIdInUrl());

export const useKanbansSearchParams = () => ({
  projectId: useProjectIdInUrl(),
});

export const useKanbansQueryKey = () => ["kanbans", useKanbansSearchParams()];

export const useTaskSearchParams = () => {
  const [param, setParam] = useUrlQueryParam([
    "name",
    "typeId",
    "processorId",
    "tagId",
  ]);
  const projectId = useProjectIdInUrl();
  // const debouncedName = useDebounce(param.name, 0);
  return useMemo(
    () => ({
      projectId,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      tagId: Number(param.tagId) || undefined,
      // name: debouncedName,
      name: param.name,
    }),
    [projectId, param]
  );
};

export const useTasksQueryKey = () => ["tasks", useTaskSearchParams()];
export const useTaskModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam([
    "editingTaskId",
  ]);
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId));
  const startEdit = useCallback(
    (id: number) => setEditingTaskId({ editingTaskId: id }),
    [setEditingTaskId]
  );
  const close = useCallback(
    () => setEditingTaskId({ editingTaskId: "" }),
    [setEditingTaskId]
  );
  return {
    editingTaskId,
    editingTask,
    isLoading,
    startEdit,
    close,
  };
};
