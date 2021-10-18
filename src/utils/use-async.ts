import { useState } from "react";

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: "idle" | "loading" | "error" | "success";
}
const defaultInitialState: State<null> = {
  stat: "idle",
  data: null,
  error: null,
};
export const useAsync = <D>(initialState?: State<D>) => {
  const [state, setState] = useState({
    ...defaultInitialState,
    ...initialState,
  });
  const setData = (data: D) => {
    setState({
      data,
      stat: "success",
      error: null,
    });
  };
  const setError = (error: Error) => {
    setState({
      error,
      stat: "error",
      data: null,
    });
  };
  //用来出发异步请求
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error("请传入Promise类型数据");
    }
    setState({ ...state, stat: "loading" });
    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        //catch会处理掉异常，得主动抛出异常才能被调用时捕捉到
        setError(error);
        return Promise.reject(error);
      });
  };
  return {
    isIdle: state.stat === "idle",
    isLoading: state.stat === "loading",
    isError: state.stat === "error",
    isSuccess: state.stat === "success",
    run,
    setData,
    setError,
    ...state,
  };
};
