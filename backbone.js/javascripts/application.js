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
  });

  new app.AppView();
});
