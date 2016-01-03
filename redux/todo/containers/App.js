import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addTodo, completeTodo, setVisibilityFilter, visibilityFilters } from '../actions';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import Footer from '../components/Footer';

class App extends Component {
  render() {
    const { dispatch, visibleTodos, visibilityFilter } = this.props;

    return (
      <div>
        <AddTodo onAddClick={text =>　dispatch(addTodo(text))} />
        <TodoList
          todos={visibleTodos}
          onTodoClick={id => dispatch(completeTodo(id))} />
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))} />
      </div>
    );
  }
}

App.propTypes = {
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ])
};

function selectTodos(todos, filter) {
  switch (filter) {
    case visibilityFilters.SHOW_ALL:
      return todos;
    case visibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed);
    case visibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed);
  }
}

function props(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

export default connect(props)(App);
