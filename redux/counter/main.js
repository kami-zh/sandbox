//
// Actions
//

const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if ((counter % 2) === 0) {
      return;
    }

    dispatch(increment());
  };
}

function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment())
    }, delay);
  };
}

//
// Reducers
//

import { combineReducers } from 'redux';

function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    case DECREMENT_COUNTER:
      return state - 1;
    default:
      return state;
  }
}

const reducer = combineReducers({
  counter
});

//
// Stores
//

import { createStore } from 'redux';

const store = createStore(reducer);
