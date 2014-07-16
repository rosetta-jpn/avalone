var utils = require('../utils');

/* Public: RoomModule - enable enter and leave from Room
 *
 * listProp: the String preresenting the property (which is Object)
 *           which this module let users enter or leave.
 */
module.exports = function RoomModule (listProp) {

  // Public: let the specified user enter this[listProp].
  function enter(user) {
    this[listProp][user.id] = user;
    user.on('disconnect', this.leave.bind(this, user));
    this.emit('enter', user)
  }

  // Public: let the specified user leave this[listProp].
  function leave(user) {
    delete this[listProp][user.id];
    this.emit('leave', user)
  }

  return { enter: enter, leave: leave };
}
