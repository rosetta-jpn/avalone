$.fn.formData = function () {
  data = this.serializeArray();
  rightParen = /\]/g
  return data.reduce(function (json, param) {
    names = param.name.replace(rightParen, '').split('[')
    // take the deepest object from nested objects
    var deepestObj = names.slice(0, -1).reduce(function (obj, name) {
      return obj[name] = obj[name] || {};
    }, json);
    deepestObj[names[names.length - 1]] = param.value
    return json;
  }, {});
}

