import { useEffect, useState } from "react";
const isFalsy = (value: unknown) => (value === 0 ? false : !value);
const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";
export const cleanObject = (obj: { [key: string]: unknown }) => {
  let result = { ...obj };
  Object.keys(result).forEach((key) => {
    if (isVoid(result[key])) {
      delete result[key];
    }
  });
  return result;
};
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //eslint-disable-next-line
  }, []);
};
export const useDebounce = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebounce] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value]);
  return debouncedValue;
};
const throttle = (fn: (...a: any) => any, delay: number) => {
  let preTime = 0;
  return (...args: any) => {
    if (+new Date() - preTime >= delay || !preTime) {
      fn(args);
      preTime = +new Date();
    }
  };
};
export const useArray = <T>(initialArray: T[]) => {
  const [arr, setArr] = useState(initialArray);
  return {
    add(value: T) {
      setArr([...arr, value]);
    },
    clear() {
      setArr([]);
    },
    removeIndex(index: number) {
      const copiedArray = [...arr];
      copiedArray.splice(index, 1);
      setArr(copiedArray);
    },
  };
};
export const useDocumentTitle = (
  title: string,
  keepOnUnmount: boolean = true
) => {
  const oldTitle = document.title;
  useEffect(() => {
    document.title = title;
  }, [title]);
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
    //eslint-disable-next-line
  }, []);
};
export const resetRoute = () => (window.location.href = window.location.origin);
