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

  var proto = Object.create(parent.prototype);
  if (!child || typeof child !== 'function') {
    var properties = child || {};
    child = function (){ parent.apply(this, arguments) };
    extend(proto, properties);
  }
  child.prototype = proto;
  useClassMethods(child, classMethods);
  return child;
}

var property = exports.property = function (obj, defs) {
  for (var name in defs) {
    Object.defineProperty(obj, name, defs[name]);
  }
}

var charTable = (function () {
  var nums = [];
  for (var i = 48; i < 58; i++) nums.push(i); // 0-9
  for (var i = 65; i < 91; i++) nums.push(i); // A-Z
  for (var i = 97; i < 123; i++) nums.push(i); // a-z
  return String.fromCharCode.apply(String, nums);
}());

var randomId = exports.randomId = function (idLength) {
  idLength = idLength || 8;
  var id = "";
  for (var i = 0; i < idLength; i++)
    id += charTable.charAt(Math.floor(charTable.length * Math.random()));
  return id;
}

