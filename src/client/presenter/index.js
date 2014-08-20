var Presenter = module.exports = function (app, range) {
  var presenters = {};
  for (var key in Presenter) {
    presenters[key] = new Presenter[key](app, range);
  }
  return presenters;
}

Presenter.RoomPresenter = require('./room_presenter');
Presenter.GamePresenter = require('./game_presenter');
Presenter.QuestPresenter = require('./quest_presenter');
Presenter.TeamPresenter = require('./team_presenter');
Presenter.AvalonPresenter = require('./avalon_presenter');

