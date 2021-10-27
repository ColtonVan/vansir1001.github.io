import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParam] = useSearchParams();
  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      //eslint-disable-next-line
      [searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      const o = { ...Object.fromEntries(searchParams), ...params };
      console.log(o);
      return setSearchParam(o);
    },
  ] as const; //数组转元组
};
