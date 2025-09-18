type SetterFn<T> = (prevState: T) => Partial<T>;

export function createStore<TState>(initialState: TState) {
  let state = initialState;

  function setState(partialState: Partial<TState> | SetterFn<TState>) {
    const newValue =
      typeof partialState === 'function' ? partialState(state) : partialState;

    state = { ...state, ...newValue };
  }

  function getState() {
    return state;
  }

  return { getState, setState };
}

const store = createStore({ userName: '', active: false, counter: 1 });

store.setState({ userName: 'Debs' });
store.setState((prevState) => ({ counter: prevState.counter + 1 }));
store.setState((prevState) => ({ counter: prevState.counter + 1 }));
