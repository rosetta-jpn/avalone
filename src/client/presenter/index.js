var Presenter = module.exports = {};

Presenter.bindPresenters = function bindPresenters(app, range) {
  var presenters = {};
  for (var key in Presenter.Presenters) {
    presenters[key] = new Presenter.Presenters[key](app, range);
  }
  return presenters;
}

Presenter.unbindPresenters = function unbindPresenters(presenters) {
  for (var key in presenters) {
    presenters[key].unbind();
  }
}

Presenter.Presenters = {};
Presenter.Presenters.RoomPresenter = require('./room_presenter');
Presenter.Presenters.GamePresenter = require('./game_presenter');
Presenter.Presenters.QuestPresenter = require('./quest_presenter');
Presenter.Presenters.TeamPresenter = require('./team_presenter');
Presenter.Presenters.AvalonPresenter = require('./avalon_presenter');

