import { useMemo } from "react";
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

export const useProjectModal = () => {
  const [{ projectCreate }, setProjectModalOpen] = useUrlQueryParam([
    "projectCreate",
  ]);

  const open = () => setProjectModalOpen({ projectCreate: true });
  const close = () => setProjectModalOpen({ projectCreate: false });

  return { projectModalOpen: projectCreate === "true", open, close };
};
