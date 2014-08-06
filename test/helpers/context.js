function isFunction (obj) {
  return typeof obj === 'function';
}

var Context = module.exports = function () {
  this.caches = {};
}

Context.prototype.use = function (name, obj) {
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

