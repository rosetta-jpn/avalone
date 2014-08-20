function isFunction (obj) {
  return typeof obj === 'function';
}

var Context = module.exports = function () {
  this.caches = {};
}

Context.prototype.use = function (name, obj) {
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
  this.use(name, obj);
  return this[name];
}

