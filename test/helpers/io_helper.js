var utils = require('../../src/utils')
  , events = require('events');

var IOHelper = module.exports = function IOHelper (clock) {
  this.clock = clock;
}

utils.inherit(events.EventEmitter, IOHelper);

var originalEmit = IOHelper.prototype.emit;
utils.extend(IOHelper.prototype, {
  createBoot: function () {
    function boot() {
      return this;
    }
    return boot.bind(this);
  },

  emit: function () {
  },

  invoke: originalEmit,
  sendEvent: function (type, content) {
    utils.log('SendEvent:', type, content);
    this.invoke('event', {
      type: type,
      content: content,
    });
    if (this.clock && this.clock.tick) this.clock.tick(0);
  },
});
