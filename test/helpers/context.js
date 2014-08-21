function isFunction (obj) {
  return typeof obj === 'function';
}

var Context = module.exports = function () {
  this.caches = {};
}

Context.prototype._use = function (name, obj) {
  this.caches[name] = null;
  if (isFunction(obj)) {
    Object.defineProperty(this, name, {
      get: function () {
        if (this.caches[name]) return this.caches[name];
        return this.caches[name] = obj.call(this);
      },
      set: function (newValue) {
        this.caches[name] = newValue;
      },
      enumerable : true,
      configurable : true
    })
  } else {
    this[name] = obj;
  }
}

Context.prototype.useNow = function (name, obj) {
  this.given(name, obj);
  return this[name];
}

/* Public: Define a property whose return value is memorized after first call. (like `let` of RSpec)
 *
 * name - the name of the property.
 * obj - the getter function or the object of the property.
 */
Context.prototype.given = Context.prototype.use = function (name, obj) {
  if (typeof name === 'object') {
    var hash = name;
    for (var prop in hash) {
      this._use(prop, hash[prop]);
    }
  } else {
    return this._use(name, obj);
  }
}

Context.prototype.namespace = function () {
  var names = Array.prototype.slice.call(arguments);
  for (var i = 0; i < names.length; i++) {
    var child = new Context();
    child.parent = this;
    this[names[i]] = child;
  }
};
