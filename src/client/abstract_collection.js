var utils = require('../utils');

var AbstractCollection = module.exports = function (page) {
  this.data = {};
  this.page = page;
  if (this.bind) this.bind();
}
AbstractCollection.extend = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift(this);
  return utils.inherit.apply(this, args);
}

var add = AbstractCollection.prototype.add = function (obj, key, value) {
  if (obj.$add) {
    obj.$add(key, value);
  } else {
    obj[key] = value
  }
  return value;
}

AbstractCollection.prototype.update = function (obj, key, value) {
  _delete(obj, key, value)
  return add(obj, key, value);
}

var _delete = AbstractCollection.prototype.delete = function (obj, key) {
  var value = obj[key];
  if (obj.$delete) {
    obj.$delete(key);
  } else {
    delete obj[key]
  }
  return value;
}

AbstractCollection.prototype.set = function (ary, idx, value) {
  if (ary.$set) {
    ary.$set(idx, value);
  } else {
    ary[idx] = value;
  }
  return value;
}

AbstractCollection.prototype.remove = function (ary, tgt) {
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
Object.defineProperty(AbstractCollection.prototype, 'client', {
  get: function () { return this.page.client; },
});
