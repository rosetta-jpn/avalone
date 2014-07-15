var extend = exports.extend = function (parent, module) {
  for (var prop in module) {
    parent[prop] = module[prop];
  }
  return parent;
};

var merge = exports.merge = function () {
  var objects = arguments, merged = {};
  for (var i = 0; i < objects.length; i++) {
    extend(merged, objects[i]);
  }
  return merged;
}

var useClassMethods = exports.useClassMethods = function (obj, classMethods) {
  if (obj.classMethods) return;
  obj.classMethods = classMethods || {};
  extend(obj.prototype, {
    classMethods: obj.classMethods
  });
}

var inherit = exports.inherit = function (parent, child) {
  var classMethods;

  if (parent.classMethods) {
    classMethods = Object.create(parent.classMethods);
  } else {
    classMethods = {};
  }
  extend(classMethods, {
    super: parent,
  });

  if (!child) {
    child = function (){ parent.apply(this, arguments) };
  }
  child.prototype = Object.create(parent.prototype);
  useClassMethods(child, classMethods);
  return child;
}

var property = exports.property = function (obj, defs) {
  for (var name in defs) {
    Object.defineProperty(obj, name, defs[name]);
  }
}

