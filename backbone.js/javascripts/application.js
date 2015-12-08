var app = app || {};

var ENTER_KEY = 13;
var ESC_KEY = 27;

$(function() {
  'use strict';

  app.ToDo = Backbone.Model.extend({
    defaults: {
      title: '',
      completed: false
    },

    toggle: function() {
      this.save({
        completed: !this.get('completed')
      })
    }
  });

  var ToDos = Backbone.Collection.extend({
    model: app.ToDo,

    localStorage: new Backbone.LocalStorage('backbone.js'),

    completed: function() {
      return this.where({ completed: true });
    },

    remaining: function() {
      return this.where({ completed: false });
    },

    nextOrder: function() {
      return this.length? this.last().get('order') + 1 : 1;
    },

    comparator: 'order'
  });

  app.ToDos = new ToDos();

  app.ToDoView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#item-template').html()),

    events: {
      'click .toggle': 'toggleCompleted',
      'dbclick label': 'edit',
      'click .destroy': 'clear',
      'keypress .edit': 'updateOnEnter',
      'keydown .edit': 'revertOnEscape',
      'blur .edit': 'close'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    render: function() {
      if (this.model.changed.id !== undefined) {
        return;
      }

      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('completed', this.model.get('completed'));
      this.toggleVisible();
      this.$input = this.$('.edit');

      return this;
    },

    toggleVisible: function() {
      this.$el.toggleClass('hidden', this.isHidden());
    },

    isHidden: function() {
      return this.model.get('completed') ? (app.ToDoFilter === 'active') : (app.ToDoFilter === 'completed');
    },

    toggleCompleted: function() {
      this.model.toggle();
    },

    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
    },

    close: function() {
      var value = this.$input.val().trim();

      if (!this.$el.hasClass('editing')) {
        return;
      }

      if (value) {
        this.model.save({ title: value });
      } else {
        this.clear();
      }

      this.$el.removeClass('editing');
    },

    updateOnEnter: function(e) {
      if (e.which === ENTER_KEY) {
        this.close();
      }
    },

    revertOnEscape: function() {
      if (e.which === ESC_KEY) {
        this.$el.removeClass('editing');
        this.$input.val(this.model.get('title'));
      }
    },

    clear: function() {
      this.model.destroy();
    }
  });

  app.AppView = Backbone.View.extend({
    el: '.todoapp',

    statsTemplate: _.template($('#stats-template').html()),

    events: {
      'keypress .new-todo': 'createOnEnter',
      'click .clear-completed': 'clearCompleted',
      'click .toggle-all': 'toggleAllComplete'
    },

    initialize: function() {
      this.allCheckbox = this.$('.toggle-all')[0];
      this.$input = this.$('.new-todo');
      this.$footer = this.$('.footer');
      this.$main = this.$('.main');
      this.$list = $('.todo-list');

      this.listenTo(app.ToDos, 'add', this.addOne);
      this.listenTo(app.ToDos, 'reset', this.addAll);
      this.listenTo(app.ToDos, 'change:completed', this.filterOne);
      this.listenTo(app.ToDos, 'filter', this.filterAll);
      this.listenTo(app.ToDos, 'all', _.debounce(this.render, 0));

      app.ToDos.fetch({ reset: true });
    },

    render: function() {
      var completed = app.ToDos.completed().length;
      var remaining = app.ToDos.remaining().length;

      if (app.todos.length) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
          completed: completed,
          remaining: remaining
        }));

        this.$('.filters li a')
          .removeClass('selected')
          .filter('[href="#/' + (app.ToDoFilter || '') + '"]')
          .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    addOne: function(todo) {
      var view = new app.ToDoView({ model: todo });
      this.$list.append(view.render().el);
    },

    addAll: function() {
      this.$list.html('');
      this.todos.each(this.addOne, this);
    },

    filterOne: function(todo) {
      todo.trigger('visible');
    },

    filterAll: function() {
      app.ToDos.each(this.filterOne, this);
    },

    newAttributes: function() {
      return {
        title: this.$input.val().trim(),
        order: app.ToDos.nextOrder(),
        completed: false
      };
    },

    createOnEnter: function(e) {
      if (e.which === ENTER_KEY && this.$input.val().trim()) {
        app.ToDos.create(this.newAttributes());
        this.$input.val('');
      }
    },

    clearCompleted: function() {
      _.invoke(app.ToDos.completed(), 'destroy');
      return false;
    },

    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      app.ToDos.each(function(todo) {
        todo.save({ completed: completed });
      });
    }
  });

  new app.AppView();
});
