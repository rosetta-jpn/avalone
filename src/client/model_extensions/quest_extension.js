var Quest = require('../../models/quest')
  , database = require('../database')
  , utils = require('../../utils');

utils.extend(Quest.prototype, {
  applyResult: function (isSuccess, success, failure) {
    this.successCount = success;
    this.failureCount = failure;
    this.state = isSuccess ? this.classMethods.States.Success : this.classMethods.States.Failure;
    this.emit('update');

    if (this.isSuccess) this.emit("success");
    else this.emit("failure");
  }
});

