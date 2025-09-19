import { useState, useEffect } from 'react';

type SetterFn<T> = (prevState: T) => Partial<T>;
type SetStateFn<T> = (partialState: Partial<T> | SetterFn<T>) => void;

export function createStore<TState extends Record<string, any>>(
  createState: (setter: SetStateFn<TState>) => TState,
) {
  let state: TState;
  let listeners: Set<() => void>;

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function nofityListeners() {
    listeners.forEach((listener) => listener());
  }

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = { ...state, ...newValue };

    nofityListeners();
  }

  function getState() {
    return state;
  }

  function useStore<TValue>(
    selector: (currentState: TState) => TValue,
  ): TValue {
    const [value, setValue] = useState(() => selector(state));

    useEffect(() => {
      const unsubscribe = subscribe(() => {
        const newValue = selector(state);

        if (value !== newValue) {
          setValue(newValue);
        }
      });

      return () => {
        unsubscribe();
      };
    }, [selector, value]);

    return value;
  }

  state = createState(setState);
  listeners = new Set();

  return { getState, setState, subscribe, useStore };
}
