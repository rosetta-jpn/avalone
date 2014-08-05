var BasePresenter = require('./base')
  , utils = require('../../utils');

QuestPresenter = module.exports = function () {
  this.$el = $('.rv-quest')
  this.model = {
    quest: this.database.quest,
  };
  this.bind();

  this.database.on('new:Quest', this.changeQuest.bind(this));
}

utils.inherit(BasePresenter, QuestPresenter);

QuestPresenter.prototype.changeQuest = function (quest) {
  this.model.quest = quest;
  this.update();
  console.log('Update:Quest', this.model);
}

QuestPresenter.prototype.formatters = {
  toClassName: function (name) { return 'quest-' + name; },
  imagePath: function (name) { return 'images/' + name + '.jpg'; },
}
