(function (global) {
  var inherit = function (parent, child) {
    var bridge = function (){};
    bridge.prototype = parent.prototype;
    child.prototype = new bridge();
    return child;
  }

  var Scene = global.Scene = function (page) {
    this.page = page;
  }

  Scene.extend = function (obj) {
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

  Scene.prototype.show = function() {
    $('.scene').hide();
    this.$el.fadeIn();
  }

  Object.defineProperty(Scene.prototype, 'client', {
    get: function () { return this.page.client; },
  });

  Object.defineProperty(Scene.prototype, '$el', {
    get: function () { return this._$el || $(this.selector); },
  });

}(this));

