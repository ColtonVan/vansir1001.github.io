import { useMemo } from "react";
import { useProject } from "../../utils/project";
import { useUrlQueryParam } from "../../utils/url";

export const useProjectSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({
        ...param,
        personId: Number(param.personId) || undefined,
      }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectQueryKey = () => [
  "projects",
  useProjectSearchParams()[0],
];

export const useProjectModal = () => {
  const [{ projectCreate, editingProjectId }, setProjectModalQuery] =
    useUrlQueryParam(["projectCreate", "editingProjectId"]);
  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );
  const open = () => setProjectModalQuery({ projectCreate: true });
  const close = () => {
    setProjectModalQuery({
      projectCreate: undefined,
      editingProjectId: undefined,
    });
  };
  const startEdit = (id: number) =>
    setProjectModalQuery({ editingProjectId: id });
  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProject),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};
