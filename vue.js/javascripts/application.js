var app = app || {};

var STORAGE_KEY = 'vue.js';

app.todoStorage = {
  fetch: function() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }
};

// var filters = {
//   all: function(todos) {
//     return todos;
//   },
//
//   active: function(todos) {
//     return todos.filter(function(todo) {
//       return !todo.completed;
//     });
//   },
//
//   completed: function(todos) {
//     return todos.filter(function(todo) {
//       return todo.completed;
//     });
//   }
// };

app.todo = new Vue({
  el: '.todoapp',

  data: {
    todos: app.todoStorage.fetch(),
    newTodo: '',
    editedTodo: null,
    // visibility: 'all'
  },

  watch: {
    todos: {
      handler: function(todos) {
        app.todoStorage.save(todos);
      },
      deep: true
    }
  },

  // computed: {
  //   filteredTodos: function() {
  //     return filters[this.visibility](this.todos);
  //   },
  //
  //   remaining: function() {
  //     return filters.active(this.todos).length;
  //   },
  //
  //   allDone: {
  //     get: function() {
  //       return this.remaining === 0;
  //     },
  //
  //     set: function(value) {
  //       this.todos.forEach(function(todo) {
  //         todo.completed = value;
  //       });
  //     }
  //   }
  // },

  methods: {
    addTodo: function() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({ title: value, completed: false });
      this.newTodo = '';
    },

    removeTodo: function(todo) {
      this.todos.$remove(todo);
    },

    editTodo: function(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit: function(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },

    cancelEdit: function(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    // removeCompleted: function() {
    //   this.todos = filters.active(this.todos);
    // }
  },

  directives: {
    'todo-focus': function(value) {
      if (!value) {
        return;
      }
      var el = this.el;
      Vue.nextTick(function() {
        el.focus();
      });
    }
  }
});

// var router = new Router();
//
// ['all', 'active', 'completed'].forEach(function(visibility) {
//   router.on(visibility, function() {
//     app.visibility = visibility;
//   });
//
//   router.configure({
//     notfound: function() {
//       window.location.hash = '';
//       app.visibility = 'all';
//     }
//   });
//
//   router.init();
// });
