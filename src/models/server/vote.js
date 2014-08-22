var utils = require('../../utils')
  , VoteCore = require('../core/vote');

var Vote = module.exports = utils.inherit(VoteCore, function Vote() {
  var args = Array.prototype.slice.call(arguments)
    , id = utils.randomId();
  args.unshift(id);
  this.superClass.apply(this, args);
});
