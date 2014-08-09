var utils = require('../utils');

/* Public: RoomModule - enable enter and leave from Room
 *
 * listProp: the String representing the property (which is Object)
 *           which this module let users enter or leave.
 * identifier: the String representing id.
 */
module.exports = function RoomModule (listProp, identifier) {

  // Public: let the specified user enter this[listProp].
  function enter(user, silent) {
    var id = user[identifier];
    this[listProp][id] = user;
    user.once('destroy', this.leaveByIndetifier.bind(this, id, silent));
    if (!silent) this.emit('enter', user)
  }

  // Public: let the specified user leave this[listProp].
  function leave(user, silent) {
    this.leaveByIndetifier(user[identifier], silent);
  }

  function leaveByIndetifier(id, silent) {
    var userList = this[listProp];
    if (userList[id]) delete userList[id];
    if (!silent) this.emit('leave', user)
  }

  return { enter: enter, leave: leave, leaveByIndetifier: leaveByIndetifier };
}
