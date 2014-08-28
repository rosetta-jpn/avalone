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
    user.once('destroy', this.leaveByIdetifier.bind(this, id, silent));
    if (!silent) this.emit('enter', user)
  }

  // Public: let the specified user leave this[listProp].
  function leave(user, silent) {
    this.leaveByIdetifier(user[identifier], silent);
  }

  function leaveByIdetifier(id, silent) {
    var userList = this[listProp];
    var user = userList[id];
    if (user) {
      delete userList[id];
      if (!silent) this.emit('leave', user);
    }
  }

  function changeList(newList) {
    var oldList = this[listProp], removes = [], joins = [], self = this;
    for (var prop in oldList)
      if (!newList[prop]) removes.push(oldList[prop]);

    for (var prop in newList)
      if (!oldList[prop]) joins.push(newList[prop]);

    removes.forEach(function (user) { self.leave(user); });
    joins.forEach(function (user) { self.enter(user); });
    return this[listProp] = newList;
  }

  return { enter: enter, leave: leave, leaveByIdetifier: leaveByIdetifier, changeList: changeList };
}
