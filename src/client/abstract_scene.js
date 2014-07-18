var inherit = function (parent, child) {
  var bridge = function (){};
  bridge.prototype = parent.prototype;
  child.prototype = new bridge();
  return child;
}

var AbstractScene = module.exports = function (page) {
  this.page = page;
}

AbstractScene.extend = function (obj) {
  var parent = this;
  var child = function (page) {
    parent.call(this, page);
    if (this.bind) this.bind();
  };
  inherit(parent, child);
  for (var prop in obj || {}) {
    child.prototype[prop] = obj[prop];
  }
  return child;
}

AbstractScene.prototype.show = function() {
  $('.scene').hide();
  this.$el.fadeIn();
}

Object.defineProperty(AbstractScene.prototype, 'client', {
  get: function () { return this.page.client; },
});

Object.defineProperty(AbstractScene.prototype, '$el', {
  get: function () { return this._$el || $(this.selector); },
});

