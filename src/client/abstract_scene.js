var utils = require('../utils');

var AbstractScene = module.exports = function (router) {
  this.router = router;
}

AbstractScene.extend = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this);
  return utils.inherit.apply(this, args);
}

AbstractScene.prototype.show = function() {
  $('.scene').hide();
  this.$el.fadeIn();
  if (this.bind) this.bind();
}

Object.defineProperty(AbstractScene.prototype, 'client', {
  get: function () { return this.router.client; },
});

Object.defineProperty(AbstractScene.prototype, '$el', {
  get: function () { return this._$el || $(this.selector); },
});

