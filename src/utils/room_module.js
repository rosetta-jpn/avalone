var utils = require('../utils');

module.exports = function RoomModule (listProp) {
  function enter(user) {
    this[listProp][user.id] = user;
    user.on('disconnect', this.leave.bind(this, user));
    this.emit('enter', user)
  }

  function leave(user) {
    delete this[listProp][user.id];
    this.emit('leave', user)
  }

  return { enter: enter, leave: leave };
}
