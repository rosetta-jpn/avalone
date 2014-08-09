var BasePresenter = require('./base')
  , utils = require('../../utils');

QuestPresenter = module.exports = function (range) {
  this.prepareModel({
    quest: this.database.quest,
  });
  this.bind(range);

  this.database.on('change:currentQuest', this.onChangeCurrentQuest.bind(this));
  this.lock('changeQuest');
}

utils.inherit(BasePresenter, QuestPresenter);

QuestPresenter.prototype.selector = '.rv-quest'
QuestPresenter.prototype.onChangeCurrentQuest = function () {
  this.changeQuest.apply(this, arguments);
}

QuestPresenter.prototype.changeQuest = function (quest) {
  this.model.quest = quest;
  this.update();
  console.log('Update:Quest', this.model);
}

QuestPresenter.prototype.updateCurrentQuest = function () {
  this.unlock('changeQuest');
  this.lock('changeQuest');
}

QuestPresenter.prototype.formatters = {
  toClassName: function (name) { return 'quest-' + name; },
  imagePath: function (name) { return 'images/' + name + '.jpg'; },
  showIsSuccess: function (isSuccess) { return isSuccess ? 'Success' : 'Failure'; },
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
  
  submitVote : function (ev){
    ev.preventDefault();
    if(this.model.quest.isVoteSuccess){
      this.client.submit('successQuest', this.model.quest.toJson());
    }else{
      this.client.submit('failQuest', this.model.quest.toJson());
    }
    this.model.quest.isVoted = true;
  }
  


}

