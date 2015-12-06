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

  app.AppView = Backbone.View.extend({
  });

  new app.AppView();
});
