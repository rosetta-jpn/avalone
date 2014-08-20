var BasePresenter = require('./base')
  , utils = require('../../utils');

var QuestPresenter = module.exports = utils.inherit(BasePresenter);

utils.extend(QuestPresenter.prototype, {
  initialize: function () {
    this.prepareModel({
      quest: this.database.quest,
    });

    this.database.on('change:currentQuest', this.onChangeCurrentQuest.bind(this));
    this.lock('changeQuest');
  },

  selector: '.rv-quest',

  onChangeCurrentQuest: function () {
    this.changeQuest.apply(this, arguments);
  },

  changeQuest: function (quest) {
    this.model.quest = quest;
    this.update();
    console.log('Update:Quest', this.model);
  },

  updateCurrentQuest: function () {
    this.unlock('changeQuest');
    this.lock('changeQuest');
  },

  formatters: {
    toClassName: function (name) { return 'quest-' + name; },
    imagePath: function (name) { return 'images/' + name + '.jpg'; },
    showIsSuccess: function (isSuccess) { return isSuccess ? 'Success' : 'Failure'; },
  },

  eventHandlers: {
    submitSuccess: function (ev) {
      ev.preventDefault();
      this.client.submit('voteMission', {
        quest: this.model.quest.toJson(),
      });
    },

    submitFail: function (ev) {
      ev.preventDefault();
      this.client.submit('failQuest', this.model.quest.toJson());
      this.client.submit('voteMission', {
        quest: this.model.quest.toJson(),
      });
    },

    submitVote: function (ev) {
      ev.preventDefault();
      if (this.model.quest.isVoteSuccess) {
        this.client.submit('successQuest', this.model.quest.toJson());
      } else {
        this.client.submit('failQuest', this.model.quest.toJson());
      }
      this.model.quest.isVoted = true;
    },
  },
});

