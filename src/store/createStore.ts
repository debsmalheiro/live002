import { useState, useEffect, useSyncExternalStore } from 'react';

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
    return useSyncExternalStore(subscribe, () => selector(state));
  }

  state = createState(setState);
  listeners = new Set();

  return { getState, setState, subscribe, useStore };
}
