import { useCallback, useReducer } from "react";

const UNDO = "UNDO";
const REDO = "REDO";
const SET = "SET";
const RESET = "RESET";

type State<T> = {
  past: T[];
  future: T[];
  present: T;
};

type Action<T> = {
  type: typeof UNDO | typeof REDO | typeof SET | typeof RESET;
  newPresent?: T;
};

const undoReducer = <T>(state: State<T>, action: Action<T>) => {
  const { past, future, present } = state;
  const { type, newPresent } = action;
  switch (type) {
    case UNDO: {
      if (!future.length) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }

    case REDO: {
      if (!future.length) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture,
      };
    }

    case SET: {
      if (newPresent === present) return state;
      return {
        present: newPresent,
        past: [...past, newPresent],
        future: [],
      };
    }

    case RESET: {
      return {
        present: newPresent,
        past: [],
        future: [],
      };
    }

    default: {
      return state;
    }
  }
};

export const useUndo = <T>(initialPresent: T) => {
  const [state, dispatch] = useReducer(undoReducer, {
    past: [],
    present: initialPresent,
    future: [],
  } as State<T>);
  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => dispatch({ type: UNDO }), []);

  const redo = useCallback(() => dispatch({ type: REDO }), []);

  const set = useCallback(
    (newPresent: T) => dispatch({ type: SET, newPresent }),
    []
  );

  const reset = useCallback(
    (newPresent: T) => dispatch({ type: RESET, newPresent }),
    []
  );

  return [
    state,
    {
      undo,
      redo,
      set,
      reset,
      canUndo,
      canRedo,
    },
  ];
};
