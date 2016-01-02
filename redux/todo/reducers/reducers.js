import { combineReducers } from 'redux';
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VISIBILITY_FILTERS } from '../actions/action';
import { SHOW_ALL } from VISIBILITY_FILTERS;

function todo(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case COMPLETE_TODO:
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: true
      };
    default:
      return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        todo(undefined, action)
      ];
    case COMPLETE_TODO:
      return state.map(t =>
        todo(t, action);
      );
    default:
      return state;
  }
}

function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  todos,
  visibilityFilter
});

export default rootReducer;
