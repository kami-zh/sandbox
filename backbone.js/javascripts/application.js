var app = app || {};

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
    }
  });

  app.AppView = Backbone.View.extend({
  });

  new app.AppView();
});
