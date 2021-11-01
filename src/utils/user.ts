import { cleanObject } from "./index";
import { useEffect } from "react";
import { useAsync } from "./use-async";
import { useHttp } from "./http";
import { User } from "../types/project";
export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();
  useEffect(() => {
    run(client("users", { data: cleanObject(param ?? {}) }));
    //eslint-disable-next-line
  }, [param]);
  return result;
};
