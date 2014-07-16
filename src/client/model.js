(function (global) {
  var inherit = function (parent, child) {
    var bridge = function (){};
    bridge.prototype = parent.prototype;
    child.prototype = new bridge();
    return child;
  }

  var extend = function (obj) {
    var parent = this;
    var child = function () { 
      parent.apply(this, arguments);
      if (this.bind) this.bind();
    };
    inherit(parent, child);
    for (var prop in obj || {}) {
      child.prototype[prop] = obj[prop];
    }
    return child;
  }

  var Model = global.Model = function (page) {
    this.data = {};
    this.page = page;
  }
  Model.extend = extend;

  var add = Model.prototype.add = function (obj, key, value) {
    if (obj.$add) {
      obj.$add(key, value);
    } else {
      obj[key] = value
    }
    return value;
  }

  Model.prototype.update = function (obj, key, value) {
    _delete(obj, key, value)
    return add(obj, key, value);
  }

  var _delete = Model.prototype.delete = function (obj, key) {
    var value = obj[key];
    if (obj.$delete) {
      obj.$delete(key);
    } else {
      delete obj[key]
    }
    return value;
  }

  Model.prototype.set = function (ary, idx, value) {
    if (ary.$set) {
      ary.$set(idx, value);
    } else {
      ary[idx] = value;
    }
    return value;
  }

  Model.prototype.remove = function (ary, tgt) {
    if (typeof tgt === "number") {
      var value = ary[tgt];
      if (ary.$remove) {
        ary.$remove(ary, tgt);
      } else {
        ary.splice(tgt, 1);
      }
      return value;
    } else {
      var idx = ary.indexOf(tgt);
      var value = idx < 0 ? undefined : ary[idx];
      if (ary.$remove) {
        ary.$remove(ary, tgt);
      } else {
        if (idx >= 0) {
          ary.splice(idx, 1);
        }
      }
      return value;
    }
  }
  Object.defineProperty(Model.prototype, 'client', {
    get: function () { return this.page.client; },
  });
}(this));
