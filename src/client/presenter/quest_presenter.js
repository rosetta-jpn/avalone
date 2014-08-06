var BasePresenter = require('./base')
  , utils = require('../../utils');

QuestPresenter = module.exports = function (range) {
  this.prepareModel({
    quest: this.database.quest,
  });
  this.bind(range);

  this.database.on('new:Quest', this.changeQuest.bind(this));
}

utils.inherit(BasePresenter, QuestPresenter);

QuestPresenter.prototype.selector = '.rv-quest'

QuestPresenter.prototype.changeQuest = function (quest) {
  this.model.quest = quest;
  this.update();
  console.log('Update:Quest', this.model);
}

QuestPresenter.prototype.formatters = {
  toClassName: function (name) { return 'quest-' + name; },
  imagePath: function (name) { return 'images/' + name + '.jpg'; },
}

QuestPresenter.prototype.eventHandlers = {
  submitSuccess: function (ev) {
    ev.preventDefault();
    this.client.submit('successQuest', this.model.quest.toJson());
  },

  submitFail: function (ev) {
    ev.preventDefault();
    this.client.submit('failQuest', this.model.quest.toJson());
  },
}

