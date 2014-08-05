var Presenter = module.exports = function () {
  var presenters = {};
  for (var key in Presenter) {
    presenters[key] = new Presenter[key];
  }
  return presenters;
}

Presenter.RoomPresenter = require('./room_presenter');
Presenter.GamePresenter = require('./game_presenter');

