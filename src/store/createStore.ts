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

  state = createState(setState);
  listeners = new Set();

  return { getState, setState, subscribe };
}

// const store = createStore({ userName: '', active: false, counter: 1 });

// store.subscribe(() => {
//   console.log(store.getState());
// });

// store.setState({ userName: 'Debs' });
// store.setState((prevState) => ({ counter: prevState.counter + 1 }));
// store.setState((prevState) => ({ counter: prevState.counter + 1 }));
